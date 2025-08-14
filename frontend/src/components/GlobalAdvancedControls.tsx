// components/GlobalAdvancedControls.tsx - PAINEL MODERNO E INTELIGENTE
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';

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
  isVisible: boolean; // Se o componente realmente existe na página
  lastUsed: number; // Timestamp da última vez que foi usado
}

interface GlobalAdvancedControlsProps {
  editMode: boolean;
  pageFilter?: string;
}

// Configurações de páginas - define EXATAMENTE quais componentes pertencem a cada página
const PAGE_COMPONENTS = {
  montante: [
    'porta-montante-',  // Qualquer coisa que comece com porta-montante-
    'contrapeso-montante-'  // Qualquer coisa que comece com contrapeso-montante-
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
  ]
};

export default function GlobalAdvancedControls({ editMode, pageFilter }: GlobalAdvancedControlsProps) {
  const breakpoint = useBreakpoint();
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  // Removido showCleanup - não é mais necessário
  const [dragState, setDragState] = useState({ isDragging: false, offset: { x: 0, y: 0 } });
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 20, y: 100 });

  // Filtrar componentes APENAS da página atual
  const filteredComponents = useMemo(() => {
    if (!pageFilter || !PAGE_COMPONENTS[pageFilter as keyof typeof PAGE_COMPONENTS]) {
      return components.filter(comp => comp.isVisible); // Sem filtro, só mostra ativos
    }

    const pagePatterns = PAGE_COMPONENTS[pageFilter as keyof typeof PAGE_COMPONENTS];
    return components.filter(comp => {
      // VERIFICA se o componente pertence ESPECIFICAMENTE à página atual
      const belongsToPage = pagePatterns.some(pattern => {
        // Para padrões que terminam com '-', usar startsWith (mais específico)
        if (pattern.endsWith('-')) {
          return comp.id.startsWith(pattern);
        }
        // Para outros padrões, usar startsWith também (ex: VD, VG, etc)
        return comp.id.startsWith(pattern);
      });
      
      console.log(`🎯 [FILTRO] ${comp.id} pertence à página ${pageFilter}? ${belongsToPage}`);
      return belongsToPage;
    });
  }, [components, pageFilter]);

  // Detectar componentes ativos na página atual
  const detectActiveComponents = () => {
    const activeComponents = new Set<string>();
    
    // Verifica todos os elementos ResponsiveWrapper na página
    document.querySelectorAll('[data-component-id]').forEach(element => {
      const componentId = element.getAttribute('data-component-id');
      if (componentId) {
        activeComponents.add(componentId);
      }
    });

    return activeComponents;
  };

  // Carregar componentes do localStorage
  const loadComponents = () => {
    const found: ComponentData[] = [];
    const activeComponents = detectActiveComponents();

    console.log(`🔍 [GLOBAL] Componentes ativos na página:`, Array.from(activeComponents));

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

    // Ordenar: ativos primeiro, depois por uso recente
    found.sort((a, b) => {
      if (a.isVisible && !b.isVisible) return -1;
      if (!a.isVisible && b.isVisible) return 1;
      return b.lastUsed - a.lastUsed;
    });

    setComponents(found);
    
    // Auto-selecionar o primeiro componente ativo
    const firstActive = found.find(c => c.isVisible);
    if (firstActive && (!selectedComponent || !found.find(c => c.id === selectedComponent)?.isVisible)) {
      setSelectedComponent(firstActive.id);
    }

    console.log(`🎯 [GLOBAL] Total: ${found.length} | Ativos: ${found.filter(c => c.isVisible).length} | Filtrados: ${filteredComponents.length}`);
  };

  // Função de limpeza removida - não é mais necessária

  // Salvar configuração no Strapi
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

      // Buscar se já existe
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
        // Atualizar timestamp de uso
        localStorage.setItem(`component-${selectedComponent}-lastused`, Date.now().toString());
      } else {
        throw new Error(`Erro HTTP ${saveResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar no Strapi:', error);
      alert(`Erro ao salvar: ${error}`);
    }
  };

  // Atualizar configuração
  const updateConfig = (property: keyof ResponsiveConfig, value: number) => {
    if (!selectedComponent) return;

    const component = components.find(c => c.id === selectedComponent);
    if (!component) return;

    const newConfigs = { ...component.configs };
    const currentConfig = newConfigs[breakpoint] || newConfigs.lg || {};
    
    newConfigs[breakpoint] = { ...currentConfig, [property]: value };
    
    // Atualizar localStorage
    localStorage.setItem(`component-${selectedComponent}`, JSON.stringify(newConfigs));
    
    // Disparar evento para o componente
    window.dispatchEvent(new CustomEvent('component-config-changed', {
      detail: { componentId: selectedComponent, config: newConfigs[breakpoint] }
    }));

    // Atualizar estado local
    setComponents(prev => prev.map(c => 
      c.id === selectedComponent ? { ...c, configs: newConfigs } : c
    ));
  };

  // Drag and drop
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
      y: Math.max(0, Math.min(window.innerHeight - 600, e.clientY - dragState.offset.y))
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

  // Não renderizar se não estiver em modo edição
  if (!editMode) return null;

  const selectedComponentData = components.find(c => c.id === selectedComponent);
  const currentConfig = selectedComponentData?.configs[breakpoint] || selectedComponentData?.configs.lg || {
    x: 74, y: 70, width: 400, height: 200, scale: 1, zIndex: 1, opacity: 1, rotation: 0
  };
  // Removido hasInactiveComponents - não mostra mais componentes de outras páginas

  return (
    <div
      ref={panelRef}
      className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] select-none"
      style={{ 
        left: position.x, 
        top: position.y,
        width: isMinimized ? '280px' : '380px',
        maxHeight: isMinimized ? '60px' : '80vh'
      }}
    >
      {/* Header */}
      <div className="drag-handle bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-xl cursor-move flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full opacity-75"></div>
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
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-6 h-6 rounded bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs"
          >
            {isMinimized ? '⬆️' : '⬇️'}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Component Selector */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Componente ({filteredComponents.length})
            </label>
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um componente</option>
              {filteredComponents.map(comp => (
                <option key={comp.id} value={comp.id}>
                  {comp.isVisible ? '🟢' : '🔴'} {comp.id}
                </option>
              ))}
            </select>
          </div>

          {/* Current Breakpoint */}
          <div className="mb-4 p-2 bg-blue-50 rounded text-xs text-blue-800">
            📱 Breakpoint atual: <strong>{breakpoint}</strong>
          </div>

          {selectedComponentData && (
            <>
              {/* Controls Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Position */}
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
                
                {/* Size */}
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

                {/* Transform */}
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">Z-Index</label>
                  <input
                    type="number"
                    value={Math.round(currentConfig.zIndex || 1)}
                    onChange={(e) => updateConfig('zIndex', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Advanced */}
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

              {/* Z-Index Controls */}
              <div className="mb-3 flex gap-2">
                <button
                  onClick={() => {
                    const newZIndex = Math.max(1, currentConfig.zIndex - 1);
                    updateConfig('zIndex', newZIndex);
                  }}
                  className="flex-1 bg-orange-500 text-white py-1 px-2 rounded text-xs hover:bg-orange-600"
                  title="Enviar para trás"
                >
                  ⬇️ Trás
                </button>
                <button
                  onClick={() => {
                    const newZIndex = currentConfig.zIndex + 1;
                    updateConfig('zIndex', newZIndex);
                  }}
                  className="flex-1 bg-purple-500 text-white py-1 px-2 rounded text-xs hover:bg-purple-600"
                  title="Trazer para frente"
                >
                  ⬆️ Frente
                </button>
                <button
                  onClick={() => updateConfig('zIndex', 9999)}
                  className="flex-1 bg-red-500 text-white py-1 px-2 rounded text-xs hover:bg-red-600"
                  title="Trazer para o topo"
                >
                  🔝 Topo
                </button>
              </div>

              {/* Save Button */}
              <button
                onClick={saveToStrapi}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-md hover:from-green-600 hover:to-emerald-700 font-medium text-sm shadow-md hover:shadow-lg transition-all"
              >
                💾 Salvar no Banco
              </button>
            </>
          )}

          {filteredComponents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
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