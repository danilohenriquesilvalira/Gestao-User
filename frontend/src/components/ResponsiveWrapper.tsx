// components/ResponsiveWrapper.tsx - VERSÃO COM SALVAMENTO MANUAL
'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  
  const { registerComponent, setComponentLoaded } = useLayoutLoading();

  const defaultConfigs = {
    xs: { x: 10, y: 70, width: 200, height: 100, scale: 0.7, zIndex: 1, opacity: 1, rotation: 0 },
    sm: { x: 20, y: 70, width: 250, height: 120, scale: 0.8, zIndex: 1, opacity: 1, rotation: 0 },
    md: { x: 74, y: 70, width: 300, height: 150, scale: 0.9, zIndex: 1, opacity: 1, rotation: 0 },
    lg: { x: 74, y: 70, width: 400, height: 200, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    xl: { x: 74, y: 70, width: 500, height: 250, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '2xl': { x: 74, y: 70, width: 600, height: 300, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '3xl': { x: 74, y: 70, width: 700, height: 350, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '4xl': { x: 74, y: 70, width: 800, height: 400, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    ...defaultConfig
  };

  const [configs, setConfigs] = useState<Record<string, ResponsiveConfig>>(defaultConfigs);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingFromStrapi, setIsLoadingFromStrapi] = useState(true);

  // Carrega TODAS as configurações do PostgreSQL via Strapi (PRIORIDADE ABSOLUTA)
  useEffect(() => {
    // Registra o componente no contexto global
    registerComponent(componentId);
    
    async function loadAllConfigs() {
      if (typeof window !== 'undefined') {
        setIsLoadingFromStrapi(true);
        
        try {
          const baseURL = (typeof window !== 'undefined' && window.location.origin.includes('localhost')) 
            ? 'http://localhost:1337' 
            : process?.env?.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
          console.log(`🔍 Carregando TODAS as configurações para ${componentId} do PostgreSQL...`);
          
          // Busca TODAS as configurações do componente de todos os breakpoints
          const response = await fetch(
            `${baseURL}/api/component-layouts?filters[componentId][$eq]=${componentId}`,
            { cache: 'no-store' }
          );
          
          if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('📄 TODOS os dados do PostgreSQL:', data);
          
          // Converte dados do Strapi para formato interno
          const loadedConfigs: Record<string, ResponsiveConfig> = { ...defaultConfigs };
          
          if (data && data.data && data.data.length > 0) {
            data.data.forEach((strapiConfig: any) => {
              // Converte breakpoints do Strapi de volta para formato interno
              const internalBreakpoint = strapiConfig.breakpoint === 'xxl' ? '2xl' : 
                                       strapiConfig.breakpoint === 'xxxl' ? '3xl' : 
                                       strapiConfig.breakpoint === 'xxxxl' ? '4xl' : 
                                       strapiConfig.breakpoint;
              
              loadedConfigs[internalBreakpoint] = {
                x: strapiConfig.x || 74,
                y: strapiConfig.y || 70,
                width: strapiConfig.width || 400,
                height: strapiConfig.height || 200,
                scale: strapiConfig.scale || 1,
                zIndex: strapiConfig.zIndex || 1,
                opacity: strapiConfig.opacity || 1,
                rotation: strapiConfig.rotation || 0
              };
              
              console.log(`⚙️ Configuração ${internalBreakpoint}:`, loadedConfigs[internalBreakpoint]);
            });
            
            console.log('✅ TODAS as configurações carregadas do PostgreSQL:', loadedConfigs);
          } else {
            console.log('ℹ️ Nenhuma configuração encontrada no PostgreSQL - usando padrões');
          }
          
          setConfigs(loadedConfigs);
          
          // Atualiza localStorage APENAS como cache (FloatingEditor ainda precisa)
          localStorage.setItem(`component-${componentId}`, JSON.stringify(loadedConfigs));
          console.log('💾 Cache localStorage atualizado com dados do PostgreSQL');
          
          console.log(`🔍 DEBUG: Estado de configs após carregamento inicial:`, loadedConfigs);
          console.log(`🔍 DEBUG: Configuração atual para breakpoint ${breakpoint}:`, loadedConfigs[breakpoint]);
          
        } catch (error) {
          console.error('❌ Erro ao carregar do PostgreSQL:', error);
          
          // ÚLTIMO RECURSO: localStorage (não deveria acontecer em produção)
          const saved = localStorage.getItem(`component-${componentId}`);
          if (saved) {
            try {
              setConfigs(JSON.parse(saved));
              console.log('⚠️ Usando cache localStorage como último recurso');
            } catch (e) {
              console.error('Erro ao carregar cache:', e);
              setConfigs(defaultConfigs);
            }
          } else {
            setConfigs(defaultConfigs);
            console.log('⚠️ Usando configurações padrão');
          }
        } finally {
          setIsLoadingFromStrapi(false);
          setIsLoaded(true);
          console.log(`✅ Componente ${componentId} totalmente carregado!`);
          setComponentLoaded(componentId);
        }
      }
    }
    
    loadAllConfigs();
  }, [componentId]); // Remove breakpoint da dependência - carrega tudo de uma vez

  const currentConfig: ResponsiveConfig = configs[breakpoint] || configs.lg || {
    x: 74,
    y: 70,
    width: 400,
    height: 200,
    scale: 1,
    zIndex: 1,
    opacity: 1,
    rotation: 0
  };

  // DEBUG: Log sempre que currentConfig mudar
  useEffect(() => {
    console.log(`🎯 DEBUG ${componentId}: currentConfig para ${breakpoint}:`, currentConfig);
    console.log(`🎯 DEBUG ${componentId}: configs completos:`, configs);
  }, [componentId, breakpoint, currentConfig, configs]);

  const saveConfig = useCallback((newConfig: ResponsiveConfig) => {
    const updated = { ...configs, [breakpoint]: newConfig };
    setConfigs(updated);
    
    // SEMPRE atualiza localStorage com TODAS as configurações para o FloatingEditor
    if (typeof window !== 'undefined') {
      localStorage.setItem(`component-${componentId}`, JSON.stringify(updated));
      console.log(`💾 Configurações atualizadas no cache para ${componentId}:`, updated);
    }
    
    onConfigChange?.(updated);
  }, [configs, breakpoint, componentId, onConfigChange]);

  // SALVAR NO STRAPI - MANUAL
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
      console.log(`💾 Salvando layout de ${componentId} no breakpoint ${strapiBreakpoint}...`);
      console.log('📋 Configuração atual a ser salva:', currentConfig);
      
      // Busca se já existe
      const checkResponse = await fetch(
        `${baseURL}/api/component-layouts?filters[componentId][$eq]=${componentId}&filters[breakpoint][$eq]=${strapiBreakpoint}`
      );
      
      if (!checkResponse.ok) {
        throw new Error(`Erro ao verificar configuração existente: ${checkResponse.status}`);
      }
      
      const checkData = await checkResponse.json();
      console.log('📋 Verificando se já existe:', checkData);
      
      // Extrai o documentId e id com segurança para Strapi v5
      const existingEntry = checkData?.data && checkData.data.length > 0 ? checkData.data[0] : null;
      const existingId = existingEntry?.id;
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
      
      console.log('📤 Enviando configuração:', configData);

      let saveResponse;
      
      if (existingDocumentId) {
        // Atualiza usando documentId (Strapi v5)
        console.log(`🔄 Atualizando configuração existente documentId ${existingDocumentId}`);
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
      
      // Atualiza localStorage com todas as configurações atuais
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
    const handleConfigChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.componentId === componentId) {
        const updated = { ...configs, [breakpoint]: customEvent.detail.config };
        setConfigs(updated);
      }
    };

    window.addEventListener('component-config-changed', handleConfigChange);
    
    return () => {
      window.removeEventListener('component-config-changed', handleConfigChange);
    };
  }, [componentId, breakpoint, configs]);

  useEffect(() => {
    if (!editMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== elementRef.current) return;

      const step = e.shiftKey ? 10 : 1;
      const resizeStep = e.shiftKey ? 20 : 5;
      let newConfig = { ...currentConfig };

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
    setIsDragging(true);
    setDragStart({
      x: e.clientX - currentConfig.x,
      y: e.clientY - currentConfig.y
    });
    elementRef.current?.focus();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !editMode) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    saveConfig({ ...currentConfig, x: newX, y: newY });
  }, [isDragging, dragStart, currentConfig, saveConfig, editMode]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResize = (direction: string, e: React.MouseEvent) => {
    if (!editMode) return;
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

      if (direction.includes('right')) {
        newWidth = Math.max(50, startWidth + deltaX);
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(30, startHeight + deltaY);
      }
      if (direction.includes('left')) {
        newWidth = Math.max(50, startWidth - deltaX);
        newX = startPosX + (startWidth - newWidth);
      }
      if (direction.includes('top')) {
        newHeight = Math.max(30, startHeight - deltaY);
        newY = startPosY + (startHeight - newHeight);
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
      {/* Não renderiza nada até estar carregado */}
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
          editMode ? 'cursor-move' : ''
        }`}
        style={{
          left: currentConfig.x,
          top: currentConfig.y,
          width: currentConfig.width,
          height: currentConfig.height,
          transform: `rotate(${currentConfig.rotation}deg)`,
          transformOrigin: 'top left',
          zIndex: currentConfig.zIndex,
          opacity: isLoadingFromStrapi ? 0.7 : currentConfig.opacity,
          transition: 'opacity 0.3s ease-in-out',
          ...(editMode && {
            boxShadow: '0 0 0 2px #3b82f6',
            outline: '2px solid #3b82f6',
            outlineOffset: '2px'
          })
        }}
        onMouseDown={handleMouseDown}
      >
        {isLoadingFromStrapi && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] z-10 pointer-events-none">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/70 px-3 py-1 rounded-full shadow-sm">
              <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Carregando {componentId}...</span>
            </div>
          </div>
        )}
        
        {renderChildren()}

        {editMode && (
          <>
            <div
              className="absolute right-[-4px] top-0 w-2 h-full bg-blue-500 cursor-e-resize opacity-50 hover:opacity-100"
              onMouseDown={(e) => handleResize('right', e)}
            />

            <div
              className="absolute bottom-[-4px] left-0 w-full h-2 bg-blue-500 cursor-s-resize opacity-50 hover:opacity-100"
              onMouseDown={(e) => handleResize('bottom', e)}
            />

            <div
              className="absolute bottom-[-4px] right-[-4px] w-4 h-4 bg-blue-600 cursor-se-resize opacity-70 hover:opacity-100"
              onMouseDown={(e) => handleResize('right bottom', e)}
            />

            <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs font-mono flex items-center gap-2">
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
          </>
        )}
      </div>
        </>
      )}
    </>
  );
}