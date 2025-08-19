// EclusaCard.tsx
import React from 'react';
import { User, Droplets, Gauge, Calendar, Activity, AlertTriangle, Wifi, Waves, Zap } from 'lucide-react';

interface EclusaCardProps {
  name: string;
  color: string;
  status?: 'Operacional' | 'Manutenção' | 'Offline';
  userLogado?: string;
  cotaMontante?: string;
  cotaCaldeira?: string;
  cotaJusante?: string;
  eficiencia?: number;
  proximaManutencao?: string;
  alarmes?: boolean;
  comunicacao?: 'Online' | 'Offline' | 'Instável';
  inundacao?: 'Normal' | 'Alerta' | 'Crítico';
  emergencia?: boolean;
}

export const EclusaCard: React.FC<EclusaCardProps> = ({ 
  name, 
  color, 
  status = 'Operacional',
  userLogado = 'João Silva',
  cotaMontante = '15.2m',
  cotaCaldeira = '12.8m',
  cotaJusante = '10.5m',
  eficiencia = 98,
  proximaManutencao = '15 dias',
  alarmes = false,
  comunicacao = 'Online',
  inundacao = 'Normal',
  emergencia = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operacional': return 'text-green-600 bg-green-50 border-green-200';
      case 'Manutenção': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Offline': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getComunicacaoColor = (comunicacao: string) => {
    switch (comunicacao) {
      case 'Online': return 'text-green-600';
      case 'Instável': return 'text-yellow-600';
      case 'Offline': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getInundacaoColor = (inundacao: string) => {
    switch (inundacao) {
      case 'Normal': return 'text-blue-600';
      case 'Alerta': return 'text-yellow-600';
      case 'Crítico': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 h-full">
      {/* Header */}
      <div 
        className="px-4 py-3 text-black font-semibold text-lg"
        style={{ backgroundColor: color }}
      >
        <h3 className="text-center uppercase tracking-wide">{name}</h3>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Status e Operador */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center gap-1 text-gray-600 text-xs font-medium mb-1">
              <Activity className="w-3 h-3" />
              Status
            </div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
              {status}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-gray-600 text-xs font-medium mb-1">
              <User className="w-3 h-3" />
              Operador
            </div>
            <div className="text-gray-900 font-medium text-xs">
              {userLogado}
            </div>
          </div>
        </div>

        {/* Sistemas */}
        <div>
          <div className="flex items-center gap-1 text-gray-600 text-xs font-medium mb-2">
            <Zap className="w-3 h-3" />
            SISTEMAS
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1">
              <AlertTriangle className={`w-3 h-3 ${alarmes ? 'text-red-600' : 'text-gray-400'}`} />
              <span className={`text-xs ${alarmes ? 'text-red-600' : 'text-gray-400'}`}>
                {alarmes ? 'Alarme' : 'Normal'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className={`w-3 h-3 ${getComunicacaoColor(comunicacao)}`} />
              <span className={`text-xs ${getComunicacaoColor(comunicacao)}`}>
                {comunicacao}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Waves className={`w-3 h-3 ${getInundacaoColor(inundacao)}`} />
              <span className={`text-xs ${getInundacaoColor(inundacao)}`}>
                {inundacao}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className={`w-3 h-3 ${emergencia ? 'text-orange-600' : 'text-gray-400'}`} />
              <span className={`text-xs ${emergencia ? 'text-orange-600' : 'text-gray-400'}`}>
                {emergencia ? 'Emergência' : 'Normal'}
              </span>
            </div>
          </div>
        </div>

        {/* Cotas */}
        <div>
          <div className="flex items-center gap-1 text-gray-600 text-xs font-medium mb-2">
            <Droplets className="w-3 h-3" />
            COTAS
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="w-6 h-6 mx-auto bg-cyan-100 rounded-full flex items-center justify-center mb-1">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-500">Mont.</div>
              <div className="text-xs font-bold text-cyan-600">{cotaMontante}</div>
            </div>
            <div>
              <div className="w-6 h-6 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-500">Cald.</div>
              <div className="text-xs font-bold text-amber-600">{cotaCaldeira}</div>
            </div>
            <div>
              <div className="w-6 h-6 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-500">Just.</div>
              <div className="text-xs font-bold text-emerald-600">{cotaJusante}</div>
            </div>
          </div>
        </div>

        {/* Eficiência */}
        <div>
          <div className="flex items-center gap-1 text-gray-600 text-xs font-medium mb-1">
            <Gauge className="w-3 h-3" />
            Eficiência
          </div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold text-green-600">{eficiencia}%</div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${eficiencia}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EclusaCard;