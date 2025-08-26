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

interface TagsMonitorProps {
  onFilterChange?: (category: string) => void;
}

export default function TagsMonitor({ onFilterChange }: TagsMonitorProps) {
  const webSocketData = useWebSocket('ws://localhost:1337/ws');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  
  // PAGINAÇÃO DINÂMICA baseada na altura da tela
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calcular tags por página baseado no tamanho da tela
  const getTagsPerPage = () => {
    if (typeof window !== 'undefined') {
      const height = window.innerHeight;
      if (height >= 1080) return 20; // Telas grandes
      if (height >= 800) return 15;  // Telas médias
      return 10; // Telas pequenas
    }
    return 10;
  };
  
  const [tagsPerPage] = useState(getTagsPerPage());
  
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

  // Notificar mudança de filtro inicial
  React.useEffect(() => {
    onFilterChange?.('all');
  }, [onFilterChange]);

  // Filtrar tags
  const filteredTags = tagsData.filter(tag => {
    const matchesCategory = filterCategory === 'all' || tag.category === filterCategory;
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tag.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = !showOnlyActive || tag.status === 'active';
    
    return matchesCategory && matchesSearch && matchesActive;
  });
  
  // PAGINAÇÃO
  const totalPages = Math.ceil(filteredTags.length / tagsPerPage);
  const startIndex = (currentPage - 1) * tagsPerPage;
  const endIndex = startIndex + tagsPerPage;
  const paginatedTags = filteredTags.slice(startIndex, endIndex);
  
  // Reset page quando filtros mudam
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, searchTerm, showOnlyActive]);

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
    <div className="w-full h-full flex flex-col overflow-hidden">
      
      {/* HEADER MINIMALISTA */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100" style={{ height: '60px' }}>
        <div className="h-full px-4 py-2 flex items-center justify-between">
          
          {/* FILTROS COMPACTOS */}
          <div className="flex items-center gap-3">
            
            {/* Campo de Busca */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-40 pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-300 text-sm transition-colors"
              />
            </div>

            {/* Select Categoria */}
            <select
              value={filterCategory}
              onChange={(e) => {
                const newCategory = e.target.value;
                setFilterCategory(newCategory);
                onFilterChange?.(newCategory);
              }}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:bg-white focus:border-blue-300 text-sm min-w-[90px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas' : category}
                </option>
              ))}
            </select>

            {/* Botão Apenas Ativos */}
            <button
              onClick={() => setShowOnlyActive(!showOnlyActive)}
              className={`px-2 py-1.5 rounded-lg text-sm transition-colors ${
                showOnlyActive 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              title={showOnlyActive ? 'Mostrar todas' : 'Apenas ativas'}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          
          {/* STATUS E MÉTRICAS NO FINAL */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${plcStatus.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{plcStatus.connected ? 'Online' : 'Offline'}</span>
            </div>
            <span className="hidden sm:inline">{webSocketDiagnostics.activeTags}/{webSocketDiagnostics.totalTags}</span>
            <span className="hidden sm:inline">{webSocketDiagnostics.latency}ms</span>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ height: 'calc(100% - 60px)' }}>
        {paginatedTags.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
            <Database className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">Nenhuma tag encontrada</p>
          </div>
        ) : (
          <>
            {/* LISTA RESPONSIVA */}
            <div className="flex-1 overflow-auto" style={{ height: 'calc(100% - 40px)' }}>
              
              {/* MOBILE - Lista Limpa */}
              <div className="block lg:hidden p-3 space-y-2">
                {paginatedTags.map((tag, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-lg p-3 hover:border-gray-200 transition-colors">
                    <div className="flex items-center justify-between">
                      
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-2 h-2 rounded-full ${
                          tag.status === 'active' ? 'bg-green-500' : 
                          tag.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                        }`}></div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-sm text-gray-900 truncate mb-1">
                            {tag.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {getCategoryIcon(tag.category)}
                            <span>{tag.category}</span>
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">
                              {tag.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-sm font-mono font-semibold ${
                          tag.type === 'bool' ? 
                            (tag.value ? 'text-green-600' : 'text-gray-500') : 
                            'text-blue-600'
                        }`}>
                          {formatValue(tag.value, tag.type)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {tag.lastUpdate.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* DESKTOP - Tabela Profissional */}
              <div className="hidden lg:block h-full">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Atualizado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedTags.map((tag, index) => (
                      <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                        
                        <td className="py-3 px-4">
                          <div className={`w-2 h-2 rounded-full ${
                            tag.status === 'active' ? 'bg-green-500' : 
                            tag.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                          }`}></div>
                        </td>
                        
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm text-gray-900">
                            {tag.name}
                          </span>
                        </td>
                        
                        <td className="py-3 px-4">
                          <span className={`font-mono text-sm font-semibold ${
                            tag.type === 'bool' ? 
                              (tag.value ? 'text-green-600' : 'text-gray-500') : 
                              'text-blue-600'
                          }`}>
                            {formatValue(tag.value, tag.type)}
                          </span>
                        </td>
                        
                        <td className="py-3 px-4">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
                            {tag.type}
                          </span>
                        </td>
                        
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 text-gray-400">
                              {getCategoryIcon(tag.category)}
                            </div>
                            <span className="text-sm text-gray-700">
                              {tag.category}
                            </span>
                          </div>
                        </td>
                        
                        <td className="py-3 px-4">
                          <span className="text-xs text-gray-500 font-mono">
                            {tag.lastUpdate.toLocaleTimeString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* PAGINAÇÃO ULTRA MINIMALISTA */}
            {totalPages > 1 && (
              <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 py-2" style={{ height: '40px' }}>
                <div className="flex items-center justify-between h-full">
                  
                  {/* Info Compacta */}
                  <div className="text-xs text-gray-400">
                    {startIndex + 1}-{Math.min(endIndex, filteredTags.length)} de {filteredTags.length}
                  </div>
                  
                  {/* Controles Minimalistas */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-6 h-6 text-gray-400 hover:text-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      ←
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                        let page;
                        if (totalPages <= 3) {
                          page = i + 1;
                        } else if (currentPage === 1) {
                          page = i + 1;
                        } else if (currentPage === totalPages) {
                          page = totalPages - 2 + i;
                        } else {
                          page = currentPage - 1 + i;
                        }
                        return page;
                      })
                        .map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-6 h-6 text-xs rounded transition-colors ${
                              currentPage === page
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))
                      }
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-6 h-6 text-gray-400 hover:text-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}