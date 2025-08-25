// components/Eclusa/GraficosCotas.tsx - MONITOR SUTIL DE COTAS
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';
import { useWebSocket } from '@/hooks/useWebSocket';
import { BarChart3 } from 'lucide-react';

interface GraficosCotasProps {
  editMode?: boolean;
}

// ✅ COMPONENTE ISOLADO QUE SÓ RENDERIZA QUANDO OS NÍVEIS MUDAM
const GraficoPuro = React.memo(({ 
  nivelCaldeiraValue, 
  nivelMontanteValue, 
  nivelJusanteValue, 
  isConnected, 
  editMode 
}: {
  nivelCaldeiraValue: number | null;
  nivelMontanteValue: number | null;  
  nivelJusanteValue: number | null;
  isConnected: boolean;
  editMode: boolean;
}) => {
  const [cotasDados, setCotasDados] = useState<any[]>([]);
  const lastUpdateRef = useRef<number>(0);
  
  const cotaAtual = {
    montante: nivelMontanteValue !== null ? (nivelMontanteValue / 100) * 25 : 16.1,
    caldeira: nivelCaldeiraValue !== null ? (nivelCaldeiraValue / 100) * 25 : 13.5,
    jusante: nivelJusanteValue !== null ? (nivelJusanteValue / 100) * 25 : 11.2
  };

  const niveisIguais = Math.abs(cotaAtual.montante - cotaAtual.caldeira) < 0.1 && 
                       Math.abs(cotaAtual.caldeira - cotaAtual.jusante) < 0.1;

  // ✅ ATUALIZA DADOS APENAS SE MUDOU SIGNIFICATIVAMENTE E COM THROTTLE
  useEffect(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current < 2000) return; // Throttle de 2 segundos
    
    setCotasDados(prev => {
      const ultimoRegistro = prev[prev.length - 1];
      
      const valoresMudaram = !ultimoRegistro || 
        Math.abs(ultimoRegistro.montante - cotaAtual.montante) > 0.2 ||
        Math.abs(ultimoRegistro.caldeira - cotaAtual.caldeira) > 0.2 ||
        Math.abs(ultimoRegistro.jusante - cotaAtual.jusante) > 0.2;

      if (valoresMudaram) {
        lastUpdateRef.current = now;
        const agora = new Date();
        const novoRegistro = {
          hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          montante: cotaAtual.montante,
          caldeira: cotaAtual.caldeira,
          jusante: cotaAtual.jusante
        };
        
        const novo = [...prev, novoRegistro];
        return novo.length > 8 ? novo.slice(-8) : novo;
      }
      return prev;
    });
  }, [cotaAtual.montante, cotaAtual.caldeira, cotaAtual.jusante]);

  // Dados iniciais apenas uma vez
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

  const CustomTooltip = useCallback(({ active, payload, label }: any) => {
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
  }, []);

  return (
    <ResponsiveWrapper 
      componentId="graficos-cotas-movimento"
      editMode={editMode}
      allowOverflow={true}
      defaultConfig={{
        xs: { x: 50, y: 50, width: 320, height: 240, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        sm: { x: 80, y: 80, width: 380, height: 270, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        md: { x: 120, y: 100, width: 420, height: 300, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        lg: { x: 150, y: 120, width: 460, height: 330, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        xl: { x: 200, y: 150, width: 500, height: 350, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        '2xl': { x: 250, y: 180, width: 540, height: 370, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        '3xl': { x: 300, y: 200, width: 580, height: 390, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
        '4xl': { x: 350, y: 220, width: 620, height: 410, scale: 1, zIndex: 15, opacity: 1, rotation: 0 }
      }}
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full w-full" style={{ overflow: 'visible' }}>
        <div className="h-3 bg-green-500 rounded-t-xl"></div>
        
        <div className="p-3 flex flex-col" style={{ height: 'calc(100% - 12px)', overflow: 'visible' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-md flex items-center justify-center">
                <BarChart3 className="w-2.5 h-2.5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Gráficos das Cotas</h3>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-500">
                    {niveisIguais ? 'Sincronizado' : 'Monitorando'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-lg p-2 border border-blue-200 hover:border-blue-300 transition-colors duration-200 shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <div className="text-xs text-blue-600 uppercase tracking-wide font-medium">Montante</div>
                </div>
                <div className="text-sm font-bold text-blue-700">{cotaAtual.montante.toFixed(1)}m</div>
              </div>
              <div className="bg-white rounded-lg p-2 border border-purple-200 hover:border-purple-300 transition-colors duration-200 shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <div className="text-xs text-purple-600 uppercase tracking-wide font-medium">Caldeira</div>
                </div>
                <div className="text-sm font-bold text-purple-700">{cotaAtual.caldeira.toFixed(1)}m</div>
              </div>
              <div className="bg-white rounded-lg p-2 border border-green-200 hover:border-green-300 transition-colors duration-200 shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <div className="text-xs text-green-600 uppercase tracking-wide font-medium">Jusante</div>
                </div>
                <div className="text-sm font-bold text-green-700">{cotaAtual.jusante.toFixed(1)}m</div>
              </div>
            </div>
          </div>

          <div className="relative" style={{ height: 'calc(100% - 140px)', minHeight: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={cotasDados} 
                margin={{ top: 5, right: 10, left: 10, bottom: 15 }}
              >
                <XAxis 
                  dataKey="hora" 
                  tick={{ fontSize: 8, fill: '#6b7280' }} 
                  axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                  tickLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 8, fill: '#6b7280' }} 
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
                
                <Line 
                  type="monotone" 
                  dataKey="montante" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  dot={{ r: 0 }}
                  activeDot={{ r: 3, fill: '#3B82F6', strokeWidth: 2, stroke: '#ffffff' }}
                  strokeOpacity={0.9}
                  fill="url(#montanteGradient)"
                />
                <Line 
                  type="monotone" 
                  dataKey="caldeira" 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                  dot={{ r: 0 }}
                  activeDot={{ r: 3, fill: '#8B5CF6', strokeWidth: 2, stroke: '#ffffff' }}
                  strokeOpacity={0.9}
                  fill="url(#caldeiraGradient)"
                />
                <Line 
                  type="monotone" 
                  dataKey="jusante" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                  dot={{ r: 0 }}
                  activeDot={{ r: 3, fill: '#10B981', strokeWidth: 2, stroke: '#ffffff' }}
                  strokeOpacity={0.9}
                  fill="url(#jusanteGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-shrink-0 mt-2 pt-2 border-t border-gray-200">
            {niveisIguais ? (
              <div className="text-center">
                <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Níveis sincronizados
                </span>
              </div>
            ) : (
              <div className="flex justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">M-C:</span>
                  <span className={`font-semibold ${Math.abs(cotaAtual.montante - cotaAtual.caldeira) > 1 ? 'text-orange-600' : 'text-gray-700'}`}>
                    {Math.abs(cotaAtual.montante - cotaAtual.caldeira).toFixed(1)}m
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">C-J:</span>
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
}, (prevProps, nextProps) => {
  // ✅ COMPARAÇÃO MANUAL: Só re-renderiza se os níveis mudaram significativamente
  return (
    prevProps.editMode === nextProps.editMode &&
    prevProps.isConnected === nextProps.isConnected &&
    Math.abs((prevProps.nivelCaldeiraValue || 0) - (nextProps.nivelCaldeiraValue || 0)) < 0.5 &&
    Math.abs((prevProps.nivelMontanteValue || 0) - (nextProps.nivelMontanteValue || 0)) < 0.5 &&
    Math.abs((prevProps.nivelJusanteValue || 0) - (nextProps.nivelJusanteValue || 0)) < 0.5
  );
});

export default function GraficosCotas({ editMode = false }: GraficosCotasProps) {
  // ✅ SÓ PEGA OS 4 VALORES ESPECÍFICOS NECESSÁRIOS
  const { nivelCaldeiraValue, nivelMontanteValue, nivelJusanteValue, isConnected } = useWebSocket('ws://localhost:8080/ws');

  // ✅ USA O COMPONENTE ISOLADO COM React.memo
  return (
    <GraficoPuro
      nivelCaldeiraValue={nivelCaldeiraValue}
      nivelMontanteValue={nivelMontanteValue}
      nivelJusanteValue={nivelJusanteValue}
      isConnected={isConnected}
      editMode={editMode}
    />
  );
}