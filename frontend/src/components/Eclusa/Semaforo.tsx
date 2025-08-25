import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';
import { useWebSocket } from '@/hooks/useWebSocket';

interface SemaforoProps {
  editMode?: boolean;
  componentId?: string;
}

const Semaforo: React.FC<SemaforoProps> = ({ 
  editMode = false,
  componentId = "semaforo"
}) => {
  const { semaforos } = useWebSocket('ws://localhost:1337/ws');
  
  // ✅ CORRIGIDO: Extrai o número correto do semáforo
  let semaforoNumber = '0'; // padrão
  if (componentId.includes('-')) {
    // "semaforo-1" -> "1", "semaforo-2" -> "2", etc.
    semaforoNumber = componentId.split('-')[1] || '0';
  } else if (componentId === 'semaforo') {
    // "semaforo" sem número -> "0"
    semaforoNumber = '0';
  }
  
  // Tags individuais para LED verde e vermelho (novos nomes)
  const tagVerde = `Eclusa_Semaforo_verde_${semaforoNumber}`;
  const tagVermelho = `Eclusa_Semaforo_vermelho_${semaforoNumber}`;
  
  // Estados individuais dos LEDs
  const ledVerde = semaforos[tagVerde] || false;
  const ledVermelho = semaforos[tagVermelho] || false;

  // ✅ DEBUG: Log mudanças em tempo real
  React.useEffect(() => {
    console.log(`🚦 COMPONENT ID: ${componentId} -> SEMÁFORO ${semaforoNumber}`);
    console.log(`🚦 TAGS: ${tagVerde}=${ledVerde}, ${tagVermelho}=${ledVermelho}`);
    console.log(`🚦 TODOS SEMÁFOROS:`, semaforos);
  }, [componentId, semaforoNumber, ledVerde, ledVermelho, semaforos]);

  return (
    <ResponsiveWrapper
      componentId={componentId}
      editMode={editMode}
      defaultConfig={{
        xs: { x: 50, y: 200, width: 100, height: 146, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
        sm: { x: 100, y: 250, width: 120, height: 175, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
        md: { x: 200, y: 300, width: 140, height: 204, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
        lg: { x: 300, y: 350, width: 160, height: 233, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
        xl: { x: 400, y: 400, width: 180, height: 262, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
        '2xl': { x: 500, y: 450, width: 200, height: 292, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
        '3xl': { x: 600, y: 500, width: 220, height: 321, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
        '4xl': { x: 700, y: 550, width: 240, height: 350, scale: 1, zIndex: 10, opacity: 1, rotation: 0 }
      }}
    >
      <div className="semaforo-wrapper" style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 57 83" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
          preserveAspectRatio="xMidYMid meet"
        >
          <path d="M22 54H35V83H22V54Z" fill="black"/>
          <path d="M57 17.3478V4.91954H43.4929V0H13.5071V4.91954H0V17.3478L13.5071 27.7938V27.7948H0V40.2231L13.5071 50.6691V54H43.4929V50.6691L57 40.2231V27.7948H43.4929V27.7938L57 17.3478ZM28.5 46.3017C24.2047 46.3017 20.73 42.7916 20.73 38.4618C20.73 34.1319 24.2047 30.6293 28.5 30.6293C32.7953 30.6293 36.27 34.1319 36.27 38.4618C36.27 42.7916 32.7953 46.3017 28.5 46.3017ZM28.5 23.3707C24.2047 23.3707 20.73 19.8681 20.73 15.5382C20.73 11.2084 24.2047 7.69832 28.5 7.69832C32.7953 7.69832 36.27 11.2084 36.27 15.5382C36.27 19.8681 32.7953 23.3707 28.5 23.3707Z" fill="black"/>
          
          {/* ✅ CÍRCULO VERDE - INDIVIDUAL DO PLC */}
          <circle 
            cx="28.5" 
            cy="14.5" 
            r="9.5" 
            fill={ledVerde ? '#00FF26' : '#666666'}
            style={{
              transition: 'fill 0.05s ease-in-out',
              filter: ledVerde ? 'drop-shadow(0 0 8px #00FF26)' : 'none'
            }}
          />
          
          {/* ✅ CÍRCULO VERMELHO - INDIVIDUAL DO PLC */}
          <circle 
            cx="28.5" 
            cy="39.5" 
            r="9.5" 
            fill={ledVermelho ? '#FF0000' : '#666666'}
            style={{
              transition: 'fill 0.05s ease-in-out',
              filter: ledVermelho ? 'drop-shadow(0 0 8px #FF0000)' : 'none'
            }}
          />
        </svg>
        
        {/* ✅ DEBUG: Status visual */}
        {editMode && (
          <div className="absolute top-0 left-0 bg-black/80 text-white text-xs p-1 rounded">
            S{semaforoNumber}: {ledVerde ? '🟢' : '⚫'} {ledVermelho ? '🔴' : '⚫'}
          </div>
        )}
      </div>
    </ResponsiveWrapper>
  );
};

export default Semaforo;
