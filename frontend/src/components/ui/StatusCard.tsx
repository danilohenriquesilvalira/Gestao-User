'use client';

import { useState } from 'react';

// Define o tipo para as eclusas com suas cores
type EclusaName = 'pocinho' | 'regua' | 'crestuma' | 'carrapatelo' | 'valeira';

// Mapeamento de cores hexadecimais para as eclusas
const eclusaColors: Record<EclusaName, string> = {
  pocinho: '#FEFE00',
  regua: '#4AE800',
  crestuma: '#60BBF8',
  carrapatelo: '#FF886C',
  valeira: '#FF5402',
};

interface StatusCardProps {
  title: string;
  eclusa: EclusaName; // O nome da eclusa para determinar a cor
  status: 'online' | 'offline' | 'maintenance' | 'alert';
  value?: string | number;
  subtitle?: string;
  lastUpdate?: string;
  onClick?: () => void;
  className?: string;
}

export default function StatusCard({
  title,
  eclusa,
  status,
  value,
  subtitle,
  lastUpdate,
  onClick,
  className = ""
}: StatusCardProps) {
  
  const getStatusColor = () => {
    switch(status) {
      case 'online': return 'bg-edp-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'alert': return 'bg-orange-500';
      default: return 'bg-edp-gray-500';
    }
  };

  const getStatusText = () => {
    switch(status) {
      case 'online': return 'Operacional';
      case 'offline': return 'Offline';
      case 'maintenance': return 'Manutenção';
      case 'alert': return 'Alerta';
      default: return 'Desconhecido';
    }
  };

  // Cores do Tailwind para o texto com base no status
  const getStatusTextColor = () => {
    switch(status) {
      case 'online': return 'text-edp-green-500';
      case 'offline': return 'text-red-500';
      case 'maintenance': return 'text-yellow-500';
      case 'alert': return 'text-orange-500';
      default: return 'text-edp-gray-500';
    }
  };

  // Obtém a cor principal da eclusa
  const eclusaColor = eclusaColors[eclusa] || eclusaColors.pocinho;

  return (
    <div 
      className={`relative w-[329px] h-[303px] ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      onClick={onClick}
    >
      {/* SVG do Card como background */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        width="329" height="303" viewBox="0 0 329 303" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        {/* Primeiro path - a cor será dinâmica */}
        <path 
          d="M19.4561 0.25H309.544C320.151 0.250219 328.75 8.84894 328.75 19.4561V102.544C328.75 113.151 320.151 121.75 309.544 121.75H19.4561C8.84894 121.75 0.250217 113.151 0.25 102.544V19.4561C0.25022 8.84894 8.84894 0.250218 19.4561 0.25Z" 
          fill={eclusaColor} 
          stroke="#CBCBCB" 
          strokeWidth="0.5"
          className="transition-all duration-300 group-hover:drop-shadow-lg"
        />
        {/* Segundo path - a parte branca */}
        <path 
          d="M19.4561 10.25H309.544C320.151 10.2502 328.75 18.8489 328.75 29.4561V283.544C328.75 294.151 320.151 302.75 309.544 302.75H19.4561C8.84894 302.75 0.250217 294.151 0.25 283.544V29.4561C0.250216 18.8489 8.84894 10.2502 19.4561 10.25Z" 
          fill="white" 
          stroke="#CBCBCB" 
          strokeWidth="0.5"
          className="transition-all duration-300 group-hover:drop-shadow-lg"
        />
      </svg>
      
      {/* Conteúdo do Card posicionado sobre o SVG */}
      <div className="absolute inset-0 flex flex-col p-6 pt-12">
        
        {/* Título e Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900 truncate">{title}</h3>
            {subtitle && (
              <div className="text-sm text-gray-500 truncate">{subtitle}</div>
            )}
          </div>
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        </div>

        {/* Valor Principal no centro */}
        <div className="flex-grow flex items-center justify-center">
          {value && (
            <div>
              <div className="text-5xl font-extrabold text-gray-900 leading-none">{value}</div>
            </div>
          )}
        </div>

        {/* Rodapé do Card */}
        <div className="mt-auto flex justify-between items-center text-sm">
          <div className={`font-medium ${getStatusTextColor()}`}>
            {getStatusText()}
          </div>
          {lastUpdate && (
            <div className="text-xs text-gray-400">
              Última Atualização: {lastUpdate}
            </div>
          )}
        </div>

        {/* Indicador de Click */}
        {onClick && (
          <div className="absolute bottom-4 right-4 group-hover:translate-x-1 transition-transform duration-200">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>

    </div>
  );
}