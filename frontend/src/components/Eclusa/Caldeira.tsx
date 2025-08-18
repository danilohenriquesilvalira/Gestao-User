// components/Eclusa/Caldeira.tsx - COMPONENTE INDEPENDENTE CALDEIRA

import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface CaldeiraProps {
  editMode?: boolean;
}

export default function Caldeira({
  editMode = false
}: CaldeiraProps) {
  return (
    <ResponsiveWrapper 
      componentId="caldeira-eclusa"
      editMode={editMode}
      defaultConfig={{
        xs: { x: 50, y: 200, width: 120, height: 80, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
        sm: { x: 100, y: 250, width: 140, height: 95, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
        md: { x: 200, y: 300, width: 160, height: 110, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
        lg: { x: 300, y: 350, width: 180, height: 125, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
        xl: { x: 400, y: 400, width: 200, height: 140, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
        '2xl': { x: 500, y: 450, width: 220, height: 155, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
        '3xl': { x: 600, y: 500, width: 240, height: 170, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
        '4xl': { x: 700, y: 550, width: 260, height: 185, scale: 1, zIndex: 10, opacity: 1, rotation: 0 }
      }}
    >
      <div className="caldeira-eclusa-wrapper" style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src="/Eclusa/Caldeira_Eclusa.svg"
          alt="Caldeira da Eclusa"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    </ResponsiveWrapper>
  );
}
