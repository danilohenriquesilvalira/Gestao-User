import React from 'react';
import { 
  Wifi, WifiOff, AlertTriangle, CheckCircle, User, Zap, 
  Calendar, Droplets, Activity, Settings, Shield, Clock,
  Gauge, Thermometer, Battery, Signal
} from 'lucide-react';

interface EclusaCardCompactProps {
  name: string;
  color: string;
  status: 'Operacional' | 'Manutenção' | 'Offline';
  userLogado: string;
  cotaMontante: string;
  cotaCaldeira: string;
  cotaJusante: string;
  eficiencia: number;
  proximaManutencao: string;
  alarmes: boolean;
  comunicacao: 'Online' | 'Offline' | 'Instável';
  inundacao: 'Normal' | 'Alerta' | 'Crítico';
  emergencia: boolean;
  temperatura?: number;
  pressao?: number;
  potencia?: number;
}

const EclusaCardCompact: React.FC<EclusaCardCompactProps> = ({
  name,
  color,
  status,
  userLogado,
  cotaMontante,
  cotaCaldeira, 
  cotaJusante,
  eficiencia,
  proximaManutencao,
  alarmes,
  comunicacao,
  inundacao,
  emergencia,
  temperatura = 22,
  pressao = 1.2,
  potencia = 85
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Operacional': return 'text-green-600 bg-green-100';
      case 'Manutenção': return 'text-yellow-600 bg-yellow-100';
      case 'Offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInundacaoColor = () => {
    switch (inundacao) {
      case 'Normal': return 'text-green-600';
      case 'Alerta': return 'text-yellow-600';
      case 'Crítico': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header com cor da eclusa */}
      <div 
        className="w-full h-3 sm:h-4 md:h-6"
        style={{ backgroundColor: color }}
      ></div>
      
      <div className="flex flex-col h-[calc(100%-12px)] sm:h-[calc(100%-16px)] md:h-[calc(100%-24px)] p-2 sm:p-3 md:p-4">
        
        {/* Header: Nome + Status com ícones */}
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <h3 className="text-xs sm:text-sm md:text-lg font-bold text-gray-800 truncate">
            {name}
          </h3>
          <div className="flex items-center gap-1">
            {/* Status com ícone */}
            <div className={`px-1 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium ${getStatusColor()}`}>
              {status === 'Operacional' && <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 inline" />}
              {status === 'Manutenção' && <Settings className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 inline" />}
              {status === 'Offline' && <AlertTriangle className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 inline" />}
            </div>
            {/* Alertas principais */}
            {alarmes && <AlertTriangle className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-yellow-500" />}
            {emergencia && <Shield className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-red-500" />}
          </div>
        </div>

        {/* Informações principais com ícones */}
        <div className="flex-1 flex flex-col justify-between">
          
          {/* Mobile: Grid compacto com ícones */}
          <div className="sm:hidden">
            <div className="grid grid-cols-3 gap-1 text-[8px]">
              <div className="flex items-center gap-1">
                <Gauge className="w-2 h-2 text-blue-500" />
                <span className="font-bold">{eficiencia}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-2 h-2 text-cyan-500" />
                <span>{cotaMontante}</span>
              </div>
              <div className="flex items-center gap-1">
                {comunicacao === 'Online' ? (
                  <Signal className="w-2 h-2 text-green-500" />
                ) : (
                  <WifiOff className="w-2 h-2 text-red-500" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-2 h-2 text-gray-500" />
                <span>{userLogado.split(' ')[0]}</span>
              </div>
              <div className="flex items-center gap-1">
                <Thermometer className="w-2 h-2 text-orange-500" />
                <span>{temperatura}°</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className={`w-2 h-2 ${getInundacaoColor()}`} />
              </div>
            </div>
          </div>

          {/* Tablet: Mais informações com ícones */}
          <div className="hidden sm:block md:hidden">
            <div className="grid grid-cols-2 gap-2 text-[9px]">
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-blue-500" />
                <span className="font-bold">{eficiencia}%</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-gray-500" />
                <span className="truncate">{userLogado.split(' ')[0]}</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-500" />
                <span>{cotaMontante}</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-blue-500" />
                <span>{cotaCaldeira}</span>
              </div>
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-orange-500" />
                <span>{temperatura}°C</span>
              </div>
              <div className="flex items-center gap-1">
                <Battery className="w-3 h-3 text-green-500" />
                <span>{potencia}%</span>
              </div>
              <div className="flex items-center gap-1">
                {comunicacao === 'Online' ? (
                  <Signal className="w-3 h-3 text-green-500" />
                ) : (
                  <WifiOff className="w-3 h-3 text-red-500" />
                )}
                <span className={getInundacaoColor()}>{inundacao}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-500" />
                <span className="text-[8px]">{proximaManutencao}</span>
              </div>
            </div>
          </div>

          {/* Desktop: Informações técnicas completas */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 gap-2 text-[10px] mb-2">
              {/* Primeira linha: Dados hidráulicos */}
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-500" />
                <span className="text-gray-600">Mont:</span>
                <span className="font-bold">{cotaMontante}</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-blue-500" />
                <span className="text-gray-600">Cald:</span>
                <span className="font-bold">{cotaCaldeira}</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-indigo-500" />
                <span className="text-gray-600">Jus:</span>
                <span className="font-bold">{cotaJusante}</span>
              </div>
              
              {/* Segunda linha: Performance */}
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-blue-500" />
                <span className="text-gray-600">Efic:</span>
                <span className="font-bold text-blue-600">{eficiencia}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Battery className="w-3 h-3 text-green-500" />
                <span className="text-gray-600">Pot:</span>
                <span className="font-bold">{potencia}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-orange-500" />
                <span className="text-gray-600">Temp:</span>
                <span className="font-bold">{temperatura}°C</span>
              </div>
              
              {/* Terceira linha: Status operacional */}
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-gray-500" />
                <span className="truncate font-medium">{userLogado.split(' ')[0]}</span>
              </div>
              <div className="flex items-center gap-1">
                {comunicacao === 'Online' ? (
                  <Signal className="w-3 h-3 text-green-500" />
                ) : (
                  <WifiOff className="w-3 h-3 text-red-500" />
                )}
                <span className="text-gray-600">{comunicacao}</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className={`w-3 h-3 ${getInundacaoColor()}`} />
                <span className={`font-medium ${getInundacaoColor()}`}>{inundacao}</span>
              </div>
            </div>

            {/* Footer: Manutenção */}
            <div className="pt-1 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-500" />
                <span className="text-[9px] text-gray-600">{proximaManutencao}</span>
              </div>
              <div className="text-[9px] text-gray-500">
                Press: {pressao} bar
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EclusaCardCompact;