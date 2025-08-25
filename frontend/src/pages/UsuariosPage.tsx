// UsuariosPage.tsx - Página moderna de gerenciamento de usuários E perfil pessoal
import { useState } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationContainer from '@/components/ui/NotificationContainer';
import AssistenteVirtual from '@/components/dashboard/AssistenteVirtual';
import UserManagement from '@/components/usuarios/UserManagement';
// import UserProfile from '@/components/usuarios/UserProfile'; // Temporariamente removido
import { useAuth } from '@/contexts/AuthContext';

export default function UsuariosPage() {
  return (
    <NotificationProvider>
      <UsuariosContent />
      <NotificationContainer />
      <AssistenteVirtual />
    </NotificationProvider>
  );
}

function UsuariosContent() {
  const { isAdmin, isGerente, isSupervisor, getUserInfo, user } = useAuth();
  
  const handleLogout = () => {
    window.location.replace('/');
  };

  // Verificar informações do usuário
  const userInfo = getUserInfo();
  const currentUser = user;
  
  // DEBUGAR ROLES
  console.log('🔍 DEBUG ROLES:', {
    currentUser,
    userInfo,
    isAdmin: isAdmin(),
    isGerente: isGerente(),
    isSupervisor: isSupervisor(),
    roleName: currentUser?.role?.name
  });

  // Determinar se o usuário tem permissão de gerenciamento
  const canManageUsers = isAdmin() || isGerente() || isSupervisor();
  
  // Título dinâmico baseado na permissão
  const pageTitle = canManageUsers ? "Gerenciamento de Usuários" : "Meu Perfil";

  if (canManageUsers) {
    // INTERFACE DE GERENCIAMENTO para Admin/Gerente/Supervisor
    return (
      <div className="flex h-screen bg-gray-50">
        <ModernSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <ModernHeader title={pageTitle} onLogout={handleLogout} />
          
          <main className="flex-1 overflow-hidden">
            <div className="w-full h-full pl-4 pr-4 py-4 md:pl-24">
              <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 p-3 lg:p-4">
                <UserManagement />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  } else {
    // INTERFACE DE PERFIL PESSOAL para Técnico/Operador/Visitante
    return (
      <div className="flex h-screen bg-gray-50">
        <ModernSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <ModernHeader title={pageTitle} onLogout={handleLogout} />
          
          <main className="flex-1 overflow-hidden">
            <div className="w-full h-full pl-4 pr-4 py-4 md:pl-24">
              <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 p-3 lg:p-4">
                <div className="w-full h-full bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 lg:p-8">
                    
                    {/* HEADER DO PERFIL */}
                    <div className="mb-6 sm:mb-8 text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-xl sm:text-2xl text-white font-bold">
                          {userInfo?.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{userInfo?.name || 'Usuário'}</h1>
                      <p className="text-base sm:text-lg text-gray-600 mt-2 capitalize">{userInfo?.role || 'Função não definida'}</p>
                    </div>

                    {/* INFORMAÇÕES DO PERFIL */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                      {/* Card de Informações Pessoais */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">👤</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Informações Pessoais</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Nome:</span>
                            <span className="text-gray-900 font-medium break-all">{userInfo?.name || 'N/A'}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Email:</span>
                            <span className="text-gray-900 font-medium break-all">{currentUser?.email || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card de Informações do Sistema */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">🛡️</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Sistema</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Função:</span>
                            <span className="text-gray-900 font-medium">{userInfo?.role || 'N/A'}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Status:</span>
                            <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              Ativo
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SEÇÃO DE PERMISSÕES */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">🔑</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Suas Permissões</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentUser?.role?.name === 'tecnico' && (
                          <>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">🔧</span>
                              <span className="text-gray-800 font-medium">Manutenção Completa</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">🔍</span>
                              <span className="text-gray-800 font-medium">Diagnósticos</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">⚙️</span>
                              <span className="text-gray-800 font-medium">Debug do Sistema</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">🚢</span>
                              <span className="text-gray-800 font-medium">Manutenção de Eclusa</span>
                            </div>
                          </>
                        )}
                        
                        {currentUser?.role?.name === 'operador' && (
                          <>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">🎮</span>
                              <span className="text-gray-800 font-medium">Operação de Eclusa</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">📊</span>
                              <span className="text-gray-800 font-medium">Relatórios Básicos</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">📡</span>
                              <span className="text-gray-800 font-medium">Monitoramento</span>
                            </div>
                          </>
                        )}

                        {currentUser?.role?.name === 'visitante' && (
                          <>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">👁️</span>
                              <span className="text-gray-800 font-medium">Visualização do Dashboard</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">📊</span>
                              <span className="text-gray-800 font-medium">Relatórios Básicos</span>
                            </div>
                          </>
                        )}

                        {currentUser?.role?.name === 'supervisor' && (
                          <>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">👥</span>
                              <span className="text-gray-800 font-medium">Visualizar Usuários</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">📊</span>
                              <span className="text-gray-800 font-medium">Relatórios</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">🎮</span>
                              <span className="text-gray-800 font-medium">Controle de Eclusa</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">📅</span>
                              <span className="text-gray-800 font-medium">Agendamento</span>
                            </div>
                          </>
                        )}

                        {currentUser?.role?.name === 'gerente' && (
                          <>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">👥</span>
                              <span className="text-gray-800 font-medium">Gerenciar Usuários</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">📊</span>
                              <span className="text-gray-800 font-medium">Todos os Relatórios</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">📡</span>
                              <span className="text-gray-800 font-medium">Monitoramento</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">🎮</span>
                              <span className="text-gray-800 font-medium">Controle de Eclusa</span>
                            </div>
                          </>
                        )}

                        {currentUser?.role?.name === 'admin' && (
                          <>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">👑</span>
                              <span className="text-gray-800 font-medium">Acesso Total</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">👥</span>
                              <span className="text-gray-800 font-medium">Gerenciar Usuários</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">⚙️</span>
                              <span className="text-gray-800 font-medium">Configurações</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                              <span className="text-xl">🔧</span>
                              <span className="text-gray-800 font-medium">Todas as Funções</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* INFORMAÇÕES ADICIONAIS */}
                    <div className="mt-6 sm:mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold text-sm">ℹ️</span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">
                          Para alterações em seu perfil, entre em contato com o administrador do sistema.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}