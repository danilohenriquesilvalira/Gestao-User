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
  // POSIÇÕES CORRIGIDAS - Movido para baixo e direita para não conflitar
  const tanqueDefaultConfig = {
    xs: { x: 100, y: 500, width: 100, height: 26, scale: 0.2, zIndex: 2, opacity: 1, rotation: 0 },
    sm: { x: 150, y: 520, width: 130, height: 32, scale: 0.25, zIndex: 2, opacity: 1, rotation: 0 },
    md: { x: 200, y: 540, width: 150, height: 38, scale: 0.3, zIndex: 2, opacity: 1, rotation: 0 },
    lg: { x: 300, y: 560, width: 200, height: 52, scale: 0.4, zIndex: 2, opacity: 1, rotation: 0 },
    xl: { x: 500, y: 580, width: 255, height: 64, scale: 0.5, zIndex: 2, opacity: 1, rotation: 0 },
    '2xl': { x: 700, y: 600, width: 306, height: 77, scale: 0.6, zIndex: 2, opacity: 1, rotation: 0 },
    '3xl': { x: 900, y: 620, width: 408, height: 102, scale: 0.8, zIndex: 2, opacity: 1, rotation: 0 },
    '4xl': { x: 1100, y: 640, width: 510, height: 128, scale: 1, zIndex: 2, opacity: 1, rotation: 0 }
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
        style={{ pointerEvents: editMode ? 'none' : 'auto' }}
      >
        <rect width="510" height="128" fill="#D9D9D9"/>
        <rect y="44" width="510" height="84" fill="#FC6500"/>
      </svg>
    </ResponsiveWrapper>
  );
};

export default TanqueDeOleo;