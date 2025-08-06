'use client';
import { useState, useEffect } from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface NivelProps {
  nivel?: number;
  scale?: number;
  editMode?: boolean;
  websocketValue?: number | null; // Novo prop para valor do WebSocket
  // Props injetadas pelo ResponsiveWrapper
  width?: number;
  height?: number;
  componentWidth?: number;
  componentHeight?: number;
}

export default function Nivel({
  nivel = 50,
  scale = 1,  
  editMode = false,
  websocketValue = null, // Valor vindo do WebSocket
  // Props injetadas pelo ResponsiveWrapper para dimensionamento
  width,
  height,
  componentWidth,
  componentHeight
}: NivelProps) {
  const [nivelAtual, setNivelAtual] = useState(nivel);
  const [isManualControl, setIsManualControl] = useState(false);

  // Atualiza o nível quando recebe dados do WebSocket
  useEffect(() => {
    if (websocketValue !== null && !isManualControl) {
      setNivelAtual(websocketValue);
    }
  }, [websocketValue, isManualControl]);

  return (
    <ResponsiveWrapper 
      componentId="nivel"
      editMode={editMode}
      defaultConfig={{
        xs: { x: 50, y: 200, width: 150, height: 80, scale: 0.4, zIndex: 50, opacity: 1, rotation: 0 },
        sm: { x: 100, y: 250, width: 200, height: 100, scale: 0.5, zIndex: 50, opacity: 1, rotation: 0 },
        md: { x: 200, y: 300, width: 250, height: 120, scale: 0.6, zIndex: 50, opacity: 1, rotation: 0 },
        lg: { x: 400, y: 300, width: 300, height: 140, scale: 0.7, zIndex: 50, opacity: 1, rotation: 0 },
        xl: { x: 500, y: 350, width: 350, height: 160, scale: 0.8, zIndex: 50, opacity: 1, rotation: 0 },
        '2xl': { x: 600, y: 400, width: 400, height: 165, scale: 0.9, zIndex: 50, opacity: 1, rotation: 0 },
        '3xl': { x: 700, y: 450, width: 450, height: 165, scale: 1.0, zIndex: 50, opacity: 1, rotation: 0 },
        '4xl': { x: 800, y: 500, width: 500, height: 165, scale: 1.1, zIndex: 50, opacity: 1, rotation: 0 },
      }}
    >
      <div className="w-full h-full">        
        <svg
          className="w-full h-full object-contain"
          width={componentWidth || 1167}
          height={componentHeight || 165}
          viewBox="0 0 1167 165"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            // Remove scale fixo e deixa o ResponsiveWrapper controlar
            transform: 'none',
            transformOrigin: 'top left'
          }}
        >
          <defs>
            <clipPath id="nivelClip">
              <rect x="0" y={165 - (nivelAtual / 100) * 165} width="1167" height={(nivelAtual / 100) * 165} />
            </clipPath>
          </defs>
          <path
            d="M224.398 135.194V141.778H0V0.00125099L180.338 0H321.057H1048.01V84H1167V163.022L968.1 162.564H966.5L928.672 162.192H321.057V164.048H307.395L298.173 150.894V92.4101L295.099 86.8218V46.2036H252.405L231.912 135.198L224.398 135.194Z"
            fill={isManualControl ? "#FF6B00" : "#1E00FF"}
            clipPath="url(#nivelClip)"
            style={{ transition: 'all 0.5s ease-in-out' }}
          />
        </svg>
      </div>
    </ResponsiveWrapper>
  );
}