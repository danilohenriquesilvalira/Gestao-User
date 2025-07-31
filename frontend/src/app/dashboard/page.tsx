'use client';
import { useState, useEffect } from 'react';
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  ServerIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

type User = {
  id: number;
  username: string;
  email: string;
  role: {
    name: string;
    description: string;
  };
};

type BackupStats = {
  total: number;
  sucesso: number;
  falha: number;
  pendente: number;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<BackupStats>({
    total: 156,
    sucesso: 142,
    falha: 8,
    pendente: 6
  });

  useEffect(() => {
    // Simular carregamento do usuário
    setUser({
      id: 1,
      username: 'admin',
      email: 'admin@sistema.com',
      role: {
        name: 'Super Admin',
        description: 'Acesso total ao sistema'
      }
    });
  }, []);

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      window.location.href = '/login';
    }
  };

  const getStatusColor = (tipo: string) => {
    switch (tipo) {
      case 'sucesso': return 'text-green-400 bg-green-400/10';
      case 'falha': return 'text-red-400 bg-red-400/10';
      case 'pendente': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-blue-400 bg-blue-400/10';
    }
  };

  const recentBackups = [
    { id: 1, servidor: 'Server-01', status: 'sucesso', data: '2024-01-31 14:30', tamanho: '2.4 GB' },
    { id: 2, servidor: 'Server-02', status: 'sucesso', data: '2024-01-31 14:25', tamanho: '1.8 GB' },
    { id: 3, servidor: 'Server-03', status: 'falha', data: '2024-01-31 14:20', tamanho: '0 B' },
    { id: 4, servidor: 'Server-04', status: 'pendente', data: '2024-01-31 14:15', tamanho: 'Processando...' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container-fluid py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ServerIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Sistema de Backup</h1>
                <p className="text-sm text-slate-400">Painel de Controle</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <UserCircleIcon className="w-8 h-8 text-slate-400" />
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.username}</p>
                  <p className="text-xs text-slate-400">{user.role.name}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                title="Sair"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-fluid py-8">
        {/* Bem-vindo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Bem-vindo, {user.username}!
          </h2>
          <p className="text-slate-400">
            Aqui está o resumo dos seus backups e atividades do sistema.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total de Backups</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Sucessos</p>
                <p className="text-2xl font-bold text-green-400">{stats.sucesso}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Falhas</p>
                <p className="text-2xl font-bold text-red-400">{stats.falha}</p>
              </div>
              <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pendente}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Recent Backups */}
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Backups Recentes</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                Ver todos
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-700">
            {recentBackups.map((backup) => (
              <div key={backup.id} className="p-6 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                      <DocumentDuplicateIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{backup.servidor}</p>
                      <p className="text-sm text-slate-400">{backup.data}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-400">{backup.tamanho}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                      {backup.status.charAt(0).toUpperCase() + backup.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl p-6 text-left transition-colors group">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/30">
              <ServerIcon className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-white font-medium mb-2">Novo Backup</h4>
            <p className="text-slate-400 text-sm">Iniciar processo de backup manual</p>
          </button>

          <button className="bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl p-6 text-left transition-colors group">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30">
              <ChartBarIcon className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-white font-medium mb-2">Relatórios</h4>
            <p className="text-slate-400 text-sm">Visualizar relatórios detalhados</p>
          </button>

          <button className="bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl p-6 text-left transition-colors group">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/30">
              <UserCircleIcon className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-white font-medium mb-2">Configurações</h4>
            <p className="text-slate-400 text-sm">Gerenciar usuários e permissões</p>
          </button>
        </div>
      </main>
    </div>
  );
}