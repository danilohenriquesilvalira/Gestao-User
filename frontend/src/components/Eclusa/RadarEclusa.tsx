// components/Eclusa/RadarEclusa.tsx - COMPONENTE RADAR COM ANIMAÇÃO E WEBSOCKET
import React, { useState, useEffect } from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';
import { useWebSocket } from '@/hooks/useWebSocket';

interface RadarEclusaProps {
  editMode?: boolean;
}

export default function RadarEclusa({
  editMode = false
}: RadarEclusaProps) {
  const [distancia, setDistancia] = useState<number | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const { radarDistanciaValue, isConnected } = useWebSocket('ws://localhost:1337/ws');

  // Atualiza distância via WebSocket
  useEffect(() => {
    if (radarDistanciaValue !== null) {
      const distanciaValue = Math.max(0, Math.min(100, radarDistanciaValue));
      setDistancia(distanciaValue);
      
      // Considera "detectando" quando distância é menor que 30%
      const detectandoBarco = distanciaValue < 30;
      setIsDetecting(detectandoBarco);
      
      console.log(`📡 RADAR: ${radarDistanciaValue} -> ${distanciaValue}% | Detectando: ${detectandoBarco}`);
    }
  }, [radarDistanciaValue]);

  // ✅ SEMPRE MOSTRA para posicionamento (WebSocket só anima)
  const displayDistancia = editMode ? 75 : (distancia ?? 50); // Padrão 50% quando sem dados
  const displayDetecting = editMode ? false : isDetecting;

  // Calcula intensidade do azul baseado na distância
  // Quanto menor a distância, mais intenso o azul
  const intensidadeAzul = Math.max(0.3, 1 - (displayDistancia / 100));

  return (
    <ResponsiveWrapper 
      componentId="radar-eclusa"
      editMode={editMode}
      defaultConfig={{
        xs: { x: 200, y: 100, width: 50, height: 35, scale: 1, zIndex: 7, opacity: 1, rotation: 0 },
        sm: { x: 250, y: 120, width: 55, height: 38, scale: 1, zIndex: 7, opacity: 1, rotation: 0 },
        md: { x: 300, y: 150, width: 60, height: 40, scale: 1, zIndex: 7, opacity: 1, rotation: 0 },
        lg: { x: 350, y: 180, width: 65, height: 43, scale: 1, zIndex: 7, opacity: 1, rotation: 0 },
        xl: { x: 400, y: 200, width: 70, height: 46, scale: 1, zIndex: 7, opacity: 1, rotation: 0 },
        '2xl': { x: 450, y: 230, width: 75, height: 49, scale: 1, zIndex: 7, opacity: 1, rotation: 0 },
        '3xl': { x: 500, y: 260, width: 80, height: 52, scale: 1, zIndex: 7, opacity: 1, rotation: 0 },
        '4xl': { x: 550, y: 290, width: 85, height: 55, scale: 1, zIndex: 7, opacity: 1, rotation: 0 }
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        {/* Container do Radar com animação */}
        <div className="relative w-full h-full">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 65 43"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="object-contain"
          >
            {/* Base preta do radar */}
            <path d="M53 16H57V32H53V16Z" fill="black"/>
            
            {/* Estrutura metálica */}
            <path 
              d="M56.7931 18.9123C58.0023 19.2254 58.0023 18.5993 58.0023 18.5993V18.9123L59.1329 18.497L62.8074 17.1471C63.9104 16.8615 63.9104 16.0813 63.9104 16.0813L64 4.45723V3.85105C64 2.54543 62.897 2.54543 62.897 2.54543L53.5281 1L48.0544 2.40518L47.041 2.66533C46 2.66533 46 3.3781 46 3.3781V16.1545C46 16.9872 46.5377 16.9872 46.5377 16.9872L50 17.6371L56.7931 18.9123Z" 
              fill="#BBBABD"
            />
            
            {/* Contornos */}
            <path 
              d="M58.0023 6.30909V18.5993M58.0023 6.30909V5.97002C58.0023 5.97002 58.0023 4.23741 57.1612 4.23741M58.0023 6.30909L59.0777 5.97002M58.0023 18.5993C58.0023 18.5993 58.0023 19.2254 56.7931 18.9123L50 17.6371L46.5377 16.9872C46.5377 16.9872 46 16.9872 46 16.1545V3.3781C46 3.3781 46 2.66533 47.041 2.66533M58.0023 18.5993V18.9123L59.1329 18.497M47.041 2.66533C47.041 2.66533 56.3202 4.23741 57.1612 4.23741M47.041 2.66533L48.0544 2.40518M57.1612 4.23741L58.2298 3.9222M64 4.45723H63.8759L59.2225 5.92437L59.0777 5.97002M64 4.45723L63.9104 16.0813M64 4.45723V3.85105C64 2.54543 62.897 2.54543 62.897 2.54543M63.9104 16.0813L59.1329 17.8332M63.9104 16.0813C63.9104 16.0813 63.9104 16.8615 62.8074 17.1471L59.1329 18.497M59.1329 17.8332L59.0777 5.97002M59.1329 17.8332V18.497M62.897 2.54543L53.5281 1L48.0544 2.40518M62.897 2.54543L58.2298 3.9222M58.2298 3.9222L48.0544 2.40518M56.7131 4.72369C57.0482 4.72369 57.3198 4.98614 57.3198 5.30989C57.3198 5.63363 57.0482 5.89608 56.7131 5.89608C56.3781 5.89608 56.1065 5.63363 56.1065 5.30989C56.1065 4.98614 56.3781 4.72369 56.7131 4.72369Z" 
              stroke="black" 
              strokeWidth="0.2"
            />

            {/* Área azul de detecção - COM ANIMAÇÃO */}
            <path 
              d="M27.4781 28.548L52 10L0.999996 20.1919V33.367L27.4781 42V28.548Z" 
              fill={`rgba(105, 189, 236, ${intensidadeAzul})`}
              style={{
                filter: displayDetecting ? 'drop-shadow(0 0 8px #69BDEC)' : 'none',
                transition: 'all 0.5s ease-in-out'
              }}
              className={displayDetecting ? 'animate-pulse' : ''}
            />
            
            {/* Contorno da área azul */}
            <path 
              d="M27.4781 28.548L52 10L0.999997 20.1919M27.4781 28.548V42L0.999997 33.367V20.1919M27.4781 28.548L0.999997 20.1919" 
              stroke="black" 
              strokeWidth="0.2"
            />

            {/* Ondas de radar quando detectando */}
            {displayDetecting && (
              <g>
                <circle
                  cx="26"
                  cy="26"
                  r="5"
                  fill="none"
                  stroke="#69BDEC"
                  strokeWidth="2"
                  opacity="0.8"
                  className="animate-ping"
                />
                <circle
                  cx="26"
                  cy="26"
                  r="10"
                  fill="none"
                  stroke="#69BDEC"
                  strokeWidth="1.5"
                  opacity="0.6"
                  className="animate-ping"
                  style={{ animationDelay: '0.2s' }}
                />
                <circle
                  cx="26"
                  cy="26"
                  r="15"
                  fill="none"
                  stroke="#69BDEC"
                  strokeWidth="1"
                  opacity="0.4"
                  className="animate-ping"
                  style={{ animationDelay: '0.4s' }}
                />
              </g>
            )}
          </svg>

          {/* Indicador de status */}
          {!editMode && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <div className={`w-2 h-2 rounded-full ${displayDetecting ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
              <div className="text-xs font-mono bg-black text-white px-1 rounded mt-1">
                {displayDistancia.toFixed(0)}%
              </div>
            </div>
          )}

          {/* Status no modo de edição */}
          {editMode && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-mono bg-blue-600 text-white px-2 py-1 rounded">
              Radar: {displayDistancia.toFixed(0)}%
            </div>
          )}
        </div>
      </div>
    </ResponsiveWrapper>
  );
}