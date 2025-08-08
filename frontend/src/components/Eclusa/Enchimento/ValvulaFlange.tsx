import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface ValvulaFlangeProps {
  isActuated?: boolean;
  editMode?: boolean;
  componentId: string;
  side?: 'direito' | 'esquerdo';
  width?: number;
  height?: number;
}

const ValvulaFlange: React.FC<ValvulaFlangeProps> = ({
  isActuated = false,
  editMode = false,
  componentId,
  side = 'direito',
  width = 15,
  height = 23
}) => {
  const isEsquerdo = side === 'esquerdo';

  // Configurações padrão ajustadas para flanges (bem pequenos)
  const flangeDefaultConfig = {
    xs: { x: 10, y: 70, width: 30, height: 40, scale: 0.7, zIndex: 1, opacity: 1, rotation: 0 },
    sm: { x: 20, y: 70, width: 35, height: 45, scale: 0.8, zIndex: 1, opacity: 1, rotation: 0 },
    md: { x: 30, y: 70, width: 40, height: 50, scale: 0.9, zIndex: 1, opacity: 1, rotation: 0 },
    lg: { x: 50, y: 70, width: 45, height: 55, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    xl: { x: 74, y: 70, width: 50, height: 60, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '2xl': { x: 100, y: 70, width: 55, height: 65, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '3xl': { x: 120, y: 70, width: 60, height: 70, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '4xl': { x: 150, y: 70, width: 65, height: 75, scale: 1, zIndex: 1, opacity: 1, rotation: 0 }
  };

  return (
    <ResponsiveWrapper 
      editMode={editMode} 
      componentId={componentId}
      defaultConfig={flangeDefaultConfig}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 15 23" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ 
          transform: isEsquerdo ? 'scaleX(-1)' : 'none',
          transition: 'transform 0.3s ease'
        }}
      >
        <path 
          d="M0.909091 0.75H14.0909H14.2127L15 3V19.5L14.0909 22.0981H0.909091L0 19.5V3L0.909091 0.75Z" 
          fill={isActuated ? "#FD6500" : "#8B4513"}
          style={{ transition: 'fill 0.3s ease' }}
        />
        <path 
          d="M15 19.5H0L0.909091 22.5H14.0909L15 19.5Z" 
          fill="black"
        />
        <path 
          d="M14.0909 0H0.909091L0 3H15L14.0909 0Z" 
          fill="black"
        />
      </svg>
    </ResponsiveWrapper>
  );
};

export default ValvulaFlange;
