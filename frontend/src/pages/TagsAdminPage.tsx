// TagsAdminPage.tsx - Página de administração avançada (APENAS ADMIN/GERENTE/SUPERVISOR)
import { useState } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationContainer from '@/components/ui/NotificationContainer';
import AssistenteVirtual from '@/components/dashboard/AssistenteVirtual';
import TagsMonitor from '@/components/tags/TagsMonitor';
import DatabaseMonitor from '@/components/database/DatabaseMonitor';
import ServerMonitor from '@/components/server/ServerMonitor';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Database, 
  Server, 
  Activity, 
  BarChart3, 
  Radio,
  HardDrive,
  Cpu,
  Wifi
} from 'lucide-react';

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
  const { isAdmin, isGerente, isSupervisor, user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'tags' | 'database' | 'server'>('tags');
  const [tagsFilterCategory, setTagsFilterCategory] = useState<string>('all');

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

  // 🔒 PROTEÇÃO: APENAS ADMIN, GERENTE E SUPERVISOR PODEM ACESSAR
  const canAccess = isAdmin() || isGerente() || isSupervisor();
  if (!canAccess) {
    console.log('❌ Usuário sem permissão, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Configuração das abas
  const tabs = [
    {
      id: 'tags' as const,
      label: 'Tags & PLC',
      icon: <Radio className="w-5 h-5" />,
      color: 'blue',
      description: 'Monitoramento em tempo real das tags do PLC'
    },
    {
      id: 'database' as const,
      label: 'Banco de Dados',
      icon: <Database className="w-5 h-5" />,
      color: 'green',
      description: 'Estatísticas e logs do banco PostgreSQL'
    },
    {
      id: 'server' as const,
      label: 'Servidor',
      icon: <Server className="w-5 h-5" />,
      color: 'purple',
      description: 'Monitoramento de recursos do servidor'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ModernSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <ModernHeader title="Administração Avançada" onLogout={handleLogout} />
        
        {/* MAIN COM CÁLCULO PRECISO DA ALTURA */}
        <main className="flex-1 min-h-0" style={{ height: 'calc(100vh - 64px)' }}>
          <div className="w-full h-full p-2 sm:p-4 md:pl-20 lg:pl-24">
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl bg-gray-50/50 p-2 sm:p-3 lg:p-4">
              
              {/* CARD PRINCIPAL COM ALTURA CALCULADA */}
              <div className="w-full h-full bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
                
                {/* BARRA COLORIDA - MAIS FINA EM MOBILE */}
                <div className={`h-2 sm:h-4 rounded-t-lg sm:rounded-t-xl ${
                  activeTab === 'tags' ? 'bg-blue-500' :
                  activeTab === 'database' ? 'bg-green-500' : 'bg-purple-500'
                }`} 
                style={{
                  backgroundColor: activeTab === 'tags' && tagsFilterCategory === 'all' ? '#3b82f6' : 
                                  activeTab === 'tags' && tagsFilterCategory === 'Níveis' ? '#06b6d4' :
                                  activeTab === 'tags' && tagsFilterCategory === 'Radares' ? '#a855f7' :
                                  activeTab === 'tags' && tagsFilterCategory === 'Portas' ? '#f97316' :
                                  activeTab === 'tags' && tagsFilterCategory === 'Lasers' ? '#eab308' :
                                  activeTab === 'tags' && tagsFilterCategory === 'Semáforos' ? '#22c55e' :
                                  activeTab === 'tags' && tagsFilterCategory === 'PipeSystem' ? '#6366f1' :
                                  activeTab === 'tags' && tagsFilterCategory === 'Válvulas' ? '#ef4444' :
                                  activeTab === 'tags' && tagsFilterCategory === 'Cotas' ? '#ec4899' : undefined
                }}></div>
                
                {/* HEADER MINIMALISTA */}
                <div className="flex-shrink-0 p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    
                    {/* TABS SIMPLES */}
                    <div className="flex gap-1">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                            activeTab === tab.id
                              ? 'bg-blue-500 text-white' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <span className="w-4 h-4">{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CONTEÚDO COM ALTURA CALCULADA PRECISA */}
                <div className="flex-1 min-h-0 overflow-hidden" style={{ height: 'calc(100% - 80px)' }}>
                  {activeTab === 'tags' && <TagsMonitor onFilterChange={setTagsFilterCategory} />}
                  {activeTab === 'database' && <DatabaseMonitor />}
                  {activeTab === 'server' && <ServerMonitor />}
                </div>
                
              </div>
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}