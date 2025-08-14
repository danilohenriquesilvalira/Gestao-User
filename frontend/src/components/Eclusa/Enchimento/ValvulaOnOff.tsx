
import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

export interface ValvulaOnOffProps {
  state?: 0 | 1 | 2;
  componentWidth?: number;
  componentHeight?: number;
  className?: string;
  editMode?: boolean;
  componentId?: string;
}

const ValvulaOnOff: React.FC<ValvulaOnOffProps> = ({ 
  state = 0,
  componentWidth,
  componentHeight,
  className = '',
  editMode = false,
  componentId = 'valvula-onoff-principal'
}) => {
  
  const getColor = (): string => {
    switch(state) {
      case 0: return '#808080';
      case 1: return '#00FF09';
      case 2: return '#FF0000';
      default: return '#808080';
    }
  };

  const color = getColor();

  const defaultPositions = {
    xs: { x: 200, y: 80, width: 80, height: 80, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
    sm: { x: 300, y: 80, width: 90, height: 90, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
    md: { x: 500, y: 80, width: 100, height: 100, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
    lg: { x: 800, y: 80, width: 110, height: 110, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
    xl: { x: 1100, y: 80, width: 120, height: 120, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
    '2xl': { x: 1400, y: 80, width: 130, height: 130, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
    '3xl': { x: 1600, y: 80, width: 140, height: 140, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
    '4xl': { x: 1750, y: 80, width: 150, height: 150, scale: 1, zIndex: 10, opacity: 1, rotation: 0 }
  };

  return (
    <ResponsiveWrapper 
      componentId={componentId}
      editMode={editMode}
      defaultConfig={defaultPositions}
    >
      <div className="valvula-onoff-wrapper" data-state={state} style={{ width: '100%', height: '100%' }}>
        <svg 
          width="100%"
          height="100%"
          viewBox="0 0 34 34" 
          preserveAspectRatio="xMidYMid meet"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`valvula-svg ${className}`}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        >
          <path 
            d="M1.58447 4.54394L15.5942 4.54395L8.58936 16.6777L1.58447 4.54394Z" 
            fill={color} 
            stroke="black" 
            strokeWidth="0.5"
          />
          
          <path 
            d="M15.5938 28.9072H1.58398L8.58887 16.7734L15.5938 28.9072Z" 
            fill={color} 
            stroke="black" 
            strokeWidth="0.5"
          />
          
          <path 
            d="M8.58905 16.7256L21.2466 16.7256" 
            stroke="black" 
            strokeWidth="0.5"
          />
          
          <path 
            d="M21.2466 28.4794L21.2466 4.52051C21.2466 4.52051 33 5.60955 33 16.5C33 27.3904 21.2466 28.4794 21.2466 28.4794Z" 
            fill={color} 
            stroke="black" 
            strokeWidth="0.5"
          />
        </svg>
      </div>
      
      <style>{`
        .valvula-svg {
          transition: all 0.3s ease;
        }
        
        .valvula-onoff-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
          user-select: none;
          position: relative;
        }
        
        .valvula-onoff-wrapper[data-state="0"] .valvula-svg {
          opacity: 1;
        }
        
        .valvula-onoff-wrapper[data-state="1"] .valvula-svg {
          opacity: 1;
          filter: drop-shadow(0 0 4px #00FF09);
        }
        
        .valvula-onoff-wrapper[data-state="2"] .valvula-svg {
          opacity: 1;
          filter: drop-shadow(0 0 4px #FF0000);
          animation: valve-error 1s ease-in-out infinite alternate;
        }
        
        @keyframes valve-error {
          0% { 
            transform: scale(1);
          }
          100% { 
            transform: scale(1.05);
          }
        }
      `}</style>
    </ResponsiveWrapper>
  );
};

export default ValvulaOnOff;