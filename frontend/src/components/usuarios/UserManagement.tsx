// UserManagement.tsx - Componente principal de gerenciamento de usuários
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  Shield, 
  UserCheck, 
  UserX,
  Settings,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';
import UserCard from './UserCard';
import UserModal from './UserModal';
import { strapiUsersApi, type User, type UserRole } from '@/api/strapiUsers';
import { useAuth } from '@/contexts/AuthContext';

export default function UserManagement() {
  const { isAdmin, isGerente, isSupervisor } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [usersData, rolesData] = await Promise.all([
        strapiUsersApi.getUsers(),
        strapiUsersApi.getRoles()
      ]);
      
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    const canManage = isAdmin() || isGerente() || isSupervisor();
    if (!canManage) {
      alert('Apenas administradores, gerentes e supervisores podem criar usuários');
      return;
    }
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    const canManage = isAdmin() || isGerente() || isSupervisor();
    if (!canManage) {
      alert('Apenas administradores, gerentes e supervisores podem editar usuários');
      return;
    }
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId: number) => {
    const canManage = isAdmin() || isGerente() || isSupervisor();
    if (!canManage) {
      alert('Apenas administradores, gerentes e supervisores podem excluir usuários');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const success = await strapiUsersApi.deleteUser(userId);
        if (success) {
          setUsers(users.filter(user => user.id !== userId));
          alert('Usuário excluído com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert(error.message || 'Erro ao excluir usuário');
      }
    }
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      if (editingUser) {
        // Atualizar usuário existente
        const updatedUser = await strapiUsersApi.updateUser(editingUser.id, userData);
        if (updatedUser) {
          setUsers(users.map(user => 
            user.id === editingUser.id ? updatedUser : user
          ));
          alert('Usuário atualizado com sucesso!');
        }
      } else {
        // Criar novo usuário
        const newUser = await strapiUsersApi.createUser(userData as Omit<User, 'id'>);
        if (newUser) {
          setUsers([...users, newUser]);
          alert('Usuário criado com sucesso!');
        }
      }
      setShowModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert(error.message || 'Erro ao salvar usuário');
    }
  };

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role?.name === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      
      {/* CARD PRINCIPAL COM BARRA VERDE */}
      <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
        
        {/* BARRA VERDE ELEGANTE */}
        <div className="h-3 bg-green-500 rounded-t-xl"></div>
        
        {/* HEADER MODERNO */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100" style={{ height: '140px' }}>
          <div className="h-full p-6 flex flex-col justify-between">
            
            {/* Título e Ações */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>Gerenciamento de Usuários</h1>
                  <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: '"Inter", sans-serif' }}>
                    <span className="font-mono font-semibold text-gray-700">{filteredUsers.length}</span> usuários encontrados
                  </p>
                </div>
              </div>

              {(isAdmin() || isGerente() || isSupervisor()) && (
                <button
                  onClick={handleCreateUser}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  <Plus className="w-5 h-5" />
                  Novo Usuário
                </button>
              )}
            </div>

            {/* Filtros Modernos */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl 
                           focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                           text-sm transition-all duration-200 placeholder:text-gray-400"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                />
              </div>

              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10
                           focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                           text-sm cursor-pointer transition-all duration-200 min-w-[160px]"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  <option value="all">Todos os Perfis</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>
                      {role.displayName || role.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="flex-1 overflow-hidden" style={{ height: 'calc(100% - 143px)' }}>
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-500" style={{ fontFamily: '"Inter", sans-serif' }}>Nenhum usuário encontrado</p>
              <p className="text-sm text-gray-400 mt-1" style={{ fontFamily: '"Inter", sans-serif' }}>Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="h-full overflow-auto bg-gray-50/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-6">
                {filteredUsers.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    canEdit={isAdmin() || isGerente() || isSupervisor()}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de criação/edição */}
      {showModal && (
        <UserModal
          user={editingUser}
          roles={roles}
          onSave={handleSaveUser}
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}