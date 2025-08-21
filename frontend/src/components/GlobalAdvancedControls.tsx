import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { 
  Settings, 
  Minimize2, 
  Maximize2, 
  BarChart3, 
  RotateCcw, 
  RefreshCw, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Minus, 
  Save, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Layers,
  Move
} from 'lucide-react';

interface ResponsiveConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  zIndex: number;
  opacity: number;
  rotation: number;
}

interface ComponentData {
  id: string;
  configs: Record<string, ResponsiveConfig>;
  isVisible: boolean;
  lastUsed: number;
  hasOverlap?: boolean;
}

interface GlobalAdvancedControlsProps {
  editMode: boolean;
  pageFilter?: string;
}

const PAGE_COMPONENTS = {
  montante: [
    'porta-montante-',
    'contrapeso-montante-'
  ],
  enchimento: [
    'enchimento-',
    'pipe-system-',
    'valvula-X',
    'VD', 'VG', 'VH', 'VF',
    'base-pistao-enchimento-',
    'pistao-enchimento-',
    'cilindro-enchimento-',
    'motor-enchimento-',
    'tanque-de-oleo'
  ],
  jusante: [
    'porta-jusante-',
    'contrapeso-jusante-'
  ],
  eclusa: [
    'caldeira-eclusa',
    'parede-eclusa', 
    'porta-jusante',
    'porta-montante',
    'base-porta-jusante',
    'base-porta-jusante-2',
    'tubulacao-caldeira',
    'radar-eclusa',
    'semaforo',
    'semaforo-1',
    'semaforo-2',
    'semaforo-3',
    'graficos-cotas'
  ]
};

