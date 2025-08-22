import { useState, useEffect } from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface NivelCaldeiraProps {
  nivel?: number;
  scale?: number;
  editMode?: boolean;
  websocketValue?: number | null;
  width?: number;
  height?: number;
  componentWidth?: number;
  componentHeight?: number;
}

export default function NivelCaldeira({
  nivel = 50,
  editMode = false,
  websocketValue = null,
  componentWidth,
  componentHeight
}: NivelCaldeiraProps) {
  const [nivelAtual, setNivelAtual] = useState(nivel);
  const [isManualControl] = useState(false);

  useEffect(() => {
    if (websocketValue !== null && !isManualControl) {
      setNivelAtual(websocketValue);
    }
  }, [websocketValue, isManualControl]);

  return (
    <ResponsiveWrapper 
      componentId="nivel-caldeira"
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
          width={componentWidth || 687}
          height={componentHeight || 158}
          viewBox="0 0 687 158"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: 'none',
            transformOrigin: 'top left'
          }}
        >
          <defs>
            <clipPath id="nivelCaldeiraClip">
              <rect x="0" y={158 - (nivelAtual / 100) * 158} width="687" height={(nivelAtual / 100) * 158} />
            </clipPath>
          </defs>
          <path
            d="M0 83.5134V0.0134258H16H25L686.5 0V157.013H674.5H673H633.5H632.5H11.5L3 144.513V88.5134L0 83.5134Z"
            fill={isManualControl ? "#FF6B00" : "#1E00FF"}
            clipPath="url(#nivelCaldeiraClip)"
            style={{ transition: 'all 0.5s ease-in-out' }}
          />
        </svg>
      </div>
    </ResponsiveWrapper>
  );
}