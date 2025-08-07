'use client';

import React from 'react';
import Image from 'next/image';
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
      <div className={`w-full h-full ${editMode ? 'border-2 border-blue-500 bg-blue-50/20' : ''}`}>
        <Image
          src="/PortaMontante/BasePortaMontante.svg"
          alt="Base Porta Montante"
          width={componentWidth || width}
          height={componentHeight || height}
          className="w-full h-full object-contain"
          priority
        />
        
        {editMode && (
          <div className="absolute inset-0 border-2 border-dashed border-purple-400 bg-purple-50/20 rounded flex items-center justify-center pointer-events-none">
            <div className="text-xs font-bold text-purple-600 bg-white px-2 py-1 rounded">
              Base Porta Montante - {Math.round(componentWidth || width)}×{Math.round(componentHeight || height)}
            </div>
          </div>
        )}
      </div>
    </ResponsiveWrapper>
  );
};

export default BasePortaMontante;