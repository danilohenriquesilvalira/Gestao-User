import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ModernHeaderProps {
  title?: string;
  onLogout?: () => void;
  onToggleMobileMenu?: () => void;
}

export default function ModernHeader({ 
  title = "Dashboard",
  onLogout,
  onToggleMobileMenu
}: ModernHeaderProps) {
  const { getUserInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationCount] = useState(3);

  const userInfo = getUserInfo();
  const userName = userInfo?.name || 'Usuário';
  const userRole = userInfo?.role || 'Visitante';

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      navigate('/');
    }
  };

  return (
    <header className="h-12 sm:h-14 md:h-16 bg-[#131827] border-b border-slate-700 px-2 sm:px-4 md:px-6 flex items-center justify-between shadow-lg relative z-40">
      
      {/* Logo e Título - Mobile First Design */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-1 min-w-0">
        {/* Logo Principal - Sempre visível */}
        <img
          src="/Logo_EDP.svg"
          alt="EDP Logo"
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 hover:scale-105 transition-transform flex-shrink-0"
        />
        
        {/* Logo Texto + Título - Responsivo */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 overflow-hidden">
          {/* Letra EDP - Escondida em mobile muito pequeno */}
          <img
            src="/Letra_EDP.svg"
            alt="EDP"
            className="hidden xs:block w-12 h-4 sm:w-16 sm:h-5 md:w-20 md:h-6 flex-shrink-0"
          />
          
          {/* Divisor + Título - Apenas desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-px h-5 md:h-6 bg-slate-600"></div>
            <h1 className="text-lg md:text-xl font-medium text-white truncate">{title}</h1>
          </div>
        </div>
        
        {/* Título Mobile - Centralizado em mobile */}
        <div className="lg:hidden flex-1 text-center">
          <h1 className="text-sm sm:text-base font-medium text-white truncate px-2">{title}</h1>
        </div>
      </div>

      {/* Área Direita - Notificações + Usuário */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
        
        {/* Notificações - Mobile Optimized */}
        <div className="relative">
          <button 
            className="p-1.5 sm:p-2 hover:scale-105 active:scale-95 transition-all text-slate-300 hover:text-green-400 rounded-lg hover:bg-slate-700/50 active:bg-slate-700/70"
            aria-label="Notificações"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-lg">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </div>

        {/* Info do Usuário - Desktop Only */}
        <div className="hidden md:flex items-center text-right mr-2">
          <div>
            <div className="text-sm font-medium text-white truncate max-w-24 lg:max-w-32">{userName}</div>
            <div className="text-xs text-slate-400 truncate">{userRole}</div>
          </div>
        </div>
        
        {/* Avatar + Dropdown - Mobile Friendly */}
        <div className="relative group">
          <button 
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-slate-700 border-2 border-slate-600 rounded-full flex items-center justify-center hover:bg-slate-600 hover:border-slate-500 active:scale-95 transition-all shadow-md"
            aria-label="Menu do usuário"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Dropdown Menu - Mobile & Desktop Friendly */}
          <div className="absolute right-0 top-full mt-1 w-44 sm:w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
            
            {/* Info do Usuário - Mobile Only */}
            <div className="md:hidden px-4 py-3 border-b border-slate-700 bg-slate-750">
              <div className="text-sm font-medium text-white truncate">{userName}</div>
              <div className="text-xs text-slate-400 mt-0.5 truncate">{userRole}</div>
            </div>
            
            {/* Botão Logout */}
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-slate-700 active:bg-slate-600 transition-colors flex items-center gap-3 rounded-b-xl"
            >
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}