// Dashboard.tsx
import { useState } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import { useWebSocket } from '@/hooks/useWebSocket';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationContainer from '@/components/ui/NotificationContainer';
import AssistenteVirtual from '@/components/dashboard/AssistenteVirtual';
import DashboardRegua from '@/components/dashboard/DashboardRegua';

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
  const { isConnected, error } = useWebSocket('ws://localhost:1337/ws');

  const handleLogout = () => {
    window.location.replace('/');
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <ModernSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <ModernHeader onLogout={handleLogout} />
        
        <main className="flex-1 overflow-hidden min-h-0">
          {/* Dashboard Unificado da Régua - Mobile First */}
          <div className="w-full h-full p-2 sm:p-3 md:p-4 lg:pl-6 lg:pr-4 lg:py-4 xl:pl-8 xl:pr-6">
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl bg-gray-50/50 p-2 sm:p-3 md:p-4 lg:p-4 xl:p-5">
              <DashboardRegua />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}