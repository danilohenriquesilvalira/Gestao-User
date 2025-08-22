import { useState, useEffect } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import GlobalAdvancedControls from '@/components/GlobalAdvancedControls';
import NivelCaldeira from '@/components/Eclusa/Nivel_Caldeira';
import NivelMontante from '@/components/Eclusa/Nivel_Montante';
import NivelJusante from '@/components/Eclusa/Nivel_Jusante';
import { useWebSocket } from '@/hooks/useWebSocket';
import Caldeira from '@/components/Eclusa/Caldeira';
import Parede from '@/components/Eclusa/Parede';
import PortaJusante from '@/components/Eclusa/PortaJusante';
import PortaMontante from '@/components/Eclusa/PortaMontante';
import BasePortaJusante from '@/components/Eclusa/BasePortaJusante';
import BasePortaJusante2 from '@/components/Eclusa/BasePortaJusante2';
import RadarEclusa from '@/components/Eclusa/RadarEclusa';
import Semaforo from '@/components/Eclusa/Semaforo';
import TubulacaoCaldeira from '@/components/Eclusa/TubulacaoCaldeira';
import GraficosCotas from '@/components/Eclusa/GraficosCotas';
import StatusSistema from '@/components/Eclusa/StatusSistema';
import RadarMonitor from '@/components/Eclusa/RadarMonitor';
import AssistenteVirtual from '@/components/dashboard/AssistenteVirtual';
import { LayoutLoadingProvider, useLayoutLoading } from '@/contexts/LayoutLoadingContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationContainer from '@/components/ui/NotificationContainer';
import { EdpLoading } from '@/components/ui/EdpLoading';

// Debug Component para responsividade
function ScreenDebug() {
  const [screenInfo, setScreenInfo] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const getBreakpoint = (width: number) => {
    if (width >= 3840) return '6xl (3840px+)';
    if (width >= 2560) return '5xl (2560px+)';
    if (width >= 1920) return '4xl (1920px+)';
    if (width >= 1440) return '3xl (1440px+)';
    if (width >= 1280) return '2xl (1280px+)';
    if (width >= 1024) return 'xl (1024px+)';
    if (width >= 768) return 'lg (768px+)';
    if (width >= 425) return 'md (425px+)';
    if (width >= 375) return 'sm (375px+)';
    if (width >= 320) return 'xs (320px+)';
    return 'Menor que xs';
  };

  return (
    <div className="fixed top-20 right-4 bg-black text-white p-3 rounded-lg text-xs font-mono-tech z-40 border border-gray-800">
      <div className="text-tech-600">Resolução: {screenInfo.width} x {screenInfo.height}</div>
      <div className="text-gray-300">Breakpoint: {getBreakpoint(screenInfo.width)}</div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <NotificationProvider>
      <LayoutLoadingProvider>
        <DashboardContent />
        <NotificationContainer />
      </LayoutLoadingProvider>
    </NotificationProvider>
  );
}

function DashboardContent() {
  const [editMode, setEditMode] = useState(false);
  const { isAllLoaded } = useLayoutLoading();
  const { 
    nivelCaldeiraValue, 
    nivelMontanteValue, 
    nivelJusanteValue,
    motorValue, 
    isConnected, 
    error, 
    lastMessage 
  } = useWebSocket('ws://localhost:8080/ws');

  // ✅ CONDIÇÃO: Layout carregado E (WebSocket conectado OU modo edição)
  const isFullyReady = isAllLoaded && (isConnected || editMode);

  const handleLogout = () => {
    window.location.replace('/');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100">
      {/* TELA DE LOADING GLOBAL - Com EdpLoading Personalizado */}
      {!isFullyReady && (
        <EdpLoading
          title="Eclusa de Navegação"
          subtitle="Sistema de Gestão Industrial EDP"
          status={
            !isAllLoaded ? 'Inicializando interface...' : 
            !isConnected ? 'Conectando ao PLC...' : 
            'Sincronizando dados do sistema...'
          }
          size="lg"
        />
      )}

      {/* CONTEÚDO DO DASHBOARD - Só mostra quando TUDO estiver carregado E WebSocket com dados */}
      {isFullyReady && (
        <>
          <ModernHeader
            title="Eclusa de Navegação"
            user="danilohenriquesilvalira"
            onLogout={handleLogout}
          />


          {/* BOTÃO DE EDIT MODE DIRETO */}
          {!editMode && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="fixed bottom-8 right-8 w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 z-50 flex items-center justify-center"
              title="Ativar Modo Edição"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
          )}

          {editMode && (
            <button
              onClick={() => setEditMode(false)}
              className="fixed bottom-8 right-8 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 z-50 flex items-center justify-center"
              title="Sair do Modo Edição"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          )}

          {/* PAINEL FLUTUANTE GLOBAL */}
          <GlobalAdvancedControls editMode={editMode} />

          <ModernSidebar />

          {/* ÁREA PRINCIPAL */}
          <div 
            className={`h-[calc(100vh-64px)] overflow-auto pb-20 md:pb-0 ${
              editMode ? 'bg-blue-50/30' : ''
            }`}
          >
            {/* COMPONENTES DE NÍVEL */}
            <NivelCaldeira
              nivel={75}
              editMode={editMode}
              websocketValue={nivelCaldeiraValue}
            />
            <NivelMontante
              nivel={60}
              editMode={editMode}
              websocketValue={nivelMontanteValue}
            />
            <NivelJusante
              nivel={80}
              editMode={editMode}
              websocketValue={nivelJusanteValue}
            />

            {/* ✅ COMPONENTES ECLUSA INDEPENDENTES - SEM CARD */}
            <Caldeira editMode={editMode} />
            <Parede editMode={editMode} />
            <PortaJusante editMode={editMode} />
            <PortaMontante editMode={editMode} />
            <BasePortaJusante editMode={editMode} />
            <BasePortaJusante2 editMode={editMode} />
            <TubulacaoCaldeira editMode={editMode} />
            <RadarEclusa editMode={editMode} />
            <Semaforo editMode={editMode} />
            <GraficosCotas editMode={editMode} />
            <StatusSistema editMode={editMode} />
            <RadarMonitor editMode={editMode} />
            
            {/* ✅ SEMÁFOROS CORRIGIDOS - APENAS OS QUE EXISTEM NO GO BACKEND */}
            <Semaforo editMode={editMode} componentId="semaforo-1" />
            <Semaforo editMode={editMode} componentId="semaforo-2" />
            <Semaforo editMode={editMode} componentId="semaforo-3" />
          </div>

          {/* ✅ ASSISTENTE VIRTUAL INTELIGENTE */}
          <AssistenteVirtual />

        </>
      )}
    </div>
  );
}