import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { ComponentPriority } from '@/lib/standardConfigs';

// Fases de carregamento coordenadas - ELIMINA piscamento
enum LoadingPhase {
  INITIALIZING = 'initializing',
  LOADING_BACKGROUNDS = 'loading_backgrounds',  // z-index 1-5
  LOADING_LARGE = 'loading_large',             // z-index 6-14  
  LOADING_MEDIUM = 'loading_medium',           // z-index 15-19
  LOADING_SMALL = 'loading_small',             // z-index 20+
  READY = 'ready',
  ERROR = 'error'
}

interface ComponentState {
  id: string;
  priority: ComponentPriority;
  phase: LoadingPhase;
  isReady: boolean;
  loadingStartTime: number;
}

interface RobustLayoutContextType {
  // Estado geral
  globalPhase: LoadingPhase;
  isGloballyReady: boolean;
  
  // Gerenciamento de componentes
  registerComponent: (componentId: string, priority: ComponentPriority) => void;
  setComponentReady: (componentId: string) => void;
  setComponentError: (componentId: string, error: string) => void;
  isComponentReady: (componentId: string) => boolean;
  shouldComponentRender: (componentId: string, priority: ComponentPriority) => boolean;
  
  // Debug e estatísticas
  getLoadingStats: () => {
    total: number;
    ready: number;
    byPriority: Record<ComponentPriority, { total: number; ready: number }>;
  };
}

const RobustLayoutContext = createContext<RobustLayoutContextType | undefined>(undefined);

export const useRobustLayout = () => {
  const context = useContext(RobustLayoutContext);
  if (!context) {
    throw new Error('useRobustLayout deve ser usado dentro de RobustLayoutProvider');
  }
  return context;
};

interface RobustLayoutProviderProps {
  children: React.ReactNode;
  maxLoadingTime?: number; // Timeout de segurança
}

