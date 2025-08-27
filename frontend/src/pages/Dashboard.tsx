// Dashboard.tsx - Mobile-First Delicado
import { useState } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import { useWebSocket } from '@/hooks/useWebSocket';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationContainer from '@/components/ui/NotificationContainer';
import AssistenteVirtual from '@/components/dashboard/AssistenteVirtual';

export default function Dashboard() {
  return (
    <NotificationProvider>
      <DashboardContent />
      <NotificationContainer />
      <AssistenteVirtual />
    </NotificationProvider>
  );
}

function DashboardContent() {
  const { isConnected } = useWebSocket('ws://localhost:1337/ws');

  const handleLogout = () => {
    window.location.replace('/');
  };

  // Níveis do WebSocket
  const [niveis] = useState({
    caldeira: 14.2,
    jusante: 12.8,
    montante: 16.5
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ModernSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <ModernHeader title="Dashboard" onLogout={handleLogout} />
        
        <main className="flex-1 min-h-0 pb-16 md:pb-0 p-3 sm:p-4 md:p-6">
          
          {/* CARD MOBILE-FIRST */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            
            {/* RETÂNGULO AZUL EM CIMA */}
            <div className="h-2 bg-blue-500"></div>
            
            {/* HEADER */}
            <div className="p-4 sm:p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Níveis de Água</h2>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs sm:text-sm text-gray-600">{isConnected ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>

            {/* CONTEÚDO MOBILE-FIRST */}
            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                
                {/* CALDEIRA */}
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-600 mb-1">{niveis.caldeira}m</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-700">Caldeira</div>
                  <div className="w-full h-0.5 sm:h-1 bg-indigo-200 rounded-full mt-2">
                    <div className="w-3/4 h-full bg-indigo-500 rounded-full"></div>
                  </div>
                </div>

                {/* JUSANTE */}
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-1">{niveis.jusante}m</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-700">Jusante</div>
                  <div className="w-full h-0.5 sm:h-1 bg-blue-200 rounded-full mt-2">
                    <div className="w-2/3 h-full bg-blue-500 rounded-full"></div>
                  </div>
                </div>

                {/* MONTANTE */}
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-600 mb-1">{niveis.montante}m</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-700">Montante</div>
                  <div className="w-full h-0.5 sm:h-1 bg-cyan-200 rounded-full mt-2">
                    <div className="w-4/5 h-full bg-cyan-500 rounded-full"></div>
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