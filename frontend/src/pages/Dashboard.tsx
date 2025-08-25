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
    <div className="flex h-screen bg-gray-50">
      <ModernSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ModernHeader onLogout={handleLogout} />
        
        <main className="flex-1 overflow-hidden">
          {/* Dashboard Unificado da Régua */}
          <div className="w-full h-full pl-4 pr-4 py-4 md:pl-24">
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 p-3 lg:p-4">
              <DashboardRegua />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}