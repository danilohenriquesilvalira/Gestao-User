// UserProfile.tsx - Perfil pessoal para usuários comuns (Técnico, Operador, Visitante)
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Clock, 
  Edit3, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle,
  Settings
} from 'lucide-react';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserProfileProps {
  userInfo: UserInfo | null;
}

export default function UserProfile({ userInfo }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setEditedInfo(prev => ({
        ...prev,
        name: userInfo.name || '',
        email: userInfo.email || ''
      }));
    }
  }, [userInfo]);

  const handleSave = async () => {
    if (!userInfo) return;
    
    setIsLoading(true);
    setMessage(null);

    try {
      // Validações
      if (!editedInfo.name.trim()) {
        throw new Error('Nome é obrigatório');
      }

      if (!editedInfo.email.trim() || !editedInfo.email.includes('@')) {
        throw new Error('Email válido é obrigatório');
      }

      if (editedInfo.newPassword && editedInfo.newPassword !== editedInfo.confirmPassword) {
        throw new Error('Senhas não coincidem');
      }

      if (editedInfo.newPassword && !editedInfo.currentPassword) {
        throw new Error('Senha atual é obrigatória para alterar senha');
      }

      // Preparar dados para envio
      const updateData: any = {
        name: editedInfo.name.trim(),
        email: editedInfo.email.trim()
      };

      if (editedInfo.newPassword) {
        updateData.currentPassword = editedInfo.currentPassword;
        updateData.password = editedInfo.newPassword;
      }

      // Fazer requisição para o backend
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:1337/api/user-manager/update/${userInfo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        setIsEditing(false);
        setEditedInfo(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        // Atualizar dados locais se necessário
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo(prev => ({
      ...prev,
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setMessage(null);
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'tecnico': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'operador': return 'bg-green-100 text-green-800 border-green-200';
      case 'visitante': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'tecnico': return '🔧';
      case 'operador': return '⚙️';
      case 'visitante': return '👁️';
      default: return '👤';
    }
  };

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar perfil</h3>
          <p className="text-gray-600">Não foi possível carregar as informações do usuário.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header do Perfil */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{userInfo.name}</h1>
                <p className="text-blue-100 flex items-center gap-2">
                  <span className="text-lg">{getRoleIcon(userInfo.role)}</span>
                  {userInfo.role}
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full border ${getRoleColor(userInfo.role)}`}>
              <span className="font-medium">Usuário Ativo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem de Feedback */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Informações Pessoais */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Informações Pessoais
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Editar Perfil
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Nome Completo
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedInfo.name}
                onChange={(e) => setEditedInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite seu nome completo"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                {userInfo.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editedInfo.email}
                onChange={(e) => setEditedInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite seu email"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                {userInfo.email}
              </div>
            )}
          </div>

          {/* Role (apenas visualização) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield className="w-4 h-4 inline mr-1" />
              Função
            </label>
            <div className={`px-4 py-3 rounded-lg border ${getRoleColor(userInfo.role)}`}>
              <span className="flex items-center gap-2">
                <span>{getRoleIcon(userInfo.role)}</span>
                {userInfo.role}
              </span>
            </div>
          </div>

          {/* Data de Criação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Membro desde
            </label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
            </div>
          </div>
        </div>

        {/* Seção de Alteração de Senha */}
        {isEditing && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Alterar Senha</h3>
            <p className="text-sm text-gray-600 mb-6">Deixe em branco se não desejar alterar a senha.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Senha Atual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha Atual
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={editedInfo.currentPassword}
                    onChange={(e) => setEditedInfo(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Senha atual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Nova Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={editedInfo.newPassword}
                    onChange={(e) => setEditedInfo(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={editedInfo.confirmPassword}
                    onChange={(e) => setEditedInfo(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirmar nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Informações de Acesso */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5" />
          Informações de Acesso
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">Conta Criada</h3>
            <p className="text-blue-700">
              {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleString('pt-BR') : 'N/A'}
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-900 mb-2">Última Atualização</h3>
            <p className="text-green-700">
              {userInfo.updatedAt ? new Date(userInfo.updatedAt).toLocaleString('pt-BR') : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}