import { useState, useEffect } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import GlobalAdvancedControls from '@/components/GlobalAdvancedControls';
import { PortaMontanteRegua, BasePortaMontante } from '@/components/Eclusa/PortaMontante/index';
import ContraPeso_MontanteDireito from '@/components/Eclusa/PortaMontante/ContraPeso_MontanteDireito';
import ContraPeso_MontanteEsquerdo from '@/components/Eclusa/PortaMontante/ContraPeso_MontanteEsquerdo';
import Motor from '@/components/industrial/Motor';
import { StatusIndicator } from '@/components/ui';
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

export default function PortaMontantePage() {
  return (
    <NotificationProvider>
      <LayoutLoadingProvider>
        <PortaMontanteContent />
        <NotificationContainer />
      </LayoutLoadingProvider>
    </NotificationProvider>
  );
}

function PortaMontanteContent() {
  const [editMode, setEditMode] = useState(false);
  const { isAllLoaded } = useLayoutLoading();
  const { 
    nivelValue, 
    // Valores específicos da Porta Montante
    portaMontanteValue, 
    portaMontanteContrapesoDirectoValue, 
    portaMontanteContrapesoEsquerdoValue, 
    portaMontanteMotorDireitoValue, 
    portaMontanteMotorEsquerdoValue,
    isConnected, 
    error, 
    lastMessage 
  } = useWebSocket('ws://localhost:8080/ws');

  const handleLogout = () => {
    window.location.replace('/');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      {!isAllLoaded && (
        <EdpLoading
          title="Porta Montante"
          subtitle="Sistema de Controle Industrial EDP"
          status="Inicializando componentes da porta montante..."
          size="lg"
        />
      )}

      {isAllLoaded && (
        <>
          <ModernHeader
            title="Porta Montante - Sistema de Controle"
            user="danilohenriquesilvalira"
            onLogout={handleLogout}
          />

          <ScreenDebug />

          <div className="fixed top-20 left-4 bg-black text-white p-3 rounded text-xs z-40 max-w-[350px]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>PLC: {isConnected ? 'Conectado' : 'Desconectado'}</span>
              </div>
              
              {nivelValue !== null && (
                <div className="text-blue-400">📊 Nível: {formatPercentage(nivelValue)}</div>
              )}
              
              {portaMontanteValue !== null && (
                <div className="text-green-400">
                  ⚙️ Porta Montante: {formatPercentage(portaMontanteValue)}
                </div>
              )}
              
              {portaMontanteMotorDireitoValue !== null && (
                <div className="text-cyan-400">
                  🔧 Motor Direito: {formatMotorStatus(portaMontanteMotorDireitoValue)}
                </div>
              )}
              
              {portaMontanteMotorEsquerdoValue !== null && (
                <div className="text-yellow-400">
                  🔧 Motor Esquerdo: {formatMotorStatus(portaMontanteMotorEsquerdoValue)}
                </div>
              )}
              
              {error && (
                <div className="text-red-400">❌ Erro: {error}</div>
              )}

              {lastMessage && (
                <div className="text-gray-400 text-xs">
                  📡 Última msg: {lastMessage.substring(0, 25)}...
                </div>
              )}
            </div>
          </div>

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

          <GlobalAdvancedControls editMode={editMode} />
          <ModernSidebar />

          <div className={`h-[calc(100vh-64px)] overflow-auto pb-20 md:pb-0 ${editMode ? 'bg-blue-50/30' : ''}`}>
            {/* COMPONENTES DA PORTA MONTANTE */}
            <BasePortaMontante 
              editMode={editMode} 
              componentId="porta-montante-base-principal"
            />
            
            <PortaMontanteRegua 
              editMode={editMode} 
              componentId="porta-montante-regua-principal"
              abertura={limitPercentage(portaMontanteValue)}
            />
            
            <ContraPeso_MontanteDireito 
              editMode={editMode} 
              componentId="contrapeso-montante-direito"
              nivel={limitPercentage(portaMontanteContrapesoDirectoValue)}
            />
            
            <ContraPeso_MontanteEsquerdo 
              editMode={editMode} 
              componentId="contrapeso-montante-esquerdo"
              nivel={limitPercentage(portaMontanteContrapesoEsquerdoValue)}
            />
            
            {/* MOTORES DA PORTA MONTANTE */}
            <Motor 
              editMode={editMode}
              componentId="motor-montante-direito"
              status={limitMotorStatus(portaMontanteMotorDireitoValue)}
              direction="right"
            />
            
            <Motor 
              editMode={editMode}
              componentId="motor-montante-esquerdo" 
              status={limitMotorStatus(portaMontanteMotorEsquerdoValue)}
              direction="left"
            />
          </div>
        </>
      )}
    </div>
  );
}