// SystemMonitor.tsx - Monitor de Sistema REAL (sem simulações)
import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Wifi, 
  Network,
  HardDrive, 
  Cpu, 
  MemoryStick,
  Activity,
  TrendingUp,
  TrendingDown,
  Signal,
  Globe,
  Router,
  MonitorSpeaker,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Thermometer,
  Eye,
  Settings,
  BarChart3,
  RefreshCw
} from 'lucide-react';

// Interfaces para dados reais da API
interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  temperature: number;
  uptime: string;
  os: string;
  arch: string;
  timestamp: string;
}

interface NetworkDevice {
  ip: string;
  status: 'online' | 'offline' | 'checking';
  ping: number | null;
  lastCheck: string;
  description: string;
}

interface DatabaseStats {
  connections: number;
  size: string;
  status: 'healthy' | 'warning' | 'error';
  tablesCount: number;
  lastBackup: string;
  version: string;
}

interface SystemLog {
  timestamp: string;
  level: string;
  message: string;
  source: string;
}

interface SystemData {
  systemMetrics: SystemMetrics;
  networkDevices: NetworkDevice[];
  databaseStats: DatabaseStats;
  systemLogs: SystemLog[];
}

export default function SystemMonitor() {
  const [systemData, setSystemData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Função para buscar dados REAIS da API
  const fetchSystemData = async () => {
    try {
      setError(null);
      console.log('🔄 Buscando dados reais do sistema...');
      
      const response = await fetch('http://localhost:1337/api/system/all');
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Dados reais recebidos:', data);
      
      setSystemData(data);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('❌ Erro ao buscar dados do sistema:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setLoading(false);
    }
  };

  // Buscar dados na inicialização e a cada 5 segundos
  useEffect(() => {
    fetchSystemData();
    const interval = setInterval(fetchSystemData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Função para obter cor baseada no valor da métrica
  const getMetricColor = (value: number, type: string) => {
    if (type === 'temperature') {
      if (value > 70) return 'text-red-500';
      if (value > 50) return 'text-yellow-500';
      return 'text-green-500';
    }
    
    if (value > 85) return 'text-red-500';
    if (value > 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Função para obter cor por status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'error':
      case 'offline':
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
          <span className="text-lg text-gray-600">Carregando métricas reais do sistema...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Erro ao Carregar Sistema</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={fetchSystemData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!systemData) {
    return <div>Dados não disponíveis</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Monitor de Sistema REAL</h1>
              <p className="text-gray-600">
                {systemData.systemMetrics.os.toUpperCase()} {systemData.systemMetrics.arch} 
                {lastUpdate && ` • Atualizado às ${lastUpdate.toLocaleTimeString()}`}
              </p>
            </div>
          </div>
          
          {/* Status Geral */}
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 font-medium">Sistema Online</span>
          </div>
        </div>

        {/* Métricas Principais REAIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CPU REAL */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">CPU</span>
              </div>
              <span className={`text-lg font-bold ${getMetricColor(systemData.systemMetrics.cpu, 'cpu')}`}>
                {systemData.systemMetrics.cpu.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${systemData.systemMetrics.cpu}%` }}
              ></div>
            </div>
          </div>

          {/* MEMÓRIA REAL */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MemoryStick className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">RAM</span>
              </div>
              <span className={`text-lg font-bold ${getMetricColor(systemData.systemMetrics.memory, 'memory')}`}>
                {systemData.systemMetrics.memory.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${systemData.systemMetrics.memory}%` }}
              ></div>
            </div>
          </div>

          {/* DISCO REAL */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-900">Disco</span>
              </div>
              <span className={`text-lg font-bold ${getMetricColor(systemData.systemMetrics.disk, 'disk')}`}>
                {systemData.systemMetrics.disk.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${systemData.systemMetrics.disk}%` }}
              ></div>
            </div>
          </div>

          {/* TEMPERATURA REAL */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-900">Temp</span>
              </div>
              <span className={`text-lg font-bold ${getMetricColor(systemData.systemMetrics.temperature, 'temperature')}`}>
                {systemData.systemMetrics.temperature > 0 ? 
                  `${systemData.systemMetrics.temperature.toFixed(1)}°C` : 
                  'N/A'
                }
              </span>
            </div>
            <div className="text-sm text-red-700">
              Uptime: {systemData.systemMetrics.uptime}
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Rede e Banco de Dados REAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Monitor de Rede REAL */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Network className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Rede (PING REAL)</h2>
            </div>
            <div className="text-xs text-gray-500">
              PLC: 192.168.0.33
            </div>
          </div>

          <div className="space-y-4">
            {systemData.networkDevices.map((device, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getStatusColor(device.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      device.status === 'online' ? 'bg-green-500' : 
                      device.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
                    }`}></div>
                    <div>
                      <span className="font-semibold text-gray-900">{device.ip}</span>
                      <p className="text-sm text-gray-600">{device.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {device.ping !== null && (
                      <div className="text-sm font-mono text-gray-700 font-bold">
                        {device.ping.toFixed(1)}ms
                      </div>
                    )}
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(device.lastCheck).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monitor do Banco de Dados REAL */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Banco de Dados REAL</h2>
          </div>

          <div className="space-y-4">
            {/* Status do BD */}
            <div className={`p-4 rounded-lg border ${getStatusColor(systemData.databaseStats.status)}`}>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Status: {systemData.databaseStats.status.toUpperCase()}</span>
              </div>
              {systemData.databaseStats.version && (
                <p className="text-sm text-gray-600">{systemData.databaseStats.version}</p>
              )}
            </div>

            {/* Métricas do BD REAIS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{systemData.databaseStats.connections}</div>
                <div className="text-sm text-blue-700">Conexões Ativas</div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{systemData.databaseStats.tablesCount}</div>
                <div className="text-sm text-green-700">Tabelas</div>
              </div>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="text-lg font-bold text-purple-600">{systemData.databaseStats.size}</div>
              <div className="text-sm text-purple-700">Tamanho do Banco</div>
            </div>

            {systemData.databaseStats.lastBackup && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Último Backup:</div>
                <div className="text-sm font-mono text-gray-800">{systemData.databaseStats.lastBackup}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logs do Sistema REAIS */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex-1 min-h-0">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Logs do Sistema Windows (REAIS)
          </h2>
        </div>

        <div className="p-4 overflow-auto h-full">
          <div className="space-y-3">
            {systemData.systemLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  log.level.includes('Error') || log.level.includes('ERROR') ? 'bg-red-500' :
                  log.level.includes('Warning') || log.level.includes('WARNING') ? 'bg-yellow-500' :
                  log.level.includes('Success') || log.level.includes('Information') ? 'bg-green-500' : 
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      log.level.includes('Error') || log.level.includes('ERROR') ? 'bg-red-100 text-red-700' :
                      log.level.includes('Warning') || log.level.includes('WARNING') ? 'bg-yellow-100 text-yellow-700' :
                      log.level.includes('Success') || log.level.includes('Information') ? 'bg-green-100 text-green-700' : 
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