'use client';

import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

export interface PistaoEnchimentoProps {
  nivel?: number;
  side?: 'direito' | 'esquerdo';
  componentWidth?: number;
  componentHeight?: number;
  className?: string;
  editMode?: boolean;
  componentId?: string;
}

const PistaoEnchimento: React.FC<PistaoEnchimentoProps> = ({ 
  nivel = 0,
  side = 'direito',
  componentWidth,
  componentHeight,
  className = '',
  editMode = false,
  componentId = `pistao-enchimento-${side}`
}) => {
  
  const nivelSeguro = Math.max(0, Math.min(100, nivel));
  
  const getDefaultPositions = () => {
    const baseY = 150;
    const leftX = side === 'esquerdo' ? 300 : 1200;
    
    return {
      xs: { x: leftX - 400, y: baseY, width: 120, height: 300, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
      sm: { x: leftX - 300, y: baseY, width: 140, height: 320, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
      md: { x: leftX - 200, y: baseY, width: 160, height: 340, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
      lg: { x: leftX, y: baseY, width: 180, height: 360, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
      xl: { x: leftX + 100, y: baseY, width: 200, height: 380, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
      '2xl': { x: leftX + 200, y: baseY, width: 220, height: 400, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
      '3xl': { x: leftX + 300, y: baseY, width: 240, height: 420, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
      '4xl': { x: leftX + 400, y: baseY, width: 260, height: 440, scale: 1, zIndex: 6, opacity: 1, rotation: 0 }
    };
  };

  // Calcula o movimento baseado no tamanho do container
  const moveAmount = componentHeight ? (componentHeight * 0.4 * (nivelSeguro / 100)) : 0;

  return (
    <ResponsiveWrapper 
      componentId={componentId}
      editMode={editMode}
      defaultConfig={getDefaultPositions()}
    >
      <div className="pistao-enchimento-wrapper" style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Container do pistão com movimento usando transform */}
        <div 
          style={{
            width: '100%',
            height: '100%',
            transform: `translateY(-${moveAmount}px)`,
            transition: 'transform 0.8s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img 
            src="/Enchimento/Pistao_enchimento.svg" 
            alt={`Pistão ${side}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transform: side === 'esquerdo' ? 'scaleX(-1)' : 'none',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          />
        </div>
      </div>
    </ResponsiveWrapper>
  );
};

export default PistaoEnchimento;