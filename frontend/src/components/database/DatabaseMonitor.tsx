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
  Table
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
      
      {/* HEADER ULTRA COMPACTO */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-bold text-gray-900 truncate">Banco PostgreSQL</h1>
              <p className="text-xs text-gray-600 truncate">
                {databaseData.databaseStats.version}
                {lastUpdate && ` • ${lastUpdate.toLocaleTimeString()}`}
              </p>
            </div>
          </div>
          
          {/* Status Compacto */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(databaseData.databaseStats.status)}`}>
            <CheckCircle className="w-3 h-3" />
            <span className="font-medium">
              {databaseData.databaseStats.status === 'healthy' ? 'OK' : 
               databaseData.databaseStats.status === 'warning' ? 'Atenção' : 'Erro'}
            </span>
          </div>
        </div>

        {/* MÉTRICAS ULTRA COMPACTAS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
          
          {/* Conexões */}
          {(() => {
            const connectionStatus = getMetricStatus(databaseData.databaseStats.connections, 'connections');
            const colors = getMetricColor(connectionStatus);
            return (
              <div className={`${colors.bg} p-2 rounded border ${colors.border}`}>
                <div className="flex items-center justify-between">
                  <Users className={`w-3 h-3 ${colors.text}`} />
                  <span className={`text-sm font-bold ${colors.text}`}>
                    {databaseData.databaseStats.connections}
                  </span>
                </div>
                <div className={`text-xs ${colors.textSecondary} truncate`}>Conexões</div>
              </div>
            );
          })()}

          {/* Tabelas */}
          {(() => {
            const tableStatus = getMetricStatus(databaseData.databaseStats.tablesCount, 'tables');
            const colors = getMetricColor(tableStatus);
            return (
              <div className={`${colors.bg} p-2 rounded border ${colors.border}`}>
                <div className="flex items-center justify-between">
                  <Table className={`w-3 h-3 ${colors.text}`} />
                  <span className={`text-sm font-bold ${colors.text}`}>
                    {databaseData.databaseStats.tablesCount}
                  </span>
                </div>
                <div className={`text-xs ${colors.textSecondary} truncate`}>Tabelas</div>
              </div>
            );
          })()}

          {/* Tamanho */}
          <div className="bg-purple-50 p-2 rounded border border-purple-200">
            <div className="flex items-center justify-between">
              <HardDrive className="w-3 h-3 text-purple-600" />
              <span className="text-sm font-bold text-purple-600">
                {databaseData.databaseStats.size}
              </span>
            </div>
            <div className="text-xs text-purple-700 truncate">Tamanho</div>
          </div>

          {/* Resposta */}
          {(() => {
            const responseStatus = getMetricStatus(databaseData.databaseStats.responseTime, 'responseTime');
            const colors = getMetricColor(responseStatus);
            return (
              <div className={`${colors.bg} p-2 rounded border ${colors.border}`}>
                <div className="flex items-center justify-between">
                  <Zap className={`w-3 h-3 ${colors.text}`} />
                  <span className={`text-sm font-bold ${colors.text}`}>
                    {databaseData.databaseStats.responseTime.toFixed(1)}ms
                  </span>
                </div>
                <div className={`text-xs ${colors.textSecondary} truncate`}>Resposta</div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* LOGS COM ALTURA CALCULADA PRECISA */}
      <div className="flex-1 bg-white border-t border-gray-200 overflow-hidden" style={{ height: 'calc(100% - 140px)' }}>
        <div className="flex-shrink-0 p-2 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            Logs do Banco
          </h2>
        </div>

        <div className="flex-1 overflow-auto p-2" style={{ height: 'calc(100% - 40px)' }}>
          <div className="space-y-2">
            {databaseData.databaseLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Activity className="w-12 h-12 text-gray-300 mb-2" />
                <p className="text-sm">Nenhum log disponível</p>
              </div>
            ) : (
              databaseData.databaseLogs.map((log, index) => (
                <div key={index} className="bg-gray-50 rounded p-2 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                      log.level === 'ERROR' ? 'bg-red-500' :
                      log.level === 'WARNING' ? 'bg-yellow-500' :
                      log.level === 'SUCCESS' ? 'bg-green-500' : 
                      'bg-blue-500'
                    }`}></div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-center xs:gap-2 mb-1">
                        <span className={`text-xs font-semibold px-1 py-0.5 rounded ${
                          log.level === 'ERROR' ? 'bg-red-100 text-red-700' :
                          log.level === 'WARNING' ? 'bg-yellow-100 text-yellow-700' :
                          log.level === 'SUCCESS' ? 'bg-green-100 text-green-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {log.level}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="truncate">{log.source}</span>
                          <span>•</span>
                          <span className="whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-700 break-words">{log.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}