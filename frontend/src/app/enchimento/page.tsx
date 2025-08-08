'use client';

import { useState, useEffect } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import GlobalAdvancedControls from '@/components/GlobalAdvancedControls';
import { PipeSystem, ValvulaOnOff, ValveDirecional, ValvulaGaveta, ValvulaVertical, ValvulaFlange, BasePistaoEnchimento, PistaoEnchimento, CilindroEnchimento, MotorEnchimento } from '@/components/Eclusa/Enchimento';
import { useWebSocket } from '@/hooks/useWebSocket';
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

export default function EnchimentoPage() {
  return (
    <NotificationProvider>
      <LayoutLoadingProvider>
        <EnchimentoContent />
        <NotificationContainer />
      </LayoutLoadingProvider>
    </NotificationProvider>
  );
}

function EnchimentoContent() {
  const [editMode, setEditMode] = useState(false);
  const { isAllLoaded } = useLayoutLoading();
  const { 
    nivelValue, 
    motorValue, 
    pipeSystem,
    isConnected, 
    error, 
    lastMessage 
  } = useWebSocket('ws://localhost:8080/ws');

  const getPipeStatesFromWebSocket = () => {
    const pipeStates: {[key: string]: 0 | 1} = {};
    
    for (let i = 0; i < pipeSystem.length && i < 24; i++) {
      pipeStates[`pipe${i + 1}`] = pipeSystem[i] ? 1 : 0;
    }
    
    return pipeStates;
  };

  const isFullyReady = isAllLoaded && (
    isConnected && ( 
      nivelValue !== null ||
      editMode
    )
  );

  const handleLogout = () => {
    window.location.replace('/');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      {!isFullyReady && (
        <EdpLoading
          title="Sistema de Enchimento"
          subtitle="Controle de Enchimento Industrial EDP"
          status={
            !isAllLoaded ? 'Inicializando interface...' : 
            !isConnected ? 'Conectando ao PLC...' : 
            'Sincronizando dados do sistema...'
          }
          size="lg"
        />
      )}

      {isFullyReady && (
        <>
          <ModernHeader
            title="Sistema de Enchimento"
            user="danilohenriquesilvalira"
            onLogout={handleLogout}
          />

          <div className="flex h-[calc(100vh-64px)]">
            <ModernSidebar />
            
            <div className="flex-1 relative overflow-hidden bg-gray-50">
              
              <div className="w-full h-full flex items-center justify-center p-4">
                <PipeSystem
                  editMode={editMode}
                  pipeStates={getPipeStatesFromWebSocket()}
                />
              </div>
              
              {/* VÁLVULAS DO SISTEMA DE ENCHIMENTO */}
              <ValvulaOnOff
                state={motorValue !== null ? (motorValue === 0 ? 0 : motorValue === 1 ? 1 : 2) : 0}
                editMode={editMode}
                componentId="valvula-X00"
              />
              
              <ValvulaOnOff
                state={0}
                editMode={editMode}
                componentId="valvula-X01"
              />
              
              <ValvulaOnOff
                state={0}
                editMode={editMode}
                componentId="valvula-X02"
              />
              
              <ValvulaOnOff
                state={0}
                editMode={editMode}
                componentId="valvula-X04"
              />
              
              <ValvulaOnOff
                state={0}
                editMode={editMode}
                componentId="valvula-X05"
              />
              
              <ValvulaOnOff
                state={0}
                editMode={editMode}
                componentId="valvula-X06"
              />
              
              {/* VÁLVULAS DIRECIONAIS DO SISTEMA DE ENCHIMENTO */}
              {/* Lado Direito */}
              <ValveDirecional
                isOpen={false}
                editMode={editMode}
                componentId="VD0"
                side="direito"
              />
              
              <ValveDirecional
                isOpen={false}
                editMode={editMode}
                componentId="VD1"
                side="direito"
              />
              
              <ValveDirecional
                isOpen={false}
                editMode={editMode}
                componentId="VD2"
                side="direito"
              />
              
              {/* Lado Esquerdo (Espelhadas) */}
              <ValveDirecional
                isOpen={false}
                editMode={editMode}
                componentId="VD3"
                side="esquerdo"
              />
              
              <ValveDirecional
                isOpen={false}
                editMode={editMode}
                componentId="VD4"
                side="esquerdo"
              />
              
              <ValveDirecional
                isOpen={false}
                editMode={editMode}
                componentId="VD5"
                side="esquerdo"
              />
              

              
              {/* VÁLVULAS GAVETA DO SISTEMA DE ENCHIMENTO */}
              {/* Lado Direito */}
              <ValvulaGaveta
                estado={false}
                editMode={editMode}
                componentId="VG0"
                side="direito"
              />
              
              <ValvulaGaveta
                estado={false}
                editMode={editMode}
                componentId="VG1"
                side="direito"
              />
              
              {/* Lado Esquerdo (Espelhadas) */}
              <ValvulaGaveta
                estado={false}
                editMode={editMode}
                componentId="VG2"
                side="esquerdo"
              />
              
              <ValvulaGaveta
                estado={false}
                editMode={editMode}
                componentId="VG3"
                side="esquerdo"
              />
              
              <ValvulaGaveta
                estado={false}
                editMode={editMode}
                componentId="VG4"
                side="direito"
              />
              
              <ValvulaGaveta
                estado={false}
                editMode={editMode}
                componentId="VG5"
                side="esquerdo"
              />
              
              {/* VÁLVULAS HORIZONTAIS DO SISTEMA DE ENCHIMENTO */}
              <ValvulaVertical
                isOpen={false}
                editMode={editMode}
                componentId="VH0"
                side="direito"
              />
              
              <ValvulaVertical
                isOpen={false}
                editMode={editMode}
                componentId="VH1"
                side="esquerdo"
              />
              
              {/* VÁLVULAS FLANGE DO SISTEMA DE ENCHIMENTO */}
              {/* Lado Direito */}
              <ValvulaFlange
                isActuated={false}
                editMode={editMode}
                componentId="VF0"
                side="direito"
              />
              
              <ValvulaFlange
                isActuated={false}
                editMode={editMode}
                componentId="VF1"
                side="direito"
              />
              
              <ValvulaFlange
                isActuated={false}
                editMode={editMode}
                componentId="VF2"
                side="direito"
              />
              
              {/* Lado Esquerdo (Espelhadas) */}
              <ValvulaFlange
                isActuated={false}
                editMode={editMode}
                componentId="VF3"
                side="esquerdo"
              />
              
              <ValvulaFlange
                isActuated={false}
                editMode={editMode}
                componentId="VF4"
                side="esquerdo"
              />
              
              <ValvulaFlange
                isActuated={false}
                editMode={editMode}
                componentId="VF5"
                side="esquerdo"
              />
              
              {/* BASES DOS PISTÕES */}
              <BasePistaoEnchimento
                side="esquerdo"
                editMode={editMode}
                componentId="base-pistao-enchimento-esquerdo"
              />
              
              <BasePistaoEnchimento
                side="direito"
                editMode={editMode}
                componentId="base-pistao-enchimento-direito"
              />
              
              {/* PISTÕES COM LÓGICA DE NÍVEL */}
              <PistaoEnchimento
                nivel={nivelValue !== null ? nivelValue : 0} // ✅ CONECTADO AO WEBSOCKET
                side="esquerdo"
                editMode={editMode}
                componentId="pistao-enchimento-esquerdo"
              />
              
              <PistaoEnchimento
                nivel={nivelValue !== null ? nivelValue : 0} // ✅ CONECTADO AO WEBSOCKET
                side="direito"
                editMode={editMode}
                componentId="pistao-enchimento-direito"
              />
              
              {/* CILINDROS COM LÓGICA DE ESTADO MOTOR */}
              <CilindroEnchimento
                estado={motorValue !== null ? motorValue : 0} // ✅ CONECTADO AO WEBSOCKET
                side="esquerdo"
                editMode={editMode}
                componentId="cilindro-enchimento-esquerdo"
              />
              
              <CilindroEnchimento
                estado={motorValue !== null ? motorValue : 0} // ✅ CONECTADO AO WEBSOCKET
                side="direito"
                editMode={editMode}
                componentId="cilindro-enchimento-direito"
              />
              
              {/* MOTORES COM LÓGICA DE STATUS */}
              <MotorEnchimento
                status={motorValue !== null ? (motorValue as 0 | 1 | 2) : 0} // ✅ CONECTADO AO WEBSOCKET
                side="esquerdo"
                editMode={editMode}
                componentId="motor-enchimento-esquerdo"
              />
              
              <MotorEnchimento
                status={motorValue !== null ? (motorValue as 0 | 1 | 2) : 0} // ✅ CONECTADO AO WEBSOCKET
                side="direito"
                editMode={editMode}
                componentId="motor-enchimento-direito"
              />


            </div>
          </div>

          <ScreenDebug />

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

          <GlobalAdvancedControls editMode={editMode} pageFilter="enchimento" />

        </>
      )}
    </div>
  );
}