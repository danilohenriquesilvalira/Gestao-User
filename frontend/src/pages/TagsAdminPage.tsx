// TagsAdminPage.tsx - Página de administração de Tags/PLC (APENAS ADMIN)
import { useState } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationContainer from '@/components/ui/NotificationContainer';
import AssistenteVirtual from '@/components/dashboard/AssistenteVirtual';
import TagsMonitor from '@/components/tags/TagsMonitor';
import DatabaseMonitor from '@/components/database/DatabaseMonitor';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function TagsAdminPage() {
  return (
    <NotificationProvider>
      <TagsAdminContent />
      <NotificationContainer />
      <AssistenteVirtual />
    </NotificationProvider>
  );
}

function TagsAdminContent() {
  const { isAdmin, user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'tags' | 'system'>('tags');

  const handleLogout = () => {
    window.location.replace('/');
  };

  // DEBUG: Verificar status do usuário
  console.log('🔍 DEBUG TagsAdmin - User:', user);
  console.log('🔍 DEBUG TagsAdmin - isAdmin():', isAdmin());
  console.log('🔍 DEBUG TagsAdmin - user?.role:', user?.role);
  console.log('🔍 DEBUG TagsAdmin - isAuthenticated:', isAuthenticated);

  // Aguardar carregamento dos dados do usuário
  if (!isAuthenticated || !user) {
    return <div>Carregando...</div>;
  }

  // 🔒 PROTEÇÃO: APENAS ADMIN PODE ACESSAR
  if (!isAdmin()) {
    console.log('❌ Usuário não é admin, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ModernSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ModernHeader title="Tags & PLC Admin" onLogout={handleLogout} />
        
        <main className="flex-1 overflow-hidden">
          {/* Mesmo padrão visual do dashboard */}
          <div className="w-full h-full pl-4 pr-4 py-4 md:pl-24">
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 p-3 lg:p-4">
              
              {/* ✅ SISTEMA DE ABAS - SEM AFETAR O CÓDIGO ORIGINAL */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('tags')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'tags' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Tags & PLC
                </button>
                
                <button
                  onClick={() => setActiveTab('system')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'system' 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-700 border border-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  Banco de Dados
                </button>
              </div>

              {/* ✅ CONTEÚDO DAS ABAS - PRESERVANDO O COMPONENTE ORIGINAL */}
              <div className="h-[calc(100%-3.5rem)] overflow-hidden">
                {activeTab === 'tags' && <TagsMonitor />}
                {activeTab === 'system' && <DatabaseMonitor />}
              </div>
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}