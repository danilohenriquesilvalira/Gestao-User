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
              <div className="w-full h-full rounded-2xl bg-white shadow-lg p-8">
                
                {/* HEADER DO PERFIL */}
                <div className="mb-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white font-bold">
                      {userInfo?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">{userInfo?.name || 'Usuário'}</h1>
                  <p className="text-lg text-gray-600 mt-2 capitalize">{userInfo?.role || 'Função não definida'}</p>
                </div>

                {/* INFORMAÇÕES DO PERFIL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">📧 Informações de Contato</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Nome:</span> {userInfo?.name || 'N/A'}</p>
                      <p><span className="font-medium">Email:</span> {currentUser?.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">🛡️ Informações do Sistema</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Função:</span> {userInfo?.role || 'N/A'}</p>
                      <p><span className="font-medium">Status:</span> <span className="text-green-600">✅ Ativo</span></p>
                    </div>
                  </div>
                </div>

                {/* SEÇÃO DE PERMISSÕES */}
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">🔑 Suas Permissões</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentUser?.role?.name === 'tecnico' && (
                      <>
                        <div className="flex items-center gap-2 text-blue-800">
                          <span>🔧</span> Manutenção Completa
                        </div>
                        <div className="flex items-center gap-2 text-blue-800">
                          <span>🔍</span> Diagnósticos
                        </div>
                        <div className="flex items-center gap-2 text-blue-800">
                          <span>⚙️</span> Debug do Sistema
                        </div>
                        <div className="flex items-center gap-2 text-blue-800">
                          <span>🚢</span> Manutenção de Eclusa
                        </div>
                      </>
                    )}
                    
                    {currentUser?.role?.name === 'operador' && (
                      <>
                        <div className="flex items-center gap-2 text-blue-800">
                          <span>🎮</span> Operação de Eclusa
                        </div>
                        <div className="flex items-center gap-2 text-blue-800">
                          <span>📊</span> Relatórios Básicos
                        </div>
                        <div className="flex items-center gap-2 text-blue-800">
                          <span>📡</span> Monitoramento
                        </div>
                      </>
                    )}

                    {currentUser?.role?.name === 'visitante' && (
                      <>
                        <div className="flex items-center gap-2 text-blue-800">
                          <span>👁️</span> Visualização do Dashboard
                        </div>
                        <div className="flex items-center gap-2 text-blue-800">
                          <span>📊</span> Relatórios Básicos
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* INFORMAÇÕES ADICIONAIS */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    Para alterações em seu perfil, entre em contato com o administrador do sistema.
                  </p>
                </div>

              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}