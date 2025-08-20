// Dashboard.tsx
import { useState } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import { useWebSocket } from '@/hooks/useWebSocket';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationContainer from '@/components/ui/NotificationContainer';
import AssistenteVirtual from '@/components/dashboard/AssistenteVirtual';
import EclusaCardCompact from '@/components/ui/EclusaCardCompact';
import AlarmesCompact from '@/components/ui/AlarmesCompact';
import ModernCharts from '@/components/ui/ModernCharts';

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
  const { isConnected, error } = useWebSocket('ws://localhost:8080/ws');

  const handleLogout = () => {
    window.location.replace('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ModernSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ModernHeader onLogout={handleLogout} />
        
        <main className="flex-1 overflow-hidden">
          {/* Área de Conteúdo - Demarcação DEPOIS do sidebar */}
          <div className="w-full h-full pl-4 pr-4 py-4 md:pl-24">
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 p-6 flex flex-col">
              
              {/* 5 EclusaCards Responsivos */}
              
              {/* Mobile: 1 por linha */}
              <div className="block sm:hidden mb-8">
                <div className="space-y-3">
                  <div className="h-32">
                    <EclusaCardCompact
                      name="Crestuma"
                      color="#60BBF8"
                      status="Operacional"
                      userLogado="Maria Santos"
                      cotaMontante="15.2m"
                      cotaCaldeira="12.8m"
                      cotaJusante="10.5m"
                      eficiencia={98}
                      proximaManutencao="15 dias"
                      alarmes={false}
                      comunicacao="Online"
                      inundacao="Normal"
                      emergencia={false}
                    />
                  </div>
                  <div className="h-32">
                    <EclusaCardCompact
                      name="Carrapatelo"
                      color="#FF886C"
                      status="Operacional"
                      userLogado="Pedro Lima"
                      cotaMontante="14.8m"
                      cotaCaldeira="12.2m"
                      cotaJusante="9.8m"
                      eficiencia={95}
                      proximaManutencao="8 dias"
                      alarmes={true}
                      comunicacao="Instável"
                      inundacao="Normal"
                      emergencia={false}
                    />
                  </div>
                  <div className="h-32">
                    <EclusaCardCompact
                      name="Régua"
                      color="#4AE800"
                      status="Manutenção"
                      userLogado="Carlos Mendes"
                      cotaMontante="16.1m"
                      cotaCaldeira="13.5m"
                      cotaJusante="11.2m"
                      eficiencia={85}
                      proximaManutencao="Em andamento"
                      alarmes={false}
                      comunicacao="Offline"
                      inundacao="Alerta"
                      emergencia={true}
                    />
                  </div>
                  <div className="h-32">
                    <EclusaCardCompact
                      name="Valeira"
                      color="#FF5402"
                      status="Operacional"
                      userLogado="Ana Ferreira"
                      cotaMontante="15.8m"
                      cotaCaldeira="13.1m"
                      cotaJusante="10.9m"
                      eficiencia={97}
                      proximaManutencao="22 dias"
                      alarmes={false}
                      comunicacao="Online"
                      inundacao="Normal"
                      emergencia={false}
                    />
                  </div>
                  <div className="h-32">
                    <EclusaCardCompact
                      name="Pocinho"
                      color="#FEFE00"
                      status="Operacional"
                      userLogado="João Rodrigues"
                      cotaMontante="14.5m"
                      cotaCaldeira="11.9m"
                      cotaJusante="9.5m"
                      eficiencia={99}
                      proximaManutencao="30 dias"
                      alarmes={true}
                      comunicacao="Online"
                      inundacao="Crítico"
                      emergencia={false}
                    />
                  </div>
                </div>
              </div>
              
              {/* Tablet: 2+2+1 */}
              <div className="hidden sm:block md:hidden mb-8">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="h-40">
                    <EclusaCardCompact
                      name="Crestuma"
                      color="#60BBF8"
                      status="Operacional"
                      userLogado="Maria Santos"
                      cotaMontante="15.2m"
                      cotaCaldeira="12.8m"
                      cotaJusante="10.5m"
                      eficiencia={98}
                      proximaManutencao="15 dias"
                      alarmes={false}
                      comunicacao="Online"
                      inundacao="Normal"
                      emergencia={false}
                    />
                  </div>
                  <div className="h-40">
                    <EclusaCardCompact
                      name="Carrapatelo"
                      color="#FF886C"
                      status="Operacional"
                      userLogado="Pedro Lima"
                      cotaMontante="14.8m"
                      cotaCaldeira="12.2m"
                      cotaJusante="9.8m"
                      eficiencia={95}
                      proximaManutencao="8 dias"
                      alarmes={true}
                      comunicacao="Instável"
                      inundacao="Normal"
                      emergencia={false}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="h-40">
                    <EclusaCardCompact
                      name="Régua"
                      color="#4AE800"
                      status="Manutenção"
                      userLogado="Carlos Mendes"
                      cotaMontante="16.1m"
                      cotaCaldeira="13.5m"
                      cotaJusante="11.2m"
                      eficiencia={85}
                      proximaManutencao="Em andamento"
                      alarmes={false}
                      comunicacao="Offline"
                      inundacao="Alerta"
                      emergencia={true}
                    />
                  </div>
                  <div className="h-40">
                    <EclusaCardCompact
                      name="Valeira"
                      color="#FF5402"
                      status="Operacional"
                      userLogado="Ana Ferreira"
                      cotaMontante="15.8m"
                      cotaCaldeira="13.1m"
                      cotaJusante="10.9m"
                      eficiencia={97}
                      proximaManutencao="22 dias"
                      alarmes={false}
                      comunicacao="Online"
                      inundacao="Normal"
                      emergencia={false}
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-1/2 h-40">
                    <EclusaCardCompact
                      name="Pocinho"
                      color="#FEFE00"
                      status="Operacional"
                      userLogado="João Rodrigues"
                      cotaMontante="14.5m"
                      cotaCaldeira="11.9m"
                      cotaJusante="9.5m"
                      eficiencia={99}
                      proximaManutencao="30 dias"
                      alarmes={true}
                      comunicacao="Online"
                      inundacao="Crítico"
                      emergencia={false}
                    />
                  </div>
                </div>
              </div>
              
              {/* Desktop: Todos os 5 em linha */}
              <div className="hidden md:block mb-8">
                <div className="grid grid-cols-5 gap-4">
                  <div className="h-48">
                    <EclusaCardCompact
                      name="Crestuma"
                      color="#60BBF8"
                      status="Operacional"
                      userLogado="Maria Santos"
                      cotaMontante="15.2m"
                      cotaCaldeira="12.8m"
                      cotaJusante="10.5m"
                      eficiencia={98}
                      proximaManutencao="15 dias"
                      alarmes={false}
                      comunicacao="Online"
                      inundacao="Normal"
                      emergencia={false}
                    />
                  </div>
                  <div className="h-48">
                    <EclusaCardCompact
                      name="Carrapatelo"
                      color="#FF886C"
                      status="Operacional"
                      userLogado="Pedro Lima"
                      cotaMontante="14.8m"
                      cotaCaldeira="12.2m"
                      cotaJusante="9.8m"
                      eficiencia={95}
                      proximaManutencao="8 dias"
                      alarmes={true}
                      comunicacao="Instável"
                      inundacao="Normal"
                      emergencia={false}
                    />
                  </div>
                  <div className="h-48">
                    <EclusaCardCompact
                      name="Régua"
                      color="#4AE800"
                      status="Manutenção"
                      userLogado="Carlos Mendes"
                      cotaMontante="16.1m"
                      cotaCaldeira="13.5m"
                      cotaJusante="11.2m"
                      eficiencia={85}
                      proximaManutencao="Em andamento"
                      alarmes={false}
                      comunicacao="Offline"
                      inundacao="Alerta"
                      emergencia={true}
                    />
                  </div>
                  <div className="h-48">
                    <EclusaCardCompact
                      name="Valeira"
                      color="#FF5402"
                      status="Operacional"
                      userLogado="Ana Ferreira"
                      cotaMontante="15.8m"
                      cotaCaldeira="13.1m"
                      cotaJusante="10.9m"
                      eficiencia={97}
                      proximaManutencao="22 dias"
                      alarmes={false}
                      comunicacao="Online"
                      inundacao="Normal"
                      emergencia={false}
                    />
                  </div>
                  <div className="h-48">
                    <EclusaCardCompact
                      name="Pocinho"
                      color="#FEFE00"
                      status="Operacional"
                      userLogado="João Rodrigues"
                      cotaMontante="14.5m"
                      cotaCaldeira="11.9m"
                      cotaJusante="9.5m"
                      eficiencia={99}
                      proximaManutencao="30 dias"
                      alarmes={true}
                      comunicacao="Online"
                      inundacao="Crítico"
                      emergencia={false}
                    />
                  </div>
                </div>
              </div>
              
              {/* Sistema de Alarmes & Avisos Responsivo */}
              
              {/* Mobile: Padrão uniforme */}
              <div className="block sm:hidden">
                <div className="h-[calc(100vh-390px)] min-h-[300px]">
                  <AlarmesCompact />
                </div>
              </div>
              
              {/* Tablet: Padrão uniforme */}
              <div className="hidden sm:block md:hidden">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-[calc(100vh-390px)] min-h-[300px]">
                    <AlarmesCompact />
                  </div>
                  <div className="h-[calc(100vh-390px)] min-h-[300px]">
                    <ModernCharts />
                  </div>
                </div>
              </div>
              
              {/* Desktop: Padrão uniforme */}
              <div className="hidden md:block">
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2 h-[calc(100vh-390px)] min-h-[300px]">
                    <AlarmesCompact />
                  </div>
                  <div className="col-span-3 h-[calc(100vh-390px)] min-h-[300px]">
                    <ModernCharts />
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