'use client';

import { useEffect, useState } from 'react';
import { usePLC } from '@/hooks/usePLC';
import PLCComponent from '@/components/Plc/PLCComponent';
import StatusCard from '@/components/ui/StatusCard';
import { Notification } from '@/components/ui/Notification';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Componente de debug de tela, copiado do seu Dashboard para consistência
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

export default function PLCPage() {
  const { plcs, tags, loading, error, refresh, setError } = usePLC();
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    refresh();
  }, []);

  // Mostrar erros
  useEffect(() => {
    if (error) {
      setNotification({ message: error, type: 'error' });
      setTimeout(() => {
        setNotification(null);
        setError(null);
      }, 5000);
    }
  }, [error, setError]);

  // Mostrar sucesso
  const showSuccess = (message: string) => {
    setNotification({ message, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      {/* Modern Header */}
      <ModernHeader
        title="Sistema SCADA - PLCs"
        user="Administrador"
        onLogout={() => window.location.replace('/')}
      />

      {/* Screen Debug */}
      <ScreenDebug />

      {/* Modern Sidebar - Desktop only */}
      <ModernSidebar activeItem="plcs" />

      {/* Main Content Container - Calculando o espaço livre */}
      <div className="h-[calc(100vh-64px)] overflow-auto ml-0 md:ml-20 pb-20 md:pb-0">
        <div className="min-h-[calc(100vh-64px)] bg-white p-4 lg:p-8">
          
          {/* Status Cards - Layout Responsivo e Otimizado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatusCard
              title="PLCs Ativos"
              eclusa="pocinho"
              status="online"
              value={`${plcs.filter(p => p.active).length}/${plcs.length}`}
            />
            <StatusCard
              title="Total Tags"
              eclusa="regua"
              status="online"
              value={tags.length}
            />
            <StatusCard
              title="Tags Conectadas"
              eclusa="crestuma"
              status="online"
              value={`${tags.filter(t => t.current_value !== null).length}/${tags.length}`}
            />
            <StatusCard
              title="Status Sistema"
              eclusa="carrapatelo"
              status={loading ? "maintenance" : "online"}
              value={loading ? "Carregando..." : "Online"}
            />
          </div>

          {/* Main Component - Container para Cards de PLC/Tags */}
          <div className="bg-white border rounded-lg shadow-sm p-4 md:p-6">
            <PLCComponent 
              plcs={plcs}
              tags={tags}
              loading={loading}
              onSuccess={showSuccess}
            />
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <Notification
            message={notification.message}
            type={notification.type}
            isVisible={true}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </div>
  );
}