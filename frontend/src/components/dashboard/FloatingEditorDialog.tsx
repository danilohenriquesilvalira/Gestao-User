// components/FloatingEditorDialog.tsx - EDITOR MODERNO REFORMULADO
'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useNotification } from '@/contexts/NotificationContext';

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

interface FloatingEditorDialogProps {
  editMode: boolean;
  onToggleEdit: () => void;
}

export default function FloatingEditorDialog({ editMode, onToggleEdit }: FloatingEditorDialogProps) {
  const breakpoint = useBreakpoint();
  const { addNotification } = useNotification();
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  // Posicionamento inteligente baseado no tamanho da tela
  useEffect(() => {
    if (editMode && !isDragging) {
      const updatePosition = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Posição otimizada: lado direito, mas não colado na borda
        const x = Math.max(20, screenWidth - 450);
        const y = Math.max(20, Math.min(100, screenHeight * 0.15));
        
        setPosition({ x, y });
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [editMode, isDragging]);

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
      
      // Ordena componentes alfabeticamente
      found.sort((a, b) => a.id.localeCompare(b.id));
      setComponents(found);
      
      if (found.length > 0 && !selectedComponent) {
        setSelectedComponent(found[0].id);
      }
    };

    detectComponents();
  }, [editMode, selectedComponent]);

  // Sistema de drag aprimorado
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        const newX = Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragStart.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragStart.y));
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Função de salvamento melhorada com notificações
  const saveComponentToStrapi = async (componentId: string) => {
    if (!componentId) {
      addNotification({
        type: 'warning',
        title: 'Atenção',
        message: 'Selecione um componente para salvar'
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const component = components.find(c => c.id === componentId);
      if (!component) {
        throw new Error('Componente não encontrado');
      }

      const currentConfig = component.configs[breakpoint] || component.configs.lg || {};
      const strapiBreakpoint = breakpoint === '2xl' ? 'xxl' : 
                              breakpoint === '3xl' ? 'xxxl' : 
                              breakpoint === '4xl' ? 'xxxxl' : breakpoint;

      const baseURL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      
      // Busca registro existente
      const searchResponse = await fetch(
        `${baseURL}/api/component-layouts?filters[componentId][$eq]=${componentId}&filters[breakpoint][$eq]=${strapiBreakpoint}`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!searchResponse.ok) {
        throw new Error(`Erro na busca: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      const existingRecord = searchData.data[0];

      const configData = {
        componentId,
        breakpoint: strapiBreakpoint,
        x: Math.round(currentConfig.x || 0),
        y: Math.round(currentConfig.y || 0),
        width: Math.round(currentConfig.width || 400),
        height: Math.round(currentConfig.height || 200),
        scale: Number((currentConfig.scale || 1).toFixed(2)),
        zIndex: currentConfig.zIndex || 1,
        opacity: Number((currentConfig.opacity || 1).toFixed(2)),
        rotation: Math.round(currentConfig.rotation || 0)
      };

      let response;
      if (existingRecord) {
        // Atualiza registro existente usando documentId
        response = await fetch(`${baseURL}/api/component-layouts/${existingRecord.documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: configData })
        });
      } else {
        // Cria novo registro
        response = await fetch(`${baseURL}/api/component-layouts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: configData })
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro HTTP ${response.status}: ${errorData.error?.message || 'Erro desconhecido'}`);
      }

      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: `Layout do ${componentId} salvo no banco de dados (${breakpoint})`
      });

    } catch (error) {
      console.error('Erro ao salvar no Strapi:', error);
      addNotification({
        type: 'error',
        title: 'Erro ao Salvar',
        message: error instanceof Error ? error.message : 'Erro desconhecido ao salvar no banco'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Função para salvar todos os componentes de uma vez
  const saveAllComponents = async () => {
    if (components.length === 0) {
      addNotification({
        type: 'warning',
        title: 'Atenção',
        message: 'Nenhum componente encontrado para salvar'
      });
      return;
    }

    setIsSaving(true);
    let successCount = 0;
    let errorCount = 0;

    for (const component of components) {
      try {
        await saveComponentToStrapi(component.id);
        successCount++;
        // Pequeno delay para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        errorCount++;
      }
    }

    if (successCount > 0 && errorCount === 0) {
      addNotification({
        type: 'success',
        title: 'Todos Salvos!',
        message: `${successCount} componentes salvos com sucesso`
      });
    } else if (successCount > 0 && errorCount > 0) {
      addNotification({
        type: 'warning',
        title: 'Parcialmente Salvo',
        message: `${successCount} salvos, ${errorCount} com erro`
      });
    } else {
      addNotification({
        type: 'error',
        title: 'Erro Geral',
        message: 'Não foi possível salvar nenhum componente'
      });
    }

    setIsSaving(false);
  };

  // Atualiza configuração do componente
  const updateComponentConfig = (componentId: string, key: keyof ResponsiveConfig, value: number) => {
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    const currentConfig = component.configs[breakpoint] || component.configs.lg || {};
    const newConfig = { ...currentConfig, [key]: value };
    const updatedConfigs = { ...component.configs, [breakpoint]: newConfig };
    
    // Salva no localStorage
    localStorage.setItem(`component-${componentId}`, JSON.stringify(updatedConfigs));
    
    // Atualiza estado
    setComponents(prev => prev.map(c => 
      c.id === componentId 
        ? { ...c, configs: updatedConfigs }
        : c
    ));
    
    // Dispara evento para componente se atualizar
    window.dispatchEvent(new CustomEvent('component-config-changed', { 
      detail: { componentId, config: newConfig } 
    }));
  };

  // Dados do componente selecionado
  const selectedComponentData = useMemo(() => 
    components.find(c => c.id === selectedComponent), [components, selectedComponent]
  );

  const currentConfig: ResponsiveConfig = useMemo(() => 
    selectedComponentData?.configs[breakpoint] || 
    selectedComponentData?.configs.lg || 
    { x: 0, y: 0, width: 400, height: 200, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    [selectedComponentData, breakpoint]
  );

  // Botão flutuante quando não está em modo de edição
  if (!editMode) {
    return (
      <button
        onClick={onToggleEdit}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center group border-2 border-blue-500/30"
        title="Abrir Editor de Layout"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:rotate-12">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
        </svg>
      </button>
    );
  }

  // Interface principal do editor
  return (
    <div
      ref={dialogRef}
      className={`fixed bg-white/98 backdrop-blur-md border-2 border-gray-200/80 rounded-3xl shadow-2xl z-[9999] transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 max-h-[85vh]'
      }`}
      style={{
        left: position.x,
        top: position.y,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        pointerEvents: 'auto'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header Premium */}
      <div className="drag-handle bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white p-4 rounded-t-3xl cursor-move flex items-center justify-between relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm">Layout Editor Pro</h3>
            <p className="text-xs text-gray-300">Breakpoint: {breakpoint.toUpperCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors"
            title={isMinimized ? "Expandir" : "Minimizar"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              {isMinimized ? (
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              ) : (
                <path d="M19 13H5v-2h14v2z"/>
              )}
            </svg>
          </button>
          <button
            onClick={onToggleEdit}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors"
            title="Fechar Editor"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Component Selector & Actions */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Componente</label>
                  <select 
                    value={selectedComponent}
                    onChange={(e) => setSelectedComponent(e.target.value)}
                    className="w-full text-sm border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all"
                  >
                    <option value="">Selecione um componente...</option>
                    {components.map(comp => (
                      <option key={comp.id} value={comp.id}>
                        {comp.id.charAt(0).toUpperCase() + comp.id.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => saveComponentToStrapi(selectedComponent)}
                  disabled={isSaving || !selectedComponent}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-lg hover:shadow-xl"
                >
                  {isSaving ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="animate-spin">
                        <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"/>
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19Z"/>
                      </svg>
                      Salvar Banco
                    </>
                  )}
                </button>
                
                <button
                  onClick={saveAllComponents}
                  disabled={isSaving || components.length === 0}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-lg hover:shadow-xl"
                  title="Salvar todos os componentes"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM17 16H7V14H17V16ZM17 8H7V6H17V8Z"/>
                  </svg>
                  Todos
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          {selectedComponentData && (
            <div className="overflow-y-auto max-h-96">
              <div className="p-4 space-y-6">
                
                {/* Posição */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                      </svg>
                    </div>
                    Posição
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        X: <span className="font-bold text-blue-600">{Math.round(currentConfig.x || 0)}px</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={window.innerWidth}
                        value={currentConfig.x || 0}
                        onChange={(e) => updateComponentConfig(selectedComponent, 'x', parseInt(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg appearance-none cursor-pointer slider-modern"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Y: <span className="font-bold text-blue-600">{Math.round(currentConfig.y || 0)}px</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={window.innerHeight}
                        value={currentConfig.y || 0}
                        onChange={(e) => updateComponentConfig(selectedComponent, 'y', parseInt(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg appearance-none cursor-pointer slider-modern"
                      />
                    </div>
                  </div>
                </div>

                {/* Tamanho */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M22 4H2V20H22V4ZM20 18H4V6H20V18Z"/>
                      </svg>
                    </div>
                    Dimensões
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Largura: <span className="font-bold text-purple-600">{Math.round(currentConfig.width || 0)}px</span>
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="1500"
                        value={currentConfig.width || 400}
                        onChange={(e) => updateComponentConfig(selectedComponent, 'width', parseInt(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg appearance-none cursor-pointer slider-modern"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Altura: <span className="font-bold text-purple-600">{Math.round(currentConfig.height || 0)}px</span>
                      </label>
                      <input
                        type="range"
                        min="30"
                        max="800"
                        value={currentConfig.height || 200}
                        onChange={(e) => updateComponentConfig(selectedComponent, 'height', parseInt(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg appearance-none cursor-pointer slider-modern"
                      />
                    </div>
                  </div>
                </div>

                {/* Escala e Rotação */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M12 5V1L7 6L12 11V7C15.31 7 18 9.69 18 13S15.31 19 12 19 6 16.31 6 13H4C4 17.42 7.58 21 12 21S20 17.42 20 13 16.42 5 12 5Z"/>
                      </svg>
                    </div>
                    Transformações
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Escala: <span className="font-bold text-orange-600">{(currentConfig.scale || 1).toFixed(1)}x</span>
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={currentConfig.scale || 1}
                        onChange={(e) => updateComponentConfig(selectedComponent, 'scale', parseFloat(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg appearance-none cursor-pointer slider-modern"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Rotação: <span className="font-bold text-orange-600">{Math.round(currentConfig.rotation || 0)}°</span>
                      </label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={currentConfig.rotation || 0}
                        onChange={(e) => updateComponentConfig(selectedComponent, 'rotation', parseInt(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg appearance-none cursor-pointer slider-modern"
                      />
                    </div>
                  </div>
                </div>

                {/* Opacidade e Z-Index */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M3 13H15V11H3V13ZM3 17H11V15H3V17ZM3 9H15V7H3V9ZM16 15V9H21L16 15Z"/>
                      </svg>
                    </div>
                    Camadas & Opacidade
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Opacidade: <span className="font-bold text-green-600">{Math.round((currentConfig.opacity || 1) * 100)}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={currentConfig.opacity || 1}
                        onChange={(e) => updateComponentConfig(selectedComponent, 'opacity', parseFloat(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg appearance-none cursor-pointer slider-modern"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Z-Index: <span className="font-bold text-green-600">{currentConfig.zIndex || 1}</span>
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={currentConfig.zIndex || 1}
                          onChange={(e) => updateComponentConfig(selectedComponent, 'zIndex', parseInt(e.target.value) || 1)}
                          className="flex-1 text-sm border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white/80"
                          min="1"
                          max="999"
                        />
                        <button 
                          onClick={() => updateComponentConfig(selectedComponent, 'zIndex', (currentConfig.zIndex || 1) + 1)}
                          className="w-8 h-8 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                      </svg>
                    </div>
                    Ações Rápidas
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        updateComponentConfig(selectedComponent, 'x', (window.innerWidth - (currentConfig.width || 400)) / 2);
                        updateComponentConfig(selectedComponent, 'y', (window.innerHeight - (currentConfig.height || 200)) / 2);
                      }}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-lg hover:shadow-xl"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                      </svg>
                      Centralizar
                    </button>
                    <button 
                      onClick={() => {
                        updateComponentConfig(selectedComponent, 'rotation', 0);
                        updateComponentConfig(selectedComponent, 'opacity', 1);
                        updateComponentConfig(selectedComponent, 'scale', 1);
                      }}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-lg hover:shadow-xl"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 5V1L7 6L12 11V7C15.31 7 18 9.69 18 13S15.31 19 12 19 6 16.31 6 13H4C4 17.42 7.58 21 12 21S20 17.42 20 13 16.42 5 12 5Z"/>
                      </svg>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* CSS moderno para sliders */}
      <style>{`
        .slider-modern::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1);
          transition: all 0.2s ease;
        }
        
        .slider-modern::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.6), 0 0 0 1px rgba(59, 130, 246, 0.2);
        }
        
        .slider-modern::-webkit-slider-track {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(90deg, #e5e7eb, #d1d5db);
        }
      `}</style>
    </div>
  );
}