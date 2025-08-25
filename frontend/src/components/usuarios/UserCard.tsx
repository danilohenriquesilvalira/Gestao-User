// UserCard.tsx - Card individual de usuário
import React from 'react';
import { 
  Edit3, 
  Trash2, 
  Shield, 
  UserCheck, 
  UserX,
  Mail,
  Clock,
  Settings
} from 'lucide-react';
import { type User } from '@/api/strapiUsers';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  canEdit: boolean;
}

export default function UserCard({ user, onEdit, onDelete, canEdit }: UserCardProps) {
  // Cores para diferentes roles
  const getRoleColor = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
      case 'superadmin':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'gerente':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'tecnico':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'operador':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'terceirizado':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
      case 'superadmin':
        return <Shield className="w-3 h-3" />;
      case 'gerente':
        return <Settings className="w-3 h-3" />;
      default:
        return <UserCheck className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      {/* Avatar e Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{user.username}</h3>
            <div className="flex items-center gap-2">
              {user.blocked ? (
                <div className="flex items-center gap-1 text-red-500">
                  <UserX className="w-3 h-3" />
                  <span className="text-xs">Bloqueado</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-green-500">
                  <UserCheck className="w-3 h-3" />
                  <span className="text-xs">Ativo</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ações */}
        {canEdit && (
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(user)}
              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
              title="Editar usuário"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(user.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Excluir usuário"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Email */}
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
        <Mail className="w-3.5 h-3.5" />
        <span className="truncate">{user.email}</span>
      </div>

      {/* Role Badge */}
      {user.role && (
        <div className="mb-3">
          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role.name)}`}>
            {getRoleIcon(user.role.name)}
            <span>{user.role.displayName || user.role.name}</span>
          </div>
        </div>
      )}

      {/* Data de criação */}
      <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
        <Clock className="w-3 h-3" />
        <span>Criado em {formatDate(user.createdAt)}</span>
      </div>
    </div>
  );
}