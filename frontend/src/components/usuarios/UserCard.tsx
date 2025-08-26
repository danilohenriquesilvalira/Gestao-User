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
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-5 
                   shadow-sm hover:shadow-lg hover:border-gray-300/50 
                   transition-all duration-300 group hover:bg-white"
         style={{ fontFamily: '"Inter", sans-serif' }}>
      
      {/* Avatar e Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <span className="text-white font-bold text-lg">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            {/* Status indicator */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
              user.blocked ? 'bg-red-500' : 'bg-green-500'
            }`}></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-gray-800 transition-colors" 
                style={{ fontFamily: '"Inter", sans-serif' }}>
              {user.username}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {user.blocked ? (
                <div className="flex items-center gap-1.5 text-red-600">
                  <UserX className="w-3 h-3" />
                  <span className="text-xs font-medium">Bloqueado</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-green-600">
                  <UserCheck className="w-3 h-3" />
                  <span className="text-xs font-medium">Ativo</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ações */}
        {canEdit && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(user)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50/80 rounded-lg transition-all duration-200"
              title="Editar usuário"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(user.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50/80 rounded-lg transition-all duration-200"
              title="Excluir usuário"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Email */}
      <div className="flex items-center gap-2.5 mb-4 text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
        <div className="w-8 h-8 bg-gray-100/80 rounded-lg flex items-center justify-center group-hover:bg-gray-200/60 transition-colors">
          <Mail className="w-3.5 h-3.5 text-gray-500" />
        </div>
        <span className="truncate" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{user.email}</span>
      </div>

      {/* Role Badge */}
      {user.role && (
        <div className="mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${getRoleColor(user.role.name)} shadow-sm hover:shadow-md transition-all duration-200`}
               style={{ fontFamily: '"Inter", sans-serif' }}>
            <div className="w-4 h-4">
              {getRoleIcon(user.role.name)}
            </div>
            <span>{user.role.displayName || user.role.name}</span>
          </div>
        </div>
      )}

      {/* Data de criação */}
      <div className="flex items-center gap-2.5 text-xs text-gray-500 pt-3 border-t border-gray-100/50">
        <div className="w-6 h-6 bg-gray-100/60 rounded-md flex items-center justify-center">
          <Clock className="w-3 h-3 text-gray-400" />
        </div>
        <span style={{ fontFamily: '"JetBrains Mono", monospace' }}>Criado em {formatDate(user.createdAt)}</span>
      </div>
    </div>
  );
}