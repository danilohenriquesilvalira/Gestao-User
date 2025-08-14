import React, { useState } from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface ContraPesoMontanteEsquerdoProps {
  editMode?: boolean;
  componentId?: string;
  nivel?: number; // Prop para receber o valor do WebSocket (0-100)
}

const ContraPeso_MontanteEsquerdo: React.FC<ContraPesoMontanteEsquerdoProps> = ({ 
  editMode = false,
  componentId = 'contrapeso-montante-esquerdo',
  nivel: nivelExterno 
}) => {
  // Estado interno para quando não recebe o valor via prop
  const [nivelInterno, setNivelInterno] = useState(0); // Estado inicial: 0% (posição inicial)

  // Usa o valor externo se fornecido, senão usa o interno
  const nivel = nivelExterno !== undefined ? nivelExterno : nivelInterno;

  const handleNivelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNivelInterno(Number(event.target.value));
  };

  // Altura da linha que se estende acima do contrapeso
  const linhaHeight = nivel * 6; // Multiplicador para o movimento
  
  // Altura do SVG dinâmica - sempre garante espaço suficiente
  const svgHeight = Math.max(800, linhaHeight + 300); // Mais espaço para evitar cortes
  
  // Altura total da linha (sempre conecta ao contrapeso)
  const alturaLinhaTotal = linhaHeight + 136; // 136 é a altura do contrapeso

  return (
    <ResponsiveWrapper
      componentId={componentId}
      editMode={editMode}
      defaultConfig={{
        xs: { x: 50, y: 150, width: 120, height: 400, scale: 0.6, zIndex: 7, opacity: 1, rotation: 0 },
        sm: { x: 50, y: 200, width: 140, height: 450, scale: 0.65, zIndex: 7, opacity: 1, rotation: 0 },
        md: { x: 50, y: 250, width: 160, height: 500, scale: 0.7, zIndex: 7, opacity: 1, rotation: 0 },
        lg: { x: 50, y: 300, width: 180, height: 550, scale: 0.75, zIndex: 7, opacity: 1, rotation: 0 },
        xl: { x: 50, y: 350, width: 200, height: 600, scale: 0.8, zIndex: 7, opacity: 1, rotation: 0 },
        '2xl': { x: 50, y: 400, width: 220, height: 650, scale: 0.85, zIndex: 7, opacity: 1, rotation: 0 },
        '3xl': { x: 50, y: 450, width: 240, height: 700, scale: 0.9, zIndex: 7, opacity: 1, rotation: 0 },
        '4xl': { x: 50, y: 500, width: 260, height: 750, scale: 0.95, zIndex: 7, opacity: 1, rotation: 0 }
      }}
    >
      <div className={`w-full h-full flex flex-col items-center justify-center ${editMode ? 'border-2 border-purple-500 bg-purple-50/20' : ''}`}>
        {/* Container do SVG completo - agora totalmente responsivo */}
        <div className="relative w-full h-full flex items-center gap-4">
          <div className="relative w-full h-full">
            <svg 
              width="100%" 
              height="100%" 
              viewBox={`0 0 91 ${svgHeight}`} 
              preserveAspectRatio="xMidYMid meet"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Linha preta que se estende para cima - sempre conecta ao contrapeso */}
              <rect 
                x="42.5" 
                y="0" 
                width="5" 
                height={alturaLinhaTotal} 
                fill="black"
                style={{ transition: 'height 0.5s linear' }}
              />
              
              {/* Contrapeso SVG - posicionado no final da linha */}
              <g 
                transform={`translate(0, ${linhaHeight})`} 
                style={{ transition: 'transform 0.5s linear' }}
              >
                {/* SVG do contrapeso */}
                <path d="M13.4174 133.751C4.81565 132.319 -0.01051 130.376 1.93841e-05 128.35L90.7087 128.349C90.687 130.376 86.9834 132.311 78.3589 133.745C69.7343 135.178 58.0484 135.985 45.8703 135.986C33.6923 135.987 22.0191 135.183 13.4174 133.751Z" fill="url(#paint0_linear_esquerdo)"/>
                <path d="M13.4174 132.74C4.81565 131.308 -0.01051 129.365 1.93841e-05 127.338L90.7087 127.338C90.687 129.364 86.9834 131.299 78.3589 132.733C69.7343 134.167 58.0484 134.973 45.8703 134.974C33.6923 134.975 22.0191 134.171 13.4174 132.74Z" fill="url(#paint1_linear_esquerdo)"/>
                <path d="M90.7048 128.319H0L0.22191 12.6689H90.7048V128.319Z" fill="url(#paint2_linear_esquerdo)"/>
                <path d="M90.625 14.0973C90.625 14.5889 90.3775 15.1115 89.8135 15.6625C89.249 16.2141 88.3962 16.7642 87.2641 17.2993C85.0019 18.3687 81.7045 19.3416 77.5998 20.1623C69.3967 21.8025 58.0475 22.8196 45.5 22.8196C32.9525 22.8196 21.6033 21.8025 13.4002 20.1623C9.29551 19.3416 5.99809 18.3687 3.73588 17.2993C2.60382 16.7642 1.75104 16.2141 1.18647 15.6625C0.622521 15.1115 0.375 14.5889 0.375 14.0973C0.375 13.6057 0.622521 13.0831 1.18647 12.5321C1.75104 11.9805 2.60382 11.4304 3.73588 10.8952C5.99809 9.82587 9.29551 8.85294 13.4002 8.03226C21.6033 6.39212 32.9525 5.375 45.5 5.375C58.0475 5.375 69.3967 6.39212 77.5998 8.03226C81.7045 8.85294 85.0019 9.82587 87.2641 10.8952C88.3962 11.4304 89.249 11.9805 89.8135 12.5321C90.3775 13.0831 90.625 13.6057 90.625 14.0973Z" fill="url(#paint3_linear_esquerdo)" stroke="#C0C0C0" strokeWidth="0.75"/>
                <ellipse cx="45.6842" cy="15.1085" rx="11.4372" ry="2.02162" fill="black"/>
                <path d="M24.7578 88.6504V86.2041L31.7012 78.6455C32.4434 77.8057 33.0244 77.0781 33.4443 76.4629C33.874 75.8379 34.1816 75.2617 34.3672 74.7344C34.5527 74.207 34.6455 73.6846 34.6455 73.167C34.6455 72.2295 34.377 71.4482 33.8398 70.8232C33.3027 70.1885 32.5801 69.8711 31.6719 69.8711C30.4414 69.8711 29.5283 70.2275 28.9326 70.9404C28.3369 71.6436 28.0391 72.6055 28.0391 73.8262H24.4648L24.4355 73.7383C24.4062 72.4785 24.6797 71.3408 25.2559 70.3252C25.832 69.3096 26.667 68.5039 27.7607 67.9082C28.8545 67.3125 30.1533 67.0146 31.6572 67.0146C33.0244 67.0146 34.2061 67.2734 35.2021 67.791C36.1982 68.3086 36.9697 69.0264 37.5166 69.9443C38.0635 70.8623 38.3369 71.9316 38.3369 73.1523C38.3369 73.7773 38.249 74.3779 38.0732 74.9541C37.8975 75.5205 37.6338 76.1016 37.2822 76.6973C36.9307 77.2832 36.4814 77.9082 35.9346 78.5723C35.3975 79.2363 34.7627 79.9639 34.0303 80.7549L29.4746 85.7354L29.5039 85.8086H39.0107V88.6504H24.7578ZM48.6787 88.958C47.4092 88.958 46.2617 88.7285 45.2363 88.2695C44.2109 87.8008 43.4004 87.1221 42.8047 86.2334C42.2188 85.3447 41.9404 84.2754 41.9697 83.0254L41.999 82.9375L45.4854 82.8203C45.4854 83.8555 45.7783 84.666 46.3643 85.252C46.9502 85.8281 47.7217 86.1162 48.6787 86.1162C49.7725 86.1162 50.5977 85.7305 51.1543 84.959C51.7109 84.1777 51.9893 83.1377 51.9893 81.8389C51.9893 80.5596 51.6963 79.5195 51.1104 78.7188C50.5342 77.918 49.7041 77.5176 48.6201 77.5176C47.6729 77.5176 46.9648 77.6787 46.4961 78.001C46.0371 78.3232 45.7002 78.7822 45.4854 79.3779L42.292 79.1289L43.5225 67.3223H54.9043V70.3838H46.584L45.9541 75.7598C46.2275 75.5547 46.5352 75.374 46.877 75.2178C47.2188 75.0518 47.5947 74.9199 48.0049 74.8223C48.415 74.7246 48.8594 74.6709 49.3379 74.6611C50.666 74.6416 51.7988 74.9199 52.7363 75.4961C53.6836 76.0625 54.4111 76.8828 54.9189 77.957C55.4268 79.0312 55.6807 80.3057 55.6807 81.7803C55.6807 83.1865 55.4121 84.4316 54.875 85.5156C54.3379 86.5898 53.5469 87.4346 52.502 88.0498C51.4668 88.6553 50.1924 88.958 48.6787 88.958ZM63.9424 88.9287C62.5947 88.9287 61.5449 88.5527 60.793 87.8008C60.041 87.0391 59.665 85.8281 59.665 84.168V75.4375H57.3506V72.8008H59.665V68.9482H63.3418V72.8008H66.4766V75.4375H63.3418V84.168C63.3418 84.8418 63.4785 85.335 63.752 85.6475C64.0352 85.9502 64.416 86.1016 64.8945 86.1016C65.168 86.1016 65.4707 86.0771 65.8027 86.0283C66.1445 85.9795 66.418 85.9307 66.623 85.8818L67.0039 88.4746C66.5742 88.6016 66.0811 88.709 65.5244 88.7969C64.9775 88.8848 64.4502 88.9287 63.9424 88.9287Z" fill="black"/>
                <rect x="39" width="13" height="16" fill="black"/>

                {/* Definições para os gradientes */}
                <defs>
                  <linearGradient id="paint0_linear_esquerdo" x1="90.5005" y1="128.979" x2="0.000210953" y2="129.008" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#808080"/>
                    <stop offset="0.5" stopColor="white"/>
                    <stop offset="1" stopColor="#808080"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_esquerdo" x1="90.5005" y1="127.967" x2="0.000210953" y2="127.996" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#808080"/>
                    <stop offset="0.5" stopColor="white"/>
                    <stop offset="1" stopColor="#808080"/>
                  </linearGradient>
                  <linearGradient id="paint2_linear_esquerdo" x1="90.4964" y1="22.624" x2="-3.29304e-07" y2="22.624" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#808080"/>
                    <stop offset="0.5" stopColor="white"/>
                    <stop offset="1" stopColor="#808080"/>
                  </linearGradient>
                  <linearGradient id="paint3_linear_esquerdo" x1="91" y1="14.0973" x2="0" y2="14.0973" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#808080"/>
                    <stop offset="0.5" stopColor="white"/>
                    <stop offset="1" stopColor="#808080"/>
                  </linearGradient>
                </defs>
              </g>
            </svg>
          </div>
          
          {/* Controle deslizante ao lado - só exibido quando usado isoladamente */}
          {nivelExterno === undefined && (
            <div className="flex flex-col items-center">
              <span className="text-black font-bold mb-1">Nível Esq</span>
              <input
                type="range"
                min="0"
                max="100"
                value={nivelInterno}
                onChange={handleNivelChange}
                className="cursor-pointer"
                style={{ 
                  writingMode: 'bt-lr' as any, 
                  WebkitAppearance: 'slider-vertical',
                  transform: 'rotate(270deg)',
                  height: '100px'
                }}
              />
              <span className="text-black mt-2 font-bold">{nivelInterno}%</span>
            </div>
          )}
        </div>

        {editMode && (
          <div className="absolute inset-0 border-2 border-dashed border-purple-400 bg-purple-50/20 rounded flex items-center justify-center pointer-events-none">
          </div>
        )}
      </div>
    </ResponsiveWrapper>
  );
};

export default ContraPeso_MontanteEsquerdo;
