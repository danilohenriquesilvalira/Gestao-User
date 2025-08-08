'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EdpLoading } from '@/components/ui/EdpLoading';

interface LoadingContextType {
  showLoading: (config: LoadingConfig) => void;
  hideLoading: () => void;
  isLoading: boolean;
}

interface LoadingConfig {
  title?: string;
  subtitle?: string;
  status?: string;
  showProgress?: boolean;
  progress?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const EdpLoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState<LoadingConfig>({});

  const showLoading = (config: LoadingConfig) => {
    setLoadingConfig(config);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setLoadingConfig({});
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
      {isLoading && (
        <EdpLoading
          title={loadingConfig.title || "Carregando Sistema EDP"}
          subtitle={loadingConfig.subtitle || "Aguarde um momento..."}
          status={loadingConfig.status}
          showProgress={loadingConfig.showProgress}
          progress={loadingConfig.progress}
          size={loadingConfig.size || 'lg'}
        />
      )}
    </LoadingContext.Provider>
  );
};

export const useEdpLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useEdpLoading deve ser usado dentro de EdpLoadingProvider');
  }
  return context;
};

// Hook específico para diferentes tipos de carregamento
export const useEdpLoadingPresets = () => {
  const { showLoading, hideLoading } = useEdpLoading();

  return {
    // Loading para autenticação
    showAuth: () => showLoading({
      title: "Autenticando",
      subtitle: "Verificando credenciais...",
      status: "Conectando ao sistema EDP"
    }),

    // Loading para eclusa
    showEclusa: (status?: string) => showLoading({
      title: "Eclusa de Navegação",
      subtitle: "Sistema de Gestão Industrial EDP",
      status: status || "Inicializando sistema..."
    }),

    // Loading para PLC
    showPlc: () => showLoading({
      title: "Conectando PLC",
      subtitle: "Estabelecendo comunicação...",
      status: "Sincronizando dados industriais"
    }),

    // Loading com progresso
    showProgress: (progress: number, title?: string) => showLoading({
      title: title || "Processando",
      subtitle: "Aguarde a conclusão...",
      showProgress: true,
      progress
    }),

    // Loading genérico
    showGeneric: (title?: string, subtitle?: string) => showLoading({
      title: title || "Carregando",
      subtitle: subtitle || "Processando solicitação..."
    }),

    hideLoading
  };
};

export default EdpLoadingProvider;
