// components/Eclusa/GraficosCotas.tsx - MONITOR ULTRA-MODERNO DE COTAS COM ANIMAÇÕES
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';
import { useWebSocket } from '@/hooks/useWebSocket';

interface GraficosCotasProps {
  editMode?: boolean;
}

export default function GraficosCotas({ editMode = false }: GraficosCotasProps) {
  const [historicoDados, setHistoricoDados] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'area' | 'line'>('area');
  const { cotaMontanteValue, cotaCaldeiraValue, cotaJusanteValue, isConnected } = useWebSocket('ws://localhost:8080/ws');

  // Dados das cotas com animação de transição
  const cotaAtual = useMemo(() => ({
    montante: cotaMontanteValue ?? 16.1 + Math.sin(Date.now() / 10000) * 0.2,
    caldeira: cotaCaldeiraValue ?? 13.5 + Math.sin(Date.now() / 8000) * 0.15,
    jusante: cotaJusanteValue ?? 11.2 + Math.sin(Date.now() / 12000) * 0.1
  }), [cotaMontanteValue, cotaCaldeiraValue, cotaJusanteValue]);

  // Status inteligente do sistema
  const statusSistema = useMemo(() => {
    const diffMC = Math.abs(cotaAtual.montante - cotaAtual.caldeira);
    const diffCJ = Math.abs(cotaAtual.caldeira - cotaAtual.jusante);
    
    if (diffMC < 0.1 && diffCJ < 0.1) return { tipo: 'sucesso', texto: 'NÍVEIS SINCRONIZADOS', cor: 'from-emerald-500 to-green-600' };
    if (diffMC > 2.5 || diffCJ > 2.5) return { tipo: 'critico', texto: 'DESNIVELAMENTO CRÍTICO', cor: 'from-red-500 to-red-600' };
    if (diffMC > 1 || diffCJ > 1) return { tipo: 'aviso', texto: 'AJUSTE NECESSÁRIO', cor: 'from-amber-500 to-orange-600' };
    return { tipo: 'normal', texto: 'OPERAÇÃO NORMAL', cor: 'from-blue-500 to-indigo-600' };
  }, [cotaAtual]);

  // Atualiza histórico com dados mais realistas
  useEffect(() => {
    const interval = setInterval(() => {
      const agora = new Date();
      const novoRegistro = {
        tempo: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        montante: Number(cotaAtual.montante.toFixed(3)),
        caldeira: Number(cotaAtual.caldeira.toFixed(3)),
        jusante: Number(cotaAtual.jusante.toFixed(3)),
        timestamp: agora.getTime()
      };

      setHistoricoDados(prev => {
        const novo = [...prev, novoRegistro];
        return novo.length > 15 ? novo.slice(-15) : novo;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [cotaAtual]);

  // Inicialização com dados realistas
  useEffect(() => {
    const dadosIniciais = [];
    for (let i = 14; i >= 0; i--) {
      const tempo = new Date(Date.now() - i * 2000);
      dadosIniciais.push({
        tempo: tempo.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        montante: Number((16.1 + Math.sin((Date.now() - i * 2000) / 10000) * 0.2).toFixed(3)),
        caldeira: Number((13.5 + Math.sin((Date.now() - i * 2000) / 8000) * 0.15).toFixed(3)),
        jusante: Number((11.2 + Math.sin((Date.now() - i * 2000) / 12000) * 0.1).toFixed(3)),
        timestamp: tempo.getTime()
      });
    }
    setHistoricoDados(dadosIniciais);
  }, []);

  // Tooltip customizado ultra-moderno
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    
    return (
      <div className="bg-gray-900/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-700">
        <p className="text-gray-300 text-xs mb-2">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: entry.color }}></div>
              <span className="text-white text-sm font-medium">
                {entry.name}: <span className="text-blue-300 font-bold">{entry.value}m</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <ResponsiveWrapper 
      componentId="graficos-cotas"
      editMode={editMode}
      defaultConfig={{
        xs: { x: 50, y: 50, width: 400, height: 300, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        sm: { x: 100, y: 80, width: 450, height: 320, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        md: { x: 150, y: 100, width: 500, height: 350, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        lg: { x: 200, y: 120, width: 550, height: 380, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        xl: { x: 250, y: 150, width: 600, height: 400, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        '2xl': { x: 300, y: 180, width: 650, height: 420, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        '3xl': { x: 350, y: 200, width: 700, height: 450, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        '4xl': { x: 400, y: 220, width: 750, height: 480, scale: 1, zIndex: 15, opacity: 1, rotation: 0 }
      }}
    >
      <div className="w-full h-full bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        
        {/* Header Ultra-moderno */}
        <div className={`bg-gradient-to-r ${statusSistema.cor} p-4 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Sistema de Cotas</h2>
                <p className="text-white/80 text-sm">{statusSistema.texto}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Indicadores em tempo real */}
              <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="text-white text-sm font-medium">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
              </div>
              
              {/* Toggle view mode */}
              <button
                onClick={() => setViewMode(viewMode === 'area' ? 'line' : 'area')}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
                title="Alternar visualização"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Valores em tempo real com animações */}
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Montante', valor: cotaAtual.montante, cor: 'from-blue-500 to-blue-600', icon: 'M5 10l7-7m0 0l7 7m-7-7v18' },
              { label: 'Caldeira', valor: cotaAtual.caldeira, cor: 'from-purple-500 to-purple-600', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
              { label: 'Jusante', valor: cotaAtual.jusante, cor: 'from-green-500 to-green-600', icon: 'M19 14l-7 7m0 0l-7-7m7 7V3' }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className={`bg-gradient-to-br ${item.cor} p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                  <div className="flex items-center justify-between mb-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="text-white/80 text-xs font-medium">{item.label}</span>
                  </div>
                  <div className="text-white font-bold text-xl">
                    {item.valor.toFixed(2)}<span className="text-sm ml-1">m</span>
                  </div>
                  
                  {/* Barra de progresso animada */}
                  <div className="mt-2 bg-white/20 rounded-full h-1 overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, (item.valor / 20) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico moderno */}
        <div className="flex-1 p-4 bg-gray-850">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'area' ? (
              <AreaChart data={historicoDados} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <defs>
                  <linearGradient id="montanteGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="caldeiraGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="jusanteGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                <XAxis dataKey="tempo" tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#6b7280" tickFormatter={(value) => `${value}m`} />
                <Tooltip content={<CustomTooltip />} />
                
                <Area type="monotone" dataKey="montante" stackId="1" stroke="#3b82f6" strokeWidth={2} fill="url(#montanteGradient)" name="Montante" />
                <Area type="monotone" dataKey="caldeira" stackId="2" stroke="#8b5cf6" strokeWidth={2} fill="url(#caldeiraGradient)" name="Caldeira" />
                <Area type="monotone" dataKey="jusante" stackId="3" stroke="#10b981" strokeWidth={2} fill="url(#jusanteGradient)" name="Jusante" />
              </AreaChart>
            ) : (
              <LineChart data={historicoDados} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                <XAxis dataKey="tempo" tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#6b7280" tickFormatter={(value) => `${value}m`} />
                <Tooltip content={<CustomTooltip />} />
                
                <Line type="monotone" dataKey="montante" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#3b82f6' }} name="Montante" />
                <Line type="monotone" dataKey="caldeira" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#8b5cf6' }} name="Caldeira" />
                <Line type="monotone" dataKey="jusante" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#10b981' }} name="Jusante" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Footer com estatísticas */}
        <div className="p-3 bg-gray-800 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                Δ M-C:
              </span>
              <span className={`font-bold ${Math.abs(cotaAtual.montante - cotaAtual.caldeira) > 1 ? 'text-red-400' : 'text-green-400'}`}>
                {Math.abs(cotaAtual.montante - cotaAtual.caldeira).toFixed(3)}m
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                Δ C-J:
              </span>
              <span className={`font-bold ${Math.abs(cotaAtual.caldeira - cotaAtual.jusante) > 1 ? 'text-red-400' : 'text-green-400'}`}>
                {Math.abs(cotaAtual.caldeira - cotaAtual.jusante).toFixed(3)}m
              </span>
            </div>
          </div>
        </div>

      </div>
    </ResponsiveWrapper>
  );
}