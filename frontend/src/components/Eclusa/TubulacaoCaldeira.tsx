// components/Eclusa/TubulacaoCaldeira.tsx - COMPONENTE TUBULAÇÃO CALDEIRA
import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface TubulacaoCaldeiraProps {
  editMode?: boolean;
}

export default function TubulacaoCaldeira({
  editMode = false
}: TubulacaoCaldeiraProps) {
  return (
    <ResponsiveWrapper 
      componentId="tubulacao-caldeira"
      editMode={editMode}
      defaultConfig={{
        xs: { x: 150, y: 250, width: 300, height: 30, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
        sm: { x: 200, y: 300, width: 350, height: 35, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
        md: { x: 250, y: 350, width: 400, height: 40, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
        lg: { x: 300, y: 400, width: 450, height: 45, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
        xl: { x: 350, y: 450, width: 500, height: 50, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
        '2xl': { x: 400, y: 500, width: 550, height: 55, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
        '3xl': { x: 450, y: 550, width: 600, height: 60, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
        '4xl': { x: 500, y: 600, width: 650, height: 65, scale: 1, zIndex: 6, opacity: 1, rotation: 0 }
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1020 102"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="object-contain"
        >
          <path
            d="M8 0C8.00182 45.0517 34.7931 44.866 34.7931 44.866H84.721H117.759C117.759 44.866 121.6 44.6803 121.985 45.0517C122.369 45.4231 166.463 64.609 166.463 64.609H329.776C329.776 64.609 329.776 45.8318 349.103 45.8318H382.567M329.761 64.6433C329.761 64.6433 329.776 83.7969 349.475 83.7969H381.862"
            stroke="#0000FF"
            strokeWidth="15"
          />
          <path
            d="M437.983 64.6595C437.983 64.6595 438.196 64.6595 470.066 64.6595C501.936 64.6595 501.75 64.6595 501.75 23M437.983 64.6595C437.983 64.6595 438.54 83.5048 418.036 83.5048H386M437.983 64.6595C437.983 64.6595 439.244 45.1987 418.74 45.1987H386"
            stroke="#CBCBCB"
            strokeWidth="15"
          />
          <path
            d="M565.607 65.606C565.607 65.606 565.394 65.606 533.524 65.606C501.653 65.606 501.84 65.606 501.84 23.9453M565.607 65.606C565.607 65.606 565.05 84.4518 585.555 84.4518H617.59M565.607 65.606C565.607 65.606 564.346 46.1446 584.85 46.1446H617.59"
            stroke="#0000FF"
            strokeWidth="15"
          />
          <path
            d="M673.104 65.299C673.104 65.299 736.438 65.6704 740.938 65.6704H970.817C970.817 65.6704 1011.65 65.6704 1011.65 26M673.104 65.299C673.104 65.299 673.66 84.1448 653.204 84.1448H621.245M673.104 65.299C673.104 65.299 674.362 45.8376 653.906 45.8376H621.245"
            stroke="#CBCBCB"
            strokeWidth="15"
          />
          
          {/* Válvulas vermelhas */}
          <g filter="url(#filter0_d_3302_626)">
            <rect x="382" y="35" width="4.22443" height="20.5217" fill="#FF7777"/>
            <rect x="382.1" y="35.1" width="4.02443" height="20.3217" stroke="black" strokeWidth="0.2"/>
          </g>
          <g filter="url(#filter1_d_3302_626)">
            <rect x="382" y="73" width="4.22443" height="20.5217" fill="#FF7777"/>
            <rect x="382.1" y="73.1" width="4.02443" height="20.3217" stroke="black" strokeWidth="0.2"/>
          </g>
          <g filter="url(#filter2_d_3302_626)">
            <rect x="617" y="35" width="4.22443" height="20.5217" fill="#FF7777"/>
            <rect x="617.1" y="35.1" width="4.02443" height="20.3217" stroke="black" strokeWidth="0.2"/>
          </g>
          <g filter="url(#filter3_d_3302_626)">
            <rect x="617" y="73" width="4.22443" height="20.5217" fill="#FF7777"/>
            <rect x="617.1" y="73.1" width="4.02443" height="20.3217" stroke="black" strokeWidth="0.2"/>
          </g>
          
          {/* Filtros para sombras */}
          <defs>
            <filter id="filter0_d_3302_626" x="378" y="35" width="12.2227" height="28.5234" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="4"/>
              <feGaussianBlur stdDeviation="2"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3302_626"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3302_626" result="shape"/>
            </filter>
            <filter id="filter1_d_3302_626" x="378" y="73" width="12.2227" height="28.5234" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="4"/>
              <feGaussianBlur stdDeviation="2"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3302_626"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3302_626" result="shape"/>
            </filter>
            <filter id="filter2_d_3302_626" x="613" y="35" width="12.2227" height="28.5234" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="4"/>
              <feGaussianBlur stdDeviation="2"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3302_626"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3302_626" result="shape"/>
            </filter>
            <filter id="filter3_d_3302_626" x="613" y="73" width="12.2227" height="28.5234" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="4"/>
              <feGaussianBlur stdDeviation="2"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3302_626"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3302_626" result="shape"/>
            </filter>
          </defs>
        </svg>
      </div>
    </ResponsiveWrapper>
  );
}