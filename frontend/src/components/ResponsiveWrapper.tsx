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
  allowOverflow?: boolean; // NOVO: Permite overflow para componentes com movimento
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
  onConfigChange,
  allowOverflow = false // NOVO: Permite overflow para componentes com movimento
}: ResponsiveWrapperProps) {
  const breakpoint = useBreakpoint();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  
  const { registerComponent, setComponentLoaded } = useLayoutLoading();

  const MIN_SELECTION_SIZE = 60;

  // Configurações base inteligentes por tipo de componente
  const getSmartDefaultConfig = useMemo(() => {
    // Z-INDEX INTELIGENTE POR TIPO
    let baseZIndex = 10;
    
    if (componentId.includes('pipe-system') || componentId.includes('tanque')) {
      baseZIndex = 1; // Background
    } else if (componentId.includes('valvula') || componentId.includes('VD') || 
               componentId.includes('VG') || componentId.includes('VH') || 
               componentId.includes('VF')) {
      baseZIndex = 20; // Middle layer
    } else if (componentId.includes('pistao') || componentId.includes('motor') || 
               componentId.includes('cilindro')) {
      baseZIndex = 30; // Foreground
    } else if (componentId.includes('base')) {
      baseZIndex = 15; // Between background and middle
    }

    const baseConfigs = {
      xs: { x: 10, y: 70, width: 200, height: 100, scale: 0.7, zIndex: baseZIndex, opacity: 1, rotation: 0 },
      sm: { x: 20, y: 70, width: 250, height: 120, scale: 0.8, zIndex: baseZIndex, opacity: 1, rotation: 0 },
      md: { x: 30, y: 70, width: 300, height: 150, scale: 0.9, zIndex: baseZIndex, opacity: 1, rotation: 0 },
      lg: { x: 50, y: 70, width: 350, height: 175, scale: 1, zIndex: baseZIndex, opacity: 1, rotation: 0 },
      xl: { x: 74, y: 70, width: 400, height: 200, scale: 1, zIndex: baseZIndex, opacity: 1, rotation: 0 },
      '2xl': { x: 100, y: 70, width: 450, height: 225, scale: 1, zIndex: baseZIndex, opacity: 1, rotation: 0 },
      '3xl': { x: 120, y: 70, width: 500, height: 250, scale: 1, zIndex: baseZIndex, opacity: 1, rotation: 0 },
      '4xl': { x: 150, y: 70, width: 550, height: 275, scale: 1, zIndex: baseZIndex, opacity: 1, rotation: 0 }
    };
    
    if (defaultConfig && Object.keys(defaultConfig).length > 0) {
      return { ...baseConfigs, ...defaultConfig };
    }
    
    return baseConfigs;
  }, [defaultConfig, componentId]);

  const [configs, setConfigs] = useState<Record<string, ResponsiveConfig>>(getSmartDefaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);
  const isInitializedRef = useRef(false);

  const currentConfig = useMemo((): ResponsiveConfig => {
    const config = configs[breakpoint] || configs.lg || {
      x: 74,
      y: 70,
      width: 400,
      height: 200,
      scale: 1,
      zIndex: 10,
      opacity: 1,
      rotation: 0
    };
    
    return config;
  }, [configs, breakpoint]);

  const selectionDimensions = useMemo(() => {
    const width = currentConfig.width;
    const height = currentConfig.height;
    const isSmallComponent = currentConfig.width < MIN_SELECTION_SIZE || currentConfig.height < MIN_SELECTION_SIZE;
    
    return { width, height, isSmallComponent };
  }, [currentConfig.width, currentConfig.height]);

  const loadFromStrapi = useCallback(async () => {
    try {
      const baseURL = (typeof window !== 'undefined' && window.location.origin.includes('localhost')) 
        ? 'http://localhost:1337' 
        : import.meta.env?.VITE_STRAPI_URL || 'http://localhost:1337';
      
      const response = await fetch(
        `${baseURL}/api/component-layouts?filters[componentId][$eq]=${componentId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data?.data && data.data.length > 0) {
          const postgresConfigs: Record<string, ResponsiveConfig> = {};
          
          data.data.forEach((item: any) => {
            const attrs = item.attributes || item;
            const dbBreakpoint = attrs.breakpoint === 'xxl' ? '2xl' : 
                                attrs.breakpoint === 'xxxl' ? '3xl' : 
                                attrs.breakpoint === 'xxxxl' ? '4xl' : attrs.breakpoint;
            
            postgresConfigs[dbBreakpoint] = {
              x: Number(attrs.x) || 74,
              y: Number(attrs.y) || 70,
              width: Number(attrs.width) || 400,
              height: Number(attrs.height) || 200,
              scale: Number(attrs.scale) || 1,
              zIndex: Number(attrs.zIndex) || 10,
              opacity: Number(attrs.opacity) || 1,
              rotation: Number(attrs.rotation) || 0
            };
          });
          
          const mergedConfigs = { ...getSmartDefaultConfig, ...postgresConfigs };
          setConfigs(mergedConfigs);
          localStorage.setItem(`component-${componentId}`, JSON.stringify(mergedConfigs));
          
          return true;
        }
      }
    } catch (error) {
      console.warn(`⚠️ Erro ao carregar ${componentId}:`, error);
    }
    return false;
  }, [componentId, getSmartDefaultConfig]);

  useEffect(() => {
    if (isInitializedRef.current) return;
    
    isInitializedRef.current = true;
    registerComponent(componentId);
    
    const initializeComponent = async () => {
      const loadedFromPostgres = await loadFromStrapi();
      
      if (!loadedFromPostgres) {
        const saved = localStorage.getItem(`component-${componentId}`);
        if (saved) {
          try {
            const loadedConfigs = JSON.parse(saved);
            setConfigs(loadedConfigs);
          } catch (e) {
            console.error('Erro ao carregar cache local:', e);
            setConfigs(getSmartDefaultConfig);
            localStorage.setItem(`component-${componentId}`, JSON.stringify(getSmartDefaultConfig));
          }
        } else {
          setConfigs(getSmartDefaultConfig);
          localStorage.setItem(`component-${componentId}`, JSON.stringify(getSmartDefaultConfig));
          
          window.dispatchEvent(new CustomEvent('component-config-changed', { 
            detail: { componentId, config: getSmartDefaultConfig } 
          }));
        }
      }
      
      setIsLoaded(true);
      setComponentLoaded(componentId);
    };
    
    initializeComponent();
  }, [componentId, loadFromStrapi, getSmartDefaultConfig]);

  useEffect(() => {
    const handleComponentSelect = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSelectedComponent(customEvent.detail.componentId);
      
      // ✅ Se este componente foi selecionado, foca automaticamente para controle por teclado
      if (customEvent.detail.componentId === componentId && editMode) {
        setTimeout(() => {
          elementRef.current?.focus();
        }, 100);
      }
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
  }, [componentId, editMode]);

  const isSelected = selectedComponent === componentId;
  const shouldShowControls = editMode && isSelected;

  const saveConfig = useCallback((newConfig: ResponsiveConfig) => {
    const updated = { ...configs, [breakpoint]: newConfig };
    setConfigs(updated);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(`component-${componentId}`, JSON.stringify(updated));
    }
    
    window.dispatchEvent(new CustomEvent('component-config-changed', { 
      detail: { componentId, config: newConfig } 
    }));
    
    onConfigChange?.(updated);
  }, [configs, breakpoint, componentId, onConfigChange]);

  const saveToStrapi = useCallback(async () => {
    if (!currentConfig) return;

    setIsSaving(true);
    try {
      const strapiBreakpoint = breakpoint === '2xl' ? 'xxl' : 
                              breakpoint === '3xl' ? 'xxxl' : 
                              breakpoint === '4xl' ? 'xxxxl' : breakpoint;

      const baseURL = (typeof window !== 'undefined' && window.location.origin.includes('localhost')) 
        ? 'http://localhost:1337' 
        : import.meta.env?.VITE_STRAPI_URL || 'http://localhost:1337';
      
      const checkURL = `${baseURL}/api/component-layouts?filters[componentId][$eq]=${componentId}&filters[breakpoint][$eq]=${strapiBreakpoint}`;
      const checkResponse = await fetch(checkURL);
      
      if (!checkResponse.ok) {
        throw new Error(`Erro ao verificar configuração existente: ${checkResponse.status}`);
      }
      
      const checkData = await checkResponse.json();
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
        zIndex: Number(currentConfig.zIndex) || 10,
        opacity: Number(currentConfig.opacity) || 1,
        rotation: Number(currentConfig.rotation) || 0
      };

      let saveResponse;
      
      if (existingDocumentId) {
        saveResponse = await fetch(`${baseURL}/api/component-layouts/${existingDocumentId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ data: configData })
        });
      } else {
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

      const allConfigsUpdated = { ...configs, [breakpoint]: currentConfig };
      localStorage.setItem(`component-${componentId}`, JSON.stringify(allConfigsUpdated));
      
      alert(`✅ Configuração salva com sucesso!`);
      
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      alert(`❌ Erro ao salvar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSaving(false);
    }
  }, [componentId, breakpoint, currentConfig, configs]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    window.dispatchEvent(new CustomEvent('deselect-all-components'));
    
    window.dispatchEvent(new CustomEvent('select-component', {
      detail: { componentId, zIndex: currentConfig.zIndex || 10 }
    }));
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (currentConfig.x || 0),
      y: e.clientY - (currentConfig.y || 0)
    });
    
    // ✅ Foca automaticamente para ativar controle por teclado
    setTimeout(() => {
      elementRef.current?.focus();
    }, 50);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !editMode || !isSelected) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 20;
    const componentWidth = Math.max(1, currentConfig.width || 100);
    const componentHeight = Math.max(1, currentConfig.height || 100);

    const limitedX = Math.max(margin, Math.min(newX, viewportWidth - componentWidth - margin));
    const limitedY = Math.max(margin, Math.min(newY, viewportHeight - componentHeight - margin));

    if (isNaN(limitedX) || isNaN(limitedY)) {
      return;
    }

    saveConfig({ 
      ...currentConfig, 
      x: Math.round(limitedX), 
      y: Math.round(limitedY) 
    });
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

  // ✅ CONTROLE POR TECLADO - MOVIMENTO COM SETAS
  useEffect(() => {
    if (!editMode || !isSelected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Verifica se o foco está no elemento do componente
      const focusedElement = document.activeElement as HTMLElement;
      if (!elementRef.current?.contains(focusedElement) && focusedElement !== elementRef.current) {
        return;
      }

      let deltaX = 0;
      let deltaY = 0;

      // Define a velocidade de movimento
      let moveSpeed = 1; // Movimento fino padrão
      if (e.shiftKey) moveSpeed = 10; // Movimento rápido com Shift
      if (e.ctrlKey || e.metaKey) moveSpeed = 5; // Movimento médio com Ctrl/Cmd

      switch (e.key) {
        case 'ArrowUp':
          deltaY = -moveSpeed;
          e.preventDefault();
          break;
        case 'ArrowDown':
          deltaY = moveSpeed;
          e.preventDefault();
          break;
        case 'ArrowLeft':
          deltaX = -moveSpeed;
          e.preventDefault();
          break;
        case 'ArrowRight':
          deltaX = moveSpeed;
          e.preventDefault();
          break;
        default:
          return; // Se não for uma seta, não faz nada
      }

      if (deltaX !== 0 || deltaY !== 0) {
        const newX = Math.max(0, Math.min((currentConfig.x || 0) + deltaX, window.innerWidth - (currentConfig.width || 100) - 20));
        const newY = Math.max(0, Math.min((currentConfig.y || 0) + deltaY, window.innerHeight - (currentConfig.height || 100) - 20));

        saveConfig({
          ...currentConfig,
          x: Math.round(newX),
          y: Math.round(newY)
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editMode, isSelected, currentConfig, saveConfig]);

  // Detectar automaticamente componentes que precisam de overflow visível
  const needsOverflow = allowOverflow || 
                       componentId.includes('porta') || 
                       componentId.includes('regua') ||
                       componentId.includes('elevador') ||
                       componentId.includes('movimento');

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

  // Determinar tipo de componente para estilo
  const getComponentType = () => {
    if (componentId.includes('pipe') || componentId.includes('tanque')) return 'background';
    if (componentId.includes('pistao') || componentId.includes('motor') || componentId.includes('cilindro')) return 'foreground';
    return 'middle';
  };

  const componentType = getComponentType();

  return (
    <>
      {!isLoaded && <div style={{ display: 'none' }} />}
      
      {isLoaded && (
        <>
          <div
            ref={elementRef}
            data-component-id={componentId}
            data-component-type={componentType}
            tabIndex={editMode ? 0 : -1}
            className={`absolute outline-none ${
              editMode ? 'cursor-pointer' : ''
            } ${shouldShowControls ? 'cursor-move' : ''}`}
            style={{
              left: Math.max(0, currentConfig.x),
              top: Math.max(0, currentConfig.y),
              width: Math.max(1, selectionDimensions.width),
              height: Math.max(1, selectionDimensions.height),
              transform: `rotate(${currentConfig.rotation || 0}deg)`,
              transformOrigin: 'top left',
              // Z-INDEX INTELIGENTE
              zIndex: shouldShowControls 
                ? Math.max(currentConfig.zIndex, 50) // Selecionado fica acima de 50
                : currentConfig.zIndex,
              opacity: Math.min(1, Math.max(0, currentConfig.opacity || 1)),
              transition: 'none',
              pointerEvents: editMode ? 'auto' : 'auto',
              ...(shouldShowControls && {
                boxShadow: '0 0 0 2px #3b82f6',
                outline: '2px solid #3b82f6',
                outlineOffset: '2px'
              })
            }}
            onMouseDown={handleMouseDown}
          >
            <div 
              style={{
                width: Math.max(1, currentConfig.width),
                height: Math.max(1, currentConfig.height),
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: editMode ? 'none' : 'auto',
                // CORREÇÃO: Permite overflow quando necessário para componentes com movimento
                overflow: needsOverflow ? 'visible' : 'hidden'
              }}
            >
              {renderChildren()}
            </div>

            {shouldShowControls && (
              <>
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

                <div 
                  className="absolute bg-blue-500 text-white px-2 py-1 rounded text-xs font-mono flex items-center gap-2 whitespace-nowrap"
                  style={{
                    top: '-44px',
                    left: 0,
                    zIndex: 999
                  }}
                >
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600 px-1 rounded">
                        {componentType === 'background' ? '🖼️' : componentType === 'foreground' ? '🎯' : '⚙️'}
                      </span>
                      <span>{componentId} | Z:{currentConfig.zIndex}</span>
                      {needsOverflow && <span className="bg-purple-600 px-1 rounded" title="Overflow visível">📐</span>}
                      
                      <button
                        onClick={saveToStrapi}
                        disabled={isSaving}
                        className="bg-green-600 px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                        title="Salvar"
                      >
                        {isSaving ? '⏳' : '💾'}
                      </button>
                    </div>
                    <div className="text-xs bg-blue-600 px-1 rounded text-white/90">
                      ⌨️ Setas: move | Shift+Setas: rápido | Ctrl+Setas: médio
                    </div>
                  </div>
                </div>
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