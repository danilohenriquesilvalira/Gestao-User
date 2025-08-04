'use client';

import { useState, useEffect } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';
import SmartSidebarPanel from '@/components/SmartSidebarPanel';
import Nivel from '@/components/Nivel';
import Motor from '@/components/Eclusa/Motor'; // 🚀 NOVO IMPORT
import { useWebSocket } from '@/hooks/useWebSocket';

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

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [editMode, setEditMode] = useState(false);

  // 🔥 Hook do WebSocket ATUALIZADO para múltiplas variáveis
  const { nivelValue, motorValue, isConnected, error, lastMessage } = useWebSocket('ws://localhost:8080/ws');

  const handleLogout = () => {
    window.location.replace('/');
  };

  const handleNavClick = (itemId: string) => {
    setActiveItem(itemId);
    console.log(`Navegando para: ${itemId}`);
  };

  const getIconColor = (itemId: string) => {
    return activeItem === itemId ? '#3CFF01' : 'white';
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      {/* Modern Header */}
      <ModernHeader
        title="Dashboard Principal"
        user="danilohenriquesilvalira" // 👤 Usuário atualizado
        onLogout={handleLogout}
      />

      <ScreenDebug />

      {/* 📊 STATUS DO WEBSOCKET DETALHADO */}
      <div className="fixed top-20 left-4 bg-black text-white p-3 rounded text-xs z-40 max-w-[350px]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>PLC: {isConnected ? 'Conectado' : 'Desconectado'}</span>
          </div>
          
          {nivelValue !== null && (
            <div className="text-blue-400">📊 Nível: {nivelValue}%</div>
          )}
          
          {motorValue !== null && (
            <div className="text-green-400">
              ⚙️ Motor: {motorValue === 0 ? 'INATIVO' : motorValue === 1 ? 'OPERANDO' : 'FALHA'}
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

      {/* BARRA LATERAL INTELIGENTE */}
      <SmartSidebarPanel
        editMode={editMode}
        onToggleEdit={() => setEditMode(!editMode)}
      />

      {/* Modern Sidebar - Desktop only */}
      <ModernSidebar />

      {/* Container principal */}
      <div className="h-[calc(100vh-64px)] overflow-auto pb-20 md:pb-0">
        {/* Área vazia para conteúdo futuro */}
      </div>

      {/* COMPONENTE NIVEL COM CONTROLE WEBSOCKET */}
      <Nivel
        nivel={75}
        showControls={true}
        editMode={editMode}
        websocketValue={nivelValue} // 📊 Valor do nível via WebSocket
      />

      {/* 🚀 NOVO COMPONENTE MOTOR COM CONTROLE WEBSOCKET */}
      <Motor
        status={1} // Status padrão
        showControls={true}
        editMode={editMode}
        websocketValue={motorValue} // ⚙️ Valor do motor via WebSocket
      />

      {/* ECLUSA BASE RESPONSIVA */}
      <ResponsiveWrapper
        componentId="eclusa-caldeira"
        editMode={editMode}
        defaultConfig={{
          xs: { x: 0, y: 300, width: 300, height: 200, scale: 0.3, zIndex: 1, opacity: 1, rotation: 0 },
          sm: { x: 0, y: 350, width: 400, height: 250, scale: 0.4, zIndex: 1, opacity: 1, rotation: 0 },
          md: { x: 74, y: 400, width: 500, height: 300, scale: 0.5, zIndex: 1, opacity: 1, rotation: 0 },
          lg: { x: 74, y: 200, width: 800, height: 400, scale: 0.6, zIndex: 1, opacity: 1, rotation: 0 },
          xl: { x: 74, y: 150, width: 1000, height: 450, scale: 0.7, zIndex: 1, opacity: 1, rotation: 0 },
          '2xl': { x: 74, y: 100, width: 1100, height: 480, scale: 0.8, zIndex: 1, opacity: 1, rotation: 0 },
          '3xl': { x: 74, y: 50, width: 1200, height: 487, scale: 0.9, zIndex: 1, opacity: 1, rotation: 0 },
          '4xl': { x: 74, y: 0, width: 1204, height: 487, scale: 1.0, zIndex: 1, opacity: 1, rotation: 0 },
        }}
      >
        <div className="relative w-full h-full">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1204 487"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect
              x="0"
              y="0"
              width="1204"
              height="120"
              fill="#4AE800"
              stroke="#CBCBCB"
              strokeWidth="1"
              rx="20"
            />
            <rect
              x="0"
              y="15"
              width="1204"
              height="472"
              fill="white"
              stroke="#CBCBCB"
              strokeWidth="1"
              rx="20"
            />
          </svg>

          <div className="absolute inset-0 flex items-end justify-center pb-4">
            <img
              src="/Eclusa/Parede_Eclusa.svg"
              alt="Parede da Eclusa"
              className="absolute max-w-full h-auto object-contain"
              style={{
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            />

            <img
              src="/Eclusa/Caldeira_Eclusa.svg"
              alt="Caldeira da Eclusa"
              className="absolute max-w-full h-auto object-contain z-10"
              style={{
                bottom: '60px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            />
          </div>
        </div>
      </ResponsiveWrapper>
    </div>
  );
}