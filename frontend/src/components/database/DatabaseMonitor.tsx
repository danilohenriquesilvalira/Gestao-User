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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Monitor do Banco de Dados</h1>
              <p className="text-gray-600">
                {databaseData.databaseStats.version}
                {lastUpdate && ` • Atualizado às ${lastUpdate.toLocaleTimeString()}`}
              </p>
            </div>
          </div>
          
          {/* Status Geral */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(databaseData.databaseStats.status)}`}>
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              {databaseData.databaseStats.status === 'healthy' ? 'Saudável' : 
               databaseData.databaseStats.status === 'warning' ? 'Atenção' : 'Erro'}
            </span>
          </div>
        </div>

        {/* Métricas Principais do Banco */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Conexões Ativas */}
          {(() => {
            const connectionStatus = getMetricStatus(databaseData.databaseStats.connections, 'connections');
            const colors = getMetricColor(connectionStatus);
            return (
              <div className={`${colors.bg} p-4 rounded-xl border ${colors.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className={`w-5 h-5 ${colors.text}`} />
                    <span className={`font-semibold ${colors.textSecondary}`}>Conexões</span>
                  </div>
                  <span className={`text-2xl font-bold ${colors.text}`}>
                    {databaseData.databaseStats.connections}
                  </span>
                </div>
                <div className={`text-sm ${colors.textSecondary}`}>
                  Conexões Ativas {connectionStatus !== 'normal' && `(${connectionStatus.toUpperCase()})`}
                </div>
              </div>
            );
          })()}

          {/* Tabelas */}
          {(() => {
            const tableStatus = getMetricStatus(databaseData.databaseStats.tablesCount, 'tables');
            const colors = getMetricColor(tableStatus);
            return (
              <div className={`${colors.bg} p-4 rounded-xl border ${colors.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Table className={`w-5 h-5 ${colors.text}`} />
                    <span className={`font-semibold ${colors.textSecondary}`}>Tabelas</span>
                  </div>
                  <span className={`text-2xl font-bold ${colors.text}`}>
                    {databaseData.databaseStats.tablesCount}
                  </span>
                </div>
                <div className={`text-sm ${colors.textSecondary}`}>
                  Tabelas no Banco {tableStatus !== 'normal' && `(${tableStatus.toUpperCase()})`}
                </div>
              </div>
            );
          })()}

          {/* Tamanho */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Tamanho</span>
              </div>
              <span className="text-lg font-bold text-purple-600">
                {databaseData.databaseStats.size}
              </span>
            </div>
            <div className="text-sm text-purple-700">Espaço Usado</div>
          </div>

          {/* Tempo de Resposta */}
          {(() => {
            const responseStatus = getMetricStatus(databaseData.databaseStats.responseTime, 'responseTime');
            const colors = getMetricColor(responseStatus);
            return (
              <div className={`${colors.bg} p-4 rounded-xl border ${colors.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className={`w-5 h-5 ${colors.text}`} />
                    <span className={`font-semibold ${colors.textSecondary}`}>Resposta</span>
                  </div>
                  <span className={`text-lg font-bold ${colors.text}`}>
                    {databaseData.databaseStats.responseTime.toFixed(1)}ms
                  </span>
                </div>
                <div className={`text-sm ${colors.textSecondary}`}>
                  Tempo de Query {responseStatus !== 'normal' && `(${responseStatus.toUpperCase()})`}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Seção de Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Informações Detalhadas */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Informações do Banco</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Versão:</span>
              <span className="text-gray-900">{databaseData.databaseStats.version}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(databaseData.databaseStats.status)}`}>
                {databaseData.databaseStats.status.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Uptime:</span>
              <span className="text-gray-900">{databaseData.databaseStats.uptime}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Último Backup:</span>
              <span className="text-gray-900 font-mono text-sm">{databaseData.databaseStats.lastBackup}</span>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Performance</h2>
          </div>

          <div className="space-y-4">
            {/* Conexões */}
            {(() => {
              const connectionStatus = getMetricStatus(databaseData.databaseStats.connections, 'connections');
              const colors = getMetricColor(connectionStatus);
              const percentage = Math.min((databaseData.databaseStats.connections / 100) * 100, 100);
              
              return (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Conexões Ativas 
                      {connectionStatus !== 'normal' && (
                        <span className={`ml-1 text-xs font-bold ${colors.text}`}>
                          ({connectionStatus.toUpperCase()})
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-gray-500">{databaseData.databaseStats.connections}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${colors.bar} h-2 rounded-full transition-all duration-500`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })()}

            {/* Tempo de Resposta */}
            {(() => {
              const responseStatus = getMetricStatus(databaseData.databaseStats.responseTime, 'responseTime');
              const colors = getMetricColor(responseStatus);
              const percentage = Math.min((databaseData.databaseStats.responseTime / 500) * 100, 100);
              
              return (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Tempo de Resposta
                      {responseStatus !== 'normal' && (
                        <span className={`ml-1 text-xs font-bold ${colors.text}`}>
                          ({responseStatus.toUpperCase()})
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-gray-500">{databaseData.databaseStats.responseTime.toFixed(1)}ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${colors.bar} h-2 rounded-full transition-all duration-500`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })()}

            {/* Tabelas */}
            {(() => {
              const tableStatus = getMetricStatus(databaseData.databaseStats.tablesCount, 'tables');
              const colors = getMetricColor(tableStatus);
              const percentage = Math.min((databaseData.databaseStats.tablesCount / 150) * 100, 100);
              
              return (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Utilização de Tabelas
                      {tableStatus !== 'normal' && (
                        <span className={`ml-1 text-xs font-bold ${colors.text}`}>
                          ({tableStatus.toUpperCase()})
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-gray-500">{databaseData.databaseStats.tablesCount} tabelas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${colors.bar} h-2 rounded-full transition-all duration-500`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Logs do Banco */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex-1 min-h-0">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Logs do Banco de Dados
          </h2>
        </div>

        <div className="p-4 overflow-auto h-full">
          <div className="space-y-3">
            {databaseData.databaseLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  log.level === 'ERROR' ? 'bg-red-500' :
                  log.level === 'WARNING' ? 'bg-yellow-500' :
                  log.level === 'SUCCESS' ? 'bg-green-500' : 
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      log.level === 'ERROR' ? 'bg-red-100 text-red-700' :
                      log.level === 'WARNING' ? 'bg-yellow-100 text-yellow-700' :
                      log.level === 'SUCCESS' ? 'bg-green-100 text-green-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-xs text-gray-500">{log.source}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}