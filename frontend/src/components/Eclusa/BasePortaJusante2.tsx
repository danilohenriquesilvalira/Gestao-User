// components/Eclusa/BasePortaJusante2.tsx - COMPONENTE BASE PORTA JUSANTE 2 (FIXO)
import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface BasePortaJusante2Props {
  editMode?: boolean;
}

export default function BasePortaJusante2({
  editMode = false
}: BasePortaJusante2Props) {
  return (
    <ResponsiveWrapper 
      componentId="base-porta-jusante-2"
      editMode={editMode}
      defaultConfig={{
        xs: { x: 320, y: 280, width: 20, height: 90, scale: 1, zIndex: 5, opacity: 1, rotation: 0 },
        sm: { x: 370, y: 330, width: 22, height: 95, scale: 1, zIndex: 5, opacity: 1, rotation: 0 },
        md: { x: 420, y: 380, width: 24, height: 100, scale: 1, zIndex: 5, opacity: 1, rotation: 0 },
        lg: { x: 470, y: 430, width: 25, height: 111, scale: 1, zIndex: 5, opacity: 1, rotation: 0 },
        xl: { x: 520, y: 480, width: 27, height: 118, scale: 1, zIndex: 5, opacity: 1, rotation: 0 },
        '2xl': { x: 570, y: 530, width: 29, height: 125, scale: 1, zIndex: 5, opacity: 1, rotation: 0 },
        '3xl': { x: 620, y: 580, width: 31, height: 132, scale: 1, zIndex: 5, opacity: 1, rotation: 0 },
        '4xl': { x: 670, y: 630, width: 33, height: 139, scale: 1, zIndex: 5, opacity: 1, rotation: 0 }
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 25 111"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="object-contain"
        >
          <g filter="url(#filter0_d_3480_696)">
            <path
              d="M4.99827 1H19.7852V102.24H4.99827V1Z"
              fill="#808080"
              stroke="black"
              strokeWidth="0.5"
              strokeMiterlimit="22.9256"
            />
            
            {/* Seções com gradientes */}
            <rect
              width="14.7307"
              height="12.5958"
              transform="matrix(-1 0 0 1 19.7852 64.2656)"
              fill="url(#paint0_linear_3480_696)"
            />
            <rect
              width="14.7855"
              height="11.629"
              transform="matrix(-1 0 0 1 19.7852 1.6875)"
              fill="url(#paint1_linear_3480_696)"
            />
            <rect
              width="14.7307"
              height="12.5958"
              transform="matrix(-1 0 0 1 19.7852 26.2891)"
              fill="url(#paint2_linear_3480_696)"
            />
            <rect
              width="14.7307"
              height="15.4158"
              transform="matrix(-1 0 0 1 19.7852 50.1641)"
              fill="url(#paint3_linear_3480_696)"
            />
            <rect
              width="14.7307"
              height="15.4158"
              transform="matrix(-1 0 0 1 19.7852 76.1094)"
              fill="url(#paint4_linear_3480_696)"
            />
            <rect
              width="14.7307"
              height="13.9118"
              transform="matrix(-1 0 0 1 19.7852 13.2266)"
              fill="url(#paint5_linear_3480_696)"
            />
            <rect
              width="14.7307"
              height="12.5958"
              transform="matrix(-1 0 0 1 19.7852 38.9766)"
              fill="url(#paint6_linear_3480_696)"
            />
            <rect
              width="14.7855"
              height="12.313"
              transform="matrix(-1 0 0 1 19.7852 89.2422)"
              fill="url(#paint7_linear_3480_696)"
            />
          </g>
          
          <defs>
            <filter
              id="filter0_d_3480_696"
              x="0.75"
              y="0.75"
              width="23.2852"
              height="109.742"
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
                result="effect1_dropShadow_3480_696"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_3480_696"
                result="shape"
              />
            </filter>
            
            {/* Gradientes lineares */}
            <linearGradient
              id="paint0_linear_3480_696"
              x1="14.7307"
              y1="6.29792"
              x2="0"
              y2="6.29792"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#241E25" />
              <stop offset="1" stopColor="#FEFEFE" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_3480_696"
              x1="0"
              y1="5.81448"
              x2="14.7855"
              y2="5.81448"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#241E25" />
              <stop offset="1" stopColor="#FEFEFE" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_3480_696"
              x1="0"
              y1="6.29792"
              x2="14.7307"
              y2="6.29792"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#241E25" />
              <stop offset="1" stopColor="#FEFEFE" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_3480_696"
              x1="0"
              y1="7.70791"
              x2="14.7307"
              y2="7.70791"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#241E25" />
              <stop offset="1" stopColor="#FEFEFE" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_3480_696"
              x1="0"
              y1="7.70791"
              x2="14.7307"
              y2="7.70791"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#241E25" />
              <stop offset="1" stopColor="#FEFEFE" />
            </linearGradient>
            <linearGradient
              id="paint5_linear_3480_696"
              x1="14.7307"
              y1="6.95592"
              x2="0"
              y2="6.95592"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#241E25" />
              <stop offset="1" stopColor="#FEFEFE" />
            </linearGradient>
            <linearGradient
              id="paint6_linear_3480_696"
              x1="14.7307"
              y1="6.29792"
              x2="0"
              y2="6.29792"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#241E25" />
              <stop offset="1" stopColor="#FEFEFE" />
            </linearGradient>
            <linearGradient
              id="paint7_linear_3480_696"
              x1="14.7855"
              y1="6.15651"
              x2="0"
              y2="6.15651"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#241E25" />
              <stop offset="1" stopColor="#FEFEFE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </ResponsiveWrapper>
  );
}