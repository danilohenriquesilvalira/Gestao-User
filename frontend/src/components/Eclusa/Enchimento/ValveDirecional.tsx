import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface ValveDirecionalProps {
  isOpen?: boolean;
  editMode?: boolean;
  componentId: string;
  side?: 'direito' | 'esquerdo';
  width?: number;
  height?: number;
}

const ValveDirecional: React.FC<ValveDirecionalProps> = ({ 
  isOpen = false,
  editMode = false,
  componentId,
  side = 'direito',
  width = 56, 
  height = 38 
}) => {
  const isEsquerdo = side === 'esquerdo';

  // Configurações padrão ajustadas para válvulas direcionais (menores)
  const valveDefaultConfig = {
    xs: { x: 10, y: 70, width: 60, height: 42, scale: 0.7, zIndex: 1, opacity: 1, rotation: 0 },
    sm: { x: 20, y: 70, width: 65, height: 46, scale: 0.8, zIndex: 1, opacity: 1, rotation: 0 },
    md: { x: 30, y: 70, width: 70, height: 50, scale: 0.9, zIndex: 1, opacity: 1, rotation: 0 },
    lg: { x: 50, y: 70, width: 75, height: 54, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    xl: { x: 74, y: 70, width: 80, height: 58, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '2xl': { x: 100, y: 70, width: 85, height: 62, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '3xl': { x: 120, y: 70, width: 90, height: 66, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '4xl': { x: 150, y: 70, width: 95, height: 70, scale: 1, zIndex: 1, opacity: 1, rotation: 0 }
  };

  return (
    <ResponsiveWrapper 
      editMode={editMode} 
      componentId={componentId}
      defaultConfig={valveDefaultConfig}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 57 38" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ 
          transform: isEsquerdo ? 'scaleX(-1)' : 'none',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Corpo principal da válvula */}
        <rect 
          x="-0.1" 
          y="0.1" 
          width="43.8" 
          height="22.8" 
          transform="matrix(-1 8.74228e-08 8.74228e-08 1 43.8 7)" 
          fill={isOpen ? "#22C55E" : "#808080"}
          stroke="black" 
          strokeWidth="0.2"
          style={{ transition: 'fill 0.3s ease' }}
        />
        
        {/* Linha marrom - visível quando fechada (false) */}
        <path 
          d="M27 8L27 30" 
          stroke="#753E00" 
          strokeWidth="10"
          style={{ 
            opacity: isOpen ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
        
        {/* Linha laranja - visível quando aberta (true) */}
        <path 
          d="M27 30L27 24L7 12.5L7 8" 
          stroke="#E95D00" 
          strokeWidth="10"
          style={{ 
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
        
        {/* Conectores fixos */}
        <path 
          d="M20 30L33 30L33 37L20 37L20 30Z" 
          fill="#900000" 
          stroke="#900000"
        />
        <path 
          d="M20 1L33 0.999999L33 8L20 8L20 1Z" 
          fill="#900000" 
          stroke="#900000"
        />
        <path 
          d="M1 1L13 0.999999L13 8L1 8L1 1Z" 
          fill="#900000" 
          stroke="#900000"
        />
        
        {/* Indicador de status */}
        <path 
          d="M56 22H44V29.9023H56V22Z" 
          fill={isOpen ? "#22C55E" : "#808080"}
          stroke="black" 
          strokeWidth="0.2"
          style={{ transition: 'fill 0.3s ease' }}
        />
      </svg>
    </ResponsiveWrapper>
  );
};

export default ValveDirecional;
