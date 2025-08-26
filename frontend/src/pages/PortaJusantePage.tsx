import { useState, useEffect } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import { useAuth } from '@/contexts/AuthContext';
import GlobalAdvancedControls from '@/components/GlobalAdvancedControls';
import PortaJusante from '@/components/Eclusa/PortaJusante';
import { BasePorta, PortaJusanteRegua, ContraPesoDireito, ContraPesoEsquerdo } from '@/components/Eclusa/PortaJusante/index';
import { StatusIndicator } from '@/components/ui';
import Motor from '@/components/industrial/Motor';
import { useWebSocket } from '@/hooks/useWebSocket';
import { limitPercentage, limitMotorStatus, formatPercentage, formatMotorStatus } from '@/lib/plcValidation';
import { LayoutLoadingProvider, useLayoutLoading } from '@/contexts/LayoutLoadingContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationContainer from '@/components/ui/NotificationContainer';
import { EdpLoading } from '@/components/ui/EdpLoading';

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

  const getBreakpoint = (width: number): string => {
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

export default function PortaJusantePage() {
  return (
    <NotificationProvider>
      <LayoutLoadingProvider>
        <PortaJusanteContent />
        <NotificationContainer />
      </LayoutLoadingProvider>
    </NotificationProvider>
  );
}

function PortaJusanteContent() {
  const [editMode, setEditMode] = useState(false);
  const { canEditLayout } = useAuth();
  const { isAllLoaded } = useLayoutLoading();
  const { nivelValue, motorValue, contrapesoDirectoValue, contrapesoEsquerdoValue, motorDireitoValue, motorEsquerdoValue, isConnected, isDataReady, error, lastMessage } = useWebSocket('ws://localhost:1337/ws');

  // ✅ CONDIÇÃO OTIMIZADA: Só aguarda componentes carregarem, não dados do WebSocket
  const isFullyReady = isAllLoaded;

  const handleLogout = () => {
    window.location.replace('/');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100">
      {!isFullyReady && (
        <EdpLoading
          title="Porta Jusante"
          subtitle="Sistema de Controle Industrial EDP"
          status={
            !isAllLoaded ? 'Carregando componentes...' : 
            false ? 'Aguardando dados do PLC...' :
            'Sistema pronto'
          }
          size="lg"
        />
      )}

      {isFullyReady && (
        <>
          <ModernHeader
            title="Porta Jusante - Sistema de Controle"
            user="danilohenriquesilvalira"
            onLogout={handleLogout}
          />


          {!editMode && canEditLayout() && (
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

          <GlobalAdvancedControls editMode={editMode} pageFilter="jusante" />
          <ModernSidebar />

          <div className={`h-[calc(100vh-64px)] overflow-auto pb-20 md:pb-0 ${editMode ? 'bg-blue-50/30' : ''}`}>
            <BasePorta 
              editMode={editMode} 
              componentId="porta-jusante-base-principal"
            />
            
            <PortaJusanteRegua 
              editMode={editMode} 
              componentId="porta-jusante-regua-principal"
              nivel={limitPercentage(motorValue)}
            />
            
            <ContraPesoDireito 
              editMode={editMode} 
              componentId="porta-jusante-contrapeso-direito"
              nivel={limitPercentage(contrapesoDirectoValue)}
            />
            
            <ContraPesoEsquerdo 
              editMode={editMode} 
              componentId="porta-jusante-contrapeso-esquerdo"
              nivel={limitPercentage(contrapesoEsquerdoValue)}
            />

            {/* MOTORES DA PORTA JUSANTE */}
            <Motor
              editMode={editMode}
              componentId="porta-jusante-motor-direito"
              status={limitMotorStatus(motorDireitoValue)}
              websocketValue={motorDireitoValue}
            />
            
            <Motor
              editMode={editMode}
              componentId="porta-jusante-motor-esquerdo"
              status={limitMotorStatus(motorEsquerdoValue)}
              websocketValue={motorEsquerdoValue}
              direction="right"
            />
          </div>
        </>
      )}
    </div>
  );
}