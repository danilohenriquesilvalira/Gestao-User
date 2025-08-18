

import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface BasePortaProps {
  editMode?: boolean;
  componentId?: string;
}

export default function BasePorta({ 
  editMode = false,
  componentId = 'base-porta-jusante'
}: BasePortaProps) {
  
  return (
    <ResponsiveWrapper 
      componentId={componentId}
      editMode={editMode}
      defaultConfig={{
        xs: { x: 50, y: 50, width: 200, height: 300, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
        sm: { x: 100, y: 100, width: 250, height: 375, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
        md: { x: 150, y: 150, width: 300, height: 450, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
        lg: { x: 200, y: 200, width: 350, height: 525, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
        xl: { x: 250, y: 250, width: 400, height: 600, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
        '2xl': { x: 300, y: 300, width: 450, height: 675, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
        '3xl': { x: 350, y: 350, width: 500, height: 750, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
        '4xl': { x: 400, y: 400, width: 550, height: 825, scale: 1, zIndex: 1, opacity: 1, rotation: 0 }
      }}
    >
      <div className="base-porta-jusante-wrapper" style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Container da Base da Porta */}
        <div className="relative w-full h-full">
          <img
            src="/PortaJusante/BasePorta.svg"
            alt="Base da Porta Jusante"
            style={{
              objectFit: 'contain',
              objectPosition: 'center',
              width: '100%',
              height: '100%'
            }}
            className="drop-shadow-lg"
          />
          
        </div>
      </div>
    </ResponsiveWrapper>
  );
}
