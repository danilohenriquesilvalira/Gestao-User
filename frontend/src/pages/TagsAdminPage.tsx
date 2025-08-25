// TagsAdminPage.tsx - Página de administração de Tags/PLC (APENAS ADMIN)
import { useState } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationContainer from '@/components/ui/NotificationContainer';
import AssistenteVirtual from '@/components/dashboard/AssistenteVirtual';
import TagsMonitor from '@/components/tags/TagsMonitor';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function TagsAdminPage() {
  return (
    <NotificationProvider>
      <TagsAdminContent />
      <NotificationContainer />
      <AssistenteVirtual />
    </NotificationProvider>
  );
}

function TagsAdminContent() {
  const { isAdmin, user, isAuthenticated } = useAuth();

  const handleLogout = () => {
    window.location.replace('/');
  };

  // DEBUG: Verificar status do usuário
  console.log('🔍 DEBUG TagsAdmin - User:', user);
  console.log('🔍 DEBUG TagsAdmin - isAdmin():', isAdmin());
  console.log('🔍 DEBUG TagsAdmin - user?.role:', user?.role);
  console.log('🔍 DEBUG TagsAdmin - isAuthenticated:', isAuthenticated);

  // Aguardar carregamento dos dados do usuário
  if (!isAuthenticated || !user) {
    return <div>Carregando...</div>;
  }

  // 🔒 PROTEÇÃO: APENAS ADMIN PODE ACESSAR
  if (!isAdmin()) {
    console.log('❌ Usuário não é admin, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ModernSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ModernHeader title="Tags & PLC Admin" onLogout={handleLogout} />
        
        <main className="flex-1 overflow-hidden">
          {/* Mesmo padrão visual do dashboard */}
          <div className="w-full h-full pl-4 pr-4 py-4 md:pl-24">
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 p-3 lg:p-4">
              <TagsMonitor />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}