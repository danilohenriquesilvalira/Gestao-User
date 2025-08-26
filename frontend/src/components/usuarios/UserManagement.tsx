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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
              <p className="text-sm text-gray-500">{filteredUsers.length} usuários encontrados</p>
            </div>
          </div>

          {(isAdmin() || isGerente() || isSupervisor()) && (
            <button
              onClick={handleCreateUser}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Usuário
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Perfis</option>
              {roles.map(role => (
                <option key={role.id} value={role.name}>
                  {role.displayName || role.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Lista de Usuários
          </h2>
        </div>

        <div className="overflow-auto h-full">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Users className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium">Nenhum usuário encontrado</p>
              <p className="text-sm">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-4">
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