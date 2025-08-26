// DatabaseMonitor.tsx - Monitor EXCLUSIVO do Banco de Dados
import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Server,
  BarChart3,
  TrendingUp,
  HardDrive,
  Zap,
  Users,
  Table,
  Shield,
  Cpu,
  Network,
  Timer,
  FileText,
  Search,
  Filter,
  ChevronDown,
  PieChart,
  LineChart,
  Calendar,
  Archive,
  Settings
} from 'lucide-react';

// Interfaces para dados do banco
interface DatabaseStats {
  connections: number;
  size: string;
  status: 'healthy' | 'warning' | 'error';
  tablesCount: number;
  lastBackup: string;
  version: string;
  responseTime: number;
  uptime: string;
  lastUpdate: string;
}

interface DatabaseLog {
  timestamp: string;
  level: string;
  message: string;
  source: string;
}

interface DatabaseData {
  databaseStats: DatabaseStats;
  databaseLogs: DatabaseLog[];
}

export default function DatabaseMonitor() {
  const [databaseData, setDatabaseData] = useState<DatabaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'performance' | 'logs' | 'tables'>('overview');
  const [logFilter, setLogFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ⚠️ LIMITES REALISTAS PARA ESTE PROJETO
  const thresholds = {
    connections: { warning: 80, alarm: 95 },      // conexões ativas (mais realista)
    responseTime: { warning: 1000, alarm: 3000 }, // ms (1s warning, 3s alarm - mais realista)
    tables: { warning: 120, alarm: 140 }          // número de tabelas (você tem 115, então 120+ é warning)
  };

  // Função para buscar dados REAIS do banco
  const fetchDatabaseData = async () => {
    try {
      setError(null);
      console.log('🔄 Buscando dados do banco de dados...');
      
      const response = await fetch('http://localhost:1337/api/database/all');
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Dados do banco recebidos:', data);
      
      setDatabaseData(data);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('❌ Erro ao buscar dados do banco:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setLoading(false);
    }
  };

  // Buscar dados na inicialização e a cada 10 segundos
  useEffect(() => {
    fetchDatabaseData();
    const interval = setInterval(fetchDatabaseData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // ⚠️ FUNÇÃO PARA DETERMINAR STATUS BASEADO NOS LIMITES
  const getMetricStatus = (value: number, metric: keyof typeof thresholds): 'normal' | 'warning' | 'alarm' => {
    const limits = thresholds[metric];
    if (value >= limits.alarm) return 'alarm';
    if (value >= limits.warning) return 'warning';
    return 'normal';
  };

  // 🎨 FUNÇÃO PARA CORES BASEADA NO STATUS DA MÉTRICA
  const getMetricColor = (status: 'normal' | 'warning' | 'alarm') => {
    switch (status) {
      case 'alarm':
        return {
          bg: 'bg-gradient-to-br from-red-50 to-red-100',
          border: 'border-red-200',
          text: 'text-red-600',
          textSecondary: 'text-red-700',
          bar: 'bg-red-600'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
          border: 'border-yellow-200',
          text: 'text-yellow-600',
          textSecondary: 'text-yellow-700',
          bar: 'bg-yellow-600'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
          border: 'border-blue-200',
          text: 'text-blue-600',
          textSecondary: 'text-blue-700',
          bar: 'bg-blue-600'
        };
    }
  };

  // Função para obter cor por status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-500 bg-red-50 border-red-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-lg text-gray-600">Carregando dados do banco de dados...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Erro ao Carregar Banco</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={fetchDatabaseData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!databaseData) {
    return <div>Dados do banco não disponíveis</div>;
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      
      {/* HEADER COMPACTO E RESPONSIVO */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100">
        <div className="p-3 sm:p-4">
          
          {/* Layout Responsivo */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
            
            {/* Status Premium - Mobile First */}
            <div className={`flex items-center justify-center lg:justify-start gap-2 px-3 py-2 rounded-lg border shadow-sm ${
              databaseData.databaseStats.status === 'healthy' ? 'bg-green-50 border-green-200 text-green-700' :
              databaseData.databaseStats.status === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 
              'bg-red-50 border-red-200 text-red-700'
            }`} style={{ fontFamily: '"Inter", sans-serif' }}>
              <div className={`w-2 h-2 rounded-full relative ${
                databaseData.databaseStats.status === 'healthy' ? 'bg-green-500 shadow-green-500/30 shadow-md' :
                databaseData.databaseStats.status === 'warning' ? 'bg-yellow-500 shadow-yellow-500/30 shadow-md' : 
                'bg-red-500 shadow-red-500/30 shadow-md'
              }`}>
                {databaseData.databaseStats.status === 'healthy' && (
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                )}
              </div>
              <span className="font-medium text-sm lg:text-base">
                {databaseData.databaseStats.status === 'healthy' ? 'Sistema Saudável' : 
                 databaseData.databaseStats.status === 'warning' ? 'Atenção Requerida' : 'Erro Crítico'}
              </span>
            </div>

            {/* Tabs de Navegação Responsivos */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-1 sm:gap-2">
              {[
                { id: 'overview', label: 'Geral', icon: <PieChart className="w-4 h-4" /> },
                { id: 'performance', label: 'Performance', icon: <LineChart className="w-4 h-4" /> },
                { id: 'tables', label: 'Tabelas', icon: <Table className="w-4 h-4" /> },
                { id: 'logs', label: 'Logs', icon: <FileText className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`px-2 sm:px-3 lg:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 ${
                    activeView === tab.id
                      ? 'bg-green-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'overview' && (
          <div className="h-full p-6 overflow-auto bg-gray-50/50">
            
            {/* MÉTRICAS PRINCIPAIS PREMIUM */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              
              {/* Card Conexões Premium */}
              {(() => {
                const connectionStatus = getMetricStatus(databaseData.databaseStats.connections, 'connections');
                const isWarning = connectionStatus !== 'normal';
                return (
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 
                                shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 ${
                        isWarning ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'
                      }`}>
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        isWarning ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {connectionStatus === 'alarm' ? 'CRÍTICO' : connectionStatus === 'warning' ? 'ATENÇÃO' : 'NORMAL'}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                      {databaseData.databaseStats.connections}
                    </div>
                    <div className="text-sm text-gray-600 font-medium" style={{ fontFamily: '"Inter", sans-serif' }}>Conexões Ativas</div>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWarning ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min((databaseData.databaseStats.connections / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })()}

              {/* Card Tabelas Premium */}
              {(() => {
                const tableStatus = getMetricStatus(databaseData.databaseStats.tablesCount, 'tables');
                const isWarning = tableStatus !== 'normal';
                return (
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 
                                shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 ${
                        isWarning ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-purple-500 to-purple-600'
                      }`}>
                        <Table className="w-6 h-6 text-white" />
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        isWarning ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-purple-100 text-purple-700 border border-purple-200'
                      }`}>
                        {tableStatus === 'alarm' ? 'MUITAS' : tableStatus === 'warning' ? 'ALTA' : 'NORMAL'}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                      {databaseData.databaseStats.tablesCount}
                    </div>
                    <div className="text-sm text-gray-600 font-medium" style={{ fontFamily: '"Inter", sans-serif' }}>Tabelas no DB</div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <Archive className="w-3 h-3" />
                      <span>Estruturas cadastradas</span>
                    </div>
                  </div>
                );
              })()}

              {/* Card Tamanho Premium */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 
                            shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                    <HardDrive className="w-6 h-6 text-white" />
                  </div>
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-medium">
                    STORAGE
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  {databaseData.databaseStats.size}
                </div>
                <div className="text-sm text-gray-600 font-medium" style={{ fontFamily: '"Inter", sans-serif' }}>Tamanho Total</div>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>Último backup: {new Date(databaseData.databaseStats.lastBackup).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Card Tempo de Resposta Premium */}
              {(() => {
                const responseStatus = getMetricStatus(databaseData.databaseStats.responseTime, 'responseTime');
                const isWarning = responseStatus !== 'normal';
                return (
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 
                                shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 ${
                        isWarning ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-cyan-500 to-cyan-600'
                      }`}>
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        responseStatus === 'alarm' ? 'bg-red-100 text-red-700 border border-red-200' :
                        responseStatus === 'warning' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                        'bg-cyan-100 text-cyan-700 border border-cyan-200'
                      }`}>
                        {responseStatus === 'alarm' ? 'LENTO' : responseStatus === 'warning' ? 'MODERADO' : 'RÁPIDO'}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                      {databaseData.databaseStats.responseTime.toFixed(1)}ms
                    </div>
                    <div className="text-sm text-gray-600 font-medium" style={{ fontFamily: '"Inter", sans-serif' }}>Tempo de Resposta</div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <Timer className="w-3 h-3" />
                      <span>Latência média</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* INFORMAÇÕES DETALHADAS DO SISTEMA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Card Informações Gerais */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Server className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>Informações do Sistema</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Versão PostgreSQL</span>
                    <span className="text-sm font-mono text-gray-900">{databaseData.databaseStats.version}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Tempo de Atividade</span>
                    <span className="text-sm font-mono text-gray-900">{databaseData.databaseStats.uptime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Última Atualização</span>
                    <span className="text-sm font-mono text-gray-900">
                      {new Date(databaseData.databaseStats.lastUpdate).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Status de Performance */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>Status de Performance</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Conexões</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((databaseData.databaseStats.connections / 100) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-mono text-gray-900">{databaseData.databaseStats.connections}/100</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Resposta</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        getMetricStatus(databaseData.databaseStats.responseTime, 'responseTime') === 'normal' ? 'bg-green-500' :
                        getMetricStatus(databaseData.databaseStats.responseTime, 'responseTime') === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-mono text-gray-900">{databaseData.databaseStats.responseTime.toFixed(1)}ms</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Status Geral</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${
                        databaseData.databaseStats.status === 'healthy' ? 'text-green-500' :
                        databaseData.databaseStats.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {databaseData.databaseStats.status === 'healthy' ? 'Saudável' :
                         databaseData.databaseStats.status === 'warning' ? 'Atenção' : 'Erro'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'logs' && (
          <div className="h-full flex flex-col overflow-hidden">
            
            {/* Header da seção de Logs */}
            <div className="flex-shrink-0 bg-white border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>Logs do Sistema</h2>
                    <p className="text-sm text-gray-600">Eventos e atividades do banco de dados</p>
                  </div>
                </div>

                {/* Controles de filtro */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl 
                               focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                               text-sm transition-all duration-200 placeholder:text-gray-400"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={logFilter}
                      onChange={(e) => setLogFilter(e.target.value)}
                      className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10
                               focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                               text-sm cursor-pointer transition-all duration-200 min-w-[120px]"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      <option value="all">Todos os níveis</option>
                      <option value="ERROR">Erros</option>
                      <option value="WARNING">Avisos</option>
                      <option value="SUCCESS">Sucessos</option>
                      <option value="INFO">Informações</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Área de Logs Premium */}
            <div className="flex-1 overflow-hidden bg-gray-50/50" style={{ height: 'calc(100% - 120px)' }}>
              <div className="h-full p-6 overflow-auto">
                {(() => {
                  // Filtrar logs baseado no filtro e busca
                  const filteredLogs = databaseData.databaseLogs.filter(log => {
                    const matchesFilter = logFilter === 'all' || log.level === logFilter;
                    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        log.source.toLowerCase().includes(searchTerm.toLowerCase());
                    return matchesFilter && matchesSearch;
                  });

                  if (filteredLogs.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-lg font-medium text-gray-500" style={{ fontFamily: '"Inter", sans-serif' }}>
                          {searchTerm || logFilter !== 'all' ? 'Nenhum log encontrado' : 'Nenhum log disponível'}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {searchTerm || logFilter !== 'all' ? 'Tente ajustar os filtros' : 'Os logs aparecerão aqui quando disponíveis'}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {filteredLogs.map((log, index) => (
                        <div key={index} className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 
                                           shadow-sm hover:shadow-md transition-all duration-200 group">
                          <div className="flex items-start gap-3">
                            
                            {/* Indicador de nível */}
                            <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 shadow-sm ${
                              log.level === 'ERROR' ? 'bg-red-500 shadow-red-500/30' :
                              log.level === 'WARNING' ? 'bg-yellow-500 shadow-yellow-500/30' :
                              log.level === 'SUCCESS' ? 'bg-green-500 shadow-green-500/30' : 
                              'bg-blue-500 shadow-blue-500/30'
                            }`}></div>
                            
                            <div className="flex-1 min-w-0">
                              {/* Header do log */}
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                <div className="flex items-center gap-3">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${
                                    log.level === 'ERROR' ? 'bg-red-50 text-red-700 border-red-200' :
                                    log.level === 'WARNING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    log.level === 'SUCCESS' ? 'bg-green-50 text-green-700 border-green-200' : 
                                    'bg-blue-50 text-blue-700 border-blue-200'
                                  }`} style={{ fontFamily: '"Inter", sans-serif' }}>
                                    {log.level}
                                  </span>
                                  
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="font-medium" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{log.source}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span className="font-mono">
                                    {new Date(log.timestamp).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Mensagem do log */}
                              <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-200/50">
                                <p className="text-sm text-gray-700 leading-relaxed break-words" 
                                   style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                                  {log.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* View de Tabelas */}
        {activeView === 'tables' && (
          <div className="h-full p-6 bg-gray-50/50 overflow-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Table className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>Estrutura do Banco</h3>
                  <p className="text-sm text-gray-600">Informações sobre tabelas e estruturas</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-200/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Table className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Total de Tabelas</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 font-mono">{databaseData.databaseStats.tablesCount}</div>
                </div>
                
                <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-200/50">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Tamanho Total</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 font-mono">{databaseData.databaseStats.size}</div>
                </div>
                
                <div className="bg-green-50/50 rounded-lg p-4 border border-green-200/50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Status</span>
                  </div>
                  <div className="text-lg font-bold text-green-600 capitalize">{databaseData.databaseStats.status}</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center" style={{ fontFamily: '"Inter", sans-serif' }}>
                  💡 Detalhes específicos das tabelas serão implementados em versões futuras
                </p>
              </div>
            </div>
          </div>
        )}

        {/* View de Performance */}
        {activeView === 'performance' && (
          <div className="h-full p-6 bg-gray-50/50 overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Gráfico de Performance */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>Métricas de Performance</h3>
                    <p className="text-sm text-gray-600">Tempo de resposta e conexões</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Tempo de Resposta</span>
                    <span className="text-lg font-bold text-cyan-600 font-mono">{databaseData.databaseStats.responseTime.toFixed(1)}ms</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        getMetricStatus(databaseData.databaseStats.responseTime, 'responseTime') === 'normal' ? 'bg-green-500' :
                        getMetricStatus(databaseData.databaseStats.responseTime, 'responseTime') === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((databaseData.databaseStats.responseTime / 3000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mt-2">
                    <span>0ms</span>
                    <span className="text-center">1500ms</span>
                    <span className="text-right">3000ms</span>
                  </div>
                </div>
              </div>
              
              {/* Monitoramento em Tempo Real */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>Status em Tempo Real</h3>
                    <p className="text-sm text-gray-600">Monitoramento contínuo do sistema</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-700">Sistema Online</span>
                    </div>
                    <span className="text-sm font-mono text-green-600">{databaseData.databaseStats.uptime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm font-medium text-blue-700">Conexões Ativas</span>
                    <span className="text-sm font-mono text-blue-600">{databaseData.databaseStats.connections}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-sm font-medium text-purple-700">Última Atualização</span>
                    <span className="text-xs font-mono text-purple-600">
                      {lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}