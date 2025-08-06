// components/Eclusa/PortaJusante.tsx - COMPONENTE PORTA JUSANTE COM WEBSOCKET
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';
import { useWebSocket } from '@/hooks/useWebSocket';

interface PortaJusanteProps {
  editMode?: boolean;
}

export default function PortaJusante({
  editMode = false
}: PortaJusanteProps) {
  const [abertura, setAbertura] = useState(100); // Estado inicial: 100% ABERTA
  const { nivelValue, motorValue, isConnected } = useWebSocket('ws://localhost:8080/ws');

  // Atualiza abertura via WebSocket - usando motorValue como exemplo
  useEffect(() => {
    if (motorValue !== null) {
      // Converte valor do motor para porcentagem de abertura
      const aberturaPercentual = Math.max(0, Math.min(100, motorValue));
      setAbertura(aberturaPercentual);
    }
  }, [motorValue]);

  return (
    <ResponsiveWrapper 
      componentId="porta-jusante"
      editMode={editMode}
      defaultConfig={{
        xs: { x: 300, y: 200, width: 85, height: 181, scale: 1, zIndex: 8, opacity: 1, rotation: 0 },
        sm: { x: 350, y: 250, width: 95, height: 200, scale: 1, zIndex: 8, opacity: 1, rotation: 0 },
        md: { x: 400, y: 300, width: 105, height: 220, scale: 1, zIndex: 8, opacity: 1, rotation: 0 },
        lg: { x: 450, y: 350, width: 115, height: 240, scale: 1, zIndex: 8, opacity: 1, rotation: 0 },
        xl: { x: 500, y: 400, width: 125, height: 260, scale: 1, zIndex: 8, opacity: 1, rotation: 0 },
        '2xl': { x: 550, y: 450, width: 135, height: 280, scale: 1, zIndex: 8, opacity: 1, rotation: 0 },
        '3xl': { x: 600, y: 500, width: 145, height: 300, scale: 1, zIndex: 8, opacity: 1, rotation: 0 },
        '4xl': { x: 650, y: 550, width: 155, height: 320, scale: 1, zIndex: 8, opacity: 1, rotation: 0 }
      }}
    >
      <div className={`w-full h-full flex flex-col items-center justify-center ${editMode ? 'border-2 border-blue-500 bg-blue-50/20' : ''}`}>
        {/* Container da Porta com animação */}
        <div className="relative flex-1 flex items-center justify-center">
          <div
            style={{
              width: '85px',
              height: '181px',
              transform: `scaleX(${abertura / 100}) translateX(${(100 - abertura) * 0.85}px)`, 
              transformOrigin: 'right center', // Movimento da DIREITA para ESQUERDA
              transition: 'transform 0.5s ease-in-out', // Animação suave
            }}
          >
            <Image
              src="/Eclusa/Porta_jusante.svg"
              alt="Porta Jusante"
              width={85}
              height={181}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {editMode && (
          <div className="absolute inset-0 border-2 border-dashed border-purple-400 bg-purple-50/20 rounded flex items-center justify-center pointer-events-none">
          </div>
        )}
      </div>
    </ResponsiveWrapper>
  );
}