export const RobustLayoutProvider: React.FC<RobustLayoutProviderProps> = ({ 
  children, 
  maxLoadingTime = 5000 // 5 segundos máximo
}) => {
  const [globalPhase, setGlobalPhase] = useState<LoadingPhase>(LoadingPhase.INITIALIZING);
  const [components, setComponents] = useState<Map<string, ComponentState>>(new Map());
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  // Registrar componente no sistema
  const registerComponent = useCallback((componentId: string, priority: ComponentPriority) => {
    setComponents(prev => {
      const newComponents = new Map(prev);
      if (!newComponents.has(componentId)) {
        newComponents.set(componentId, {
          id: componentId,
          priority,
          phase: LoadingPhase.INITIALIZING,
          isReady: false,
          loadingStartTime: Date.now()
        });
        console.log(`📋 [ROBUST] Registrado: ${componentId} (prioridade: ${priority})`);
      }
      return newComponents;
    });
  }, []);
  
  // Marcar componente como pronto
  const setComponentReady = useCallback((componentId: string) => {
    setComponents(prev => {
      const newComponents = new Map(prev);
      const component = newComponents.get(componentId);
      if (component) {
        const loadTime = Date.now() - component.loadingStartTime;
        newComponents.set(componentId, {
          ...component,
          phase: LoadingPhase.READY,
          isReady: true
        });
        console.log(`✅ [ROBUST] ${componentId} pronto (${loadTime}ms)`);
      }
      return newComponents;
    });
  }, []);
  
  // Marcar componente com erro
  const setComponentError = useCallback((componentId: string, error: string) => {
    setComponents(prev => {
      const newComponents = new Map(prev);
      const component = newComponents.get(componentId);
      if (component) {
        newComponents.set(componentId, {
          ...component,
          phase: LoadingPhase.ERROR,
          isReady: false
        });
        console.error(`❌ [ROBUST] ${componentId} erro: ${error}`);
      }
      return newComponents;
    });
  }, []);
  
  // Verificar se componente está pronto
  const isComponentReady = useCallback((componentId: string): boolean => {
    const component = components.get(componentId);
    return component?.isReady || false;
  }, [components]);
  
  // Determinar se componente deve renderizar baseado na fase atual
  const shouldComponentRender = useCallback((componentId: string, priority: ComponentPriority): boolean => {
    const component = components.get(componentId);
    if (!component || !component.isReady) return false;
    
    // Renderizar baseado na fase atual e prioridade
    switch (globalPhase) {
      case LoadingPhase.LOADING_BACKGROUNDS:
        return priority === ComponentPriority.LOW;
      case LoadingPhase.LOADING_LARGE:
        return priority === ComponentPriority.LOW;
      case LoadingPhase.LOADING_MEDIUM:
        return priority === ComponentPriority.LOW || priority === ComponentPriority.NORMAL;
      case LoadingPhase.LOADING_SMALL:
      case LoadingPhase.READY:
        return true;
      default:
        return false;
    }
  }, [globalPhase, components]);
  
  // Estatísticas de carregamento para debug
  const getLoadingStats = useCallback(() => {
    const stats = {
      total: components.size,
      ready: 0,
      byPriority: {
        [ComponentPriority.LOW]: { total: 0, ready: 0 },
        [ComponentPriority.NORMAL]: { total: 0, ready: 0 },
        [ComponentPriority.HIGH]: { total: 0, ready: 0 }
      }
    };
    
    components.forEach(component => {
      if (component.isReady) stats.ready++;
      stats.byPriority[component.priority].total++;
      if (component.isReady) stats.byPriority[component.priority].ready++;
    });
    
    return stats;
  }, [components]);
  
  // Controle automático de fases baseado no carregamento dos componentes
  useEffect(() => {
    if (components.size === 0) return;
    
    const stats = getLoadingStats();
    console.log(`📊 [ROBUST] Stats:`, stats);
    
    // Verificar se todos os componentes de uma prioridade estão prontos
    const backgroundsReady = stats.byPriority[ComponentPriority.LOW].total === 0 || 
                            stats.byPriority[ComponentPriority.LOW].ready === stats.byPriority[ComponentPriority.LOW].total;
    
    const largeReady = backgroundsReady && 
                       (stats.byPriority[ComponentPriority.NORMAL].total === 0 || 
                        stats.byPriority[ComponentPriority.NORMAL].ready >= Math.ceil(stats.byPriority[ComponentPriority.NORMAL].total * 0.8));
    
    const allReady = stats.ready === stats.total;
    
    // Progressão de fases
    if (allReady && globalPhase !== LoadingPhase.READY) {
      setGlobalPhase(LoadingPhase.READY);
      console.log(`🎉 [ROBUST] Todos os componentes carregados!`);
    } else if (largeReady && globalPhase === LoadingPhase.LOADING_LARGE) {
      setGlobalPhase(LoadingPhase.LOADING_MEDIUM);
      console.log(`🔄 [ROBUST] Fase: Carregando componentes médios`);
    } else if (backgroundsReady && globalPhase === LoadingPhase.LOADING_BACKGROUNDS) {
      setGlobalPhase(LoadingPhase.LOADING_LARGE);
      console.log(`🔄 [ROBUST] Fase: Carregando componentes grandes`);
    }
  }, [components, globalPhase, getLoadingStats]);
  
  // Inicializar carregamento após components serem registrados
  useEffect(() => {
    if (components.size > 0 && globalPhase === LoadingPhase.INITIALIZING) {
      setGlobalPhase(LoadingPhase.LOADING_BACKGROUNDS);
      console.log(`🚀 [ROBUST] Iniciando carregamento coordenado`);
      
      // Timeout de segurança
      timeoutRef.current = setTimeout(() => {
        console.warn(`⚠️ [ROBUST] Timeout atingido, forçando READY`);
        setGlobalPhase(LoadingPhase.READY);
      }, maxLoadingTime);
    }
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [components.size, globalPhase, maxLoadingTime]);
  
  const isGloballyReady = globalPhase === LoadingPhase.READY;
  
  const contextValue: RobustLayoutContextType = {
    globalPhase,
    isGloballyReady,
    registerComponent,
    setComponentReady,
    setComponentError,
    isComponentReady,
    shouldComponentRender,
    getLoadingStats
  };
  
  return (
    <RobustLayoutContext.Provider value={contextValue}>
      {children}
    </RobustLayoutContext.Provider>
  );
};