'use client';

import React from 'react';
import Image from 'next/image';
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
      <div className={`w-full h-full flex items-center justify-center ${editMode ? 'border-2 border-green-500 bg-green-50/20' : ''}`}>
        {/* Container da Base da Porta */}
        <div className="relative w-full h-full">
          <Image
            src="/PortaJusante/BasePorta.svg"
            alt="Base da Porta Jusante"
            fill
            style={{
              objectFit: 'contain',
              objectPosition: 'center'
            }}
            className="drop-shadow-lg"
            priority
          />
          
          {/* Overlay de informações no modo edição */}
          {editMode && (
            <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
              Base Porta Jusante
            </div>
          )}
          
        </div>
      </div>
    </ResponsiveWrapper>
  );
}
