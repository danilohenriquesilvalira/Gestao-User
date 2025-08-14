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

  const currentConfig = useMemo((): ResponsiveConfig => {
    const config = configs[breakpoint] || configs.lg || {
      x: 74,
      y: 70,
      width: 400,
      height: 200,
      scale: 1,
      zIndex: 1,
      opacity: 1,
      rotation: 0
    };
    
    const isMotorMontante = componentId.includes('porta-montante-motor');
    if (isMotorMontante) {
      console.log('🚨 [MOTOR CONFIG] Motor da montante config:', {
        componentId,
        breakpoint,
        config,
        allConfigs: configs
      });
    }
    console.log('🎯 [CONFIG] Current config for', componentId, 'breakpoint', breakpoint, ':', config);
    
    // DEBUG: Log para detectar mudanças de posição
    if (componentId.includes('valvula') || componentId.includes('motor') || componentId === 'VF4' || componentId === 'VF5') {
      console.log(`📍 [POSIÇÃO] ${componentId} - x:${config.x}, y:${config.y}, w:${config.width}, h:${config.height}, z:${config.zIndex}`);
    }
    
    // DEBUG ESPECÍFICO para VF4 e VF5
    if (componentId === 'VF4' || componentId === 'VF5') {
      console.log(`🔍 [VF DEBUG] ${componentId} está sendo renderizado!`, config);
    }
    
    return config;
  }, [configs, breakpoint, componentId]);

  // Detectar componentes sobrepostos na posição do clique
  const detectOverlappingComponents = (clientX: number, clientY: number) => {
    const elementsAtPoint = document.elementsFromPoint(clientX, clientY);
    const components: Array<{id: string, zIndex: number}> = [];
    
    elementsAtPoint.forEach(element => {
      const compId = element.getAttribute('data-component-id');
      if (compId && compId !== componentId) {
        const zIndex = parseInt(window.getComputedStyle(element).zIndex) || 1;
        components.push({ id: compId, zIndex });
      }
    });
    
    // Ordenar por Z-index (maior primeiro)
    return components.sort((a, b) => b.zIndex - a.zIndex);
  };

  // Cálculo de dimensões da área de seleção (SEMPRE EXATO - SEM MUDANÇA)
  const selectionDimensions = useMemo(() => {
    // SEMPRE usar o tamanho EXATO do componente - NUNCA mudar por causa do editMode
    const width = currentConfig.width;
    const height = currentConfig.height;
    
    // Apenas para debugging/logs - não afeta o tamanho
    const isSmallComponent = currentConfig.width < MIN_SELECTION_SIZE || currentConfig.height < MIN_SELECTION_SIZE;
    
    return { width, height, isSmallComponent };
  }, [currentConfig.width, currentConfig.height]);

  // Função para carregar do PostgreSQL na inicialização
  const loadFromStrapi = useCallback(async () => {
    const isMotorMontante = componentId.includes('porta-montante-motor');
    if (isMotorMontante) {
      console.log('🚨 [MOTOR DEBUG] Carregando motor da montante:', componentId);
    }
    console.log('🔄 [LOAD] Tentando carregar do Strapi para:', componentId);
    try {
      const baseURL = (typeof window !== 'undefined' && window.location.origin.includes('localhost')) 
        ? 'http://localhost:1337' 
        : import.meta.env?.VITE_STRAPI_URL || 'http://localhost:1337';
      
      const response = await fetch(
        `${baseURL}/api/component-layouts?filters[componentId][$eq]=${componentId}`
      );
      
      console.log('📡 [LOAD] Response status:', response.status, response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`🔍 [LOAD] ${componentId} - Strapi Response:`, data);
        
        if (data?.data && data.data.length > 0) {
          // Converte dados do PostgreSQL para formato local
          const postgresConfigs: Record<string, ResponsiveConfig> = {};
          
          console.log(`🔍 [DEBUG] ${componentId} - First item structure:`, data.data[0]);
          
          data.data.forEach((item: any) => {
            // Acessa os atributos corretos do Strapi
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
              zIndex: Number(attrs.zIndex) || 1,
              opacity: Number(attrs.opacity) || 1,
              rotation: Number(attrs.rotation) || 0
            };
          });
          
          // Mescla com configurações padrão
          const mergedConfigs = { ...defaultConfigs, ...postgresConfigs };
          console.log('🔧 [LOAD] Configs finais:', mergedConfigs);
          console.log('🔧 [LOAD] Breakpoint atual:', breakpoint);
          
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
      // ❌ CORREÇÃO TEMPORÁRIA REMOVIDA - estava impedindo carregamento do Strapi
      // const isEnchimentoComponent = (componentId.includes('enchimento') || 
      //                              componentId.includes('valvula') || 
      //                              componentId.includes('pipe-system') ||
      //                              componentId.includes('pistao') ||
      //                              componentId.includes('cilindro')) && 
      //                              !componentId.includes('porta-montante');
      
      // if (isEnchimentoComponent) {
      //   console.log(`🔧 [CORREÇÃO ENCHIMENTO] Forçando configurações padrão para ${componentId}`);
      //   localStorage.removeItem(`component-${componentId}`);
      //   setConfigs(defaultConfigs);
      //   localStorage.setItem(`component-${componentId}`, JSON.stringify(defaultConfigs));
      //   setIsLoaded(true);
      //   setComponentLoaded(componentId);
      //   return;
      // }
      
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
        : import.meta.env?.VITE_STRAPI_URL || 'http://localhost:1337';
      
      console.log('🔍 [AUTO-SAVE DEBUG] Iniciando auto-save:', {
        componentId,
        breakpoint: strapiBreakpoint,
        baseURL,
        configToSave
      });
      
      // Verifica se já existe
      const checkURL = `${baseURL}/api/component-layouts?filters[componentId][$eq]=${componentId}&filters[breakpoint][$eq]=${strapiBreakpoint}`;
      console.log('📡 [AUTO-SAVE DEBUG] Verificando se existe:', checkURL);
      
      const checkResponse = await fetch(checkURL);
      
      if (!checkResponse.ok) {
        console.warn(`⚠️ [AUTO-SAVE DEBUG] Erro ao verificar configuração existente: ${checkResponse.status}`);
        return;
      }
      
      const checkData = await checkResponse.json();
      const existingEntry = checkData?.data && checkData.data.length > 0 ? checkData.data[0] : null;
      const existingDocumentId = existingEntry?.documentId;

      console.log('📋 [AUTO-SAVE DEBUG] Resposta do check:', { 
        checkData, 
        existingEntry, 
        existingDocumentId 
      });

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

      console.log('💾 [AUTO-SAVE DEBUG] Dados a serem salvos:', configData);

      let saveResponse;
      
      if (existingDocumentId) {
        console.log('🔄 [AUTO-SAVE DEBUG] Atualizando entrada existente:', existingDocumentId);
        saveResponse = await fetch(`${baseURL}/api/component-layouts/${existingDocumentId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ data: configData })
        });
      } else {
        console.log('➕ [AUTO-SAVE DEBUG] Criando nova entrada');
        saveResponse = await fetch(`${baseURL}/api/component-layouts`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ data: configData })
        });
      }

      console.log('📤 [AUTO-SAVE DEBUG] Resposta da operação:', {
        status: saveResponse.status,
        statusText: saveResponse.statusText,
        ok: saveResponse.ok,
        url: saveResponse.url
      });

      if (saveResponse.ok) {
        const responseData = await saveResponse.json();
        console.log(`✅ [AUTO-SAVE] ${componentId} salvo no PostgreSQL`, responseData);
      } else {
        const errorText = await saveResponse.text();
        console.warn(`⚠️ [AUTO-SAVE] Erro ao salvar ${componentId}:`, {
          status: saveResponse.status,
          statusText: saveResponse.statusText,
          errorText
        });
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
        : import.meta.env?.VITE_STRAPI_URL || 'http://localhost:1337';
      
      console.log('🔍 [MANUAL-SAVE DEBUG] Iniciando save manual:', {
        componentId,
        breakpoint: strapiBreakpoint,
        baseURL,
        currentConfig
      });
      
      const checkURL = `${baseURL}/api/component-layouts?filters[componentId][$eq]=${componentId}&filters[breakpoint][$eq]=${strapiBreakpoint}`;
      console.log('📡 [MANUAL-SAVE DEBUG] Verificando se existe:', checkURL);
      
      const checkResponse = await fetch(checkURL);
      
      if (!checkResponse.ok) {
        console.error('❌ [MANUAL-SAVE DEBUG] Erro ao verificar existência:', checkResponse.status);
        throw new Error(`Erro ao verificar configuração existente: ${checkResponse.status}`);
      }
      
      const checkData = await checkResponse.json();
      
      const existingEntry = checkData?.data && checkData.data.length > 0 ? checkData.data[0] : null;
      const existingDocumentId = existingEntry?.documentId;

      console.log('📋 [MANUAL-SAVE DEBUG] Resposta do check:', { 
        checkData, 
        existingEntry, 
        existingDocumentId 
      });

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
          newConfig.zIndex = newConfig.zIndex + 1;
          console.log(`🔼 [Z-INDEX] ${componentId} trazido para frente: ${newConfig.zIndex}`);
          break;
        case '[':
          e.preventDefault();
          newConfig.zIndex = Math.max(1, newConfig.zIndex - 1);
          console.log(`🔽 [Z-INDEX] ${componentId} enviado para trás: ${newConfig.zIndex}`);
          break;
        case '\\':
          e.preventDefault();
          newConfig.zIndex = 9999;
          console.log(`🔝 [Z-INDEX] ${componentId} trazido para o topo: ${newConfig.zIndex}`);
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
    
    // SELEÇÃO INTELIGENTE: temporariamente aumentar Z-index para facilitar manipulação
    if (!isSelected) {
      const tempZIndex = 9998; // Z-index temporário alto
      if (elementRef.current) {
        elementRef.current.style.zIndex = tempZIndex.toString();
      }
      
      // Restaurar Z-index original após 5 segundos ou quando deselecionar
      setTimeout(() => {
        if (elementRef.current && !isSelected) {
          elementRef.current.style.zIndex = currentConfig.zIndex.toString();
        }
      }, 5000);
    }
    
    window.dispatchEvent(new CustomEvent('select-component', {
      detail: { componentId, zIndex: currentConfig.zIndex }
    }));
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - currentConfig.x,
      y: e.clientY - currentConfig.y
    });
    elementRef.current?.focus();
    
    // Detectar componentes sobrepostos para ajudar na seleção
    const overlappingComponents = detectOverlappingComponents(e.clientX, e.clientY);
    
    console.log(`🎯 [SELEÇÃO] Componente ${componentId} selecionado (Z-index: ${currentConfig.zIndex})`);
    if (overlappingComponents.length > 1) {
      console.log(`⚠️ [SOBREPOSIÇÃO] ${overlappingComponents.length} componentes sobrepostos:`, overlappingComponents);
    }
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
          {/* Grid de fundo movido para o final para não interferir no layout */}

          <div
            ref={elementRef}
            data-component-id={componentId}
            tabIndex={editMode ? 0 : -1}
            className={`absolute outline-none ${
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
              transition: 'none !important',
              animation: 'none !important',
              // Força reset de propriedades que podem causar "pulo"
              margin: 0,
              padding: 0,
              border: 'none',
              boxSizing: 'border-box',
              ...(shouldShowControls && {
                boxShadow: '0 0 0 2px #3b82f6',
                outline: '2px solid #3b82f6',
                outlineOffset: '2px',
                backgroundColor: currentConfig.width < MIN_SELECTION_SIZE || currentConfig.height < MIN_SELECTION_SIZE ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
              })
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Container interno para o conteúdo real - SEMPRE na posição 0,0 */}
            <div 
              style={{
                width: currentConfig.width,
                height: currentConfig.height,
                position: 'absolute',
                // SEMPRE posição 0,0 - NUNCA centralizar - evita pulos
                top: 0,
                left: 0,
                pointerEvents: editMode ? 'none' : 'auto',
                transition: 'none !important',
                animation: 'none !important',
                // Reset de propriedades CSS
                margin: 0,
                padding: 0,
                border: 'none',
                boxSizing: 'border-box'
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

          {/* Grid de fundo APÓS todos os componentes para não afetar layout */}
          {editMode && (
            <div
              className="fixed inset-0 pointer-events-none"
              style={{
                zIndex: -1, // Atrás de tudo
                backgroundImage: `
                  radial-gradient(circle, rgba(59, 130, 246, 0.15) 1px, transparent 1px),
                  linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px, 20px 20px, 20px 20px'
              }}
            />
          )}
        </>
      )}
    </>
  );
}