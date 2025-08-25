// AuthContext.tsx - Contexto de autenticação REAL
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role: {
    id: number;
    name: string;
    displayName: string;
    description: string;
    type: string;
    level?: number;
  };
  confirmed: boolean;
  blocked: boolean;
  provider: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  canEditLayout: () => boolean; // Só admin pode ativar modo de edição
  getUserInfo: () => { name: string; role: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Carregar dados salvos do localStorage
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(userData);
        console.log('👤 Usuário carregado:', userData.username, '-', userData.role.displayName);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('✅ Login realizado:', userData.username, '-', userData.role.displayName);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    console.log('🚪 Logout realizado');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role.name === 'admin') return true; // Admin tem todas as permissões
    
    const rolePermissions: { [key: string]: string[] } = {
      gerente: ['users.manage', 'reports.view', 'system.monitor', 'eclusa.control'],
      supervisor: ['users.view', 'reports.view', 'eclusa.control', 'maintenance.schedule'],
      tecnico: ['maintenance.all', 'diagnostics.run', 'system.debug', 'eclusa.maintenance'],
      operador: ['eclusa.operate', 'reports.basic', 'system.monitor'],
      visitante: ['dashboard.view', 'reports.basic']
    };

    const permissions = rolePermissions[user.role.name] || [];
    return permissions.includes(permission);
  };

  const isAdmin = (): boolean => {
    return user?.role.name === 'admin';
  };

  const isGerente = (): boolean => {
    return user?.role.name === 'gerente';
  };

  const isSupervisor = (): boolean => {
    return user?.role.name === 'supervisor';
  };

  const canEditLayout = (): boolean => {
    // SOMENTE ADMIN pode ativar modo de edição
    return isAdmin();
  };

  const getUserInfo = () => {
    if (!user) return null;
    return {
      name: user.username,
      role: user.role.displayName
    };
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      token,
      login,
      logout,
      hasPermission,
      isAdmin,
      isGerente,
      isSupervisor,
      canEditLayout,
      getUserInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}