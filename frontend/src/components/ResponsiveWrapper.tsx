'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useLayoutLoading } from '@/contexts/LayoutLoadingContext';

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

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  componentId: string;
  editMode?: boolean;
  defaultConfig?: Partial<Record<string, ResponsiveConfig>>;
  onConfigChange?: (config: Record<string, ResponsiveConfig>) => void;
}

interface InjectedProps {
  width?: number;
  height?: number;
  componentWidth?: number;
  componentHeight?: number;
}

export default function ResponsiveWrapper({
  children,
  componentId,
  editMode = false,
  defaultConfig = {},
  onConfigChange
}: ResponsiveWrapperProps) {
  const breakpoint = useBreakpoint();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  
  const { registerComponent, setComponentLoaded } = useLayoutLoading();

  // ÁREA MÍNIMA DE SELEÇÃO PARA GARANTIR MANIPULAÇÃO
  const MIN_SELECTION_SIZE = 60;

  const defaultConfigs = useMemo(() => {
    const baseConfigs = {
      xs: { x: 10, y: 70, width: 200, height: 100, scale: 0.7, zIndex: 1, opacity: 1, rotation: 0 },
      sm: { x: 20, y: 70, width: 250, height: 120, scale: 0.8, zIndex: 1, opacity: 1, rotation: 0 },
      md: { x: 30, y: 70, width: 300, height: 150, scale: 0.9, zIndex: 1, opacity: 1, rotation: 0 },
      lg: { x: 50, y: 70, width: 350, height: 175, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
      xl: { x: 74, y: 70, width: 400, height: 200, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
      '2xl': { x: 100, y: 70, width: 450, height: 225, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
      '3xl': { x: 120, y: 70, width: 500, height: 250, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
      '4xl': { x: 150, y: 70, width: 550, height: 275, scale: 1, zIndex: 1, opacity: 1, rotation: 0 }
    };
    
    if (defaultConfig && Object.keys(defaultConfig).length > 0) {
      return { ...baseConfigs, ...defaultConfig };
    }
    
    return baseConfigs;
  }, [defaultConfig]);

  const [configs, setConfigs] = useState<Record<string, ResponsiveConfig>>(defaultConfigs);
  const [isLoaded, setIsLoaded] = useState(false);
  const isInitializedRef = useRef(false);

  const currentConfig = useMemo((): ResponsiveConfig => 
    configs[breakpoint] || configs.lg || {
      x: 74,
      y: 70,
      width: 400,
      height: 200,
      scale: 1,
      zIndex: 1,
      opacity: 1,
      rotation: 0
    }, [configs, breakpoint]
  );

  // Cálculo de dimensões da área de seleção
  const selectionDimensions = useMemo(() => {
    const width = Math.max(currentConfig.width, MIN_SELECTION_SIZE);
    const height = Math.max(currentConfig.height, MIN_SELECTION_SIZE);
    return { width, height };
  }, [currentConfig.width, currentConfig.height]);

  // Função para carregar do PostgreSQL na inicialização
  const loadFromStrapi = useCallback(async () => {
    try {
      const baseURL = (typeof window !== 'undefined' && window.location.origin.includes('localhost')) 
        ? 'http://localhost:1337' 
        : process?.env?.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      
      const response = await fetch(
        `${baseURL}/api/component-layouts?filters[componentId][$eq]=${componentId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data?.data && data.data.length > 0) {
          // Converte dados do PostgreSQL para formato local
          const postgresConfigs: Record<string, ResponsiveConfig> = {};
          
          data.data.forEach((item: any) => {
            const dbBreakpoint = item.breakpoint === 'xxl' ? '2xl' : 
                                item.breakpoint === 'xxxl' ? '3xl' : 
                                item.breakpoint === 'xxxxl' ? '4xl' : item.breakpoint;
            
            postgresConfigs[dbBreakpoint] = {
              x: Number(item.x) || 74,
              y: Number(item.y) || 70,
              width: Number(item.width) || 400,
              height: Number(item.height) || 200,
              scale: Number(item.scale) || 1,
              zIndex: Number(item.zIndex) || 1,
              opacity: Number(item.opacity) || 1,
              rotation: Number(item.rotation) || 0
            };
          });
          
          // Mescla com configurações padrão
          const mergedConfigs = { ...defaultConfigs, ...postgresConfigs };
          setConfigs(mergedConfigs);
          
          // Atualiza localStorage com dados do PostgreSQL
          localStorage.setItem(`component-${componentId}`, JSON.stringify(mergedConfigs));
          
          console.log(`✅ [POSTGRES LOAD] ${componentId} carregado do banco`);
          return true;
        }
      }
    } catch (error) {
      console.warn(`⚠️ [POSTGRES LOAD] Erro ao carregar ${componentId}:`, error);
    }
    return false;
  }, [componentId, defaultConfigs]);

  // Inicialização com prioridade PostgreSQL > localStorage > padrão
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    isInitializedRef.current = true;
    registerComponent(componentId);
    
    // Função async para carregar em ordem de prioridade
    const initializeComponent = async () => {
      // 1. Tenta carregar do PostgreSQL primeiro
      const loadedFromPostgres = await loadFromStrapi();
      
      if (!loadedFromPostgres) {
        // 2. Se não tem no PostgreSQL, tenta localStorage
        const saved = localStorage.getItem(`component-${componentId}`);
        if (saved) {
          try {
            const loadedConfigs = JSON.parse(saved);
            setConfigs(loadedConfigs);
            console.log(`✅ [LOCALSTORAGE] ${componentId} carregado do cache local`);
          } catch (e) {
            console.error('Erro ao carregar cache local:', e);
            // 3. Se localStorage corrompido, usa padrão
            setConfigs(defaultConfigs);
            localStorage.setItem(`component-${componentId}`, JSON.stringify(defaultConfigs));
          }
        } else {
          // 4. Se não tem nem localStorage, usa padrão
          setConfigs(defaultConfigs);
          localStorage.setItem(`component-${componentId}`, JSON.stringify(defaultConfigs));
          
          window.dispatchEvent(new CustomEvent('component-config-changed', { 
            detail: { componentId, config: defaultConfigs } 
          }));
          
          console.log(`💾 [PADRÃO] ${componentId} inicializado com configurações padrão`);
        }
      }
      
      setIsLoaded(true);
      setComponentLoaded(componentId);
      
      console.log(`🎯 ResponsiveWrapper ${componentId} inicializado`);
    };
    
    initializeComponent();
  }, [componentId, loadFromStrapi]); // Dependências corretas

  useEffect(() => {
    const handleComponentSelect = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSelectedComponent(customEvent.detail.componentId);
    };

    const handleDeselectAll = () => {
      setSelectedComponent(null);
    };

    window.addEventListener('select-component', handleComponentSelect);
    window.addEventListener('deselect-all-components', handleDeselectAll);
    
    return () => {
      window.removeEventListener('select-component', handleComponentSelect);
      window.removeEventListener('deselect-all-components', handleDeselectAll);
    };
  }, []);

  const isSelected = selectedComponent === componentId;
  const shouldShowControls = editMode && isSelected;

  // Função para AUTO-SAVE no PostgreSQL (sem localStorage)
  const autoSaveToStrapi = useCallback(async (configToSave: ResponsiveConfig) => {
    try {
      const strapiBreakpoint = breakpoint === '2xl' ? 'xxl' : 
                              breakpoint === '3xl' ? 'xxxl' : 
                              breakpoint === '4xl' ? 'xxxxl' : breakpoint;

      const baseURL = (typeof window !== 'undefined' && window.location.origin.includes('localhost')) 
        ? 'http://localhost:1337' 
        : process?.env?.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      
      // Verifica se já existe
      const checkResponse = await fetch(
        `${baseURL}/api/component-layouts?filters[componentId][$eq]=${componentId}&filters[breakpoint][$eq]=${strapiBreakpoint}`
      );
      
      if (!checkResponse.ok) {
        console.warn(`⚠️ Erro ao verificar configuração existente: ${checkResponse.status}`);
        return;
      }
      
      const checkData = await checkResponse.json();
      const existingEntry = checkData?.data && checkData.data.length > 0 ? checkData.data[0] : null;
      const existingDocumentId = existingEntry?.documentId;

      const configData = {
        componentId,
        breakpoint: strapiBreakpoint,
        x: Number(configToSave.x) || 74,
        y: Number(configToSave.y) || 70,
        width: Number(configToSave.width) || 400,
        height: Number(configToSave.height) || 200,
        scale: Number(configToSave.scale) || 1,
        zIndex: Number(configToSave.zIndex) || 1,
        opacity: Number(configToSave.opacity) || 1,
        rotation: Number(configToSave.rotation) || 0
      };

      let saveResponse;
      
      if (existingDocumentId) {
        // Atualiza
        saveResponse = await fetch(`${baseURL}/api/component-layouts/${existingDocumentId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ data: configData })
        });
      } else {
        // Cria
        saveResponse = await fetch(`${baseURL}/api/component-layouts`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ data: configData })
        });
      }

      if (saveResponse.ok) {
        console.log(`✅ [AUTO-SAVE] ${componentId} salvo no PostgreSQL`);
      } else {
        console.warn(`⚠️ [AUTO-SAVE] Erro ao salvar ${componentId}:`, saveResponse.status);
      }
      
    } catch (error) {
      console.warn(`⚠️ [AUTO-SAVE] Falha ao salvar ${componentId}:`, error);
    }
  }, [componentId, breakpoint]);

  // FUNÇÃO PRINCIPAL: Salva local APENAS (AUTO-SAVE DESABILITADO TEMPORARIAMENTE)
  const saveConfig = useCallback((newConfig: ResponsiveConfig) => {
    const updated = { ...configs, [breakpoint]: newConfig };
    setConfigs(updated);
    
    // 1. Salva no localStorage (para performance imediata)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`component-${componentId}`, JSON.stringify(updated));
    }
    
    // 2. AUTO-SAVE DESABILITADO PARA EVITAR LOOP INFINITO
    // autoSaveToStrapi(newConfig);
    
    // 3. Dispara evento para GlobalAdvancedControls
    window.dispatchEvent(new CustomEvent('component-config-changed', { 
      detail: { componentId, config: newConfig } 
    }));
    
    onConfigChange?.(updated);
  }, [configs, breakpoint, componentId, onConfigChange]);

  // FUNÇÃO MANUAL: Botão de Save (mantida para compatibilidade)
  const saveToStrapi = useCallback(async () => {
    if (!currentConfig) {
      alert('❌ Erro: Configuração atual não encontrada');
      return;
    }

    setIsSaving(true);
    try {
      const strapiBreakpoint = breakpoint === '2xl' ? 'xxl' : 
                              breakpoint === '3xl' ? 'xxxl' : 
                              breakpoint === '4xl' ? 'xxxxl' : breakpoint;

      const baseURL = (typeof window !== 'undefined' && window.location.origin.includes('localhost')) 
        ? 'http://localhost:1337' 
        : process?.env?.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`💾 Salvando layout de ${componentId} no breakpoint ${strapiBreakpoint}...`);
        console.log('📋 Configuração atual a ser salva:', currentConfig);
      }
      
      const checkResponse = await fetch(
        `${baseURL}/api/component-layouts?filters[componentId][$eq]=${componentId}&filters[breakpoint][$eq]=${strapiBreakpoint}`
      );
      
      if (!checkResponse.ok) {
        throw new Error(`Erro ao verificar configuração existente: ${checkResponse.status}`);
      }
      
      const checkData = await checkResponse.json();
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📋 Verificando se já existe:', checkData);
      }
      
      const existingEntry = checkData?.data && checkData.data.length > 0 ? checkData.data[0] : null;
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
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📤 Enviando configuração:', configData);
      }

      let saveResponse;
      
      if (existingDocumentId) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔄 Atualizando configuração existente documentId ${existingDocumentId}`);
        }
        saveResponse = await fetch(`${baseURL}/api/component-layouts/${existingDocumentId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ data: configData })
        });
      } else {
        console.log('🆕 Criando nova configuração');
        saveResponse = await fetch(`${baseURL}/api/component-layouts`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ data: configData })
        });
      }

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        throw new Error(`Erro HTTP ${saveResponse.status}: ${errorText}`);
      }

      const saveResult = await saveResponse.json();
      console.log('✅ Resposta do salvamento:', saveResult);
      
      const allConfigsUpdated = { ...configs, [breakpoint]: currentConfig };
      localStorage.setItem(`component-${componentId}`, JSON.stringify(allConfigsUpdated));
      console.log('💾 Cache localStorage atualizado após salvamento');
      
      alert(`✅ Configuração ${existingDocumentId ? 'atualizada' : 'criada'} com sucesso no PostgreSQL!`);
      
    } catch (error) {
      console.error('❌ Erro ao salvar no Strapi:', error);
      alert(`❌ Erro ao salvar no banco: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSaving(false);
    }
  }, [componentId, breakpoint, currentConfig, configs]);

  useEffect(() => {
    if (!editMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== elementRef.current) return;

      const step = e.shiftKey ? 10 : 1;
      const resizeStep = e.shiftKey ? 20 : 5;
      const newConfig = { ...currentConfig };

      if (!e.ctrlKey && !e.altKey) {
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            newConfig.x -= step;
            break;
          case 'ArrowRight':
            e.preventDefault();
            newConfig.x += step;
            break;
          case 'ArrowUp':
            e.preventDefault();
            newConfig.y -= step;
            break;
          case 'ArrowDown':
            e.preventDefault();
            newConfig.y += step;
            break;
        }
      }

      if (e.ctrlKey) {
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            newConfig.width = Math.max(50, newConfig.width - resizeStep);
            break;
          case 'ArrowRight':
            e.preventDefault();
            newConfig.width += resizeStep;
            break;
          case 'ArrowUp':
            e.preventDefault();
            newConfig.height = Math.max(30, newConfig.height - resizeStep);
            break;
          case 'ArrowDown':
            e.preventDefault();
            newConfig.height += resizeStep;
            break;
        }
      }

      switch(e.key) {
        case 'r':
          e.preventDefault();
          newConfig.rotation += e.shiftKey ? 45 : 15;
          break;
        case 'c':
          e.preventDefault();
          newConfig.x = (window.innerWidth - newConfig.width) / 2;
          newConfig.y = (window.innerHeight - newConfig.height) / 2;
          break;
        case ']':
          e.preventDefault();
          newConfig.zIndex = Math.min(999, newConfig.zIndex + 1);
          break;
        case '[':
          e.preventDefault();
          newConfig.zIndex = Math.max(1, newConfig.zIndex - 1);
          break;
        default:
          return;
      }

      saveConfig(newConfig);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editMode, currentConfig, saveConfig]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editMode) return;
    
    window.dispatchEvent(new CustomEvent('select-component', {
      detail: { componentId }
    }));
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - currentConfig.x,
      y: e.clientY - currentConfig.y
    });
    elementRef.current?.focus();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !editMode || !isSelected) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 20;

    const limitedX = Math.max(margin, Math.min(newX, viewportWidth - currentConfig.width - margin));
    const limitedY = Math.max(margin, Math.min(newY, viewportHeight - currentConfig.height - margin));

    saveConfig({ ...currentConfig, x: limitedX, y: limitedY });
  }, [isDragging, dragStart, currentConfig, saveConfig, editMode, isSelected]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResize = (direction: string, e: React.MouseEvent) => {
    if (!editMode || !isSelected) return;
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = currentConfig.width;
    const startHeight = currentConfig.height;
    const startPosX = currentConfig.x;
    const startPosY = currentConfig.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 20;

      if (direction.includes('right')) {
        const calculatedWidth = Math.max(10, startWidth + deltaX);
        const maxWidth = viewportWidth - startPosX - margin;
        newWidth = Math.min(calculatedWidth, maxWidth);
      }
      if (direction.includes('bottom')) {
        const calculatedHeight = Math.max(10, startHeight + deltaY);
        const maxHeight = viewportHeight - startPosY - margin;
        newHeight = Math.min(calculatedHeight, maxHeight);
      }
      if (direction.includes('left')) {
        const calculatedWidth = Math.max(10, startWidth - deltaX);
        const proposedX = startPosX + (startWidth - calculatedWidth);
        if (proposedX >= margin) {
          newWidth = calculatedWidth;
          newX = proposedX;
        } else {
          newX = margin;
          newWidth = startPosX + startWidth - margin;
        }
      }
      if (direction.includes('top')) {
        const calculatedHeight = Math.max(10, startHeight - deltaY);
        const proposedY = startPosY + (startHeight - calculatedHeight);
        if (proposedY >= margin) {
          newHeight = calculatedHeight;
          newY = proposedY;
        } else {
          newY = margin;
          newHeight = startPosY + startHeight - margin;
        }
      }

      saveConfig({
        ...currentConfig,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  const renderChildren = () => {
    if (!React.isValidElement(children)) {
      return children;
    }

    if (typeof children.type === 'string') {
      return children;
    }

    if (typeof children.type === 'function') {
      return React.cloneElement(children, {
        width: currentConfig.width,
        height: currentConfig.height,
        componentWidth: currentConfig.width,
        componentHeight: currentConfig.height
      } as InjectedProps);
    }

    return children;
  };

  return (
    <>
      {!isLoaded && <div style={{ display: 'none' }} />}
      
      {isLoaded && (
        <>
          {editMode && (
            <div
              className="fixed inset-0 pointer-events-none z-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle, rgba(59, 130, 246, 0.15) 1px, transparent 1px),
                  linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px, 20px 20px, 20px 20px'
              }}
            />
          )}

          <div
            ref={elementRef}
            tabIndex={editMode ? 0 : -1}
            className={`absolute transition-none outline-none ${
              editMode ? 'cursor-pointer' : ''
            } ${shouldShowControls ? 'cursor-move' : ''}`}
            style={{
              left: currentConfig.x,
              top: currentConfig.y,
              width: selectionDimensions.width,
              height: selectionDimensions.height,
              transform: `rotate(${currentConfig.rotation}deg)`,
              transformOrigin: 'top left',
              zIndex: currentConfig.zIndex,
              opacity: currentConfig.opacity,
              transition: 'none',
              ...(shouldShowControls && {
                boxShadow: '0 0 0 2px #3b82f6',
                outline: '2px solid #3b82f6',
                outlineOffset: '2px',
                backgroundColor: currentConfig.width < MIN_SELECTION_SIZE || currentConfig.height < MIN_SELECTION_SIZE ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
              })
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Container interno para o conteúdo real */}
            <div 
              style={{
                width: currentConfig.width,
                height: currentConfig.height,
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: editMode ? 'none' : 'auto'
              }}
            >
              {renderChildren()}
            </div>

            {shouldShowControls && (
              <>
                {/* Alças de redimensionamento - sempre usando selectionDimensions */}
                <div
                  className="absolute bg-blue-500 cursor-e-resize opacity-50 hover:opacity-100"
                  style={{
                    right: '-4px',
                    top: 0,
                    width: '8px',
                    height: selectionDimensions.height
                  }}
                  onMouseDown={(e) => handleResize('right', e)}
                />

                <div
                  className="absolute bg-blue-500 cursor-s-resize opacity-50 hover:opacity-100"
                  style={{
                    bottom: '-4px',
                    left: 0,
                    width: selectionDimensions.width,
                    height: '8px'
                  }}
                  onMouseDown={(e) => handleResize('bottom', e)}
                />

                <div
                  className="absolute bg-blue-600 cursor-se-resize opacity-70 hover:opacity-100"
                  style={{
                    bottom: '-4px',
                    right: '-4px',
                    width: '12px',
                    height: '12px'
                  }}
                  onMouseDown={(e) => handleResize('right bottom', e)}
                />

                {/* Label - posicionado acima da área de seleção */}
                <div 
                  className="absolute bg-blue-500 text-white px-2 py-1 rounded text-xs font-mono flex items-center gap-2 whitespace-nowrap"
                  style={{
                    top: '-28px',
                    left: 0,
                    zIndex: 999
                  }}
                >
                  <span>{componentId} | {Math.round(currentConfig.width)}×{Math.round(currentConfig.height)} | Z:{currentConfig.zIndex}</span>
                  
                  <button
                    onClick={saveToStrapi}
                    disabled={isSaving}
                    className="bg-green-600 px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                    title="Salvar no banco"
                  >
                    {isSaving ? '⏳' : '💾'}
                  </button>
                </div>

                {/* Indicador visual quando muito pequeno */}
                {(currentConfig.width < MIN_SELECTION_SIZE || currentConfig.height < MIN_SELECTION_SIZE) && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      {Math.round(currentConfig.width)}×{Math.round(currentConfig.height)}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {editMode && !isSelected && (
              <div 
                className="absolute border border-dashed border-gray-300 opacity-30 pointer-events-none"
                style={{ 
                  borderRadius: '4px',
                  width: currentConfig.width,
                  height: currentConfig.height
                }}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}