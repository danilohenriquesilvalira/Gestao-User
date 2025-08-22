// components/Eclusa/StatusSistema.tsx - STATUS GERAL DO SISTEMA
import React, { useState, useEffect } from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';
import { useWebSocket } from '@/hooks/useWebSocket';
import { 
  Radio, 
  Settings, 
  Power, 
  AlertTriangle, 
  Droplets,
  Shield,
  Activity,
  Wifi,
  Bell,
  AlertOctagon
} from 'lucide-react';

interface StatusSistemaProps {
  editMode?: boolean;
}

export default function StatusSistema({ editMode = false }: StatusSistemaProps) {
  const { isConnected, semaforos } = useWebSocket('ws://localhost:8080/ws');
  
  // Simulação de dados do sistema (serão substituídos por WebSocket real)
  const [sistemaDados, setSistemaDados] = useState({
    comunicacao: 'Online',
    operacao: 'Telecomando', // Telecomando, Local, Desligado
    emergencia: false,
    alarmes: 3,
    inundacao: false,
    autoOK: true
  });

  // Simula mudanças de status
  useEffect(() => {
    const interval = setInterval(() => {
      setSistemaDados(prev => ({
        ...prev,
        comunicacao: isConnected ? 'Online' : 'Offline',
        alarmes: Math.floor(Math.random() * 5),
        emergencia: Math.random() > 0.9,
        inundacao: Math.random() > 0.95
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const getOperacaoIcon = (modo: string) => {
    switch (modo) {
      case 'Telecomando':
        return <Radio className="w-3 h-3" />;
      case 'Local':
        return <Settings className="w-3 h-3" />;
      case 'Desligado':
        return <Power className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  const getStatusColor = (tipo: string, valor: any) => {
    switch (tipo) {
      case 'comunicacao':
        return valor === 'Online' ? 'text-green-600' : 'text-red-600';
      case 'operacao':
        if (valor === 'Telecomando') return 'text-blue-600';
        if (valor === 'Local') return 'text-yellow-600';
        return 'text-gray-600';
      case 'emergencia':
        return valor ? 'text-red-600' : 'text-gray-400';
      case 'alarmes':
        if (valor > 2) return 'text-red-600';
        if (valor > 0) return 'text-yellow-600';
        return 'text-green-600';
      case 'inundacao':
        return valor ? 'text-red-600' : 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <ResponsiveWrapper 
      componentId="status-sistema"
      editMode={editMode}
      defaultConfig={{
        xs: { x: 400, y: 50, width: 260, height: 180, scale: 1, zIndex: 16, opacity: 1, rotation: 0 },
        sm: { x: 480, y: 80, width: 280, height: 200, scale: 1, zIndex: 16, opacity: 1, rotation: 0 },
        md: { x: 540, y: 100, width: 300, height: 220, scale: 1, zIndex: 16, opacity: 1, rotation: 0 },
        lg: { x: 610, y: 120, width: 320, height: 240, scale: 1, zIndex: 16, opacity: 1, rotation: 0 },
        xl: { x: 700, y: 150, width: 340, height: 260, scale: 1, zIndex: 16, opacity: 1, rotation: 0 },
        '2xl': { x: 790, y: 180, width: 360, height: 280, scale: 1, zIndex: 16, opacity: 1, rotation: 0 },
        '3xl': { x: 880, y: 200, width: 380, height: 300, scale: 1, zIndex: 16, opacity: 1, rotation: 0 },
        '4xl': { x: 970, y: 220, width: 400, height: 320, scale: 1, zIndex: 16, opacity: 1, rotation: 0 }
      }}
    >
      {/* CARD PADRONIZADO COM DETALHE VERDE MAIS DELICADO */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full">
        <div className="h-3 bg-green-500 rounded-t-xl"></div>
        
        <div className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Status do Sistema</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-500">Monitoramento em tempo real</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Grid - Mais centralizado */}
          <div className="flex-1 flex flex-col justify-center space-y-2">
            
            {/* Comunicação */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600 uppercase tracking-wide">Comunicação</span>
              </div>
              <span className={`text-sm font-semibold ${getStatusColor('comunicacao', sistemaDados.comunicacao)}`}>
                {sistemaDados.comunicacao}
              </span>
            </div>

            {/* Modo de Operação */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={getStatusColor('operacao', sistemaDados.operacao)}>
                  {getOperacaoIcon(sistemaDados.operacao)}
                </div>
                <span className="text-xs text-gray-600 uppercase tracking-wide">Operação</span>
              </div>
              <span className={`text-sm font-semibold ${getStatusColor('operacao', sistemaDados.operacao)}`}>
                {sistemaDados.operacao}
              </span>
            </div>

            {/* Alarmes */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600 uppercase tracking-wide">Alarmes</span>
              </div>
              <span className={`text-sm font-semibold ${getStatusColor('alarmes', sistemaDados.alarmes)}`}>
                {sistemaDados.alarmes === 0 ? 'OK' : `${sistemaDados.alarmes} ativo${sistemaDados.alarmes > 1 ? 's' : ''}`}
              </span>
            </div>

            {/* Emergência */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600 uppercase tracking-wide">Emergência</span>
              </div>
              <span className={`text-sm font-semibold ${getStatusColor('emergencia', sistemaDados.emergencia)}`}>
                {sistemaDados.emergencia ? 'ATIVO' : 'OK'}
              </span>
            </div>

            {/* Inundação */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Droplets className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600 uppercase tracking-wide">Inundação</span>
              </div>
              <span className={`text-sm font-semibold ${getStatusColor('inundacao', sistemaDados.inundacao)}`}>
                {sistemaDados.inundacao ? 'DETECTADA' : 'Normal'}
              </span>
            </div>

          </div>

          {/* Footer com timestamp */}
          <div className="flex-shrink-0 mt-4 pt-3 border-t border-gray-200">
            <div className="text-center text-xs text-gray-500">
              Última atualização: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </ResponsiveWrapper>
  );
}