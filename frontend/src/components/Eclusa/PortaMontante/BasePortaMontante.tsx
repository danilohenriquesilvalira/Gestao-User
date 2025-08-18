

import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface BasePortaMontanteProps {
  editMode?: boolean;
  componentId?: string;
  // Props injetadas pelo ResponsiveWrapper
  width?: number;
  height?: number;
  componentWidth?: number;
  componentHeight?: number;
}

const BasePortaMontante: React.FC<BasePortaMontanteProps> = ({
  editMode = false,
  componentId = 'base-porta-montante',
  width = 480,
  height = 360,
  componentWidth,
  componentHeight
}) => {
  return (
    <ResponsiveWrapper
      componentId={componentId}
      editMode={editMode}
      defaultConfig={{
        xs: { x: 100, y: 150, width: 200, height: 150, scale: 0.8, zIndex: 5, opacity: 1, rotation: 0 },
        sm: { x: 120, y: 180, width: 240, height: 180, scale: 0.85, zIndex: 5, opacity: 1, rotation: 0 },
        md: { x: 150, y: 220, width: 280, height: 210, scale: 0.9, zIndex: 5, opacity: 1, rotation: 0 },
        lg: { x: 200, y: 260, width: 320, height: 240, scale: 0.95, zIndex: 5, opacity: 1, rotation: 0 },
        xl: { x: 250, y: 300, width: 360, height: 270, scale: 1.0, zIndex: 5, opacity: 1, rotation: 0 },
        '2xl': { x: 300, y: 350, width: 400, height: 300, scale: 1.05, zIndex: 5, opacity: 1, rotation: 0 },
        '3xl': { x: 350, y: 400, width: 440, height: 330, scale: 1.1, zIndex: 5, opacity: 1, rotation: 0 },
        '4xl': { x: 400, y: 450, width: 480, height: 360, scale: 1.15, zIndex: 5, opacity: 1, rotation: 0 }
      }}
    >
      <div className="base-porta-montante-wrapper" style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src="/PortaMontante/BasePortaMontante.svg"
          alt="Base Porta Montante"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    </ResponsiveWrapper>
  );
};

export default BasePortaMontante;