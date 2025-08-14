
import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

export interface CilindroEnchimentoProps {
  estado?: boolean | number; // Aceita boolean ou número (0/1)
  side?: 'direito' | 'esquerdo';
  componentWidth?: number;
  componentHeight?: number;
  className?: string;
  editMode?: boolean;
  componentId?: string;
}

const CilindroEnchimento: React.FC<CilindroEnchimentoProps> = ({ 
  estado = false,
  side = 'direito',
  componentWidth,
  componentHeight,
  className = '',
  editMode = false,
  componentId = `cilindro-enchimento-${side}`
}) => {
  
  // Converter o estado para boolean caso seja número (0 = false, 1 = true)
  const estadoBoolean = typeof estado === 'number' ? Boolean(estado) : estado;
  
  // Define a cor do retângulo de acordo com o estado
  const corRetangulo = estadoBoolean ? "#FC6500" : "#753E00";
  
  // Configurações padrão para cada lado
  const getDefaultPositions = () => {
    const baseY = 100;
    const leftX = side === 'esquerdo' ? 150 : 1350;
    
    return {
      xs: { x: leftX - 400, y: baseY, width: 80, height: 280, scale: 1, zIndex: 4, opacity: 1, rotation: 0 },
      sm: { x: leftX - 300, y: baseY, width: 90, height: 300, scale: 1, zIndex: 4, opacity: 1, rotation: 0 },
      md: { x: leftX - 200, y: baseY, width: 100, height: 320, scale: 1, zIndex: 4, opacity: 1, rotation: 0 },
      lg: { x: leftX, y: baseY, width: 108, height: 340, scale: 1, zIndex: 4, opacity: 1, rotation: 0 },
      xl: { x: leftX + 100, y: baseY, width: 120, height: 360, scale: 1, zIndex: 4, opacity: 1, rotation: 0 },
      '2xl': { x: leftX + 200, y: baseY, width: 130, height: 380, scale: 1, zIndex: 4, opacity: 1, rotation: 0 },
      '3xl': { x: leftX + 300, y: baseY, width: 140, height: 400, scale: 1, zIndex: 4, opacity: 1, rotation: 0 },
      '4xl': { x: leftX + 400, y: baseY, width: 150, height: 420, scale: 1, zIndex: 4, opacity: 1, rotation: 0 }
    };
  };

  return (
    <ResponsiveWrapper 
      componentId={componentId}
      editMode={editMode}
      defaultConfig={getDefaultPositions()}
    >
      <div className="cilindro-enchimento-wrapper" style={{ 
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
          viewBox="0 0 108 378" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: side === 'esquerdo' ? 'scaleX(-1)' : 'none',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          }}
        >
          {/* Retângulo central - muda de cor conforme o estado */}
          <rect 
            x="16" 
            y="25" 
            width="76" 
            height="263" 
            fill={corRetangulo} 
            stroke="black" 
            strokeWidth="2"
          />
          
          {/* Elementos fixos que sempre aparecem com as mesmas cores */}
          <path d="M96 24.5V20.5H99.5V5H96V1H12V5H8.5V20.5H12.5L12.5 24.5H90.0001H96Z" fill="black" stroke="black"/>
          <path d="M8 20.5V5H1V20.5H8Z" fill="#900000" stroke="#900000"/>
          <path d="M107 20.5V5H100V20.5H107Z" fill="#900000" stroke="#900000"/>
          <path d="M12.5 377.5V313H96L96.5 377.5H12.5Z" fill="black" stroke="#737373"/>
          <path d="M96 312.5V308.5H99.5V293H96V289H12V293H8.5V308.5H12.5L12.5 312.5H90.0001H96Z" fill="black" stroke="black"/>
          <path d="M8 308.5V293H1V308.5H8Z" fill="#900000" stroke="#900000"/>
          <path d="M107 308.5V293H100V308.5H107Z" fill="#900000" stroke="#900000"/>
        </svg>
      </div>
    </ResponsiveWrapper>
  );
};

export default CilindroEnchimento;

// Exemplo de uso:
// <CilindroEnchimento estado={0} /> -> Retângulo marrom (#753E00)
// <CilindroEnchimento estado={1} /> -> Retângulo laranja (#FC6500)
// <CilindroEnchimento estado={false} /> -> Retângulo marrom (#753E00)
// <CilindroEnchimento estado={true} /> -> Retângulo laranja (#FC6500)
