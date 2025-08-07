'use client';

import React, { useState, useEffect } from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface ContraPesoEsquerdoProps {
  editMode?: boolean;
  componentId?: string;
  posicaoInicial?: number;
  posicaoMaxima?: number;
  posicaoY?: number;
  nivel?: number;
  width?: number; // Vem do ResponsiveWrapper
  height?: number; // Vem do ResponsiveWrapper
}

const ContraPesoEsquerdo: React.FC<ContraPesoEsquerdoProps> = ({ 
  editMode = false,
  componentId = 'porta-jusante-contrapeso-esquerdo-default',
  posicaoInicial = 0,
  posicaoMaxima = 300,
  posicaoY = 0,
  nivel,
  width = 200, // Fallback se ResponsiveWrapper não injetar
  height = 700
}) => {
  const [aberturaInterna, setAberturaInterna] = useState(posicaoInicial);
  
  const abertura = nivel !== undefined ? nivel : aberturaInterna;
  
  const handleAberturaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAberturaInterna(Number(event.target.value));
  };
  
  const linhaHeight = abertura * 3;
  
  useEffect(() => {
    console.log('🔧 ContraPesoEsquerdo montado com ID:', componentId);
  }, [componentId]);
  
  return (
    <ResponsiveWrapper 
      componentId={componentId}
      editMode={editMode}
      defaultConfig={{
        xs: { x: 50, y: 50, width: 150, height: 500, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
        sm: { x: 100, y: 100, width: 200, height: 600, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
        md: { x: 150, y: 150, width: 250, height: 700, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
        lg: { x: 200, y: 200, width: 300, height: 800, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
        xl: { x: 250, y: 250, width: 350, height: 900, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
        '2xl': { x: 300, y: 300, width: 400, height: 1000, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
        '3xl': { x: 350, y: 350, width: 450, height: 1100, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
        '4xl': { x: 400, y: 400, width: 500, height: 1200, scale: 1, zIndex: 1, opacity: 1, rotation: 0 }
      }}
    >
      <div className={`flex items-center gap-4 w-full h-full ${editMode ? 'border-2 border-purple-500 bg-purple-50/20' : ''}`}>
        {/* Container do SVG escalado pelo ResponsiveWrapper */}
        <div className="relative w-full h-full">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 400"
            preserveAspectRatio="xMidYMax meet"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: `scale(${width / 200}, ${height / 600})` }}
          >
            {/* Linha preta */}
            <rect 
              x="46" 
              y="0" 
              width="8" 
              height={linhaHeight} 
              fill="black"
              style={{ transition: 'height 0.5s linear' }}
            />
            
            {/* Contrapeso SVG */}
            <g transform={`translate(20, ${linhaHeight + posicaoY})`} style={{ transition: 'transform 0.5s linear' }}>
              <path d="M8.79614 85.9591C3.15737 85.038 -0.00654874 83.7889 1.27065e-05 82.4863L59.4604 82.4947C59.4465 83.7972 57.0191 85.0405 51.3659 85.961C45.7127 86.8816 38.0525 87.3985 30.0697 87.3982C22.0869 87.3978 14.4349 86.8802 8.79614 85.9591Z" fill="url(#paint0_linear_1731_1450_esquerdo)"/>
              <path d="M8.79614 85.3097C3.15737 84.3886 -0.00654874 83.1395 1.27065e-05 81.8369L59.4604 81.8453C59.4465 83.1478 57.0191 84.3911 51.3659 85.3116C45.7127 86.2322 38.0525 86.7491 30.0697 86.7487C22.0869 86.7484 14.4349 86.2307 8.79614 85.3097Z" fill="url(#paint1_linear_1731_1450_esquerdo)"/>
              <path d="M59.4578 82.4669H0L0.145464 8.1416H59.4578V82.4669Z" fill="url(#paint2_linear_1731_1450_esquerdo)"/>
              <path d="M59.2763 9.05947C59.2763 9.32389 59.1413 9.62664 58.786 9.96697C58.4305 10.3076 57.8856 10.654 57.1498 10.995C55.6803 11.676 53.5302 12.299 50.8435 12.8256C45.4763 13.8777 38.0452 14.5311 29.8257 14.5311C21.6062 14.5311 14.1751 13.8777 8.80787 12.8256C6.12119 12.299 3.97102 11.676 2.50153 10.995C1.76573 10.654 1.2209 10.3076 0.865362 9.96697C0.510093 9.62664 0.375 9.32389 0.375 9.05947C0.375 8.79506 0.510093 8.49231 0.865362 8.15198C1.2209 7.8114 1.76573 7.46497 2.50153 7.12396C3.97102 6.44291 6.12119 5.81997 8.80787 5.29331C14.1751 4.24121 21.6062 3.58789 29.8257 3.58789C38.0452 3.58789 45.4763 4.24121 50.8435 5.29331C53.5302 5.81997 55.6803 6.44291 57.1498 7.12396C57.8856 7.46497 58.4305 7.8114 58.786 8.15198C59.1413 8.49231 59.2763 8.79506 59.2763 9.05947Z" fill="url(#paint3_linear_1731_1450_esquerdo)" stroke="#C0C0C0" strokeWidth="0.75"/>
              <ellipse cx="29.9464" cy="9.7094" rx="7.49716" ry="1.29924" fill="black"/>
              <rect x="25.5649" width="8.52162" height="10.2828" fill="black"/>
              <path d="M21.5498 55.9746C20.5537 55.9746 19.6748 55.7467 18.9131 55.291C18.1514 54.8288 17.5524 54.168 17.1162 53.3086C16.6865 52.4427 16.4717 51.4108 16.4717 50.2129V47.4395C16.4717 46.196 16.7158 45.1185 17.2041 44.207C17.6989 43.2956 18.376 42.5924 19.2354 42.0977C20.0947 41.5964 21.0745 41.3457 22.1748 41.3457C22.7087 41.3457 23.2002 41.3978 23.6494 41.502C24.1051 41.5996 24.5609 41.7461 25.0166 41.9414L24.5088 44.0312C24.0856 43.888 23.7113 43.7773 23.3857 43.6992C23.0602 43.6211 22.7054 43.582 22.3213 43.582C21.6833 43.582 21.1396 43.7285 20.6904 44.0215C20.2412 44.3079 19.9027 44.7214 19.6748 45.2617C19.4469 45.8021 19.3428 46.4466 19.3623 47.1953L19.3916 47.293C19.7236 46.9609 20.1338 46.7005 20.6221 46.5117C21.1104 46.3229 21.6572 46.2285 22.2627 46.2285C23.109 46.2285 23.8382 46.4336 24.4502 46.8438C25.0622 47.2539 25.5309 47.8105 25.8564 48.5137C26.182 49.2168 26.3447 50.0176 26.3447 50.916C26.3447 51.9056 26.1396 52.7812 25.7295 53.543C25.3258 54.3047 24.7627 54.9004 24.04 55.3301C23.3239 55.7598 22.4938 55.9746 21.5498 55.9746ZM21.4912 53.7871C21.9014 53.7871 22.2562 53.6634 22.5557 53.416C22.8551 53.1686 23.0863 52.8333 23.249 52.4102C23.4118 51.9805 23.4932 51.502 23.4932 50.9746C23.4932 50.2194 23.3044 49.6009 22.9268 49.1191C22.5557 48.6309 22.0251 48.3867 21.335 48.3867C21.055 48.3867 20.7848 48.4225 20.5244 48.4941C20.2705 48.5658 20.0394 48.6732 19.8311 48.8164C19.6292 48.9531 19.4567 49.1257 19.3135 49.334V50.2812C19.3135 51.0299 19.4046 51.6647 19.5869 52.1855C19.7757 52.7064 20.0329 53.1035 20.3584 53.377C20.6839 53.6504 21.0615 53.7871 21.4912 53.7871ZM32.8096 55.9746C31.2926 55.9746 30.0915 55.4896 29.2061 54.5195C28.3206 53.543 27.8779 52.1139 27.8779 50.2324V47.0977C27.8779 45.2227 28.3174 43.7969 29.1963 42.8203C30.0752 41.8372 31.2731 41.3457 32.79 41.3457C34.3005 41.3457 35.4984 41.8372 36.3838 42.8203C37.2757 43.7969 37.7217 45.2227 37.7217 47.0977V50.2324C37.7217 52.1139 37.279 53.543 36.3936 54.5195C35.5146 55.4896 34.32 55.9746 32.8096 55.9746ZM32.8096 53.7871C33.4801 53.7871 33.9912 53.5267 34.3428 53.0059C34.6943 52.485 34.8701 51.6517 34.8701 50.5059V46.8047C34.8701 45.6719 34.6911 44.8451 34.333 44.3242C33.9814 43.8034 33.4671 43.543 32.79 43.543C32.113 43.543 31.5986 43.8034 31.2471 44.3242C30.8955 44.8451 30.7197 45.6719 30.7197 46.8047V50.5059C30.7197 51.6517 30.8955 52.485 31.2471 53.0059C31.6051 53.5267 32.126 53.7871 32.8096 53.7871ZM43.4346 55.9746C42.4515 55.9746 41.693 55.7044 41.1592 55.1641C40.6318 54.6237 40.3682 53.7676 40.3682 52.5957V47.2051H38.9131V45.2031H40.3682V42.6152H43.21V45.2031H45.1533V47.2051H43.21V52.5859C43.21 52.9961 43.2946 53.2891 43.4639 53.4648C43.6396 53.6406 43.8773 53.7285 44.1768 53.7285C44.3395 53.7285 44.5088 53.7188 44.6846 53.6992C44.8669 53.6732 45.0231 53.6471 45.1533 53.6211L45.3975 55.6816C45.1045 55.7663 44.7855 55.8346 44.4404 55.8867C44.1019 55.9453 43.7666 55.9746 43.4346 55.9746Z" fill="black"/>
            </g>
            
            <defs>
              <linearGradient id="paint0_linear_1731_1450_esquerdo" x1="59.324" y1="82.899" x2="0.000263421" y2="82.9339" gradientUnits="userSpaceOnUse">
                <stop stopColor="#808080"/>
                <stop offset="0.5" stopColor="white"/>
                <stop offset="1" stopColor="#808080"/>
              </linearGradient>
              <linearGradient id="paint1_linear_1731_1450_esquerdo" x1="59.324" y1="82.2496" x2="0.000263421" y2="82.2845" gradientUnits="userSpaceOnUse">
                <stop stopColor="#808080"/>
                <stop offset="0.5" stopColor="white"/>
                <stop offset="1" stopColor="#808080"/>
              </linearGradient>
              <linearGradient id="paint2_linear_1731_1450_esquerdo" x1="59.3212" y1="14.5394" x2="-2.15862e-07" y2="14.5394" gradientUnits="userSpaceOnUse">
                <stop stopColor="#808080"/>
                <stop offset="0.5" stopColor="white"/>
                <stop offset="1" stopColor="#808080"/>
              </linearGradient>
              <linearGradient id="paint3_linear_1731_1450_esquerdo" x1="59.6513" y1="9.05947" x2="0" y2="9.05947" gradientUnits="userSpaceOnUse">
                <stop stopColor="#808080"/>
                <stop offset="0.5" stopColor="white"/>
                <stop offset="1" stopColor="#808080"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {editMode && (
          <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
            ContraPeso Esquerdo ({abertura}%)
          </div>
        )}
        
        {nivel === undefined && (
          <div className="flex flex-col items-center">
            <span className="text-white font-bold mb-1">Abertura</span>
            <input
              type="range"
              min="0"
              max="100"
              value={aberturaInterna}
              onChange={handleAberturaChange}
              className="cursor-pointer"
            />
            <span className="text-white mt-2 font-bold">{aberturaInterna}%</span>
          </div>
        )}
      </div>
    </ResponsiveWrapper>
  );
};

export default ContraPesoEsquerdo;