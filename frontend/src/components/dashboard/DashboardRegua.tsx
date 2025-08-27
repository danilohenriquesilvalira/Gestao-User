import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const DashboardRegua: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('24h');
  const [alarmFilter, setAlarmFilter] = useState('todos');

  // Dados da Régua
  const reguaData = {
    name: "Régua",
    status: "Operacional",
    userLogado: "Carlos Mendes",
    cotaMontante: "16.1m",
    cotaCaldeira: "13.5m", 
    cotaJusante: "11.2m",
    eficiencia: 87,
    proximaManutencao: "5 dias",
    comunicacao: "Online",
    inundacao: "Normal",
    emergencia: false
  };

  // Dados de eficiência
  const eficienciaData = [
    { hora: '00:00', eficiencia: 85 },
    { hora: '04:00', eficiencia: 78 },
    { hora: '08:00', eficiencia: 92 },
    { hora: '12:00', eficiencia: 87 },
    { hora: '16:00', eficiencia: 89 },
    { hora: '20:00', eficiencia: 83 }
  ];

  // Dados reais das falhas da Eclusa Régua
  const falhasReais = [
    { id: 1, descricao: 'Protecção 24V entradas analógicas disparou', sistema: 'Elétrico', ativo: true, timestamp: '14:25' },
    { id: 2, descricao: 'Protecção sobretensão descarregador disparou', sistema: 'Elétrico', ativo: true, timestamp: '13:42' },
    { id: 3, descricao: 'Sem comunicação com sala comando', sistema: 'Comunicação', ativo: true, timestamp: '13:15' },
    { id: 4, descricao: 'Emergência activada', sistema: 'Segurança', ativo: true, timestamp: '12:58' },
    { id: 5, descricao: 'Bomba comporta direita não responde', sistema: 'Hidráulico', ativo: true, timestamp: '12:30' },
    { id: 6, descricao: 'Sensor posição comporta direita avariado', sistema: 'Sensores', ativo: true, timestamp: '12:15' },
    { id: 7, descricao: 'Avaria fonte 400VAC/24VDC', sistema: 'Elétrico', ativo: false, timestamp: '11:45' },
    { id: 8, descricao: 'Protecção bomba comporta esquerda disparou', sistema: 'Hidráulico', ativo: false, timestamp: '11:22' },
    { id: 9, descricao: 'Autómato - erro diagnóstico', sistema: 'PLC', ativo: true, timestamp: '10:58' },
    { id: 10, descricao: 'Laser jusante - obstrução detectada', sistema: 'Sensores', ativo: true, timestamp: '10:35' },
    { id: 11, descricao: 'Variador motor direito avariado', sistema: 'Motor', ativo: false, timestamp: '10:12' },
    { id: 12, descricao: 'Porta desnivelada - paragem', sistema: 'Mecânico', ativo: true, timestamp: '09:45' },
    { id: 13, descricao: 'Inundação poço contrapesos porta montante', sistema: 'Hidráulico', ativo: true, timestamp: '09:22' },
    { id: 14, descricao: 'Sem comunicação quadro enchimento', sistema: 'Comunicação', ativo: false, timestamp: '08:55' },
    { id: 15, descricao: 'Radar jusante com erro', sistema: 'Sensores', ativo: true, timestamp: '08:30' }
  ];

  // Dados de alarmes - usando as mesmas falhas reais
  const alarmesDataCompletos = falhasReais.slice(0, 10).map((falha) => ({
    id: falha.id,
    tipo: falha.ativo ? (falha.sistema === 'Segurança' || falha.sistema === 'Elétrico' ? 'Crítico' : 'Aviso') : 'Info',
    equipamento: falha.sistema,
    mensagem: falha.descricao,
    timestamp: falha.timestamp,
    status: falha.ativo ? 'ativo' : 'resolvido'
  }));

  // Filtrar alarmes baseado no filtro selecionado
  const alarmesData = alarmesDataCompletos.filter((alarme) => {
    if (alarmFilter === 'todos') return true;
    if (alarmFilter === 'ativos') return alarme.status === 'ativo';
    if (alarmFilter === 'resolvidos') return alarme.status === 'resolvido';
    if (alarmFilter === 'criticos') return alarme.tipo === 'Crítico';
    return true;
  });

  // Dados por equipamento real da eclusa
  const equipamentosEclusa = [
    { equipamento: 'Enchimento', falhas: 3, cor: '#3B82F6', descricao: 'Sistema de enchimento da câmara' },
    { equipamento: 'Esvaziamento', falhas: 2, cor: '#F59E0B', descricao: 'Sistema de esvaziamento da câmara' },
    { equipamento: 'Porta Jusante', falhas: 4, cor: '#EF4444', descricao: 'Porta de acesso jusante' },
    { equipamento: 'Porta Montante', falhas: 2, cor: '#10B981', descricao: 'Porta de acesso montante' },
    { equipamento: 'Sala Comando', falhas: 3, cor: '#8B5CF6', descricao: 'Centro de controle e supervisão' },
    { equipamento: 'Esgoto e Drenagem', falhas: 1, cor: '#F97316', descricao: 'Sistema de esgotamento' }
  ];

  // Dados fixos para o gráfico de falhas por tipo
  const falhasPorTipo = [
    { tipo: 'Elétrico', quantidade: 2, total: 3, resolvidas: 1, cor: '#EF4444' },
    { tipo: 'Hidráulico', quantidade: 2, total: 3, resolvidas: 1, cor: '#3B82F6' },
    { tipo: 'Sensores', quantidade: 3, total: 3, resolvidas: 0, cor: '#F59E0B' },
    { tipo: 'Comunicação', quantidade: 1, total: 2, resolvidas: 1, cor: '#10B981' },
    { tipo: 'Segurança', quantidade: 1, total: 1, resolvidas: 0, cor: '#8B5CF6' },
    { tipo: 'PLC', quantidade: 1, total: 1, resolvidas: 0, cor: '#F97316' },
    { tipo: 'Mecânico', quantidade: 1, total: 1, resolvidas: 0, cor: '#EC4899' }
  ];

  const falhasPorDia = [
    { dia: 'Seg', falhas: 2 },
    { dia: 'Ter', falhas: 4 },
    { dia: 'Qua', falhas: 1 },
    { dia: 'Qui', falhas: 3 },
    { dia: 'Sex', falhas: 5 },
    { dia: 'Sab', falhas: 1 },
    { dia: 'Dom', falhas: 0 }
  ];

  const falhasPorMes = [
    { mes: 'Jan', falhas: 15 },
    { mes: 'Fev', falhas: 8 },
    { mes: 'Mar', falhas: 12 },
    { mes: 'Abr', falhas: 6 },
    { mes: 'Mai', falhas: 18 },
    { mes: 'Jun', falhas: 10 }
  ];

  const totalFalhasAtivas = equipamentosEclusa.reduce((acc, item) => acc + item.falhas, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operacional': return 'text-green-600';
      case 'Manutenção': return 'text-yellow-600';
      case 'Falha': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAlarmIcon = (tipo: string) => {
    switch (tipo) {
      case 'Crítico':
        return (
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
          </svg>
        );
      case 'Aviso':
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 border-0 rounded-xl shadow-2xl border border-gray-100">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 py-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <p className="text-sm font-medium text-gray-700">
                {`${entry.dataKey}: ${entry.value}`}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartOptions = [
    { 
      id: 'overview', 
      label: 'Visão Geral', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
      </svg>
    },
    { 
      id: 'daily', 
      label: 'Por Dia', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
      </svg>
    },
    { 
      id: 'monthly', 
      label: 'Por Mês', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
      </svg>
    },
    { 
      id: 'equipment', 
      label: 'Por Equipamento', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
      </svg>
    },
    { 
      id: 'failures', 
      label: 'Por Falhas', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zm-1 14h2v2h-2v-2zm0-8h2v6h-2V8z"/>
      </svg>
    }
  ];

  return (
    <div className="w-full h-full flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-5 overflow-hidden">
      
      {/* CARD DA RÉGUA - Mobile First */}
      <div className="w-full bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden flex-shrink-0">
        <div className="h-3 bg-green-500 rounded-t-xl"></div>
        <div className="p-3 sm:p-4 md:p-5 lg:p-4 xl:p-5">
          {/* Header limpo - Nome e Status - Mobile First */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 21h18v-2H3v2zm0-4h18v-6H3v6zm0-10v2h18V7H3z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Eclusa {reguaData.name}</h2>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${reguaData.status === 'Operacional' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-sm font-medium ${getStatusColor(reguaData.status)}`}>{reguaData.status}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{reguaData.eficiencia}%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Eficiência</div>
            </div>
          </div>

          {/* Informações principais em grid limpo - Mobile First */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            
            {/* Operador */}
            <div className="col-span-1 xs:col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-50 rounded-lg p-2 sm:p-3">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <div className="text-xs text-gray-500 uppercase tracking-wide hidden sm:block">Operador</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide sm:hidden">OP</div>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-900">{reguaData.userLogado}</div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="text-xs text-green-600 font-medium">Online</div>
              </div>
            </div>

            {/* Níveis de Água - 3 colunas */}
            <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
              <div className="text-xs text-blue-600 uppercase tracking-wide mb-1">Montante</div>
              <div className="text-xs sm:text-sm font-bold text-blue-800">{reguaData.cotaMontante}</div>
            </div>

            <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
              <div className="text-xs text-blue-600 uppercase tracking-wide mb-1">Caldeira</div>
              <div className="text-xs sm:text-sm font-bold text-blue-800">{reguaData.cotaCaldeira}</div>
            </div>

            <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
              <div className="text-xs text-blue-600 uppercase tracking-wide mb-1">Jusante</div>
              <div className="text-xs sm:text-sm font-bold text-blue-800">{reguaData.cotaJusante}</div>
            </div>

            {/* Status Geral */}
            <div className="col-span-1 xs:col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-50 rounded-lg p-2 sm:p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 sm:mb-2">Status Sistemas</div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center gap-1">
                  <svg className={`w-3 h-3 sm:w-4 sm:h-4 ${reguaData.comunicacao === 'Online' ? 'text-green-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  <span className="text-xs text-gray-600 hidden sm:block">COM</span>
                  <span className="text-xs text-gray-600 sm:hidden">C</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <svg className={`w-3 h-3 sm:w-4 sm:h-4 ${reguaData.inundacao === 'Normal' ? 'text-green-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3.77L11.25 4.61C11.25 4.61 6 10.26 6 14c0 3.31 2.69 6 6 6s6-2.69 6-6c0-3.74-5.25-9.39-5.25-9.39L12 3.77zM12 18.5c-2.49 0-4.5-2.01-4.5-4.5 0-1.77 2.79-5.75 4.5-7.72 1.71 1.97 4.5 5.95 4.5 7.72 0 2.49-2.01 4.5-4.5 4.5z"/>
                  </svg>
                  <span className="text-xs text-gray-600 hidden sm:block">NIV</span>
                  <span className="text-xs text-gray-600 sm:hidden">N</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <svg className={`w-3 h-3 sm:w-4 sm:h-4 ${!reguaData.emergencia ? 'text-green-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
                  </svg>
                  <span className="text-xs text-gray-600 hidden sm:block">EMG</span>
                  <span className="text-xs text-gray-600 sm:hidden">E</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA - ALARMES E FALHAS - Mobile First */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 overflow-hidden">
        
        {/* ALARMES - Mobile First */}
        <div className="lg:col-span-1 xl:col-span-2 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col max-h-full">
          <div className="h-3 bg-orange-500 rounded-t-xl"></div>
          <div className="p-2 sm:p-3 lg:p-4 flex-1 flex flex-col min-h-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2 sm:mb-3 flex-shrink-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <h3 className="text-gray-800 font-semibold text-xs sm:text-sm">Alarmes e Avisos</h3>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Filtros dos alarmes - Mobile Optimized */}
                <div className="flex gap-1 flex-wrap">
                  {[
                    { 
                      id: 'todos', 
                      label: 'Todos', 
                      icon: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                      </svg>
                    },
                    { 
                      id: 'ativos', 
                      label: 'Ativos', 
                      icon: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 13.5l3.5 2.5L12 18.5 8.5 16l3.5-2.5z"/>
                      </svg>
                    },
                    { 
                      id: 'criticos', 
                      label: 'Críticos', 
                      icon: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                      </svg>
                    },
                    { 
                      id: 'resolvidos', 
                      label: 'Resolvidos', 
                      icon: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                      </svg>
                    }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setAlarmFilter(filter.id)}
                      className={`p-1 sm:p-1.5 rounded-lg transition-all ${
                        alarmFilter === filter.id
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={filter.label}
                    >
                      {filter.icon}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-1 ml-1 sm:ml-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">{alarmesDataCompletos.filter(a => a.status === 'ativo').length}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-auto space-y-1 sm:space-y-2 pr-1"
                 style={{
                   scrollbarWidth: 'thin',
                   scrollbarColor: '#fb923c #fed7aa',
                   maxHeight: 'calc(100% - 4rem)'
                 }}>
              {alarmesData.map((alarme) => (
                <div key={alarme.id} className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-l-3 sm:border-l-4 shadow-sm hover:shadow-md transition-all duration-200 ${
                  alarme.tipo === 'Crítico' ? 'bg-red-50 border-red-500 hover:bg-red-100' :
                  alarme.tipo === 'Aviso' ? 'bg-yellow-50 border-yellow-500 hover:bg-yellow-100' : 
                  'bg-blue-50 border-blue-500 hover:bg-blue-100'
                }`}>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getAlarmIcon(alarme.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{alarme.equipamento}</span>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-500 bg-white/60 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">{alarme.timestamp}</span>
                          {alarme.status === 'ativo' && (
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed mb-1 sm:mb-2">{alarme.mensagem}</p>
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <span className={`text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${
                          alarme.status === 'ativo' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {alarme.status === 'ativo' ? 'Ativo' : 'OK'}
                        </span>
                        <span className={`text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${
                          alarme.tipo === 'Crítico' ? 'bg-red-200 text-red-800' :
                          alarme.tipo === 'Aviso' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {alarme.tipo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ANÁLISE DE FALHAS - Mobile First */}
        <div className="lg:col-span-2 xl:col-span-3 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
          <div className="h-3 bg-red-500 rounded-t-xl"></div>
          <div className="p-2 sm:p-3 lg:p-4 flex-1 flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
              <div className="flex items-center gap-1 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h3 className="text-gray-800 font-semibold text-xs sm:text-sm">Análise de Falhas</h3>
              </div>
              
              {/* Filtros compactos - Mobile Optimized */}
              <div className="flex gap-1 flex-wrap overflow-x-auto">
                {chartOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedChart(option.id)}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs rounded-lg transition-all flex items-center gap-1 sm:gap-2 ${
                      selectedChart === option.id
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={option.label}
                  >
                    <span className="flex-shrink-0">{option.icon}</span>
                    <span className="hidden md:inline lg:hidden xl:inline text-xs">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Conteúdo dos gráficos */}
            <div className="flex-1 min-h-0">
              {selectedChart === 'overview' && (
                <div className="h-full flex flex-col">
                  {/* Gráfico de pizza expandido */}
                  <div className="flex-1 min-h-0 flex items-center justify-center">
                    <div className="w-full h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={equipamentosEclusa}
                            cx="50%"
                            cy="50%"
                            innerRadius="35%"
                            outerRadius="80%"
                            paddingAngle={5}
                            dataKey="falhas"
                          >
                            {equipamentosEclusa.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.cor} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Legenda moderna */}
                  <div className="flex-shrink-0 mt-4">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {equipamentosEclusa.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: item.cor }}></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">{item.equipamento}</div>
                            <div className="text-xs text-gray-500">{item.falhas} falha{item.falhas !== 1 ? 's' : ''}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedChart === 'daily' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={falhasPorDia}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.6} />
                    <XAxis dataKey="dia" tick={{ fontSize: 12 }} stroke="#64748b" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="falhas" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {selectedChart === 'monthly' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={falhasPorMes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.6} />
                    <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="#64748b" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="falhas" 
                      stroke="#EF4444" 
                      strokeWidth={3} 
                      dot={{ fill: '#EF4444', strokeWidth: 0, r: 5 }} 
                      activeDot={{ r: 7, strokeWidth: 2, stroke: '#EF4444' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {selectedChart === 'equipment' && (
                <div className="h-full flex flex-col gap-3 overflow-y-auto">
                  {equipamentosEclusa.map((item, index) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${item.cor}20`, border: `2px solid ${item.cor}` }}>
                            {/* Ícones específicos por equipamento */}
                            {item.equipamento === 'Enchimento' && (
                              <svg className="w-6 h-6" style={{ color: item.cor }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3.77L11.25 4.61C11.25 4.61 6 10.26 6 14c0 3.31 2.69 6 6 6s6-2.69 6-6c0-3.74-5.25-9.39-5.25-9.39L12 3.77z"/>
                              </svg>
                            )}
                            {item.equipamento === 'Esvaziamento' && (
                              <svg className="w-6 h-6" style={{ color: item.cor }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                              </svg>
                            )}
                            {item.equipamento === 'Porta Jusante' && (
                              <svg className="w-6 h-6" style={{ color: item.cor }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 19V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v14H3v2h18v-2h-2zM8 19V7h8v12H8z"/>
                              </svg>
                            )}
                            {item.equipamento === 'Porta Montante' && (
                              <svg className="w-6 h-6" style={{ color: item.cor }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 19V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v14H3v2h18v-2h-2zM8 19V7h8v12H8z"/>
                              </svg>
                            )}
                            {item.equipamento === 'Sala Comando' && (
                              <svg className="w-6 h-6" style={{ color: item.cor }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z"/>
                              </svg>
                            )}
                            {item.equipamento === 'Esgoto e Drenagem' && (
                              <svg className="w-6 h-6" style={{ color: item.cor }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-800">{item.equipamento}</div>
                            <div className="text-sm text-gray-500">{item.descricao}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: item.cor }}>{item.falhas}</div>
                          <div className="text-xs text-gray-500 font-medium">falha{item.falhas !== 1 ? 's' : ''} ativa{item.falhas !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                      
                      {/* Barra de progresso visual */}
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300" 
                          style={{ 
                            backgroundColor: item.cor, 
                            width: `${Math.min((item.falhas / Math.max(...equipamentosEclusa.map(f => f.falhas))) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedChart === 'failures' && (
                <div className="h-full flex flex-col">
                  {/* Gráfico de barras personalizado */}
                  <div className="flex-1 space-y-3 overflow-y-auto">
                    {falhasPorTipo.map((sistema, index) => {
                      const maxQuantidade = Math.max(...falhasPorTipo.map(f => f.quantidade));
                      const porcentagem = maxQuantidade > 0 ? (sistema.quantidade / maxQuantidade) * 100 : 0;
                      
                      return (
                        <div key={index} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                          {/* Header do sistema */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: sistema.cor }}
                              ></div>
                              <div>
                                <h4 className="font-semibold text-gray-800 text-sm">{sistema.tipo}</h4>
                                <p className="text-xs text-gray-500">Sistema de falhas</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold" style={{ color: sistema.cor }}>
                                {sistema.quantidade}
                              </div>
                              <div className="text-xs text-gray-500">ativas</div>
                            </div>
                          </div>

                          {/* Barra de progresso visual */}
                          <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{ 
                                  backgroundColor: sistema.cor,
                                  width: `${Math.max(porcentagem, 5)}%`
                                }}
                              ></div>
                            </div>
                            
                            {/* Labels na barra */}
                            <div className="flex justify-between text-xs text-gray-600 mt-2">
                              <span>{sistema.quantidade} ativas</span>
                              <span>{sistema.resolvidas} resolvidas</span>
                              <span>{sistema.total} total</span>
                            </div>
                          </div>

                          {/* Indicadores de status */}
                          <div className="flex gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-xs text-gray-600">
                                <span className="font-medium text-red-600">{sistema.quantidade}</span> ativas
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-gray-600">
                                <span className="font-medium text-green-600">{sistema.resolvidas}</span> resolvidas
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <span className="text-xs text-gray-600">
                                <span className="font-medium">{sistema.total}</span> histórico
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Resumo */}
                  <div className="flex-shrink-0 mt-4 bg-red-50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-red-800 text-sm">Resumo Geral</h4>
                        <p className="text-xs text-red-600">Total de falhas por sistema</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-700">
                          {falhasPorTipo.reduce((acc, f) => acc + f.quantidade, 0)}
                        </div>
                        <div className="text-xs text-red-600">falhas ativas</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRegua;