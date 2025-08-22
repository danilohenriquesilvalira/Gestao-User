// components/Eclusa/GraficosCotas.tsx - MONITOR SUTIL DE COTAS
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';
import { useWebSocket } from '@/hooks/useWebSocket';
import { BarChart3 } from 'lucide-react';

interface GraficosCotasProps {
  editMode?: boolean;
}

export default function GraficosCotas({ editMode = false }: GraficosCotasProps) {
  const [cotasDados, setCotasDados] = useState<any[]>([]);
  const { cotaMontanteValue, cotaCaldeiraValue, cotaJusanteValue, isConnected } = useWebSocket('ws://localhost:8080/ws');

  // Dados atuais das cotas
  const cotaAtual = {
    montante: cotaMontanteValue ?? 16.1,
    caldeira: cotaCaldeiraValue ?? 13.5,
    jusante: cotaJusanteValue ?? 11.2
  };

  // Verifica se níveis estão iguais (muito sutil)
  const niveisIguais = Math.abs(cotaAtual.montante - cotaAtual.caldeira) < 0.1 && 
                       Math.abs(cotaAtual.caldeira - cotaAtual.jusante) < 0.1;

  // Atualiza dados do gráfico
  useEffect(() => {
    const agora = new Date();
    const novoRegistro = {
      hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      montante: cotaAtual.montante,
      caldeira: cotaAtual.caldeira,
      jusante: cotaAtual.jusante
    };

    setCotasDados(prev => {
      const novo = [...prev, novoRegistro];
      return novo.length > 8 ? novo.slice(-8) : novo;
    });
  }, [cotaMontanteValue, cotaCaldeiraValue, cotaJusanteValue]);

  // Dados iniciais
  useEffect(() => {
    if (cotasDados.length === 0) {
      const dadosIniciais = [];
      for (let i = 7; i >= 0; i--) {
        const tempo = new Date(Date.now() - i * 300000);
        dadosIniciais.push({
          hora: tempo.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          montante: 16.1 + (Math.random() - 0.5) * 0.3,
          caldeira: 13.5 + (Math.random() - 0.5) * 0.2,
          jusante: 11.2 + (Math.random() - 0.5) * 0.1
        });
      }
      setCotasDados(dadosIniciais);
    }
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-gray-100">
          <p className="text-xs text-gray-600 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-gray-700">{entry.dataKey}: {entry.value.toFixed(2)}m</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveWrapper 
      componentId="graficos-cotas"
      editMode={editMode}
      defaultConfig={{
        xs: { x: 50, y: 50, width: 320, height: 220, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        sm: { x: 80, y: 80, width: 380, height: 250, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        md: { x: 120, y: 100, width: 420, height: 280, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        lg: { x: 150, y: 120, width: 460, height: 300, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        xl: { x: 200, y: 150, width: 500, height: 320, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        '2xl': { x: 250, y: 180, width: 540, height: 340, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        '3xl': { x: 300, y: 200, width: 580, height: 360, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        '4xl': { x: 350, y: 220, width: 620, height: 380, scale: 1, zIndex: 15, opacity: 1, rotation: 0 }
      }}
    >
      {/* CARD PADRONIZADO COM DETALHE VERDE MAIS DELICADO */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full">
        <div className="h-3 bg-green-500 rounded-t-xl"></div>
        
        <div className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                <BarChart3 className="w-3 h-3 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Gráficos das Cotas</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-500">
                    {niveisIguais ? 'Níveis sincronizados' : 'Monitoramento ativo'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Valores das cotas - Centralizados e Modernos */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-xl p-3 border border-blue-200 hover:border-blue-300 transition-colors duration-200 shadow-sm hover:shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="text-xs text-blue-600 uppercase tracking-wide font-medium">Montante</div>
                </div>
                <div className="text-lg font-bold text-blue-700 mt-1">{cotaAtual.montante.toFixed(1)}m</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-purple-200 hover:border-purple-300 transition-colors duration-200 shadow-sm hover:shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <div className="text-xs text-purple-600 uppercase tracking-wide font-medium">Caldeira</div>
                </div>
                <div className="text-lg font-bold text-purple-700 mt-1">{cotaAtual.caldeira.toFixed(1)}m</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-green-200 hover:border-green-300 transition-colors duration-200 shadow-sm hover:shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="text-xs text-green-600 uppercase tracking-wide font-medium">Jusante</div>
                </div>
                <div className="text-lg font-bold text-green-700 mt-1">{cotaAtual.jusante.toFixed(1)}m</div>
              </div>
            </div>
          </div>

          {/* GRÁFICO APRIMORADO */}
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cotasDados} margin={{ top: 10, right: 15, left: 15, bottom: 20 }}>
                <XAxis 
                  dataKey="hora" 
                  tick={{ fontSize: 9, fill: '#6b7280' }} 
                  axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                  tickLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: '#6b7280' }} 
                  axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                  tickLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  tickFormatter={(value) => `${value.toFixed(1)}m`}
                />
                <defs>
                  <linearGradient id="montanteGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="caldeiraGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="jusanteGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
                
                {/* Linhas melhoradas com gradiente sutil */}
                <Line 
                  type="monotone" 
                  dataKey="montante" 
                  stroke="#3B82F6" 
                  strokeWidth={2.5} 
                  dot={{ r: 0 }}
                  activeDot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#ffffff' }}
                  strokeOpacity={0.9}
                  fill="url(#montanteGradient)"
                />
                <Line 
                  type="monotone" 
                  dataKey="caldeira" 
                  stroke="#8B5CF6" 
                  strokeWidth={2.5} 
                  dot={{ r: 0 }}
                  activeDot={{ r: 4, fill: '#8B5CF6', strokeWidth: 2, stroke: '#ffffff' }}
                  strokeOpacity={0.9}
                  fill="url(#caldeiraGradient)"
                />
                <Line 
                  type="monotone" 
                  dataKey="jusante" 
                  stroke="#10B981" 
                  strokeWidth={2.5} 
                  dot={{ r: 0 }}
                  activeDot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#ffffff' }}
                  strokeOpacity={0.9}
                  fill="url(#jusanteGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Footer com diferenças */}
          <div className="flex-shrink-0 mt-4 pt-3 border-t border-gray-200">
            {niveisIguais ? (
              <div className="text-center">
                <span className="inline-flex items-center gap-2 text-xs text-green-600 font-medium">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Níveis sincronizados
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 uppercase tracking-wide">Diff M-C:</span>
                  <span className={`font-semibold ${Math.abs(cotaAtual.montante - cotaAtual.caldeira) > 1 ? 'text-orange-600' : 'text-gray-700'}`}>
                    {Math.abs(cotaAtual.montante - cotaAtual.caldeira).toFixed(1)}m
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 uppercase tracking-wide">Diff C-J:</span>
                  <span className={`font-semibold ${Math.abs(cotaAtual.caldeira - cotaAtual.jusante) > 1 ? 'text-orange-600' : 'text-gray-700'}`}>
                    {Math.abs(cotaAtual.caldeira - cotaAtual.jusante).toFixed(1)}m
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ResponsiveWrapper>
  );
}