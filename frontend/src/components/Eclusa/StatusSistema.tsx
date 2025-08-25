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
  const { 
    isConnected, 
    semaforos,
    comunicacaoPLCValue,
    operacaoValue,
    alarmesAtivoValue,
    emergenciaAtivaValue,
    inundacaoValue
  } = useWebSocket('ws://localhost:8080/ws');
  
  // ✅ DADOS REAIS DO PLC VIA WEBSOCKET
  const sistemaDados = {
    comunicacao: comunicacaoPLCValue ? 'Online' : (isConnected ? 'PLC Offline' : 'Desconectado'),
    operacao: operacaoValue ? 'Telecomando' : 'Local', // true = Telecomando, false = Local
    emergencia: emergenciaAtivaValue || false,
    alarmes: alarmesAtivoValue ? 1 : 0, // Por enquanto 1 ou 0, pode ser expandido
    inundacao: inundacaoValue || false,
    autoOK: !alarmesAtivoValue && !emergenciaAtivaValue && !inundacaoValue
  };

  // ✅ LOG PARA DEBUG DOS VALORES DO PLC
  useEffect(() => {
    console.log('🔧 STATUS SISTEMA ATUALIZADO:', {
      comunicacaoPLC: comunicacaoPLCValue,
      operacao: operacaoValue,
      alarmes: alarmesAtivoValue,
      emergencia: emergenciaAtivaValue,
      inundacao: inundacaoValue
    });
  }, [comunicacaoPLCValue, operacaoValue, alarmesAtivoValue, emergenciaAtivaValue, inundacaoValue]);

  const getOperacaoIcon = (modo: string) => {
    switch (modo) {
      case 'Telecomando':
        return <Radio className="w-2.5 h-2.5" />;
      case 'Local':
        return <Settings className="w-2.5 h-2.5" />;
      case 'Desligado':
        return <Power className="w-2.5 h-2.5" />;
      default:
        return <Activity className="w-2.5 h-2.5" />;
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
      componentId="status-sistema-movimento"
      editMode={editMode}
      allowOverflow={true}
      defaultConfig={{
        xs: { x: 400, y: 50, width: 260, height: 220, scale: 1, zIndex: 16, opacity: 1, rotation: 0 },
        sm: { x: 480, y: 80, width: 280, height: 240, scale: 1, zIndex: 16, opacity: 1, rotation: 0 },
        md: { x: 540, y: 100, width: 300, height: 260, scale: 1, zIndex: 16, opacity: 1, rotation: 0 },
        lg: { x: 610, y: 120, width: 320, height: 280, scale: 1, zIndex: 16, opacity: 1, rotation: 0 },
        xl: { x: 700, y: 150, width: 340, height: 300, scale: 1, zIndex: 16, opacity: 1, rotation: 0 },
        '2xl': { x: 790, y: 180, width: 360, height: 320, scale: 1, zIndex: 16, opacity: 1, rotation: 0 },
        '3xl': { x: 880, y: 200, width: 380, height: 340, scale: 1, zIndex: 16, opacity: 1, rotation: 0 },
        '4xl': { x: 970, y: 220, width: 400, height: 360, scale: 1, zIndex: 16, opacity: 1, rotation: 0 }
      }}
    >
      {/* CARD PADRONIZADO COM DETALHE VERDE MAIS DELICADO */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full w-full" style={{ overflow: 'visible' }}>
        <div className="h-3 bg-green-500 rounded-t-xl"></div>
        
        <div className="p-3 flex flex-col" style={{ height: 'calc(100% - 12px)', overflow: 'visible' }}>
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-green-500 rounded-md flex items-center justify-center">
              <Shield className="w-2.5 h-2.5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900">Status do Sistema</h3>
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-500">Tempo real</span>
              </div>
            </div>
          </div>

          {/* Status Grid - Altura calculada */}
          <div className="space-y-1.5" style={{ height: 'calc(100% - 80px)' }}>
            
            {/* Comunicação */}
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-xs">
              <div className="flex items-center gap-1.5">
                <Wifi className="w-2.5 h-2.5 text-gray-500" />
                <span className="text-gray-600 uppercase tracking-wide font-medium">Comunicação</span>
              </div>
              <span className={`font-semibold ${getStatusColor('comunicacao', sistemaDados.comunicacao)}`}>
                {sistemaDados.comunicacao}
              </span>
            </div>

            {/* Modo de Operação */}
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-xs">
              <div className="flex items-center gap-1.5">
                <div className={getStatusColor('operacao', sistemaDados.operacao)}>
                  {getOperacaoIcon(sistemaDados.operacao)}
                </div>
                <span className="text-gray-600 uppercase tracking-wide font-medium">Operação</span>
              </div>
              <span className={`font-semibold ${getStatusColor('operacao', sistemaDados.operacao)}`}>
                {sistemaDados.operacao}
              </span>
            </div>

            {/* Alarmes */}
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-xs">
              <div className="flex items-center gap-1.5">
                <Bell className="w-2.5 h-2.5 text-gray-500" />
                <span className="text-gray-600 uppercase tracking-wide font-medium">Alarmes</span>
              </div>
              <span className={`font-semibold ${getStatusColor('alarmes', sistemaDados.alarmes)}`}>
                {sistemaDados.alarmes === 0 ? 'OK' : `${sistemaDados.alarmes} ativo${sistemaDados.alarmes > 1 ? 's' : ''}`}
              </span>
            </div>

            {/* Emergência */}
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-xs">
              <div className="flex items-center gap-1.5">
                <AlertOctagon className="w-2.5 h-2.5 text-gray-500" />
                <span className="text-gray-600 uppercase tracking-wide font-medium">Emergência</span>
              </div>
              <span className={`font-semibold ${getStatusColor('emergencia', sistemaDados.emergencia)}`}>
                {sistemaDados.emergencia ? 'ATIVO' : 'OK'}
              </span>
            </div>

            {/* Inundação */}
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-xs">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-2.5 h-2.5 text-gray-500" />
                <span className="text-gray-600 uppercase tracking-wide font-medium">Inundação</span>
              </div>
              <span className={`font-semibold ${getStatusColor('inundacao', sistemaDados.inundacao)}`}>
                {sistemaDados.inundacao ? 'DETECTADA' : 'Normal'}
              </span>
            </div>

          </div>

          {/* Footer com timestamp */}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-center text-xs text-gray-500">
              {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </ResponsiveWrapper>
  );
}