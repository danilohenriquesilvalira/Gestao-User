'use client';

import { useState, useEffect } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import StatusCard from '@/components/ui/StatusCard';

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
    <div className="fixed top-20 right-4 bg-black text-white p-3 rounded-lg text-xs font-mono-tech z-50 border border-gray-800">
      <div className="text-tech-600">Resolução: {screenInfo.width} x {screenInfo.height}</div>
      <div className="text-gray-300">Breakpoint: {getBreakpoint(screenInfo.width)}</div>
    </div>
  );
}

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState('dashboard');

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
        user="João Silva"
        onLogout={handleLogout}
      />
      
      <ScreenDebug />
      
      {/* Modern Sidebar - Desktop only */}
      <ModernSidebar />
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#131827] border-t border-slate-700 px-4 py-2 z-50">
        <div className="flex justify-around items-center">
          
          {/* Eclusa */}
          <button 
            onClick={() => handleNavClick('eclusa')}
            className="flex flex-col items-center p-2 rounded-lg transition-all duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={getIconColor('eclusa')} xmlns="http://www.w3.org/2000/svg">
              <path d="M7.46932 6.09748V3.65757H5.5561L5.00673 6.13799C5.00371 6.15824 4.99968 6.1773 4.99363 6.19517L1.78011 20.7215C2.28612 21.1492 2.87784 21.3731 3.47458 21.391C4.1681 21.4125 4.86865 21.1527 5.44525 20.613C6.02788 20.0031 6.73953 19.6552 7.46935 19.5742V6.09645L7.46932 6.09748Z" />
            </svg>
            <span className="text-xs mt-1" style={{ color: getIconColor('eclusa') }}>Eclusa</span>
          </button>

          {/* Dashboard */}
          <button 
            onClick={() => handleNavClick('dashboard')}
            className="flex flex-col items-center p-2 rounded-lg transition-all duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={getIconColor('dashboard')} strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs mt-1" style={{ color: getIconColor('dashboard') }}>Home</span>
          </button>

          {/* Configurações */}
          <button 
            onClick={() => handleNavClick('configuracoes')}
            className="flex flex-col items-center p-2 rounded-lg transition-all duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={getIconColor('configuracoes')} strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs mt-1" style={{ color: getIconColor('configuracoes') }}>Config</span>
          </button>

          {/* Relatórios */}
          <button 
            onClick={() => handleNavClick('relatorios')}
            className="flex flex-col items-center p-2 rounded-lg transition-all duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={getIconColor('relatorios')} strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs mt-1" style={{ color: getIconColor('relatorios') }}>Reports</span>
          </button>

          {/* Usuários */}
          <button 
            onClick={() => handleNavClick('usuarios')}
            className="flex flex-col items-center p-2 rounded-lg transition-all duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9.592 15.2031C13.281 15.2031 16.434 15.7621 16.434 17.9951C16.434 20.2281 13.302 20.8031 9.592 20.8031C5.902 20.8031 2.75 20.2491 2.75 18.0151C2.75 15.7811 5.881 15.2031 9.592 15.2031Z" stroke={getIconColor('usuarios')} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M9.59303 12.02C7.17103 12.02 5.20703 10.057 5.20703 7.635C5.20703 5.213 7.17103 3.25 9.59303 3.25C12.014 3.25 13.978 5.213 13.978 7.635C13.987 10.048 12.037 12.011 9.62403 12.02H9.59303Z" stroke={getIconColor('usuarios')} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs mt-1" style={{ color: getIconColor('usuarios') }}>Users</span>
          </button>
        </div>
      </nav>
      
      {/* Container principal */}
      <div className="h-[calc(100vh-64px)] overflow-auto pb-20 md:pb-0">
        <div className="pt-6 px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 3xl:px-28">
          
          {/* Grid de Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatusCard 
              title="Eclusa Crestuma" 
              eclusa="crestuma"
              status="online" 
              value="12.5m"
              subtitle="Nível da água"
              lastUpdate="14:30:25"
            />
            
            <StatusCard 
              title="Eclusa Carrapatelo" 
              eclusa="carrapatelo"
              status="maintenance"
              value="8.2m"
              subtitle="Nível da água"
              lastUpdate="14:28:15"
            />
            
            <StatusCard 
              title="Eclusa Régua" 
              eclusa="regua"
              status="online"
              value="15.7m"
              subtitle="Nível da água"
              lastUpdate="14:31:02"
            />
            
            <StatusCard 
              title="Eclusa Valeira"
              eclusa="valeira" 
              status="alert"
              value="95%"
              subtitle="Capacidade"
              lastUpdate="14:29:40"
            />
            
            <StatusCard 
              title="Eclusa Pocinho" 
              eclusa="pocinho"
              status="online"
              value="11.3m"
              subtitle="Nível da água"
              lastUpdate="14:30:55"
            />
            
            <StatusCard 
              title="Sistema Geral" 
              eclusa="pocinho"
              status="online"
              value="85%"
              subtitle="Performance"
              lastUpdate="14:31:10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}