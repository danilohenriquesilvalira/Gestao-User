// components/SmartSidebarPanel.tsx - BARRA LATERAL INTELIGENTE
'use client';
import React, { useState, useEffect } from 'react';
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
}

interface SmartSidebarPanelProps {
  editMode: boolean;
  onToggleEdit: () => void;
}

export default function SmartSidebarPanel({ editMode, onToggleEdit }: SmartSidebarPanelProps) {
  const breakpoint = useBreakpoint();
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [collapsed, setCollapsed] = useState(false);

  // Detecta componentes automaticamente
  useEffect(() => {
    if (!editMode) return;

    const detectComponents = () => {
      const found: ComponentData[] = [];
      
      // Varre localStorage procurando componentes
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('component-')) {
          const componentId = key.replace('component-', '');
          const configData = localStorage.getItem(key);
          
          if (configData) {
            try {
              const configs = JSON.parse(configData);
              found.push({ id: componentId, configs });
            } catch (e) {
              console.error(`Erro ao carregar ${componentId}`);
            }
          }
        }
      }
      
      setComponents(found);
      if (found.length > 0 && !selectedComponent) {
        setSelectedComponent(found[0].id);
      }
    };

    detectComponents();
    
    // Re-detecta a cada 2 segundos para pegar novos componentes
    const interval = setInterval(detectComponents, 2000);
    return () => clearInterval(interval);
  }, [editMode, selectedComponent]);

  // BOTÃO FLUTUANTE PARA ENTRAR NO EDITOR
  if (!editMode) {
    return (
      <button
        onClick={onToggleEdit}
        className="fixed top-32 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-blue-700 z-50 font-medium"
      >
        🎨 Entrar no Editor
      </button>
    );
  }

  // Atualiza configuração de um componente
  const updateComponentConfig = (componentId: string, key: keyof ResponsiveConfig, value: number) => {
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    const currentConfig = component.configs[breakpoint] || component.configs.lg || {};
    const newConfig = { ...currentConfig, [key]: value };
    const updatedConfigs = { ...component.configs, [breakpoint]: newConfig };
    
    // Atualiza localStorage
    localStorage.setItem(`component-${componentId}`, JSON.stringify(updatedConfigs));
    
    // Atualiza state local
    setComponents(prev => prev.map(c => 
      c.id === componentId 
        ? { ...c, configs: updatedConfigs }
        : c
    ));
    
    // Força refresh do componente na tela
    window.dispatchEvent(new CustomEvent('component-config-changed', { 
      detail: { componentId, config: newConfig } 
    }));
  };

  // Reset de componente
  const resetComponent = (componentId: string) => {
    localStorage.removeItem(`component-${componentId}`);
    setComponents(prev => prev.filter(c => c.id !== componentId));
    window.location.reload();
  };

  // Export/Import configs
  const exportConfigs = () => {
    const allConfigs: Record<string, Record<string, ResponsiveConfig>> = {};
    components.forEach(comp => {
      allConfigs[comp.id] = comp.configs;
    });
    
    const blob = new Blob([JSON.stringify(allConfigs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'components-layout.json';
    a.click();
  };

  if (!editMode) return null;

  const selectedComponentData = components.find(c => c.id === selectedComponent);
  const currentConfig: ResponsiveConfig = selectedComponentData?.configs[breakpoint] || selectedComponentData?.configs.lg || {
    x: 0,
    y: 0,
    width: 400,
    height: 200,
    scale: 1,
    zIndex: 1,
    opacity: 1,
    rotation: 0
  };

  return (
    <div className={`fixed right-0 top-16 bottom-0 bg-white border-l-2 border-gray-300 shadow-xl z-50 transition-all duration-300 flex flex-col ${
      collapsed ? 'w-8' : 'w-80 md:w-96'
    } ${
      // Responsividade por breakpoint
      'max-w-[90vw] md:max-w-none'
    }`}>
      
      {/* Header responsivo */}
      <div className="bg-gray-900 text-white p-2 md:p-3 flex justify-between items-center flex-shrink-0">
        {!collapsed && (
          <div className="flex-1">
            <h3 className="font-bold text-sm md:text-base">Editor</h3>
            <div className="text-xs text-gray-300">
              {components.length} comp(s) | {breakpoint}
            </div>
          </div>
        )}
        <div className="flex gap-2">
          {/* Botão sair - SEMPRE visível */}
          <button 
            onClick={onToggleEdit}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex-shrink-0"
            title="Sair do Editor"
          >
            🚪 Sair
          </button>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:text-gray-300 flex-shrink-0"
          >
            {collapsed ? '←' : '→'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="flex flex-col h-full">
          
          {/* Lista de Componentes - FIXO */}
          <div className="border-b bg-gray-50 p-3 flex-shrink-0">
            <label className="block text-sm font-medium mb-2">Componente Ativo:</label>
            <select 
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              {components.map(comp => (
                <option key={comp.id} value={comp.id}>
                  {comp.id}
                </option>
              ))}
            </select>
          </div>

          {/* Controles do Componente Selecionado - SCROLLÁVEL */}
          {selectedComponentData && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* Posição */}
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-bold text-sm mb-2 text-blue-800">📍 Posição</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium">X: {Math.round(currentConfig.x || 0)}</label>
                    <input
                      type="range"
                      min="0"
                      max={window.innerWidth}
                      value={currentConfig.x || 0}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'x', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Y: {Math.round(currentConfig.y || 0)}</label>
                    <input
                      type="range"
                      min="0"
                      max={window.innerHeight}
                      value={currentConfig.y || 0}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'y', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Tamanho */}
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-bold text-sm mb-2 text-green-800">📏 Tamanho</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium">Largura: {Math.round(currentConfig.width || 0)}</label>
                    <input
                      type="range"
                      min="50"
                      max="1500"
                      value={currentConfig.width || 400}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'width', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Altura: {Math.round(currentConfig.height || 0)}</label>
                    <input
                      type="range"
                      min="30"
                      max="800"
                      value={currentConfig.height || 200}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'height', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Transformações - SEM ESCALA */}
              <div className="bg-purple-50 p-3 rounded">
                <h4 className="font-bold text-sm mb-2 text-purple-800">🔄 Transformações</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium">Rotação: {Math.round(currentConfig.rotation || 0)}°</label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={currentConfig.rotation || 0}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'rotation', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium">Opacidade: {(currentConfig.opacity || 1).toFixed(1)}</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={currentConfig.opacity || 1}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'opacity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Z-Index */}
              <div className="bg-orange-50 p-3 rounded">
                <h4 className="font-bold text-sm mb-2 text-orange-800">📚 Camadas</h4>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={currentConfig.zIndex || 1}
                    onChange={(e) => updateComponentConfig(selectedComponent, 'zIndex', parseInt(e.target.value) || 1)}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                    min="1"
                    max="999"
                  />
                  <button 
                    onClick={() => updateComponentConfig(selectedComponent, 'zIndex', (currentConfig.zIndex || 1) + 1)}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={() => updateComponentConfig(selectedComponent, 'zIndex', Math.max(1, (currentConfig.zIndex || 1) - 1))}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  >
                    ↓
                  </button>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-bold text-sm mb-2">⚡ Ações Rápidas</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      updateComponentConfig(selectedComponent, 'x', (window.innerWidth - (currentConfig.width || 400)) / 2);
                      updateComponentConfig(selectedComponent, 'y', (window.innerHeight - (currentConfig.height || 200)) / 2);
                    }}
                    className="bg-blue-500 text-white px-3 py-2 rounded text-xs hover:bg-blue-600"
                  >
                    🎯 Centro
                  </button>
                  <button 
                    onClick={() => {
                      updateComponentConfig(selectedComponent, 'scale', 1);
                      updateComponentConfig(selectedComponent, 'rotation', 0);
                      updateComponentConfig(selectedComponent, 'opacity', 1);
                    }}
                    className="bg-gray-500 text-white px-3 py-2 rounded text-xs hover:bg-gray-600"
                  >
                    🔄 Reset
                  </button>
                  <button 
                    onClick={() => resetComponent(selectedComponent)}
                    className="bg-red-500 text-white px-3 py-2 rounded text-xs hover:bg-red-600"
                  >
                    🗑️ Limpar
                  </button>
                  <button 
                    onClick={exportConfigs}
                    className="bg-green-500 text-white px-3 py-2 rounded text-xs hover:bg-green-600"
                  >
                    💾 Export
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estado Recolhido */}
      {collapsed && (
        <div className="p-2 space-y-2">
          <button 
            onClick={onToggleEdit}
            className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
            title="Sair do Editor"
          >
            🚪
          </button>
          <div className="text-xs text-center text-gray-600 writing-mode-vertical transform rotate-180">
            Editor
          </div>
        </div>
      )}
    </div>
  );
}