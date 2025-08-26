// TagsMonitor.tsx - Monitor de Tags em Tempo Real via WebSocket
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Wifi, 
  WifiOff,
  Radio,
  Database,
  Gauge,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  RefreshCw,
  Settings,
  Zap,
  Thermometer,
  Droplets,
  Eye,
  EyeOff,
  TrendingUp,
  Users,
  Server,
  BarChart3
} from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';

// Tipos para organizar os dados
interface TagData {
  name: string;
  value: any;
  type: 'real' | 'int' | 'bool';
  category: string;
  description: string;
  lastUpdate: Date;
  status: 'active' | 'inactive' | 'error';
}

interface PLCStatus {
  connected: boolean;
  communication: boolean;
  operation: boolean;
  alarms: boolean;
  emergency: boolean;
  flooding: boolean;
}

export default function TagsMonitor() {
  const webSocketData = useWebSocket('ws://localhost:1337/ws');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  
  // Estado dos dados das tags organizados
  const [tagsData, setTagsData] = useState<TagData[]>([]);
  const [plcStatus, setPLCStatus] = useState<PLCStatus>({
    connected: false,
    communication: false,
    operation: false,
    alarms: false,
    emergency: false,
    flooding: false
  });
  
  // ✅ MÉTRICAS REAIS DE DIAGNÓSTICO DO WEBSOCKET
  const [webSocketDiagnostics, setWebSocketDiagnostics] = useState({
    connectionQuality: 'good' as 'good' | 'fair' | 'poor',
    latency: 0,
    totalTags: 0,
    activeTags: 0,
    dataFreshness: 'real-time' as 'real-time' | 'delayed' | 'stale'
  });

  // Processar dados do WebSocket e organizar em tags
  useEffect(() => {
    const now = new Date();
    const newTags: TagData[] = [];

    // 📊 NÍVEIS DA ECLUSA
    if (webSocketData.nivelCaldeiraValue !== null) {
      newTags.push({
        name: 'Eclusa_Nivel_Caldeira',
        value: webSocketData.nivelCaldeiraValue,
        type: 'real',
        category: 'Níveis',
        description: 'Nível da Caldeira da Eclusa',
        lastUpdate: now,
        status: 'active'
      });
    }

    if (webSocketData.nivelMontanteValue !== null) {
      newTags.push({
        name: 'Eclusa_Nivel_Montante',
        value: webSocketData.nivelMontanteValue,
        type: 'real',
        category: 'Níveis',
        description: 'Nível Montante da Eclusa',
        lastUpdate: now,
        status: 'active'
      });
    }

    if (webSocketData.nivelJusanteValue !== null) {
      newTags.push({
        name: 'Eclusa_Nivel_Jusante',
        value: webSocketData.nivelJusanteValue,
        type: 'real',
        category: 'Níveis',
        description: 'Nível Jusante da Eclusa',
        lastUpdate: now,
        status: 'active'
      });
    }

    // 📡 RADARES DA ECLUSA
    if (webSocketData.radarCaldeiraDistanciaValue !== null) {
      newTags.push({
        name: 'Eclusa_Radar_Caldeira_Distancia',
        value: webSocketData.radarCaldeiraDistanciaValue,
        type: 'real',
        category: 'Radares',
        description: 'Distância do Radar da Caldeira',
        lastUpdate: now,
        status: 'active'
      });
    }

    if (webSocketData.radarCaldeiraVelocidadeValue !== null) {
      newTags.push({
        name: 'Eclusa_Radar_Caldeira_Velocidade',
        value: webSocketData.radarCaldeiraVelocidadeValue,
        type: 'real',
        category: 'Radares',
        description: 'Velocidade do Radar da Caldeira',
        lastUpdate: now,
        status: 'active'
      });
    }

    if (webSocketData.radarMontanteDistanciaValue !== null) {
      newTags.push({
        name: 'Eclusa_Radar_Montante_Distancia',
        value: webSocketData.radarMontanteDistanciaValue,
        type: 'real',
        category: 'Radares',
        description: 'Distância do Radar Montante',
        lastUpdate: now,
        status: 'active'
      });
    }

    if (webSocketData.radarMontanteVelocidadeValue !== null) {
      newTags.push({
        name: 'Eclusa_Radar_Montante_Velocidade',
        value: webSocketData.radarMontanteVelocidadeValue,
        type: 'real',
        category: 'Radares',
        description: 'Velocidade do Radar Montante',
        lastUpdate: now,
        status: 'active'
      });
    }

    if (webSocketData.radarJusanteDistanciaValue !== null) {
      newTags.push({
        name: 'Eclusa_Radar_Jusante_Distancia',
        value: webSocketData.radarJusanteDistanciaValue,
        type: 'real',
        category: 'Radares',
        description: 'Distância do Radar Jusante',
        lastUpdate: now,
        status: 'active'
      });
    }

    if (webSocketData.radarJusanteVelocidadeValue !== null) {
      newTags.push({
        name: 'Eclusa_Radar_Jusante_Velocidade',
        value: webSocketData.radarJusanteVelocidadeValue,
        type: 'real',
        category: 'Radares',
        description: 'Velocidade do Radar Jusante',
        lastUpdate: now,
        status: 'active'
      });
    }

    // 🚪 PORTAS DA ECLUSA
    if (webSocketData.eclusaPortaJusanteValue !== null) {
      newTags.push({
        name: 'Eclusa_Porta_Jusante',
        value: webSocketData.eclusaPortaJusanteValue,
        type: 'real',
        category: 'Portas',
        description: 'Posição da Porta Jusante',
        lastUpdate: now,
        status: 'active'
      });
    }

    if (webSocketData.eclusaPortaMontanteValue !== null) {
      newTags.push({
        name: 'Eclusa_Porta_Montante',
        value: webSocketData.eclusaPortaMontanteValue,
        type: 'real',
        category: 'Portas',
        description: 'Posição da Porta Montante',
        lastUpdate: now,
        status: 'active'
      });
    }

    // 🔬 LASERS DA ECLUSA
    if (webSocketData.laserMontanteValue !== null) {
      newTags.push({
        name: 'Eclusa_Laser_Montante',
        value: webSocketData.laserMontanteValue,
        type: 'real',
        category: 'Lasers',
        description: 'Valor do Laser Montante',
        lastUpdate: now,
        status: 'active'
      });
    }

    if (webSocketData.laserJusanteValue !== null) {
      newTags.push({
        name: 'Eclusa_Laser_Jusante',
        value: webSocketData.laserJusanteValue,
        type: 'real',
        category: 'Lasers',
        description: 'Valor do Laser Jusante',
        lastUpdate: now,
        status: 'active'
      });
    }

    // 🚦 SEMÁFOROS
    Object.entries(webSocketData.semaforos || {}).forEach(([key, value]) => {
      newTags.push({
        name: key,
        value: value,
        type: 'bool',
        category: 'Semáforos',
        description: `Status do ${key}`,
        lastUpdate: now,
        status: 'active'
      });
    });

    // 🔧 PIPESYSTEM ARRAY
    webSocketData.pipeSystem.forEach((value, index) => {
      newTags.push({
        name: `PipeSystem[${index}]`,
        value: value,
        type: 'bool',
        category: 'PipeSystem',
        description: `Pipe ${index + 1} Status`,
        lastUpdate: now,
        status: value ? 'active' : 'inactive'
      });
    });

    // ⚡ VÁLVULAS ONOFF
    webSocketData.valvulasOnOff.forEach((value, index) => {
      newTags.push({
        name: `ValvulasOnOFF[${index}]`,
        value: value,
        type: 'int',
        category: 'Válvulas',
        description: `Válvula ${index + 1} Status`,
        lastUpdate: now,
        status: value > 0 ? 'active' : 'inactive'
      });
    });

    // 📊 COTAS
    if (webSocketData.cotaMontanteValue !== null) {
      newTags.push({
        name: 'Cota_Montante',
        value: webSocketData.cotaMontanteValue,
        type: 'real',
        category: 'Cotas',
        description: 'Cota de Montante',
        lastUpdate: now,
        status: 'active'
      });
    }

    if (webSocketData.cotaCaldeiraValue !== null) {
      newTags.push({
        name: 'Cota_Caldeira',
        value: webSocketData.cotaCaldeiraValue,
        type: 'real',
        category: 'Cotas',
        description: 'Cota da Caldeira',
        lastUpdate: now,
        status: 'active'
      });
    }

    if (webSocketData.cotaJusanteValue !== null) {
      newTags.push({
        name: 'Cota_Jusante',
        value: webSocketData.cotaJusanteValue,
        type: 'real',
        category: 'Cotas',
        description: 'Cota de Jusante',
        lastUpdate: now,
        status: 'active'
      });
    }

    setTagsData(newTags);

    // ✅ CALCULAR MÉTRICAS REAIS DE DIAGNÓSTICO
    const activeTags = newTags.filter(tag => tag.status === 'active').length;
    const totalTags = newTags.length;
    
    // ✅ Qualidade da conexão baseada em dados reais
    let connectionQuality: 'good' | 'fair' | 'poor' = 'good';
    if (!webSocketData.isConnected) {
      connectionQuality = 'poor';
    } else if (activeTags / totalTags < 0.7) {
      connectionQuality = 'fair';
    }
    
    // ✅ Frescor dos dados baseado no isDataReady
    let dataFreshness: 'real-time' | 'delayed' | 'stale' = 'real-time';
    if (!webSocketData.isDataReady) {
      dataFreshness = 'delayed';
    } else if (webSocketData.error) {
      dataFreshness = 'stale';
    }
    
    // ✅ Latência REAL baseada no tempo de resposta (timestamp)
    let latency = 0;
    if (webSocketData.isConnected && webSocketData.lastMessage) {
      // Calcular latência real baseada no tempo de processamento
      const now = Date.now();
      const messageTime = new Date(webSocketData.lastMessage).getTime();
      if (!isNaN(messageTime)) {
        latency = Math.abs(now - messageTime);
      }
    }

    setWebSocketDiagnostics({
      connectionQuality,
      latency,
      totalTags,
      activeTags,
      dataFreshness
    });

    // Atualizar status do PLC
    setPLCStatus({
      connected: webSocketData.isConnected,
      communication: webSocketData.comunicacaoPLCValue ?? false,
      operation: webSocketData.operacaoValue ?? false,
      alarms: webSocketData.alarmesAtivoValue ?? false,
      emergency: webSocketData.emergenciaAtivaValue ?? false,
      flooding: webSocketData.inundacaoValue ?? false
    });

  }, [webSocketData]);

  // Filtrar tags
  const filteredTags = tagsData.filter(tag => {
    const matchesCategory = filterCategory === 'all' || tag.category === filterCategory;
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tag.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = !showOnlyActive || tag.status === 'active';
    
    return matchesCategory && matchesSearch && matchesActive;
  });

  // Obter categorias únicas
  const categories = ['all', ...Array.from(new Set(tagsData.map(tag => tag.category)))];

  // Função para obter ícone por categoria
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Níveis': return <Droplets className="w-4 h-4" />;
      case 'Radares': return <Radio className="w-4 h-4" />;
      case 'Portas': return <Settings className="w-4 h-4" />;
      case 'Lasers': return <Zap className="w-4 h-4" />;
      case 'Semáforos': return <Activity className="w-4 h-4" />;
      case 'PipeSystem': return <Settings className="w-4 h-4" />;
      case 'Válvulas': return <Gauge className="w-4 h-4" />;
      case 'Cotas': return <Thermometer className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  // Função para obter cor por status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'inactive': return 'text-gray-400';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  // Função para formatar valor
  const formatValue = (value: any, type: string) => {
    if (type === 'bool') {
      return value ? 'TRUE' : 'FALSE';
    } else if (type === 'real') {
      return typeof value === 'number' ? value.toFixed(2) : value;
    } else {
      return value?.toString() || 'N/A';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header com Status do PLC */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Monitor de Tags PLC</h1>
              <p className="text-gray-600">Dados em tempo real via WebSocket</p>
            </div>
          </div>
          
          {/* Status Connection */}
          <div className="flex items-center gap-2">
            {plcStatus.connected ? (
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                <Wifi className="w-5 h-5 text-green-500" />
                <span className="text-green-700 font-medium">Conectado</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                <WifiOff className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium">Desconectado</span>
              </div>
            )}
          </div>
        </div>

        {/* ✅ MÉTRICAS PROFISSIONAIS DE DIAGNÓSTICO DO WEBSOCKET */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Qualidade da Conexão */}
          <div className={`p-4 rounded-xl border ${
            webSocketDiagnostics.connectionQuality === 'good' ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' :
            webSocketDiagnostics.connectionQuality === 'fair' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200' :
            'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className={`w-5 h-5 ${
                  webSocketDiagnostics.connectionQuality === 'good' ? 'text-green-600' :
                  webSocketDiagnostics.connectionQuality === 'fair' ? 'text-yellow-600' : 'text-red-600'
                }`} />
                <span className={`font-semibold ${
                  webSocketDiagnostics.connectionQuality === 'good' ? 'text-green-900' :
                  webSocketDiagnostics.connectionQuality === 'fair' ? 'text-yellow-900' : 'text-red-900'
                }`}>Qualidade</span>
              </div>
              <span className={`text-lg font-bold ${
                webSocketDiagnostics.connectionQuality === 'good' ? 'text-green-600' :
                webSocketDiagnostics.connectionQuality === 'fair' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {webSocketDiagnostics.connectionQuality === 'good' ? 'Ótima' :
                 webSocketDiagnostics.connectionQuality === 'fair' ? 'Regular' : 'Ruim'}
              </span>
            </div>
            <div className={`text-sm ${
              webSocketDiagnostics.connectionQuality === 'good' ? 'text-green-700' :
              webSocketDiagnostics.connectionQuality === 'fair' ? 'text-yellow-700' : 'text-red-700'
            }`}>
              Conexão WebSocket
            </div>
          </div>

          {/* Latência Real */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Latência</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {webSocketDiagnostics.latency}ms
              </span>
            </div>
            <div className="text-sm text-blue-700">Tempo de Resposta</div>
          </div>

          {/* Tags Ativas vs Total */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Tags</span>
              </div>
              <span className="text-lg font-bold text-purple-600">
                {webSocketDiagnostics.activeTags}/{webSocketDiagnostics.totalTags}
              </span>
            </div>
            <div className="text-sm text-purple-700">Ativas/Total</div>
          </div>

          {/* Frescor dos Dados */}
          <div className={`p-4 rounded-xl border ${
            webSocketDiagnostics.dataFreshness === 'real-time' ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200' :
            webSocketDiagnostics.dataFreshness === 'delayed' ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200' :
            'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${
                  webSocketDiagnostics.dataFreshness === 'real-time' ? 'text-emerald-600' :
                  webSocketDiagnostics.dataFreshness === 'delayed' ? 'text-orange-600' : 'text-gray-600'
                }`} />
                <span className={`font-semibold ${
                  webSocketDiagnostics.dataFreshness === 'real-time' ? 'text-emerald-900' :
                  webSocketDiagnostics.dataFreshness === 'delayed' ? 'text-orange-900' : 'text-gray-900'
                }`}>Dados</span>
              </div>
              <span className={`text-sm font-bold ${
                webSocketDiagnostics.dataFreshness === 'real-time' ? 'text-emerald-600' :
                webSocketDiagnostics.dataFreshness === 'delayed' ? 'text-orange-600' : 'text-gray-600'
              }`}>
                {webSocketDiagnostics.dataFreshness === 'real-time' ? 'Tempo Real' :
                 webSocketDiagnostics.dataFreshness === 'delayed' ? 'Atrasados' : 'Desatualizados'}
              </span>
            </div>
            <div className={`text-sm ${
              webSocketDiagnostics.dataFreshness === 'real-time' ? 'text-emerald-700' :
              webSocketDiagnostics.dataFreshness === 'delayed' ? 'text-orange-700' : 'text-gray-700'
            }`}>
              Status dos Dados
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas as Categorias' : category}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowOnlyActive(!showOnlyActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showOnlyActive 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-gray-50 border-gray-300 text-gray-700'
              }`}
            >
              {showOnlyActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="text-sm font-medium">Apenas Ativos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Tags */}
      <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Tags em Tempo Real
            </h2>
            <div className="text-sm text-gray-500">
              {filteredTags.length} de {tagsData.length} tags
            </div>
          </div>
        </div>

        <div className="overflow-auto h-full">
          {filteredTags.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Database className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium">Nenhuma tag encontrada</p>
              <p className="text-sm">Tente ajustar os filtros</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Tag</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Valor</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Tipo</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Categoria</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Descrição</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Atualizada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTags.map((tag, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className={`w-3 h-3 rounded-full ${
                            tag.status === 'active' ? 'bg-green-500' : 
                            tag.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                          }`}></div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm text-gray-900">{tag.name}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-mono text-sm font-bold ${
                            tag.type === 'bool' ? 
                              (tag.value ? 'text-green-600' : 'text-gray-500') : 
                              'text-blue-600'
                          }`}>
                            {formatValue(tag.value, tag.type)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {tag.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(tag.category)}
                            <span className="text-sm text-gray-700">{tag.category}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 max-w-xs">
                          {tag.description}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {tag.lastUpdate.toLocaleTimeString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}