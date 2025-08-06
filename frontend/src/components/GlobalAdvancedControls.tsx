// components/GlobalAdvancedControls.tsx - PAINEL FLUTUANTE GLOBAL
'use client';
import React, { useState, useEffect, useRef } from 'react';
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

interface GlobalAdvancedControlsProps {
  editMode: boolean;
}

export default function GlobalAdvancedControls({ editMode }: GlobalAdvancedControlsProps) {
  const breakpoint = useBreakpoint();
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Posicionamento inicial inteligente
  useEffect(() => {
    if (editMode) {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const x = Math.max(20, screenWidth - 420);
      const y = Math.max(20, Math.min(80, screenHeight * 0.1));
      setPosition({ x, y });
    }
  }, [editMode]);

  // Detecta componentes do localStorage
  useEffect(() => {
    if (!editMode) return;

    const detectComponents = () => {
      const found: ComponentData[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('component-')) {
          const componentId = key.replace('component-', '');
          const configData = localStorage.getItem(key);
          
          if (configData) {
            try {
              const configs = JSON.parse(configData);
              found.push({ id: componentId, configs });
            } catch (error) {
              console.error(`Erro ao carregar ${componentId}:`, error);
            }
          }
        }
      }
      
      found.sort((a, b) => a.id.localeCompare(b.id));
      setComponents(found);
      
      // Auto-seleciona o primeiro se não tem nenhum selecionado
      if (found.length > 0 && !selectedComponent) {
        setSelectedComponent(found[0].id);
      }
    };

    detectComponents();
    
    // Listener para atualizações
    const handleStorageUpdate = () => detectComponents();
    window.addEventListener('storage', handleStorageUpdate);
    
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, [editMode, selectedComponent]);

  // Sistema de drag
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.drag-handle') && !target.closest('button') && !target.closest('select')) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      document.body.style.cursor = 'grabbing';
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dialogWidth = isMinimized ? 320 : 384;
        const dialogHeight = isMinimized ? 56 : 600;
        const newX = Math.max(0, Math.min(window.innerWidth - dialogWidth, e.clientX - dragStart.x));
        const newY = Math.max(0, Math.min(window.innerHeight - dialogHeight, e.clientY - dragStart.y));
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.cursor = '';
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isDragging, dragStart, isMinimized]);

  // Atualiza configuração do componente
  const updateComponentConfig = (componentId: string, key: keyof ResponsiveConfig, value: number) => {
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    const currentConfig = component.configs[breakpoint] || component.configs.lg || {};
    const newConfig = { ...currentConfig, [key]: value };
    const updatedConfigs = { ...component.configs, [breakpoint]: newConfig };
    
    // Salva no localStorage
    localStorage.setItem(`component-${componentId}`, JSON.stringify(updatedConfigs));
    
    // Atualiza estado local
    setComponents(prev => prev.map(c => 
      c.id === componentId 
        ? { ...c, configs: updatedConfigs }
        : c
    ));
    
    // Dispara evento para componente se atualizar EM TEMPO REAL
    window.dispatchEvent(new CustomEvent('component-config-changed', { 
      detail: { componentId, config: newConfig } 
    }));
  };

  // SALVAMENTO DIRETO
  const saveComponentToStrapi = async (componentId: string) => {
    if (!componentId) return;

    setIsSaving(true);
    
    try {
      const component = components.find(c => c.id === componentId);
      if (!component) throw new Error('Componente não encontrado');

      const currentConfig = component.configs[breakpoint] || component.configs.lg || {};
      const strapiBreakpoint = breakpoint === '2xl' ? 'xxl' : 
                              breakpoint === '3xl' ? 'xxxl' : 
                              breakpoint === '4xl' ? 'xxxxl' : breakpoint;

      const baseURL = window.location.origin.includes('localhost') 
        ? 'http://localhost:1337' 
        : process?.env?.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      
      // Busca se já existe
      const checkResponse = await fetch(
        `${baseURL}/api/component-layouts?filters[componentId][$eq]=${componentId}&filters[breakpoint][$eq]=${strapiBreakpoint}`
      );
      
      const checkData = await checkResponse.json();
      const existingEntry = checkData?.data?.[0];
      const existingDocumentId = existingEntry?.documentId;

      const configData = {
        componentId,
        breakpoint: strapiBreakpoint,
        x: Number(currentConfig.x) || 74,
        y: Number(currentConfig.y) || 70,
        width: Number(currentConfig.width) || 400,
        height: Number(currentConfig.height) || 200,
        scale: Number(currentConfig.scale) || 1,
        zIndex: Number(currentConfig.zIndex) || 1,
        opacity: Number(currentConfig.opacity) || 1,
        rotation: Number(currentConfig.rotation) || 0
      };

      let saveResponse;
      
      if (existingDocumentId) {
        saveResponse = await fetch(`${baseURL}/api/component-layouts/${existingDocumentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: configData })
        });
      } else {
        saveResponse = await fetch(`${baseURL}/api/component-layouts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: configData })
        });
      }

      if (!saveResponse.ok) throw new Error(`Erro HTTP ${saveResponse.status}`);
      
      alert(`✅ ${componentId} salvo no PostgreSQL!`);
      
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      alert(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Dados do componente selecionado
  const selectedComponentData = components.find(c => c.id === selectedComponent);
  const currentConfig = selectedComponentData?.configs[breakpoint] || 
                       selectedComponentData?.configs.lg || 
                       { x: 0, y: 0, width: 400, height: 200, scale: 1, zIndex: 1, opacity: 1, rotation: 0 };

  if (!editMode) return null;

  return (
    <div
      ref={dialogRef}
      className={`fixed bg-white border transition-all duration-300 z-[9999] ${
        isDragging 
          ? 'border-blue-400 shadow-2xl border-2' 
          : 'border-gray-300 shadow-xl'
      } ${
        isMinimized ? 'w-80 h-14' : 'w-96'
      } rounded-lg`}
      style={{
        left: position.x,
        top: position.y,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className={`drag-handle bg-gray-50 border-b border-gray-200 p-3 rounded-t-lg flex items-center justify-between select-none ${
        isDragging ? 'cursor-grabbing bg-gray-100' : 'cursor-grab hover:bg-gray-100'
      }`}>
        <div className="flex items-center gap-2 pointer-events-none">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Controles Globais</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{breakpoint}</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              {isMinimized ? (
                <path d="M12 2l3.09 6.26L22 9l-6.91.74L12 22l-3.09-6.26L2 15l6.91-.74L12 2z"/>
              ) : (
                <path d="M6 18h12v-2H6v2zM6 13h12v-2H6v2zM6 8h12V6H6v2z"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Seleção de Componente */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Componente</label>
            <select 
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="">Escolha um componente...</option>
              {components.map(comp => (
                <option key={comp.id} value={comp.id}>
                  {comp.id.charAt(0).toUpperCase() + comp.id.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Botão de Salvamento */}
          <div className="p-4 border-b border-gray-100">
            <button
              onClick={() => saveComponentToStrapi(selectedComponent)}
              disabled={isSaving || !selectedComponent}
              className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {isSaving ? (
                <>
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19Z"/>
                  </svg>
                  Salvar {selectedComponent}
                </>
              )}
            </button>
          </div>

          {/* Controles */}
          {selectedComponentData && (
            <div className="overflow-y-auto max-h-80 p-4 space-y-4">
              
              {/* Posição */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Posição
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      X: {Math.round(currentConfig.x || 0)}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={window.innerWidth}
                      value={currentConfig.x || 0}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'x', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Y: {Math.round(currentConfig.y || 0)}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={window.innerHeight}
                      value={currentConfig.y || 0}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'y', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Tamanho */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Dimensões
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Largura: {Math.round(currentConfig.width || 0)}px
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="1500"
                      value={currentConfig.width || 400}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'width', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Altura: {Math.round(currentConfig.height || 0)}px
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="800"
                      value={currentConfig.height || 200}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'height', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Transformações */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Transformações
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Escala: {(currentConfig.scale || 1).toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={currentConfig.scale || 1}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'scale', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Rotação: {Math.round(currentConfig.rotation || 0)}°
                    </label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={currentConfig.rotation || 0}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'rotation', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Camadas */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Camadas
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Opacidade: {Math.round((currentConfig.opacity || 1) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={currentConfig.opacity || 1}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'opacity', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Z-Index: {currentConfig.zIndex || 1}
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        value={currentConfig.zIndex || 1}
                        onChange={(e) => updateComponentConfig(selectedComponent, 'zIndex', parseInt(e.target.value) || 1)}
                        className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        min="1"
                        max="999"
                      />
                      <button 
                        onClick={() => updateComponentConfig(selectedComponent, 'zIndex', (currentConfig.zIndex || 1) + 1)}
                        className="w-6 h-6 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ferramentas */}
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Ferramentas
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      updateComponentConfig(selectedComponent, 'x', (window.innerWidth - currentConfig.width) / 2);
                      updateComponentConfig(selectedComponent, 'y', (window.innerHeight - currentConfig.height) / 2);
                    }}
                    className="px-2 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs"
                  >
                    Centralizar
                  </button>
                  <button 
                    onClick={() => {
                      updateComponentConfig(selectedComponent, 'rotation', 0);
                      updateComponentConfig(selectedComponent, 'opacity', 1);
                      updateComponentConfig(selectedComponent, 'scale', 1);
                    }}
                    className="px-2 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
