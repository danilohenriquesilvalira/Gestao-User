// components/Eclusa/PortaJusante.tsx - COMPONENTE PORTA JUSANTE COM WEBSOCKET
import React, { useState, useEffect } from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';
import { useWebSocket } from '@/hooks/useWebSocket';

interface PortaJusanteProps {
  editMode?: boolean;
}

export default function PortaJusante({
  editMode = false
}: PortaJusanteProps) {
  const [abertura, setAbertura] = useState<number | null>(null); // ✅ ESTADO INICIAL: null (não renderiza até ter dados)
  const { eclusaPortaJusanteValue, motorValue, isConnected } = useWebSocket('ws://localhost:8080/ws');

  // Atualiza abertura via WebSocket - usando eclusaPortaJusanteValue (novo)
  useEffect(() => {
    if (eclusaPortaJusanteValue !== null) {
      // Converte valor da porta para porcentagem de abertura
      const aberturaPercentual = Math.max(0, Math.min(100, eclusaPortaJusanteValue));
      setAbertura(aberturaPercentual);
      console.log(`🚪 PORTA JUSANTE: ${eclusaPortaJusanteValue} -> ${aberturaPercentual}%`);
    } else if (motorValue !== null) {
      // Fallback para compatibilidade com sistema antigo
      const aberturaPercentual = Math.max(0, Math.min(100, motorValue));
      setAbertura(aberturaPercentual);
      console.log(`🚪 PORTA JUSANTE (fallback): ${motorValue} -> ${aberturaPercentual}%`);
    }
  }, [eclusaPortaJusanteValue, motorValue]);

  // ✅ SE NÃO TEM DADOS AINDA, NÃO RENDERIZA (evita flash)
  if (abertura === null && !editMode) {
    return null;
  }

  // Usa a abertura real do WebSocket, mesmo em edit mode
  const displayAbertura = (abertura ?? 0);

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
      <div className="w-full h-full flex flex-col items-center justify-center">
        {/* Container da Porta com animação */}
        <div className="relative flex-1 flex items-center justify-center w-full h-full">
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: `scaleX(${displayAbertura / 100})`, 
              transformOrigin: 'right center', // Abre da direita para esquerda
              transition: 'transform 0.5s ease-in-out', // Animação suave
            }}
          >
            <img
              src="/Eclusa/Porta_jusante.svg"
              alt="Porta Jusante"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      </div>
    </ResponsiveWrapper>
  );
}
