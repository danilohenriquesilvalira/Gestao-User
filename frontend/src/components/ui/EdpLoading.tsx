
import React from 'react';
import { EdpLogo } from './LogoAnimado';

interface EdpLoadingProps {
  title?: string;
  subtitle?: string;
  status?: string;
  showProgress?: boolean;
  progress?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const EdpLoading: React.FC<EdpLoadingProps> = ({
  title = "Carregando Sistema EDP",
  subtitle = "Aguarde um momento...",
  status,
  showProgress = false,
  progress = 0,
  size = 'lg'
}) => {
  const sizes = {
    sm: { logo: 60, container: 'min-h-[200px]' },
    md: { logo: 80, container: 'min-h-[300px]' },
    lg: { logo: 120, container: 'min-h-screen' },
    xl: { logo: 160, container: 'min-h-screen' }
  };

  const currentSize = sizes[size];

  return (
    <>
      {/* Estilos CSS customizados para as animações */}
      <style>{`
        @keyframes edp-pulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
        
        @keyframes edp-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(0, 150, 136, 0.3);
          }
          50% { 
            box-shadow: 0 0 40px rgba(0, 150, 136, 0.6);
          }
        }
        
        @keyframes edp-float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
          }
          25% { 
            transform: translateY(-10px) rotate(90deg);
          }
          50% { 
            transform: translateY(-5px) rotate(180deg);
          }
          75% { 
            transform: translateY(-15px) rotate(270deg);
          }
        }
        
        @keyframes edp-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .edp-loading-container {
          background: linear-gradient(135deg, 
            rgba(248, 250, 252, 0.95) 0%, 
            rgba(241, 245, 249, 0.98) 50%, 
            rgba(248, 250, 252, 0.95) 100%);
          backdrop-filter: blur(10px);
        }
        
        .edp-logo-float {
          animation: edp-float 4s ease-in-out infinite;
        }
        
        .edp-logo-glow {
          animation: edp-glow 2s ease-in-out infinite;
          border-radius: 50%;
          padding: 20px;
          background: radial-gradient(circle, rgba(0, 150, 136, 0.1) 0%, transparent 70%);
        }
        
        .edp-dots {
          animation: edp-pulse 1.5s ease-in-out infinite;
        }
        
        .edp-progress-bar {
          position: relative;
          overflow: hidden;
        }
        
        .edp-progress-shimmer {
          animation: edp-progress 2s ease-in-out infinite;
        }
      `}</style>

      <div className={`fixed inset-0 z-[9999] flex items-center justify-center edp-loading-container ${currentSize.container}`}>
        <div className="text-center px-8 py-12 max-w-md w-full">
          
          {/* Logo EDP com efeitos personalizados */}
          <div className="relative mb-8 flex items-center justify-center">
            <div className="edp-logo-glow">
              <div className="edp-logo-float">
                <EdpLogo 
                  width={currentSize.logo}
                  height={currentSize.logo}
                  effect="rotate"
                  animated={true}
                />
              </div>
            </div>
          </div>
          
          {/* Título principal */}
          <div className="space-y-4 mb-8">
            <h1 className="text-2xl xl:text-3xl font-bold text-gray-800 tracking-wide">
              {title}
            </h1>
            <p className="text-base xl:text-lg text-gray-600 font-medium">
              {subtitle}
            </p>
          </div>
          
          {/* Status específico */}
          {status && (
            <div className="mb-6">
              <p className="text-sm xl:text-base text-blue-600 font-semibold bg-blue-50 rounded-lg px-4 py-2 inline-block">
                {status}
              </p>
            </div>
          )}
          
          {/* Barra de progresso (se habilitada) */}
          {showProgress && (
            <div className="mb-6">
              <div className="edp-progress-bar w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-blue-600 transition-all duration-300 ease-out rounded-full relative"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                >
                  <div className="absolute inset-0 edp-progress-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{Math.round(progress)}% concluído</p>
            </div>
          )}
          
          {/* Dots animados */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-teal-500 rounded-full edp-dots" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full edp-dots" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-teal-600 rounded-full edp-dots" style={{animationDelay: '0.4s'}}></div>
          </div>
          
          {/* Copyright EDP */}
          <div className="mt-12 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center space-x-1">
              <span>©</span>
              <span className="font-semibold text-teal-600">EDP Portugal</span>
              <span>- Sistema de Gestão Industrial</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EdpLoading;
