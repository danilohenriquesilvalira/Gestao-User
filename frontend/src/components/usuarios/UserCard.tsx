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
  Settings,
  Crown,
  Users,
  Eye,
  Wrench,
  Gamepad2
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
        return 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200';
      case 'gerente':
        return 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border border-purple-200';
      case 'supervisor':
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200';
      case 'tecnico':
        return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200';
      case 'operador':
        return 'bg-gradient-to-r from-orange-50 to-yellow-50 text-orange-700 border border-orange-200';
      case 'visitante':
        return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200';
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
        return <Crown className="w-3 h-3" />;
      case 'gerente':
        return <Users className="w-3 h-3" />;
      case 'supervisor':
        return <Shield className="w-3 h-3" />;
      case 'tecnico':
        return <Wrench className="w-3 h-3" />;
      case 'operador':
        return <Gamepad2 className="w-3 h-3" />;
      case 'visitante':
        return <Eye className="w-3 h-3" />;
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
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
      {/* Avatar e Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">
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
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${getRoleColor(user.role.name)} shadow-sm`}>
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