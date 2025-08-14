

import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

export interface StatusIndicatorProps {
  editMode?: boolean;
  componentId?: string;
  label: string;
  websocketValue?: number; // Valor do WebSocket para determinar status
  size?: 'sm' | 'md' | 'lg';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  editMode = false,
  componentId = 'status-indicator-default',
  label,
  websocketValue = 0,
  size = 'md'
}) => {
  // Determinar status baseado no valor WebSocket
  const getPortaStatus = () => {
    if (websocketValue >= 95) {
      return {
        status: 'aberta',
        text: 'ABERTA',
        position: 'cima'
      };
    } else if (websocketValue <= 5) {
      return {
        status: 'fechada',
        text: 'FECHADA',
        position: 'baixo'
      };
    } else {
      return {
        status: 'movendo',
        text: 'MOVENDO',
        position: 'meio'
      };
    }
  };

  const portaStatus = getPortaStatus();

  // Configurações de tamanho
  const getSizeConfig = () => {
    const sizes = {
      sm: {
        container: 'px-4 py-2 text-sm',
        height: 'h-12',
        width: 'w-32'
      },
      md: {
        container: 'px-5 py-3 text-base',
        height: 'h-14',
        width: 'w-36'
      },
      lg: {
        container: 'px-6 py-4 text-lg',
        height: 'h-16',
        width: 'w-40'
      }
    };
    
    return sizes[size];
  };

  const sizeConfig = getSizeConfig();

  // Cores baseadas no status
  const getStatusColors = () => {
    switch (portaStatus.status) {
      case 'aberta':
        return {
          bg: 'bg-green-500',
          border: 'border-green-400',
          shadow: 'shadow-lg shadow-green-500/25',
          text: 'text-white',
          svgFill: '#22c55e' // Verde para aberta
        };
      case 'fechada':
        return {
          bg: 'bg-orange-500',
          border: 'border-orange-400', 
          shadow: 'shadow-lg shadow-orange-500/25',
          text: 'text-white',
          svgFill: '#f97316' // Laranja para fechada
        };
      case 'movendo':
        return {
          bg: 'bg-yellow-500',
          border: 'border-yellow-400',
          shadow: 'shadow-lg shadow-yellow-500/25', 
          text: 'text-black',
          svgFill: '#eab308' // Amarelo para movendo
        };
      default:
        return {
          bg: 'bg-gray-500',
          border: 'border-gray-400',
          shadow: 'shadow-lg shadow-gray-500/25',
          text: 'text-white', 
          svgFill: '#6b7280'
        };
    }
  };

  const colors = getStatusColors();

  return (
    <ResponsiveWrapper
      componentId={componentId}
      editMode={editMode}
      defaultConfig={{
        xs: { x: 50, y: 50, width: 140, height: 60, scale: 1, zIndex: 3, opacity: 1, rotation: 0 },
        sm: { x: 100, y: 100, width: 160, height: 70, scale: 1, zIndex: 3, opacity: 1, rotation: 0 },
        md: { x: 150, y: 150, width: 180, height: 80, scale: 1, zIndex: 3, opacity: 1, rotation: 0 },
        lg: { x: 200, y: 200, width: 200, height: 90, scale: 1, zIndex: 3, opacity: 1, rotation: 0 },
        xl: { x: 250, y: 250, width: 220, height: 100, scale: 1, zIndex: 3, opacity: 1, rotation: 0 },
        '2xl': { x: 300, y: 300, width: 240, height: 110, scale: 1, zIndex: 3, opacity: 1, rotation: 0 },
        '3xl': { x: 350, y: 350, width: 260, height: 120, scale: 1, zIndex: 3, opacity: 1, rotation: 0 },
        '4xl': { x: 400, y: 400, width: 280, height: 130, scale: 1, zIndex: 3, opacity: 1, rotation: 0 }
      }}
    >
      <div className={`
        ${editMode ? 'border-2 border-blue-400 bg-blue-50/10' : ''}
        w-full h-full flex items-center justify-center
      `}>
        {/* Status Indicator Simples */}
        <div 
          className={`w-full h-full flex items-center justify-center rounded-lg border-2 border-white transition-all duration-300 ${colors.text} font-bold text-lg`}
          style={{ backgroundColor: colors.svgFill }}
        >
          <span className="uppercase tracking-wide">
            {portaStatus.text}
          </span>
        </div>

        {/* Overlay de informações no modo edição */}
        {editMode && (
          <div className="absolute -top-8 left-0 bg-black text-white px-2 py-1 rounded text-xs">
            {portaStatus.status} - {websocketValue}%
          </div>
        )}
      </div>
    </ResponsiveWrapper>
  );
};

export default StatusIndicator;