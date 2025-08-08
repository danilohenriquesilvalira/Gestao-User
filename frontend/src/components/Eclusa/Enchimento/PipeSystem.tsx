'use client';

import React from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

export interface PipeSystemProps {
  pipeStates?: {[key: string]: 0 | 1}; // 0 = inativo, 1 = ativo
  width?: number;
  height?: number;
  className?: string;
  editMode?: boolean;
}

const PipeSystem: React.FC<PipeSystemProps> = ({ 
  pipeStates = {},
  width = 1278, 
  height = 424, 
  className = '',
  editMode = false
}) => {
  // Função para obter o estado do pipe
  const getPipeState = (pipeId: string): 0 | 1 => {
    return pipeStates[pipeId] || 0;
  };

  // Cores baseadas no estado com animação
  const getColor = (pipeId: string): string => {
    const state = getPipeState(pipeId);
    return state === 1 ? '#FC6500' : '#753E00'; // Laranja animado se ativo, marrom se inativo
  };

  // SVG do sistema de tubulações com animação de cores
  const PipeSystemSVG = () => (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 1278 424" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`pipe-system ${className}`}
    >
      {/* Pipe 1 */}
      <path 
        id="pipe1"
        d="M416.5 285.5L416.5 422.5" 
        stroke={getColor('pipe1')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe1') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 2 */}
      <path 
        id="pipe2"
        d="M395 200H442L442.5 280.5H398" 
        stroke={getColor('pipe2')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe2') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 3 */}
      <path 
        id="pipe3"
        d="M202 319H216.5M442.5 15H287.5V319H248.5M442.5 15V180.5H395.5M442.5 15H489V32.5M489 50V56V61.5" 
        stroke={getColor('pipe3')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe3') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 4 */}
      <path 
        id="pipe4"
        d="M202.5 30.5H239V5H5V368.5H353V280.5H368.711" 
        stroke={getColor('pipe4')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe4') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 5 */}
      <path 
        id="pipe5"
        d="M96 31.5H51V287.5V318.5H96" 
        stroke={getColor('pipe5')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe5') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 6 - Parte 1 */}
      <path 
        id="pipe6_part1"
        d="M31.5 319.5H22.5V348M320 348V180H357.5" 
        stroke={getColor('pipe6')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe6') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 6 - Parte 2 */}
      <path 
        id="pipe6_part2"
        d="M31.5 319.5H22.5V349.5H259.5M357.5 180H320V349.5H291" 
        stroke={getColor('pipe6')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe6') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 7 */}
      <path 
        id="pipe7"
        d="M488.5 85.5L488.5 142" 
        stroke={getColor('pipe7')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe7') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 8 */}
      <path 
        id="pipe8"
        d="M489 163.071V198.997" 
        stroke={getColor('pipe8')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe8') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 9 */}
      <path 
        id="pipe9"
        d="M488.5 236.5V399" 
        stroke={getColor('pipe9')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe9') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 10 */}
      <path 
        id="pipe10"
        d="M487.5 15H539.5V32.5M539.5 50C539.5 54.491 539.5 57.009 539.5 61.5" 
        stroke={getColor('pipe10')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe10') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 11 */}
      <path 
        id="pipe11"
        d="M537.5 15H589.5V32M509 199V178H589.5V86M589.5 61.5C589.5 56.8137 589.5 54.1863 589.5 49.5" 
        stroke={getColor('pipe11')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe11') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 12 */}
      <path 
        id="pipe12"
        d="M538.5 86V112H508.5V126" 
        stroke={getColor('pipe12')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe12') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 13 */}
      <path 
        id="pipe13"
        d="M861 286.536V423.036" 
        stroke={getColor('pipe13')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe13') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 14 */}
      <path 
        id="pipe14"
        d="M882.5 200.536H835.5V281.536H885.5" 
        stroke={getColor('pipe14')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe14') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 15 */}
      <path 
        id="pipe15"
        d="M835 15.5361H990V320.036H1030M835 15.5361V181.036H882M835 15.5361H788.5V33.0361M1057 320.036H1075M788.5 61.5V49.5" 
        stroke={getColor('pipe15')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe15') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 16 */}
      <path 
        id="pipe16"
        d="M1075 31.0361H1038.5V5.53613H1272.5V369.036H924.5V281.036H908.789" 
        stroke={getColor('pipe16')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe16') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 17 */}
      <path 
        id="pipe17"
        d="M1181 31H1226.5V288.036V319.036H1181.5" 
        stroke={getColor('pipe17')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe17') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 18 */}
      <path 
        id="pipe18"
        d="M1246 320.036H1255V349.5H1018.5M920 180.536H957.5V349.5H986.5" 
        stroke={getColor('pipe18')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe18') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 19 */}
      <path 
        id="pipe19"
        d="M789 86V126.536" 
        stroke={getColor('pipe19')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe19') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 20 */}
      <path 
        id="pipe20"
        d="M788.5 163.608V199.533" 
        stroke={getColor('pipe20')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe20') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 21 */}
      <path 
        id="pipe21"
        d="M789 236V399.536" 
        stroke={getColor('pipe21')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe21') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 22 */}
      <path 
        id="pipe22"
        d="M790 15.5361H738V32M738 62V50" 
        stroke={getColor('pipe22')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe22') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 23 */}
      <path 
        id="pipe23"
        d="M740 15.5361H688V32M768.5 199.536V178.536H688V86M688 61.5V49.5" 
        stroke={getColor('pipe23')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe23') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
      
      {/* Pipe 24 */}
      <path 
        id="pipe24"
        d="M739 85.5V112.536H769V126.536" 
        stroke={getColor('pipe24')} 
        strokeWidth="10"
        className={`pipe-segment ${getPipeState('pipe24') === 1 ? 'pipe-active' : 'pipe-inactive'}`}
      />
    </svg>
  );

  return (
    <ResponsiveWrapper 
      componentId="pipe-system-principal"
      editMode={editMode}
    >
      <div className={`pipe-system-wrapper ${className}`}>
        <PipeSystemSVG />
      </div>
      
      <style jsx>{`
        .pipe-system {
          width: 100%;
          height: 100%;
        }
        
        .pipe-segment {
          transition: stroke 0.5s ease;
        }
        
        .pipe-active {
          animation: pipe-flow 2s ease-in-out infinite;
          filter: drop-shadow(0 0 6px #FC6500);
        }
        
        .pipe-inactive {
          /* Apenas a cor marrom estática */
        }
        
        @keyframes pipe-flow {
          0% { 
            stroke: #FC6500;
            filter: drop-shadow(0 0 6px #FC6500);
          }
          50% { 
            stroke: #FF8533;
            filter: drop-shadow(0 0 12px #FC6500);
          }
          100% { 
            stroke: #FC6500;
            filter: drop-shadow(0 0 6px #FC6500);
          }
        }
        
        .pipe-system-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background: transparent;
        }
      `}</style>
    </ResponsiveWrapper>
  );
};

export default PipeSystem;
