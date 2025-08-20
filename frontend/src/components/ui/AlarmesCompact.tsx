import React, { useState } from 'react';
import { 
  AlertTriangle, AlertCircle, WifiOff, CheckCircle, 
  Clock, Bell, Shield, Info, Settings, Zap, Activity,
  Filter, ChevronDown, Droplets, Signal
} from 'lucide-react';

interface Alarme {
  id: number;
  tipo: 'CRÍTICO' | 'ATENÇÃO' | 'REDE' | 'INFO' | 'SISTEMA';
  titulo: string;
  data: string;
  eclusa: string;
  prioridade: 'alta' | 'media' | 'baixa';
  timestamp: string;
}

interface AlarmesCompactProps {
  className?: string;
}

const AlarmesCompact: React.FC<AlarmesCompactProps> = ({ className = '' }) => {
  const [filtroEclusa, setFiltroEclusa] = useState<string>('todas');
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  
  const eclusas = ['Crestuma', 'Carrapatelo', 'Régua', 'Valeira', 'Pocinho'];
  
  const alarmes: Alarme[] = [
    {
      id: 1,
      tipo: 'CRÍTICO',
      titulo: 'Falha no motor principal',
      data: '26/06/2025',
      eclusa: 'Régua',
      prioridade: 'alta',
      timestamp: '14:30'
    },
    {
      id: 2,
      tipo: 'ATENÇÃO',
      titulo: 'Nível de água baixo',
      data: '26/06/2025',
      eclusa: 'Pocinho',
      prioridade: 'media',
      timestamp: '13:15'
    },
    {
      id: 3,
      tipo: 'REDE',
      titulo: 'Conectividade instável',
      data: '26/06/2025',
      eclusa: 'Carrapatelo',
      prioridade: 'media',
      timestamp: '12:45'
    },
    {
      id: 4,
      tipo: 'INFO',
      titulo: 'Manutenção concluída',
      data: '25/06/2025',
      eclusa: 'Crestuma',
      prioridade: 'baixa',
      timestamp: '16:00'
    },
    {
      id: 5,
      tipo: 'CRÍTICO',
      titulo: 'Sistema de emergência acionado',
      data: '26/06/2025',
      eclusa: 'Valeira',
      prioridade: 'alta',
      timestamp: '14:45'
    },
    {
      id: 6,
      tipo: 'ATENÇÃO',
      titulo: 'Temperatura do motor elevada',
      data: '26/06/2025',
      eclusa: 'Crestuma',
      prioridade: 'media',
      timestamp: '14:20'
    },
    {
      id: 7,
      tipo: 'REDE',
      titulo: 'Perda de conexão com sensores',
      data: '26/06/2025',
      eclusa: 'Pocinho',
      prioridade: 'media',
      timestamp: '14:10'
    },
    {
      id: 8,
      tipo: 'CRÍTICO',
      titulo: 'Vazamento na câmara de eclusa',
      data: '26/06/2025',
      eclusa: 'Carrapatelo',
      prioridade: 'alta',
      timestamp: '13:50'
    },
    {
      id: 9,
      tipo: 'ATENÇÃO',
      titulo: 'Pressão hidráulica irregular',
      data: '26/06/2025',
      eclusa: 'Régua',
      prioridade: 'media',
      timestamp: '13:30'
    },
    {
      id: 10,
      tipo: 'SISTEMA',
      titulo: 'Backup automático executado',
      data: '26/06/2025',
      eclusa: 'Valeira',
      prioridade: 'baixa',
      timestamp: '13:00'
    },
    {
      id: 11,
      tipo: 'CRÍTICO',
      titulo: 'Falha no sistema de controle',
      data: '26/06/2025',
      eclusa: 'Crestuma',
      prioridade: 'alta',
      timestamp: '12:30'
    },
    {
      id: 12,
      tipo: 'ATENÇÃO',
      titulo: 'Vibração anômala detectada',
      data: '26/06/2025',
      eclusa: 'Pocinho',
      prioridade: 'media',
      timestamp: '12:15'
    }
  ];

  // Filtrar alarmes por eclusa
  const alarmesFiltrados = alarmes.filter(alarme => 
    filtroEclusa === 'todas' || alarme.eclusa === filtroEclusa
  );

  // Verificar se há críticos ou avisos para piscar o sino
  const temCriticos = alarmesFiltrados.some(a => a.prioridade === 'alta');
  const temAvisos = alarmesFiltrados.some(a => a.prioridade === 'media');

  const getAlarmeIcon = (tipo: string) => {
    switch (tipo) {
      case 'CRÍTICO': return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />;
      case 'ATENÇÃO': return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />;
      case 'REDE': return <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />;
      case 'INFO': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />;
      case 'SISTEMA': return <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />;
      default: return <Info className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />;
    }
  };

  const getAlarmeColor = (tipo: string) => {
    switch (tipo) {
      case 'CRÍTICO': return 'bg-red-50 border-red-200 text-red-800';
      case 'ATENÇÃO': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'REDE': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'INFO': return 'bg-green-50 border-green-200 text-green-800';
      case 'SISTEMA': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getEclusaIcon = (eclusa: string) => {
    // Ícones específicos por eclusa para identificação rápida
    switch (eclusa) {
      case 'Crestuma': return <Droplets className="w-2 h-2 text-cyan-500" />;
      case 'Carrapatelo': return <Activity className="w-2 h-2 text-orange-500" />;
      case 'Régua': return <Zap className="w-2 h-2 text-green-500" />;
      case 'Valeira': return <Signal className="w-2 h-2 text-red-500" />;
      case 'Pocinho': return <Shield className="w-2 h-2 text-purple-500" />;
      default: return <Info className="w-2 h-2 text-gray-500" />;
    }
  };

  return (
    <div className={`w-full h-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col ${className}`}>
      
      {/* Header simples e funcional */}
      <div className="bg-gray-50 border-b border-gray-200 p-3 sm:p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
              temCriticos 
                ? 'text-red-600' 
                : temAvisos 
                ? 'text-yellow-600' 
                : 'text-gray-600'
            }`} />
            <h3 className="text-gray-800 font-semibold text-xs sm:text-sm md:text-base">
              Alarmes & Avisos
            </h3>
          </div>
          
          {/* Mini filtro + Badge críticos */}
          <div className="flex items-center gap-2">
            {/* Mini filtro de eclusa */}
            <div className="relative">
              <button
                onClick={() => setMostrarFiltro(!mostrarFiltro)}
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md border border-gray-300 transition-all"
              >
                <Filter className="w-2 h-2 sm:w-3 sm:h-3 text-gray-500" />
                <span className="text-gray-700 text-[8px] sm:text-[9px] font-medium">
                  {filtroEclusa === 'todas' ? 'Todas' : filtroEclusa}
                </span>
                <ChevronDown className={`w-2 h-2 text-gray-500 transition-transform ${mostrarFiltro ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown do filtro */}
              {mostrarFiltro && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-24">
                  <div className="p-1">
                    <button
                      onClick={() => {setFiltroEclusa('todas'); setMostrarFiltro(false);}}
                      className={`w-full text-left px-2 py-1 text-[8px] sm:text-[9px] rounded transition-colors ${
                        filtroEclusa === 'todas' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Todas
                    </button>
                    {eclusas.map(eclusa => (
                      <button
                        key={eclusa}
                        onClick={() => {setFiltroEclusa(eclusa); setMostrarFiltro(false);}}
                        className={`w-full text-left px-2 py-1 text-[8px] sm:text-[9px] rounded transition-colors ${
                          filtroEclusa === eclusa ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {eclusa}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Badge de críticos discreto */}
            {alarmesFiltrados.filter(a => a.prioridade === 'alta').length > 0 && (
              <div className="bg-red-100 text-red-700 px-2 py-1 rounded-md border border-red-200">
                <span className="text-[8px] sm:text-[10px] md:text-xs font-medium">
                  {alarmesFiltrados.filter(a => a.prioridade === 'alta').length} críticos
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo com diferentes layouts responsivos */}
      <div className="p-3 sm:p-4 md:p-5 bg-white flex-1 overflow-y-auto">
        
        {/* Mobile: Cards ultra-compactos neutros */}
        <div className="sm:hidden space-y-2">
          {alarmesFiltrados.map((alarme, index) => (
            <div key={alarme.id} className="bg-gray-50 border border-gray-200 rounded-lg p-2">
              <div className="flex items-center gap-2">
                {getAlarmeIcon(alarme.tipo)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 text-[10px] font-semibold truncate">
                      {alarme.titulo}
                    </span>
                    <span className="text-gray-500 text-[8px]">
                      {alarme.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-gray-600 text-[8px]">{alarme.eclusa}</span>
                    <span className="text-gray-500 text-[7px]">{alarme.tipo}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet: Cards neutros */}
        <div className="hidden sm:block md:hidden space-y-2">
          {alarmesFiltrados.map((alarme) => (
            <div key={alarme.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getAlarmeIcon(alarme.tipo)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-medium px-2 py-0.5 bg-white border border-gray-300 rounded text-gray-700">
                      {alarme.tipo}
                    </span>
                    <span className="text-gray-600 text-[9px]">{alarme.eclusa}</span>
                  </div>
                  
                  <p className="text-gray-800 text-[11px] font-semibold mb-2 leading-tight">
                    {alarme.titulo}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-500 text-[9px]">
                        {alarme.data} {alarme.timestamp}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-medium ${
                      alarme.prioridade === 'alta' ? 'bg-red-100 text-red-700 border border-red-200' :
                      alarme.prioridade === 'media' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      {alarme.prioridade.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Lista limpa e funcional */}
        <div className="hidden md:block">
          {/* Header de estatísticas simples */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-600 text-[10px] font-semibold">
                  {alarmesFiltrados.filter(a => a.prioridade === 'alta').length} Críticos
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600 text-[10px] font-medium">
                  {alarmesFiltrados.length} Total
                </span>
              </div>
            </div>
            <div className="text-gray-500 text-[9px]">Tempo Real</div>
          </div>

          {/* Lista de alarmes limpa */}
          <div className="space-y-1.5">
            {alarmesFiltrados.map((alarme, index) => (
              <div key={alarme.id} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div>
                    {getAlarmeIcon(alarme.tipo)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[8px] font-medium px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-700">
                        {alarme.tipo}
                      </span>
                      <span className="text-gray-600 text-[9px]">{alarme.eclusa}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-2 h-2 text-gray-400" />
                        <span className="text-gray-500 text-[8px]">{alarme.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-gray-800 text-[10px] font-semibold leading-tight">
                      {alarme.titulo}
                    </p>
                  </div>
                  
                  {/* Indicador de prioridade simples */}
                  <div className={`w-2 h-8 rounded-full ${
                    alarme.prioridade === 'alta' ? 'bg-red-500' :
                    alarme.prioridade === 'media' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AlarmesCompact;