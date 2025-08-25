

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ModernHeaderProps {
  title?: string;
}

export default function ModernHeader({ 
  title = "Dashboard"
}: ModernHeaderProps) {
  const { getUserInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationCount] = useState(3);

  const userInfo = getUserInfo();
  const userName = userInfo?.name || 'Usuário';
  const userRole = userInfo?.role || 'Visitante';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-[#131827] border-b border-slate-700 px-4 md:px-6 flex items-center justify-between shadow-lg">
      
      {/* Logo e Título */}
      <div className="flex items-center gap-1 md:gap-0">
        <img
          src="/Logo_EDP.svg"
          alt="EDP Logo"
          width="24"
          height="24"
          className="md:w-8 md:h-8 hover:scale-110 transition-transform"
        />
        <div className="hidden sm:flex items-center gap-2">
          <img
            src="/Letra_EDP.svg"
            alt="EDP"
            width="64" 
            height="24"
            className="md:w-20 md:h-8"
          />
          {/* Container para a linha e o título para melhor organização */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-px h-6 bg-slate-600"></div>
            <h1 className="text-base md:text-xl font-medium text-white truncate">{title}</h1>
          </div>
        </div>
      </div>

      {/* Notificações e Usuário */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* Sino de Notificações */}
        <div className="relative">
          <button className="p-1.5 md:p-2 hover:scale-110 transition-transform text-white hover:text-green-400">
            <svg width="18" height="18" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs">
              {notificationCount}
            </span>
          )}
        </div>

        {/* Usuário */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-white">{userName}</div>
            <div className="text-xs text-slate-400">{userRole}</div>
          </div>
          
          {/* Avatar e Logout */}
          <div className="relative group">
            <button className="w-8 h-8 md:w-10 md:h-10 bg-slate-700 border-2 border-slate-600 rounded-full flex items-center justify-center hover:bg-slate-600 hover:border-slate-500 transition-all duration-200">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-10 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="md:hidden px-4 py-2 border-b border-slate-700">
                <div className="text-sm font-medium text-white">{userName}</div>
                <div className="text-xs text-slate-400">{userRole}</div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}