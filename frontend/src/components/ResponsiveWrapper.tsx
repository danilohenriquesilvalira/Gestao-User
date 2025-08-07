// components/ResponsiveWrapper.tsx - VERSÃO FUNCIONAL RESTAURADA
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

  // Configurações padrão simples
  const defaultConfigs = {
    xs: { x: 10, y: 70, width: 200, height: 100, scale: 0.7, zIndex: 1, opacity: 1, rotation: 0 },
    sm: { x: 20, y: 70, width: 250, height: 120, scale: 0.8, zIndex: 1, opacity: 1, rotation: 0 },
    md: { x: 30, y: 70, width: 300, height: 150, scale: 0.9, zIndex: 1, opacity: 1, rotation: 0 },
    lg: { x: 50, y: 70, width: 350, height: 175, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    xl: { x: 74, y: 70, width: 400, height: 200, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '2xl': { x: 100, y: 70, width: 450, height: 225, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '3xl': { x: 120, y: 70, width: 500, height: 250, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '4xl': { x: 150, y: 70, width: 550, height: 275, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    ...defaultConfig
  };

  const [configs, setConfigs] = useState<Record<string, ResponsiveConfig>>(defaultConfigs);
  const [isLoaded, setIsLoaded] = useState(false);

  // Configuração atual
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

  // Inicialização
  useEffect(() => {
    registerComponent(componentId);
    
    // Tenta carregar do localStorage
    const saved = localStorage.getItem(`component-${componentId}`);
    if (saved) {
      try {
        const loadedConfigs = JSON.parse(saved);
        setConfigs(loadedConfigs);
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Configurações carregadas para ${componentId}:`, loadedConfigs);
        }
      } catch (e) {
        console.error('Erro ao carregar cache:', e);
        setConfigs(defaultConfigs);
        // Salva as configurações padrão se houve erro
        localStorage.setItem(`component-${componentId}`, JSON.stringify(defaultConfigs));
      }
    } else {
      // Se não tem no localStorage, salva as configurações padrão
      const configsToSave = { ...defaultConfigs, ...defaultConfig };
      setConfigs(configsToSave);
      localStorage.setItem(`component-${componentId}`, JSON.stringify(configsToSave));
      
      // Dispara evento para GlobalAdvancedControls detectar o novo componente
      window.dispatchEvent(new CustomEvent('component-config-changed', { 
        detail: { componentId, config: configsToSave } 
      }));
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`💾 Configurações iniciais salvas para ${componentId}:`, configsToSave);
      }
    }
    
    setIsLoaded(true);
    setComponentLoaded(componentId);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎯 ResponsiveWrapper ${componentId} inicializado`);
    }
  }, [componentId, registerComponent, setComponentLoaded, defaultConfig]);

  // Sistema de seleção de componentes
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

  // Verifica se este componente está selecionado
  const isSelected = selectedComponent === componentId;
  const shouldShowControls = editMode && isSelected;

  // Função para salvar configuração
  const saveConfig = useCallback((newConfig: ResponsiveConfig) => {
    const updated = { ...configs, [breakpoint]: newConfig };
    setConfigs(updated);
    
    // Salva no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`component-${componentId}`, JSON.stringify(updated));
    }
    
    // Dispara evento para GlobalAdvancedControls
    window.dispatchEvent(new CustomEvent('component-config-changed', { 
      detail: { componentId, config: newConfig } 
    }));
    
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
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`💾 Salvando layout de ${componentId} no breakpoint ${strapiBreakpoint}...`);
        console.log('📋 Configuração atual a ser salva:', currentConfig);
      }
      
      // Busca se já existe
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
      
      // Extrai o documentId e id com segurança para Strapi v5
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
        // Atualiza usando documentId (Strapi v5)
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

  // Sistema de seleção individual de componentes
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
    
    // Seleciona este componente
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

    // Obter dimensões da viewport para limitação inteligente
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 20; // Margem mínima das bordas

    // Limitar movimento para não sair da tela
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

      // Obter dimensões da viewport para limitação inteligente
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 20; // Margem mínima das bordas

      if (direction.includes('right')) {
        const calculatedWidth = Math.max(50, startWidth + deltaX);
        // Limitar para não sair da tela pela direita
        const maxWidth = viewportWidth - startPosX - margin;
        newWidth = Math.min(calculatedWidth, maxWidth);
      }
      if (direction.includes('bottom')) {
        const calculatedHeight = Math.max(30, startHeight + deltaY);
        // Limitar para não sair da tela por baixo
        const maxHeight = viewportHeight - startPosY - margin;
        newHeight = Math.min(calculatedHeight, maxHeight);
      }
      if (direction.includes('left')) {
        const calculatedWidth = Math.max(50, startWidth - deltaX);
        const proposedX = startPosX + (startWidth - calculatedWidth);
        // Não permitir que saia pela esquerda
        if (proposedX >= margin) {
          newWidth = calculatedWidth;
          newX = proposedX;
        } else {
          newX = margin;
          newWidth = startPosX + startWidth - margin;
        }
      }
      if (direction.includes('top')) {
        const calculatedHeight = Math.max(30, startHeight - deltaY);
        const proposedY = startPosY + (startHeight - calculatedHeight);
        // Não permitir que saia por cima
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
          editMode ? 'cursor-pointer' : ''
        } ${shouldShowControls ? 'cursor-move' : ''}`}
        style={{
          left: currentConfig.x,
          top: currentConfig.y,
          width: currentConfig.width,
          height: currentConfig.height,
          transform: `rotate(${currentConfig.rotation}deg)`,
          transformOrigin: 'top left',
          zIndex: currentConfig.zIndex,
          opacity: currentConfig.opacity, // SEMPRE opacity normal - sem loading visual
          transition: 'none', // SEM transições para evitar flickering
          ...(shouldShowControls && {
            boxShadow: '0 0 0 2px #3b82f6',
            outline: '2px solid #3b82f6',
            outlineOffset: '2px'
          })
        }}
        onMouseDown={handleMouseDown}
      >
        {/* REMOVIDO: Loading visual que causava flickering */}
        
        {renderChildren()}

        {shouldShowControls && (
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
        
        {/* Indicador visual quando em modo de edição mas não selecionado */}
        {editMode && !isSelected && (
          <div 
            className="absolute inset-0 border border-dashed border-gray-300 opacity-30 pointer-events-none"
            style={{ borderRadius: '4px' }}
          />
        )}
      </div>
        </>
      )}
    </>
  );
}