'use client';

import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

export interface BasePistaoEnchimentoProps {
  side?: 'direito' | 'esquerdo';
  componentWidth?: number;
  componentHeight?: number;
  className?: string;
  editMode?: boolean;
  componentId?: string;
}

const BasePistaoEnchimento: React.FC<BasePistaoEnchimentoProps> = ({ 
  side = 'direito',
  componentWidth,
  componentHeight,
  className = '',
  editMode = false,
  componentId = `base-pistao-enchimento-${side}`
}) => {
  
  const getDefaultPositions = () => {
    const baseY = 150;
    const leftX = side === 'esquerdo' ? 300 : 1200;
    
    return {
      xs: { x: leftX - 400, y: baseY, width: 120, height: 300, scale: 1, zIndex: 5, opacity: 1, rotation: 0 },
      sm: { x: leftX - 300, y: baseY, width: 140, height: 320, scale: 1, zIndex: 5, opacity: 1, rotation: 0 },
      md: { x: leftX - 200, y: baseY, width: 160, height: 340, scale: 1, zIndex: 5, opacity: 1, rotation: 0 },
      lg: { x: leftX, y: baseY, width: 180, height: 360, scale: 1, zIndex: 5, opacity: 1, rotation: 0 },
      xl: { x: leftX + 100, y: baseY, width: 200, height: 380, scale: 1, zIndex: 5, opacity: 1, rotation: 0 },
      '2xl': { x: leftX + 200, y: baseY, width: 220, height: 400, scale: 1, zIndex: 5, opacity: 1, rotation: 0 },
      '3xl': { x: leftX + 300, y: baseY, width: 240, height: 420, scale: 1, zIndex: 5, opacity: 1, rotation: 0 },
      '4xl': { x: leftX + 400, y: baseY, width: 260, height: 440, scale: 1, zIndex: 5, opacity: 1, rotation: 0 }
    };
  };

  return (
    <ResponsiveWrapper 
      componentId={componentId}
      editMode={editMode}
      defaultConfig={getDefaultPositions()}
    >
      <div className="base-pistao-enchimento-wrapper" style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Base do Pistão centralizada */}
        <img 
          src="/Enchimento/BasePistaoEnchimento.svg" 
          alt={`Base Pistão ${side}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: side === 'esquerdo' ? 'scaleX(-1)' : 'none'
          }}
        />
      </div>
    </ResponsiveWrapper>
  );
};

export default BasePistaoEnchimento;