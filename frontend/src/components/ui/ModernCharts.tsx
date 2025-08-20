import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ModernChartsProps {
  className?: string;
}

const ModernCharts: React.FC<ModernChartsProps> = ({ className = '' }) => {
  const [selectedEclusas, setSelectedEclusas] = useState<string[]>(['Crestuma', 'Carrapatelo', 'Régua', 'Valeira', 'Pocinho']);
  const [timeFilter, setTimeFilter] = useState('24h');

  // Dados do gráfico de linha - eficiência das eclusas ao longo do tempo
  const fullLineData = [
    { time: '00:00', Crestuma: 98, Carrapatelo: 95, Régua: 85, Valeira: 97, Pocinho: 99 },
    { time: '04:00', Crestuma: 96, Carrapatelo: 93, Régua: 82, Valeira: 96, Pocinho: 97 },
    { time: '08:00', Crestuma: 97, Carrapatelo: 94, Régua: 88, Valeira: 98, Pocinho: 98 },
    { time: '12:00', Crestuma: 99, Carrapatelo: 96, Régua: 90, Valeira: 99, Pocinho: 100 },
    { time: '16:00', Crestuma: 98, Carrapatelo: 97, Régua: 87, Valeira: 97, Pocinho: 99 },
    { time: '20:00', Crestuma: 97, Carrapatelo: 95, Régua: 85, Valeira: 96, Pocinho: 98 },
  ];

  const lineData = timeFilter === '12h' ? fullLineData.slice(-3) : fullLineData;

  // Dados do gráfico de anel - número de falhas por eclusa
  const ringData = [
    { name: 'Crestuma', falhas: 2, color: '#3B82F6' },
    { name: 'Carrapatelo', falhas: 5, color: '#F59E0B' },
    { name: 'Régua', falhas: 8, color: '#10B981' },
    { name: 'Valeira', falhas: 1, color: '#EF4444' },
    { name: 'Pocinho', falhas: 3, color: '#EAB308' },
  ];

  const eclusaColors = {
    Crestuma: '#3B82F6',
    Carrapatelo: '#F59E0B', 
    Régua: '#10B981',
    Valeira: '#EF4444',
    Pocinho: '#EAB308'
  };

  const toggleEclusa = (eclusa: string) => {
    setSelectedEclusas(prev => 
      prev.includes(eclusa) 
        ? prev.filter(e => e !== eclusa)
        : [...prev, eclusa]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border-0 rounded-xl shadow-2xl border border-gray-100">
          <p className="font-semibold text-gray-800 mb-2">{`Horário: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 py-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <p className="text-sm font-medium text-gray-700">
                {`${entry.dataKey}: ${entry.value}%`}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const RingTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 border-0 rounded-xl shadow-2xl border border-gray-100">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">{`Falhas: ${data.falhas}`}</p>
        </div>
      );
    }
    return null;
  };

  const FilterSection = ({ isMobile = false }) => (
    <div className={`mb-2 ${isMobile ? 'p-2' : 'p-3'} bg-gray-50/70 rounded-lg border border-gray-100`}>
      {isMobile ? (
        // Mobile: Layout vertical compacto
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Período:</span>
            <div className="flex bg-white rounded-md border border-gray-200 overflow-hidden">
              <button
                onClick={() => setTimeFilter('12h')}
                className={`px-2 py-1 text-xs font-medium transition-all ${
                  timeFilter === '12h' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600'
                }`}
              >
                12h
              </button>
              <button
                onClick={() => setTimeFilter('24h')}
                className={`px-2 py-1 text-xs font-medium transition-all ${
                  timeFilter === '24h' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600'
                }`}
              >
                24h
              </button>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-gray-600 mt-1">Eclusas:</span>
            <div className="flex flex-wrap gap-1 flex-1">
              {Object.keys(eclusaColors).map((eclusa) => (
                <button
                  key={eclusa}
                  onClick={() => toggleEclusa(eclusa)}
                  className={`px-1 py-1 text-xs rounded border transition-all ${
                    selectedEclusas.includes(eclusa)
                      ? 'border-gray-300 text-gray-700'
                      : 'border-gray-200 text-gray-400 opacity-50'
                  }`}
                  style={{
                    backgroundColor: selectedEclusas.includes(eclusa) 
                      ? `${eclusaColors[eclusa as keyof typeof eclusaColors]}15`
                      : 'transparent',
                    borderColor: selectedEclusas.includes(eclusa) 
                      ? eclusaColors[eclusa as keyof typeof eclusaColors]
                      : undefined
                  }}
                >
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: eclusaColors[eclusa as keyof typeof eclusaColors] }}
                    ></div>
                    <span className="text-xs">{eclusa.slice(0, 4)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Desktop/Tablet: Layout horizontal
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">Período:</span>
            <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setTimeFilter('12h')}
                className={`px-3 py-1 text-xs font-medium transition-all ${
                  timeFilter === '12h' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                12h
              </button>
              <button
                onClick={() => setTimeFilter('24h')}
                className={`px-3 py-1 text-xs font-medium transition-all ${
                  timeFilter === '24h' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                24h
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">Eclusas:</span>
            <div className="flex flex-wrap gap-1">
              {Object.keys(eclusaColors).map((eclusa) => (
                <button
                  key={eclusa}
                  onClick={() => toggleEclusa(eclusa)}
                  className={`px-2 py-1 text-xs rounded-md border transition-all duration-200 ${
                    selectedEclusas.includes(eclusa)
                      ? 'border-gray-300 text-gray-700 shadow-sm'
                      : 'border-gray-200 text-gray-400 opacity-50'
                  }`}
                  style={{
                    backgroundColor: selectedEclusas.includes(eclusa) 
                      ? `${eclusaColors[eclusa as keyof typeof eclusaColors]}15`
                      : 'transparent',
                    borderColor: selectedEclusas.includes(eclusa) 
                      ? eclusaColors[eclusa as keyof typeof eclusaColors]
                      : undefined
                  }}
                >
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: eclusaColors[eclusa as keyof typeof eclusaColors] }}
                    ></div>
                    {eclusa}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      
      {/* Mobile */}
      <div className="sm:hidden h-full flex flex-col gap-6">
        
        {/* Gráfico de Linha */}
        <div className="h-[calc(50%-12px)] bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex flex-col overflow-hidden">
          <div className="mb-2 flex-shrink-0">
            <h3 className="text-gray-800 font-semibold text-sm">Eficiência das Eclusas</h3>
          </div>
          <div className="flex-shrink-0">
            <FilterSection isMobile={true} />
          </div>
          <div className="flex-1 min-h-0 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <defs>
                {Object.entries(eclusaColors).map(([name, color]) => (
                  <linearGradient key={name} id={`gradient${name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.6} />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#64748b" />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 10 }} stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              {selectedEclusas.includes('Crestuma') && (
                <Line 
                  type="monotone" 
                  dataKey="Crestuma" 
                  stroke={eclusaColors.Crestuma} 
                  strokeWidth={3} 
                  dot={{ fill: eclusaColors.Crestuma, strokeWidth: 0, r: 4 }} 
                  activeDot={{ r: 6, strokeWidth: 2, stroke: eclusaColors.Crestuma }}
                  filter="drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))"
                />
              )}
              {selectedEclusas.includes('Carrapatelo') && (
                <Line 
                  type="monotone" 
                  dataKey="Carrapatelo" 
                  stroke={eclusaColors.Carrapatelo} 
                  strokeWidth={3} 
                  dot={{ fill: eclusaColors.Carrapatelo, strokeWidth: 0, r: 4 }} 
                  activeDot={{ r: 6, strokeWidth: 2, stroke: eclusaColors.Carrapatelo }}
                  filter="drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))"
                />
              )}
              {selectedEclusas.includes('Régua') && (
                <Line 
                  type="monotone" 
                  dataKey="Régua" 
                  stroke={eclusaColors.Régua} 
                  strokeWidth={3} 
                  dot={{ fill: eclusaColors.Régua, strokeWidth: 0, r: 4 }} 
                  activeDot={{ r: 6, strokeWidth: 2, stroke: eclusaColors.Régua }}
                  filter="drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))"
                />
              )}
              {selectedEclusas.includes('Valeira') && (
                <Line 
                  type="monotone" 
                  dataKey="Valeira" 
                  stroke={eclusaColors.Valeira} 
                  strokeWidth={3} 
                  dot={{ fill: eclusaColors.Valeira, strokeWidth: 0, r: 4 }} 
                  activeDot={{ r: 6, strokeWidth: 2, stroke: eclusaColors.Valeira }}
                  filter="drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))"
                />
              )}
              {selectedEclusas.includes('Pocinho') && (
                <Line 
                  type="monotone" 
                  dataKey="Pocinho" 
                  stroke={eclusaColors.Pocinho} 
                  strokeWidth={3} 
                  dot={{ fill: eclusaColors.Pocinho, strokeWidth: 0, r: 4 }} 
                  activeDot={{ r: 6, strokeWidth: 2, stroke: eclusaColors.Pocinho }}
                  filter="drop-shadow(0 2px 4px rgba(234, 179, 8, 0.3))"
                />
              )}
            </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Anel */}
        <div className="h-[calc(50%-12px)] bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex flex-col overflow-hidden">
          <div className="mb-2 flex-shrink-0">
            <h3 className="text-gray-800 font-semibold text-sm">Falhas por Eclusa</h3>
          </div>
          <div className="flex-1 min-h-0 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ringData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="falhas"
                >
                  {ringData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<RingTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Tablet */}
      <div className="hidden sm:block md:hidden h-full flex flex-col gap-3">
        
        {/* Gráfico de Linha */}
        <div className="h-[calc(50%-6px)] bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex flex-col overflow-hidden">
          <div className="mb-3 flex-shrink-0">
            <h3 className="text-gray-800 font-semibold text-base">Eficiência das Eclusas</h3>
          </div>
          <div className="flex-shrink-0">
            <FilterSection />
          </div>
          <div className="flex-1 min-h-0 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <defs>
                {Object.entries(eclusaColors).map(([name, color]) => (
                  <linearGradient key={name} id={`gradient${name}Tablet`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.6} />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              {selectedEclusas.includes('Crestuma') && (
                <Line 
                  type="monotone" 
                  dataKey="Crestuma" 
                  stroke={eclusaColors.Crestuma} 
                  strokeWidth={3} 
                  dot={{ fill: eclusaColors.Crestuma, strokeWidth: 0, r: 5 }} 
                  activeDot={{ r: 7, strokeWidth: 2, stroke: eclusaColors.Crestuma }}
                  filter="drop-shadow(0 2px 6px rgba(59, 130, 246, 0.4))"
                />
              )}
              {selectedEclusas.includes('Carrapatelo') && (
                <Line 
                  type="monotone" 
                  dataKey="Carrapatelo" 
                  stroke={eclusaColors.Carrapatelo} 
                  strokeWidth={3} 
                  dot={{ fill: eclusaColors.Carrapatelo, strokeWidth: 0, r: 5 }} 
                  activeDot={{ r: 7, strokeWidth: 2, stroke: eclusaColors.Carrapatelo }}
                  filter="drop-shadow(0 2px 6px rgba(245, 158, 11, 0.4))"
                />
              )}
              {selectedEclusas.includes('Régua') && (
                <Line 
                  type="monotone" 
                  dataKey="Régua" 
                  stroke={eclusaColors.Régua} 
                  strokeWidth={3} 
                  dot={{ fill: eclusaColors.Régua, strokeWidth: 0, r: 5 }} 
                  activeDot={{ r: 7, strokeWidth: 2, stroke: eclusaColors.Régua }}
                  filter="drop-shadow(0 2px 6px rgba(16, 185, 129, 0.4))"
                />
              )}
              {selectedEclusas.includes('Valeira') && (
                <Line 
                  type="monotone" 
                  dataKey="Valeira" 
                  stroke={eclusaColors.Valeira} 
                  strokeWidth={3} 
                  dot={{ fill: eclusaColors.Valeira, strokeWidth: 0, r: 5 }} 
                  activeDot={{ r: 7, strokeWidth: 2, stroke: eclusaColors.Valeira }}
                  filter="drop-shadow(0 2px 6px rgba(239, 68, 68, 0.4))"
                />
              )}
              {selectedEclusas.includes('Pocinho') && (
                <Line 
                  type="monotone" 
                  dataKey="Pocinho" 
                  stroke={eclusaColors.Pocinho} 
                  strokeWidth={3} 
                  dot={{ fill: eclusaColors.Pocinho, strokeWidth: 0, r: 5 }} 
                  activeDot={{ r: 7, strokeWidth: 2, stroke: eclusaColors.Pocinho }}
                  filter="drop-shadow(0 2px 6px rgba(234, 179, 8, 0.4))"
                />
              )}
            </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Anel */}
        <div className="h-[calc(50%-6px)] bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex flex-col overflow-hidden">
          <div className="mb-3 flex-shrink-0">
            <h3 className="text-gray-800 font-semibold text-base">Falhas por Eclusa</h3>
          </div>
          <div className="flex-1 min-h-0 w-full flex items-center overflow-hidden">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ringData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="falhas"
                  >
                    {ringData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<RingTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 pl-4">
              <div className="space-y-2">
                {ringData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs text-gray-700">{item.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">{item.falhas}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Desktop */}
      <div className="hidden md:block h-full flex flex-col gap-4">
        
        {/* Gráfico de Linha */}
        <div className="h-[calc(50%-8px)] bg-white rounded-xl shadow-xl border border-gray-100 p-5 flex flex-col overflow-hidden">
          <div className="mb-4 flex-shrink-0">
            <h3 className="text-gray-800 font-semibold text-lg">Eficiência das Eclusas</h3>
          </div>
          <div className="flex-shrink-0">
            <FilterSection />
          </div>
          <div className="flex-1 min-h-0 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <defs>
                {Object.entries(eclusaColors).map(([name, color]) => (
                  <linearGradient key={name} id={`gradient${name}Desktop`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.7} />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              {selectedEclusas.includes('Crestuma') && (
                <Line 
                  type="monotone" 
                  dataKey="Crestuma" 
                  stroke={eclusaColors.Crestuma} 
                  strokeWidth={4} 
                  dot={{ fill: eclusaColors.Crestuma, strokeWidth: 0, r: 6 }} 
                  activeDot={{ r: 8, strokeWidth: 3, stroke: eclusaColors.Crestuma }}
                  filter="drop-shadow(0 4px 8px rgba(59, 130, 246, 0.4))"
                />
              )}
              {selectedEclusas.includes('Carrapatelo') && (
                <Line 
                  type="monotone" 
                  dataKey="Carrapatelo" 
                  stroke={eclusaColors.Carrapatelo} 
                  strokeWidth={4} 
                  dot={{ fill: eclusaColors.Carrapatelo, strokeWidth: 0, r: 6 }} 
                  activeDot={{ r: 8, strokeWidth: 3, stroke: eclusaColors.Carrapatelo }}
                  filter="drop-shadow(0 4px 8px rgba(245, 158, 11, 0.4))"
                />
              )}
              {selectedEclusas.includes('Régua') && (
                <Line 
                  type="monotone" 
                  dataKey="Régua" 
                  stroke={eclusaColors.Régua} 
                  strokeWidth={4} 
                  dot={{ fill: eclusaColors.Régua, strokeWidth: 0, r: 6 }} 
                  activeDot={{ r: 8, strokeWidth: 3, stroke: eclusaColors.Régua }}
                  filter="drop-shadow(0 4px 8px rgba(16, 185, 129, 0.4))"
                />
              )}
              {selectedEclusas.includes('Valeira') && (
                <Line 
                  type="monotone" 
                  dataKey="Valeira" 
                  stroke={eclusaColors.Valeira} 
                  strokeWidth={4} 
                  dot={{ fill: eclusaColors.Valeira, strokeWidth: 0, r: 6 }} 
                  activeDot={{ r: 8, strokeWidth: 3, stroke: eclusaColors.Valeira }}
                  filter="drop-shadow(0 4px 8px rgba(239, 68, 68, 0.4))"
                />
              )}
              {selectedEclusas.includes('Pocinho') && (
                <Line 
                  type="monotone" 
                  dataKey="Pocinho" 
                  stroke={eclusaColors.Pocinho} 
                  strokeWidth={4} 
                  dot={{ fill: eclusaColors.Pocinho, strokeWidth: 0, r: 6 }} 
                  activeDot={{ r: 8, strokeWidth: 3, stroke: eclusaColors.Pocinho }}
                  filter="drop-shadow(0 4px 8px rgba(234, 179, 8, 0.4))"
                />
              )}
            </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Anel */}
        <div className="h-[calc(50%-8px)] bg-white rounded-xl shadow-xl border border-gray-100 p-5 flex flex-col overflow-hidden">
          <div className="mb-4 flex-shrink-0">
            <h3 className="text-gray-800 font-semibold text-lg">Falhas por Eclusa</h3>
          </div>
          <div className="flex-1 min-h-0 w-full flex items-center overflow-hidden">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ringData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="falhas"
                  >
                    {ringData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<RingTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 pl-6 h-full overflow-hidden">
              <div className="h-full flex flex-col justify-center space-y-3">
                <div className="mb-2 flex-shrink-0">
                  <p className="text-gray-600 font-medium text-sm">Total de Falhas: {ringData.reduce((acc, item) => acc + item.falhas, 0)}</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {ringData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-800">{item.falhas}</span>
                        <span className="text-xs text-gray-500 ml-1">falhas</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ModernCharts;