export default function GlobalAdvancedControls({ editMode, pageFilter }: GlobalAdvancedControlsProps) {
  const breakpoint = useBreakpoint();
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragState, setDragState] = useState({ isDragging: false, offset: { x: 0, y: 0 } });
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [showZIndexManager, setShowZIndexManager] = useState(false);
  const selectedComponentRef = useRef<string>(''); // Ref para manter o componente selecionado

  const filteredComponents = useMemo(() => {
    if (!pageFilter || !PAGE_COMPONENTS[pageFilter as keyof typeof PAGE_COMPONENTS]) {
      return components.filter(comp => comp.isVisible);
    }

    const pagePatterns = PAGE_COMPONENTS[pageFilter as keyof typeof PAGE_COMPONENTS];
    return components.filter(comp => {
      const belongsToPage = pagePatterns.some(pattern => {
        if (pattern.endsWith('-')) {
          return comp.id.startsWith(pattern);
        }
        return comp.id.startsWith(pattern);
      });
      return belongsToPage;
    });
  }, [components, pageFilter]);

  // Função para detectar sobreposições
  const detectOverlaps = (comps: ComponentData[]): ComponentData[] => {
    return comps.map(comp => {
      const config = comp.configs[breakpoint] || comp.configs.lg;
      if (!config) return comp;

      let hasOverlap = false;
      
      for (const other of comps) {
        if (other.id === comp.id) continue;
        const otherConfig = other.configs[breakpoint] || other.configs.lg;
        if (!otherConfig) continue;

        // Verificar sobreposição
        const overlap = !(
          config.x + config.width < otherConfig.x ||
          otherConfig.x + otherConfig.width < config.x ||
          config.y + config.height < otherConfig.y ||
          otherConfig.y + otherConfig.height < config.y
        );

        if (overlap && Math.abs(config.zIndex - otherConfig.zIndex) < 2) {
          hasOverlap = true;
          break;
        }
      }

      return { ...comp, hasOverlap };
    });
  };

  const detectActiveComponents = () => {
    const activeComponents = new Set<string>();
    
    document.querySelectorAll('[data-component-id]').forEach(element => {
      const componentId = element.getAttribute('data-component-id');
      if (componentId) {
        activeComponents.add(componentId);
      }
    });

    return activeComponents;
  };

  const loadComponents = () => {
    const found: ComponentData[] = [];
    const activeComponents = detectActiveComponents();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('component-')) {
        const componentId = key.replace('component-', '');
        const configData = localStorage.getItem(key);
        
        if (configData) {
          try {
            const configs = JSON.parse(configData);
            const isVisible = activeComponents.has(componentId);
            const lastUsed = parseInt(localStorage.getItem(`${key}-lastused`) || '0');
            
            found.push({ 
              id: componentId, 
              configs,
              isVisible,
              lastUsed
            });
          } catch (error) {
            console.warn(`Erro ao carregar configuração de ${componentId}:`, error);
          }
        }
      }
    }

    // Detectar sobreposições
    const withOverlaps = detectOverlaps(found);

    // Ordenar por z-index
    withOverlaps.sort((a, b) => {
      const aConfig = a.configs[breakpoint] || a.configs.lg || { zIndex: 1 };
      const bConfig = b.configs[breakpoint] || b.configs.lg || { zIndex: 1 };
      return aConfig.zIndex - bConfig.zIndex;
    });

    setComponents(withOverlaps);
    
    // CORREÇÃO: Manter o componente selecionado se ainda existe
    if (selectedComponentRef.current && withOverlaps.find(c => c.id === selectedComponentRef.current)) {
      setSelectedComponent(selectedComponentRef.current);
    } else {
      const firstActive = withOverlaps.find(c => c.isVisible);
      if (firstActive && !selectedComponent) {
        setSelectedComponent(firstActive.id);
        selectedComponentRef.current = firstActive.id;
      }
    }
  };

  // Auto-organizar Z-Index
  const autoOrganizeZIndex = () => {
    const visibleComps = filteredComponents.filter(c => c.isVisible);
    
    const categories = {
      background: [] as ComponentData[],
      middle: [] as ComponentData[],
      foreground: [] as ComponentData[]
    };

    visibleComps.forEach(comp => {
      if (comp.id.includes('pipe') || comp.id.includes('tanque')) {
        categories.background.push(comp);
      } else if (comp.id.includes('pistao') || comp.id.includes('motor') || comp.id.includes('cilindro')) {
        categories.foreground.push(comp);
      } else {
        categories.middle.push(comp);
      }
    });

    let zIndex = 1;

    [...categories.background, ...categories.middle, ...categories.foreground].forEach(comp => {
      const newConfigs = { ...comp.configs };
      Object.keys(newConfigs).forEach(bp => {
        if (newConfigs[bp]) {
          newConfigs[bp].zIndex = zIndex;
        }
      });
      
      zIndex += 2;

      localStorage.setItem(`component-${comp.id}`, JSON.stringify(newConfigs));
      
      window.dispatchEvent(new CustomEvent('component-config-changed', {
        detail: { componentId: comp.id, config: newConfigs[breakpoint] }
      }));
    });

    loadComponents();
    alert('Z-Index reorganizado automaticamente!');
  };

  // Reset de Z-Index
  const resetAllZIndex = () => {
    filteredComponents.forEach((comp, index) => {
      const newConfigs = { ...comp.configs };
      Object.keys(newConfigs).forEach(bp => {
        if (newConfigs[bp]) {
          newConfigs[bp].zIndex = index + 1;
        }
      });
      
      localStorage.setItem(`component-${comp.id}`, JSON.stringify(newConfigs));
      
      window.dispatchEvent(new CustomEvent('component-config-changed', {
        detail: { componentId: comp.id, config: newConfigs[breakpoint] }
      }));
    });

    loadComponents();
    alert('Todos os Z-Index foram resetados!');
  };

  // Trazer para frente
  const bringToTop = () => {
    if (!selectedComponent) return;

    const maxZ = Math.max(...filteredComponents.map(c => {
      const config = c.configs[breakpoint] || c.configs.lg || { zIndex: 1 };
      return config.zIndex;
    }));

    updateConfig('zIndex', maxZ + 10);
  };

  const saveToStrapi = async () => {
    if (!selectedComponent) return;

    const component = components.find(c => c.id === selectedComponent);
    if (!component) return;

    const currentConfig = component.configs[breakpoint] || component.configs.lg || {};
    
    try {
      const strapiBreakpoint = breakpoint === '2xl' ? 'xxl' : 
                              breakpoint === '3xl' ? 'xxxl' : 
                              breakpoint === '4xl' ? 'xxxxl' : breakpoint;

      const baseURL = window.location.origin.includes('localhost') 
        ? 'http://localhost:1337' 
        : import.meta.env?.VITE_STRAPI_URL || 'http://localhost:1337';

      const checkResponse = await fetch(
        `${baseURL}/api/component-layouts?filters[componentId][$eq]=${selectedComponent}&filters[breakpoint][$eq]=${strapiBreakpoint}`
      );
      
      if (!checkResponse.ok) {
        throw new Error(`Erro ao verificar configuração existente: ${checkResponse.status}`);
      }

      const checkData = await checkResponse.json();
      const existingEntry = checkData?.data?.[0];
      const existingDocumentId = existingEntry?.documentId;

      const configData = {
        componentId: selectedComponent,
        breakpoint: strapiBreakpoint,
        x: Math.round(Number(currentConfig.x)) || 74,
        y: Math.round(Number(currentConfig.y)) || 70,
        width: Math.round(Number(currentConfig.width)) || 400,
        height: Math.round(Number(currentConfig.height)) || 200,
        scale: Number(currentConfig.scale) || 1,
        zIndex: Math.round(Number(currentConfig.zIndex)) || 1,
        opacity: Number(currentConfig.opacity) || 1,
        rotation: Math.round(Number(currentConfig.rotation)) || 0
      };

      const saveResponse = existingDocumentId 
        ? await fetch(`${baseURL}/api/component-layouts/${existingDocumentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: configData })
          })
        : await fetch(`${baseURL}/api/component-layouts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: configData })
          });

      if (saveResponse.ok) {
        console.log(`✅ [STRAPI] ${selectedComponent} salvo com sucesso`);
        localStorage.setItem(`component-${selectedComponent}-lastused`, Date.now().toString());
      } else {
        throw new Error(`Erro HTTP ${saveResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar no Strapi:', error);
      alert(`Erro ao salvar: ${error}`);
    }
  };

  const updateConfig = (property: keyof ResponsiveConfig, value: number) => {
    if (!selectedComponent) return;

    const component = components.find(c => c.id === selectedComponent);
    if (!component) return;

    const newConfigs = { ...component.configs };
    const currentConfig = newConfigs[breakpoint] || newConfigs.lg || {};
    
    newConfigs[breakpoint] = { ...currentConfig, [property]: value };
    
    localStorage.setItem(`component-${selectedComponent}`, JSON.stringify(newConfigs));
    
    window.dispatchEvent(new CustomEvent('component-config-changed', {
      detail: { componentId: selectedComponent, config: newConfigs[breakpoint] }
    }));

    setComponents(prev => prev.map(c => 
      c.id === selectedComponent ? { ...c, configs: newConfigs } : c
    ));

    // CORREÇÃO: Remover o setTimeout que causava perda do componente selecionado
    // e atualizar apenas o estado local das sobreposições
    setComponents(prev => detectOverlaps(prev));
  };

  // CORREÇÃO: Atualizar ref quando componente é selecionado
  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(componentId);
    selectedComponentRef.current = componentId;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!e.target || !(e.target as HTMLElement).classList.contains('drag-handle')) return;
    
    e.preventDefault();
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragState({
      isDragging: true,
      offset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.isDragging) return;
    
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragState.offset.x)),
      y: Math.max(0, Math.min(window.innerHeight - 700, e.clientY - dragState.offset.y))
    });
  };

  const handleMouseUp = () => {
    setDragState({ isDragging: false, offset: { x: 0, y: 0 } });
  };

  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging]);

  useEffect(() => {
    if (editMode) {
      loadComponents();
      
      const handleComponentChange = () => {
        setTimeout(loadComponents, 100);
      };

      window.addEventListener('component-config-changed', handleComponentChange);
      return () => window.removeEventListener('component-config-changed', handleComponentChange);
    }
  }, [editMode, pageFilter]);

  if (!editMode) return null;

  const selectedComponentData = components.find(c => c.id === selectedComponent);
  const currentConfig = selectedComponentData?.configs[breakpoint] || selectedComponentData?.configs.lg || {
    x: 74, y: 70, width: 400, height: 200, scale: 1, zIndex: 1, opacity: 1, rotation: 0
  };

  return (
    <div
      ref={panelRef}
      className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 z-[10000] select-none"
      style={{ 
        left: position.x, 
        top: position.y,
        width: isMinimized ? '280px' : '400px',
        maxHeight: isMinimized ? '60px' : '85vh'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="drag-handle bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-xl cursor-move flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 opacity-75" />
          <h3 className="font-semibold text-sm">
            Controles Avançados {pageFilter ? `- ${pageFilter.charAt(0).toUpperCase() + pageFilter.slice(1)}` : ''}
          </h3>
          {filteredComponents.length > 0 && (
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
              {filteredComponents.filter(c => c.isVisible).length}/{filteredComponents.length}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setShowZIndexManager(!showZIndexManager)}
            className="w-6 h-6 rounded bg-white/20 hover:bg-white/30 flex items-center justify-center"
            title="Gerenciador de Z-Index"
          >
            <BarChart3 className="w-3 h-3" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-6 h-6 rounded bg-white/20 hover:bg-white/30 flex items-center justify-center"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4 max-h-[75vh] overflow-y-auto">
          
          {/* Painel de Gerenciamento Rápido */}
          {showZIndexManager && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Gerenciamento Rápido de Z-Index
              </h4>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={autoOrganizeZIndex}
                  className="bg-blue-500 text-white py-2 px-3 rounded text-xs hover:bg-blue-600 flex items-center gap-1 justify-center"
                >
                  <RefreshCw className="w-3 h-3" />
                  Auto-Organizar
                </button>
                <button
                  onClick={resetAllZIndex}
                  className="bg-gray-500 text-white py-2 px-3 rounded text-xs hover:bg-gray-600 flex items-center gap-1 justify-center"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Todos
                </button>
              </div>

              {/* Lista Visual de Z-Index */}
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded p-2 bg-white">
                <div className="text-xs space-y-1">
                  {filteredComponents
                    .filter(c => c.isVisible)
                    .sort((a, b) => {
                      const aZ = (a.configs[breakpoint] || a.configs.lg || {}).zIndex || 1;
                      const bZ = (b.configs[breakpoint] || b.configs.lg || {}).zIndex || 1;
                      return bZ - aZ;
                    })
                    .map(comp => {
                      const config = comp.configs[breakpoint] || comp.configs.lg || {};
                      return (
                        <div 
                          key={comp.id}
                          className={`flex justify-between items-center px-2 py-1 rounded cursor-pointer ${
                            comp.id === selectedComponent ? 'bg-blue-100' : 'hover:bg-gray-50'
                          } ${comp.hasOverlap ? 'border-l-4 border-red-500' : ''}`}
                          onClick={() => handleComponentSelect(comp.id)}
                        >
                          <span className="truncate flex-1 flex items-center gap-1">
                            {comp.hasOverlap && <AlertTriangle className="w-3 h-3 text-red-500" />}
                            {comp.id}
                          </span>
                          <span className="font-mono font-bold ml-2">
                            Z:{config.zIndex || 1}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {filteredComponents.some(c => c.hasOverlap) && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Componentes com sobreposição detectada!
                </div>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Componente ({filteredComponents.length})
            </label>
            <select
              value={selectedComponent}
              onChange={(e) => handleComponentSelect(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um componente</option>
              {filteredComponents.map(comp => (
                <option key={comp.id} value={comp.id}>
                  {comp.isVisible ? '●' : '○'} {comp.hasOverlap ? '⚠' : ''} {comp.id}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 p-2 bg-blue-50 rounded text-xs text-blue-800 flex items-center gap-2">
            <Settings className="w-3 h-3" />
            Breakpoint: <strong>{breakpoint}</strong> | Z-Index: <strong>{currentConfig.zIndex}</strong>
          </div>

          {selectedComponentData && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">X</label>
                  <input
                    type="number"
                    value={Math.round(currentConfig.x || 0)}
                    onChange={(e) => updateConfig('x', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Y</label>
                  <input
                    type="number"
                    value={Math.round(currentConfig.y || 0)}
                    onChange={(e) => updateConfig('y', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Largura</label>
                  <input
                    type="number"
                    value={Math.round(currentConfig.width || 0)}
                    onChange={(e) => updateConfig('width', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Altura</label>
                  <input
                    type="number"
                    value={Math.round(currentConfig.height || 0)}
                    onChange={(e) => updateConfig('height', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Escala</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="3"
                    value={Number(currentConfig.scale || 1)}
                    onChange={(e) => updateConfig('scale', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    Z-Index {selectedComponentData.hasOverlap && <AlertTriangle className="w-3 h-3 text-red-500" />}
                  </label>
                  <input
                    type="number"
                    value={Math.round(currentConfig.zIndex || 1)}
                    onChange={(e) => updateConfig('zIndex', Number(e.target.value))}
                    className={`w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500 ${
                      selectedComponentData.hasOverlap ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Opacidade</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={Number(currentConfig.opacity || 1)}
                    onChange={(e) => updateConfig('opacity', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rotação</label>
                  <input
                    type="number"
                    step="15"
                    value={Math.round(currentConfig.rotation || 0)}
                    onChange={(e) => updateConfig('rotation', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Controles de Z-Index com ícones SVG */}
              <div className="mb-3 grid grid-cols-4 gap-1">
                <button
                  onClick={() => updateConfig('zIndex', 1)}
                  className="bg-gray-500 text-white py-1 px-2 rounded text-xs hover:bg-gray-600 flex items-center gap-1 justify-center"
                  title="Fundo"
                >
                  <ArrowDown className="w-3 h-3" />
                  Fundo
                </button>
                <button
                  onClick={() => updateConfig('zIndex', Math.max(1, currentConfig.zIndex - 1))}
                  className="bg-orange-500 text-white py-1 px-2 rounded text-xs hover:bg-orange-600 flex items-center gap-1 justify-center"
                  title="Diminuir"
                >
                  <Minus className="w-3 h-3" />
                  -1
                </button>
                <button
                  onClick={() => updateConfig('zIndex', currentConfig.zIndex + 1)}
                  className="bg-purple-500 text-white py-1 px-2 rounded text-xs hover:bg-purple-600 flex items-center gap-1 justify-center"
                  title="Aumentar"
                >
                  <Plus className="w-3 h-3" />
                  +1
                </button>
                <button
                  onClick={bringToTop}
                  className="bg-red-500 text-white py-1 px-2 rounded text-xs hover:bg-red-600 flex items-center gap-1 justify-center"
                  title="Topo"
                >
                  <ArrowUp className="w-3 h-3" />
                  Topo
                </button>
              </div>

              <button
                onClick={saveToStrapi}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-md hover:from-green-600 hover:to-emerald-700 font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 justify-center"
              >
                <Save className="w-4 h-4" />
                Salvar no Banco
              </button>
            </>
          )}

          {filteredComponents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <EyeOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum componente encontrado</p>
              {pageFilter && (
                <p className="text-xs mt-1">para a página "{pageFilter}"</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}