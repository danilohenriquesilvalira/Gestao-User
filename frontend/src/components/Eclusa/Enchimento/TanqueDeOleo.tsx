import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface TanqueDeOleoProps {
  editMode?: boolean;
  componentId: string;
  width?: number;
  height?: number;
}

const TanqueDeOleo: React.FC<TanqueDeOleoProps> = ({
  editMode = false,
  componentId,
  width = 510,
  height = 128
}) => {
  // Configurações padrão para o tanque de óleo (REDIMENSIONADO PARA NÃO CAUSAR CONFLITO)
  const tanqueDefaultConfig = {
    xs: { x: 10, y: 400, width: 100, height: 26, scale: 0.2, zIndex: 0, opacity: 1, rotation: 0 },
    sm: { x: 20, y: 450, width: 130, height: 32, scale: 0.25, zIndex: 0, opacity: 1, rotation: 0 },
    md: { x: 30, y: 500, width: 150, height: 38, scale: 0.3, zIndex: 0, opacity: 1, rotation: 0 },
    lg: { x: 50, y: 550, width: 200, height: 52, scale: 0.4, zIndex: 0, opacity: 1, rotation: 0 },
    xl: { x: 74, y: 600, width: 255, height: 64, scale: 0.5, zIndex: 0, opacity: 1, rotation: 0 },
    '2xl': { x: 100, y: 650, width: 306, height: 77, scale: 0.6, zIndex: 0, opacity: 1, rotation: 0 },
    '3xl': { x: 120, y: 700, width: 408, height: 102, scale: 0.8, zIndex: 0, opacity: 1, rotation: 0 },
    '4xl': { x: 150, y: 750, width: 510, height: 128, scale: 1, zIndex: 0, opacity: 1, rotation: 0 }
  };

  return (
    <ResponsiveWrapper 
      editMode={editMode} 
      componentId={componentId}
      defaultConfig={tanqueDefaultConfig}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 510 128" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width="510" height="128" fill="#D9D9D9"/>
        <rect y="44" width="510" height="84" fill="#FC6500"/>
      </svg>
    </ResponsiveWrapper>
  );
};

export default TanqueDeOleo;