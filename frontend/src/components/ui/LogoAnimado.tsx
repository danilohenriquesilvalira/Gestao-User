import React, { useState } from 'react';

interface EdpLogoProps {
  width?: number;
  height?: number;
  className?: string;
  animated?: boolean;
  effect?: 'rotate' | 'pulse' | 'glow' | 'bounce' | 'none';
}

export const EdpLogo: React.FC<EdpLogoProps> = ({ 
  width = 200, 
  height = 200, 
  className = "",
  animated = true,
  effect = 'pulse'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getAnimationClass = () => {
    if (!animated) return '';
    
    switch (effect) {
      case 'rotate':
        return 'animate-spin-slow';
      case 'pulse':
        return 'animate-pulse duration-[3s]';
      case 'glow':
        return isHovered ? 'animate-pulse duration-1000' : '';
      case 'bounce':
        return 'animate-bounce duration-[2s]';
      default:
        return '';
    }
  };

  const getFilterStyle = () => {
    if (effect === 'glow' && isHovered) {
      return 'drop-shadow(0 0 30px rgba(110, 51, 255, 0.6)) drop-shadow(0 0 60px rgba(0, 177, 235, 0.4))';
    }
    if (isHovered) {
      return 'drop-shadow(0 8px 32px rgba(110, 51, 255, 0.3))';
    }
    return 'none';
  };

  return (
    <div 
      className={`inline-block transition-all duration-500 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ filter: getFilterStyle() }}
    >
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 934 936" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`${getAnimationClass()} transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
      >
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M471.258 0.0288298C546.219 -1.04847 631.227 28.1194 708.209 78.6177L737 102.5L694.5 161.5L669.97 145.847C604.792 102.044 533.275 75.0385 471.258 72.8832C251.262 72.8832 72.9187 249.597 72.9187 467.585C72.9187 685.57 251.262 862.284 471.258 862.284V935.141C210.991 935.141 0 725.811 0 467.585C0 209.361 210.991 0.0288298 471.258 0.0288298Z" 
          fill="url(#paint0_linear_3228_740)"
        />
        <path 
          d="M217.459 476.132C193.084 583.551 299.008 766.956 488.488 782.09L490.958 710.582C377.381 694.796 270.197 611.131 289.673 477.406C304.567 402.32 383.745 316.425 476.921 335.535C534.954 350.129 585.352 399.1 573.371 459.517C554.547 522.608 499.503 521.193 463.5 506L427.5 569.5C492.589 600.538 609.44 596.212 642.703 468.78C661.193 376.88 595.674 298.345 501.506 268.815C400.887 238.426 256.981 295.865 217.459 476.132Z" 
          fill="url(#paint1_linear_3228_740)"
        />
        <path 
          d="M887.122 458.516C904.005 330.98 839.412 181.805 736.639 102L679.458 154.059C778.721 214.928 807.341 322.895 816.227 386.311C835.732 590.709 670.972 729.432 490.958 710.582C490.084 738.513 489.362 754.158 488.488 782.09C672.42 795.358 855.947 685.178 887.122 458.516Z" 
          fill="url(#paint2_linear_3228_740)"
        />
        <path 
          d="M672.192 488.513C676.169 406.365 617.062 293.649 507.092 293C399.127 294.666 349.148 361.533 348.008 441.645C347.36 495.303 385.376 575.704 479.345 583.256L481.567 511.94C451.317 504.81 414.974 482.397 418.299 438.595C423.386 385.152 463.069 361.259 503.759 360.792C573.04 362.554 604.674 443.778 601.712 485.27L672.192 488.513Z" 
          fill="url(#paint3_linear_3228_740)"
        />
        <path 
          d="M425 693.033C560.311 692.352 665.105 615.268 672.229 487.243L601.749 484C596.291 586.066 493.163 625.981 420.557 625.145C384.131 626.163 361.958 615.021 337.719 602.84L337.5 602.73L304 664.261C330.73 676.581 371.815 691.922 425 693.033Z" 
          fill="url(#paint4_linear_3228_740)"
        />
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M530.186 48.87C744.374 50.5145 933.718 209.364 933.718 467.585C933.718 725.811 724.736 935.14 466.94 935.14L428.523 933.2V860.862L466.94 862.81C684.756 862.81 861.327 685.858 861.327 467.585C860.505 237.802 690.406 118.33 530.186 118.33C317.304 118.33 222.864 281.116 222.864 388.398C222.864 497.534 271.122 559.44 337.556 603.006L304.131 664.49C195.178 599.178 153.694 502.621 152.527 387.161C150.059 226.775 293.782 48.0482 530.186 48.87Z" 
          fill="url(#paint5_linear_3228_740)"
        />
        
        <defs>
          <linearGradient id="paint0_linear_3228_740" x1="293.5" y1="889.5" x2="368.766" y2="935.141" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6E33FF"/>
            <stop offset="0.996215" stopColor="#00B1EB"/>
          </linearGradient>
          <linearGradient id="paint1_linear_3228_740" x1="429.917" y1="261.102" x2="174" y2="375" gradientUnits="userSpaceOnUse">
            <stop offset="0.502669" stopColor="#00FFFF"/>
            <stop offset="1" stopColor="#24CFFF"/>
          </linearGradient>
          <linearGradient id="paint2_linear_3228_740" x1="670.512" y1="733.5" x2="948.012" y2="265" gradientUnits="userSpaceOnUse">
            <stop offset="0.577598" stopColor="#00FFFF"/>
            <stop offset="1" stopColor="#6E33FF"/>
          </linearGradient>
          <linearGradient id="paint3_linear_3228_740" x1="637.465" y1="455" x2="469" y2="404" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22FF6C"/>
            <stop offset="0.783672" stopColor="#00FFFF"/>
          </linearGradient>
          <linearGradient id="paint4_linear_3228_740" x1="287" y1="503.5" x2="488.115" y2="693.033" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3BFF04"/>
            <stop offset="1" stopColor="#21FF6C"/>
          </linearGradient>
          <linearGradient id="paint5_linear_3228_740" x1="838.5" y1="635" x2="849.5" y2="702.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3BFF04"/>
            <stop offset="1" stopColor="#00B1EB"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Demo dos efeitos
export default function EdpLogoDemo() {
  const [currentEffect, setCurrentEffect] = useState<'rotate' | 'pulse' | 'glow' | 'bounce' | 'none'>('rotate');

  const effects = [
    { name: 'Rotação Moderna', value: 'rotate' as const },
    { name: 'Pulse', value: 'pulse' as const },
    { name: 'Glow', value: 'glow' as const },
    { name: 'Bounce', value: 'bounce' as const },
    { name: 'Estático', value: 'none' as const }
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <style jsx>{`
        @keyframes spin-smooth {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-smooth 8s linear infinite;
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          EDP Logo Oficial
        </h1>
        
        {/* Logo principal */}
        <div className="flex justify-center mb-8 bg-slate-800 rounded-xl p-8">
          <EdpLogo 
            width={300}
            height={300}
            effect={currentEffect}
          />
        </div>

        {/* Controles */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Efeitos</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {effects.map((effect) => (
              <button
                key={effect.value}
                onClick={() => setCurrentEffect(effect.value)}
                className={`p-3 rounded-lg transition-colors text-center ${
                  currentEffect === effect.value 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {effect.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tamanhos */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Tamanhos</h3>
          <div className="flex items-end justify-center space-x-8 bg-slate-700 rounded-lg p-6">
            <div className="text-center">
              <EdpLogo width={60} height={60} effect={currentEffect} />
              <p className="text-slate-400 text-sm mt-2">60px</p>
            </div>
            <div className="text-center">
              <EdpLogo width={100} height={100} effect={currentEffect} />
              <p className="text-slate-400 text-sm mt-2">100px</p>
            </div>
            <div className="text-center">
              <EdpLogo width={140} height={140} effect={currentEffect} />
              <p className="text-slate-400 text-sm mt-2">140px</p>
            </div>
          </div>
        </div>

        {/* Código de exemplo */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Implementação</h3>
          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 font-mono text-sm">
{`// Implementação simples
<EdpLogo 
  width={200}
  height={200}
  effect="${currentEffect}"
  animated={true}
/>

// Para navbar
<EdpLogo width={120} height={120} effect="pulse" />

// Para footer
<EdpLogo width={80} height={80} effect="none" />`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}