// components/Eclusa/BasePortaJusante.tsx - COMPONENTE BASE PORTA JUSANTE (FIXO)
import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface BasePortaJusanteProps {
  editMode?: boolean;
}

export default function BasePortaJusante({
  editMode = false
}: BasePortaJusanteProps) {
  return (
    <ResponsiveWrapper 
      componentId="base-porta-jusante"
      editMode={editMode}
      defaultConfig={{
        xs: { x: 280, y: 300, width: 35, height: 140, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
        sm: { x: 330, y: 350, width: 38, height: 150, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
        md: { x: 380, y: 400, width: 40, height: 160, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
        lg: { x: 430, y: 450, width: 43, height: 176, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
        xl: { x: 480, y: 500, width: 46, height: 185, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
        '2xl': { x: 530, y: 550, width: 49, height: 195, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
        '3xl': { x: 580, y: 600, width: 52, height: 205, scale: 1, zIndex: 6, opacity: 1, rotation: 0 },
        '4xl': { x: 630, y: 650, width: 55, height: 215, scale: 1, zIndex: 6, opacity: 1, rotation: 0 }
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 43 176"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="object-contain"
        >
          <g filter="url(#filter0_dn_3478_694)">
            <path
              d="M38.4434 167.187L23.3059 167.109V65.4756H12.7448L10.6326 63.4178H16.2652V50.7285H10.6326V56.9017H5V1H28.9385V2.2515H25.0661L21.1937 4.42955V36.3244H25.0661H31.0507H38.4434V65.4756V167.187Z"
              fill="#D9D9D9"
            />
            <path
              d="M23.3059 65.4756H12.7448L10.6326 63.4178H16.2652V50.7285H10.6326V56.9017H5V1H28.9385V2.2515H25.0661L21.1937 4.42955V36.3244H25.0661M23.3059 65.4756V167.109L38.4434 167.187V65.4756M23.3059 65.4756H38.4434M38.4434 65.4756V36.3244H31.0507M31.0507 36.3244V50.7285M31.0507 36.3244H25.0661M31.0507 50.7285H32.1068V63.4178H25.0661V50.7285M31.0507 50.7285H25.0661M25.0661 36.3244V50.7285"
              stroke="black"
            />
          </g>
          
          <defs>
            <filter
              id="filter0_dn_3478_694"
              x="0.5"
              y="0.5"
              width="42.4453"
              height="175.188"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_3478_694"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feTurbulence
                type="fractalNoise"
                baseFrequency="1 1"
                stitchTiles="stitch"
                numOctaves="3"
                result="noise"
                seed="3187"
              />
              <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA
                  type="discrete"
                  tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
                />
              </feComponentTransfer>
              <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
              <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
              <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
              <feMerge result="effect2_noise_3478_694">
                <feMergeNode in="shape" />
                <feMergeNode in="color1" />
              </feMerge>
              <feBlend
                mode="normal"
                in="effect2_noise_3478_694"
                in2="effect1_dropShadow_3478_694"
                result="effect2_noise_3478_694"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </ResponsiveWrapper>
  );
}