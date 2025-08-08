import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface ValvulaVerticalProps {
  isOpen?: boolean;
  editMode?: boolean;
  componentId: string;
  side?: 'direito' | 'esquerdo';
  width?: number;
  height?: number;
}

const ValvulaVertical: React.FC<ValvulaVerticalProps> = ({
  isOpen = false,
  editMode = false,
  componentId,
  side = 'direito',
  width = 41,
  height = 43
}) => {
  const isEsquerdo = side === 'esquerdo';

  // Configurações padrão ajustadas para válvulas verticais (pequenas)
  const verticalDefaultConfig = {
    xs: { x: 10, y: 70, width: 50, height: 55, scale: 0.7, zIndex: 1, opacity: 1, rotation: 0 },
    sm: { x: 20, y: 70, width: 55, height: 60, scale: 0.8, zIndex: 1, opacity: 1, rotation: 0 },
    md: { x: 30, y: 70, width: 60, height: 65, scale: 0.9, zIndex: 1, opacity: 1, rotation: 0 },
    lg: { x: 50, y: 70, width: 65, height: 70, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    xl: { x: 74, y: 70, width: 70, height: 75, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '2xl': { x: 100, y: 70, width: 75, height: 80, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '3xl': { x: 120, y: 70, width: 80, height: 85, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '4xl': { x: 150, y: 70, width: 85, height: 90, scale: 1, zIndex: 1, opacity: 1, rotation: 0 }
  };

  return (
    <ResponsiveWrapper 
      editMode={editMode} 
      componentId={componentId}
      defaultConfig={verticalDefaultConfig}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 41 43" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ 
          transform: isEsquerdo ? 'scaleX(-1)' : 'none',
          transition: 'transform 0.3s ease'
        }}
      >
        <path 
          d="M14 8L26 8L26 1L14 0.999999L14 8Z" 
          fill="#900000" 
          stroke="#900000"
        />
        
        <rect 
          x="8.1" 
          y="8.1" 
          width="24.8" 
          height="34.8" 
          fill={isOpen ? "#22C55E" : "#D9D9D9"}
          stroke="black" 
          strokeWidth="0.2"
          style={{ transition: 'fill 0.3s ease' }}
        />
        
        {/* Linha marrom - visível quando fechada (false) */}
        <path 
          d="M8.5 33C17.0915 33 23.4085 33 32 33" 
          stroke="#753E00" 
          strokeWidth="10"
          style={{ 
            opacity: isOpen ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
        
        {/* Linha laranja - visível quando aberta (true) */}
        <path 
          d="M20 8V30.8679C20 31.9724 20.8954 32.8679 21.9999 32.8679L33 32.8682" 
          stroke="#FC6500" 
          strokeWidth="10"
          style={{ 
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
        
        <path 
          d="M8 39V27H1V39H8Z" 
          fill="#900000" 
          stroke="#900000"
        />
        
        <path 
          d="M40 39V27H33V39H40Z" 
          fill="#900000" 
          stroke="#900000"
        />
      </svg>
    </ResponsiveWrapper>
  );
};

export default ValvulaVertical;
