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
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
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
    const matchesType = filterType === 'all' || tag.type === filterType;
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tag.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tag.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesType && matchesSearch;
  });
  
  // PAGINAÇÃO
  const totalPages = Math.ceil(filteredTags.length / tagsPerPage);
  const startIndex = (currentPage - 1) * tagsPerPage;
  const endIndex = startIndex + tagsPerPage;
  const paginatedTags = filteredTags.slice(startIndex, endIndex);
  
  // Reset page quando filtros mudam
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, filterType, searchTerm]);

  // Obter categorias e tipos únicos
  const categories = ['all', ...Array.from(new Set(tagsData.map(tag => tag.category)))];
  const dataTypes = ['all', ...Array.from(new Set(tagsData.map(tag => tag.type)))];

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
      
      {/* HEADER LIMPO */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100" style={{ height: '60px' }}>
        <div className="h-full px-6 flex items-center justify-between gap-6">
          
          {/* CONTROLES MODERNOS */}
          <div className="flex items-center gap-4">
            
            {/* Campo de Busca */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl 
                         focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                         text-sm transition-all duration-200 placeholder:text-gray-400"
                style={{ fontFamily: '"Inter", sans-serif' }}
              />
            </div>

            {/* Filtro por Categoria */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => {
                  const newCategory = e.target.value;
                  setFilterCategory(newCategory);
                  onFilterChange?.(newCategory);
                }}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10
                         focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                         text-sm cursor-pointer transition-all duration-200 min-w-[140px]"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                <option value="all">Todas as categorias</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Filtro por Tipo de Dados */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10
                         focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                         text-sm cursor-pointer transition-all duration-200 min-w-[120px]"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                <option value="all">Todos os tipos</option>
                {dataTypes.filter(type => type !== 'all').map(dataType => (
                  <option key={dataType} value={dataType}>
                    {dataType.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* MÉTRICAS SIMPLES */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            
            {/* Contador de Tags */}
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="font-mono font-semibold text-gray-900">
                {webSocketDiagnostics.activeTags}/{webSocketDiagnostics.totalTags}
              </span>
            </div>

            {/* Latência */}
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                webSocketDiagnostics.latency < 100 ? 'bg-green-500' :
                webSocketDiagnostics.latency < 300 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="font-mono font-semibold text-gray-900">
                {webSocketDiagnostics.latency}ms
              </span>
            </div>
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
            <div className="flex-1 overflow-auto" style={{ height: 'calc(100% - 44px)' }}>
              
              {/* MOBILE - Cards Premium */}
              <div className="block lg:hidden p-4 space-y-3" style={{ fontFamily: '"Inter", sans-serif' }}>
                {paginatedTags.map((tag, index) => (
                  <div key={index} 
                       className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 
                                shadow-sm hover:shadow-md hover:border-gray-300/50 
                                transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                      
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative">
                          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                            tag.status === 'active' ? 'bg-green-500 shadow-green-500/30 shadow-lg' : 
                            tag.status === 'error' ? 'bg-red-500 shadow-red-500/30 shadow-lg' : 'bg-gray-300'
                          }`}>
                            {tag.status === 'active' && (
                              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900 truncate mb-2 group-hover:text-gray-800 transition-colors" 
                               style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                            {tag.name}
                          </div>
                          <div className="flex items-center gap-2.5 text-xs">
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <div className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-500 transition-colors">
                                {getCategoryIcon(tag.category)}
                              </div>
                              <span className="text-gray-600" style={{ fontFamily: '"Inter", sans-serif' }}>
                                {tag.category}
                              </span>
                            </div>
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium 
                                           bg-gray-100/80 text-gray-600 border border-gray-200/50"
                                  style={{ fontFamily: '"Inter", sans-serif' }}>
                              {tag.type.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-3">
                        <div className={`text-sm font-medium px-2 py-1 rounded-lg transition-all duration-200 ${
                          tag.type === 'bool' ? 
                            (tag.value ? 'text-green-700 bg-green-50 border border-green-200/50' : 'text-gray-500 bg-gray-50 border border-gray-200/50') : 
                            'text-blue-700 bg-blue-50 border border-blue-200/50'
                        }`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                          {formatValue(tag.value, tag.type)}
                        </div>
                        <div className="text-xs text-gray-400 mt-2 text-center" 
                             style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                          {tag.lastUpdate.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* DESKTOP - Tabela Premium */}
              <div className="hidden lg:block h-full bg-white">
                <table className="w-full" style={{ fontFamily: '"Inter", sans-serif' }}>
                  <thead className="bg-gradient-to-r from-gray-50/50 to-gray-50/30">
                    <tr className="border-b border-gray-200/60">
                      <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider" 
                          style={{ fontFamily: '"Inter", sans-serif' }}>Status</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          style={{ fontFamily: '"Inter", sans-serif' }}>Nome da Tag</th>
                      <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          style={{ fontFamily: '"Inter", sans-serif' }}>Valor Atual</th>
                      <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          style={{ fontFamily: '"Inter", sans-serif' }}>Tipo</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          style={{ fontFamily: '"Inter", sans-serif' }}>Categoria</th>
                      <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          style={{ fontFamily: '"Inter", sans-serif' }}>Última Atualização</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {paginatedTags.map((tag, index) => (
                      <tr key={index} 
                          className="hover:bg-gradient-to-r hover:from-gray-50/30 hover:to-transparent 
                                   transition-all duration-200 group border-l-2 border-transparent 
                                   hover:border-l-blue-400/20 hover:shadow-sm">
                        
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center">
                            <div className="relative">
                              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                                tag.status === 'active' ? 'bg-green-500 shadow-green-500/30 shadow-md' : 
                                tag.status === 'error' ? 'bg-red-500 shadow-red-500/30 shadow-md' : 'bg-gray-300'
                              }`}>
                                {tag.status === 'active' && (
                                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-900 group-hover:text-gray-800 transition-colors" 
                                  style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                              {tag.name}
                            </span>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center">
                            <span className={`text-sm font-medium px-2 py-1 rounded-md transition-all duration-200 ${
                              tag.type === 'bool' ? 
                                (tag.value ? 'text-green-700 bg-green-50 border border-green-200/50' : 'text-gray-500 bg-gray-50 border border-gray-200/50') : 
                                'text-blue-700 bg-blue-50 border border-blue-200/50'
                            }`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                              {formatValue(tag.value, tag.type)}
                            </span>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium 
                                         bg-gray-100/80 text-gray-700 border border-gray-200/50 
                                         group-hover:bg-gray-200/60 transition-colors"
                                style={{ fontFamily: '"Inter", sans-serif' }}>
                            {tag.type.toUpperCase()}
                          </span>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 text-gray-400 group-hover:text-gray-500 transition-colors">
                              {getCategoryIcon(tag.category)}
                            </div>
                            <span className="text-sm text-gray-700 group-hover:text-gray-800 transition-colors"
                                  style={{ fontFamily: '"Inter", sans-serif' }}>
                              {tag.category}
                            </span>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6 text-center">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-xs text-gray-500 font-medium"
                                  style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                              {tag.lastUpdate.toLocaleTimeString()}
                            </span>
                            <div className="w-1 h-1 bg-gray-300 rounded-full opacity-60"></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* PAGINAÇÃO ELEGANTE */}
            {totalPages > 1 && (
              <div className="flex-shrink-0 border-t border-gray-100/50 bg-white/95 backdrop-blur-sm px-6 py-3" 
                   style={{ height: '44px', fontFamily: '"Inter", sans-serif' }}>
                <div className="flex items-center justify-between h-full">
                  
                  {/* Info da Paginação */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span>Exibindo</span>
                      <span className="font-semibold text-gray-700 px-1.5 py-0.5 bg-gray-100 rounded font-mono">
                        {startIndex + 1}-{Math.min(endIndex, filteredTags.length)}
                      </span>
                      <span>de</span>
                      <span className="font-semibold text-gray-700 px-1.5 py-0.5 bg-gray-100 rounded font-mono">
                        {filteredTags.length}
                      </span>
                      <span>tags</span>
                    </div>
                  </div>
                  
                  {/* Controles de Navegação */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 
                               disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-150
                               flex items-center justify-center text-sm font-medium border border-transparent hover:border-gray-200/50"
                    >
                      ←
                    </button>
                    
                    <div className="flex items-center gap-0.5 mx-2">
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
                            className={`w-8 h-8 text-xs font-medium rounded-lg transition-all duration-150 ${
                              currentPage === page
                                ? 'bg-blue-500 text-white shadow-sm border border-blue-600/20'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/80 border border-transparent hover:border-gray-200/50'
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
                      className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 
                               disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-150
                               flex items-center justify-center text-sm font-medium border border-transparent hover:border-gray-200/50"
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