
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface LayoutLoadingContextType {
  registeredComponents: Set<string>;
  loadedComponents: Set<string>;
  isAllLoaded: boolean;
  registerComponent: (componentId: string) => void;
  setComponentLoaded: (componentId: string) => void;
}

const LayoutLoadingContext = createContext<LayoutLoadingContextType | undefined>(undefined);

export function LayoutLoadingProvider({ children }: { children: React.ReactNode }) {
  const [registeredComponents, setRegisteredComponents] = useState<Set<string>>(new Set());
  const [loadedComponents, setLoadedComponents] = useState<Set<string>>(new Set());
  const [isForceLoaded, setIsForceLoaded] = useState(false);
  
  // Timeout de segurança - força carregamento após 1 segundo
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('⏰ TIMEOUT: Forçando carregamento após 1 segundo!');
      setIsForceLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  const registerComponent = useCallback((componentId: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📝 Registrando componente: ${componentId}`);
    }
    setRegisteredComponents(prev => {
      if (prev.has(componentId)) return prev; // ✅ EVITA LOOP - só adiciona se não existir
      const newSet = new Set(prev);
      newSet.add(componentId);
      return newSet;
    });
  }, []);

  const setComponentLoaded = useCallback((componentId: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Componente carregado: ${componentId}`);
    }
    setLoadedComponents(prev => {
      if (prev.has(componentId)) return prev; // ✅ EVITA LOOP - só adiciona se não existir
      const newSet = new Set(prev);
      newSet.add(componentId);
      return newSet;
    });
  }, []);

  // FORCE LOADING APÓS TIMEOUT OU QUANDO TODOS CARREGARAM
  const isAllLoaded = isForceLoaded || (registeredComponents.size > 0 && registeredComponents.size === loadedComponents.size);

  return (
    <LayoutLoadingContext.Provider value={{
      registeredComponents,
      loadedComponents,
      isAllLoaded,
      registerComponent,
      setComponentLoaded
    }}>
      {children}
    </LayoutLoadingContext.Provider>
  );
}

export function useLayoutLoading() {
  const context = useContext(LayoutLoadingContext);
  if (context === undefined) {
    throw new Error('useLayoutLoading must be used within a LayoutLoadingProvider');
  }
  return context;
}
