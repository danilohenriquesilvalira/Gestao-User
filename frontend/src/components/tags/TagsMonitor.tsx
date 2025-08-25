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
  EyeOff
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

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className={`p-3 rounded-lg border ${plcStatus.communication ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2">
              {plcStatus.communication ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm font-medium text-gray-700">Comunicação</span>
            </div>
          </div>

          <div className={`p-3 rounded-lg border ${plcStatus.operation ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-2">
              {plcStatus.operation ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm font-medium text-gray-700">Operação</span>
            </div>
          </div>

          <div className={`p-3 rounded-lg border ${plcStatus.alarms ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-center gap-2">
              {plcStatus.alarms ? (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              <span className="text-sm font-medium text-gray-700">Alarmes</span>
            </div>
          </div>

          <div className={`p-3 rounded-lg border ${plcStatus.emergency ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-center gap-2">
              {plcStatus.emergency ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              <span className="text-sm font-medium text-gray-700">Emergência</span>
            </div>
          </div>

          <div className={`p-3 rounded-lg border ${plcStatus.flooding ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-center gap-2">
              {plcStatus.flooding ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              <span className="text-sm font-medium text-gray-700">Inundação</span>
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