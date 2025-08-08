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
  pageFilter?: string; // Novo prop para filtrar por página
}

export default function GlobalAdvancedControls({ editMode, pageFilter }: GlobalAdvancedControlsProps) {
  const breakpoint = useBreakpoint();
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [activeComponentForEdit, setActiveComponentForEdit] = useState<string>('');
  const dialogRef = useRef<HTMLDivElement>(null);

  // 🏷️ FUNÇÃO PARA FORMATAÇÃO DE NOMES DE COMPONENTES
  const getComponentDisplayName = (componentId: string): string => {
    const componentNames: { [key: string]: string } = {
      // Porta Jusante
      'porta-jusante-base-principal': '🚪 Porta Jusante - Base',
      'porta-jusante-regua-principal': '🚪 Porta Jusante - Regua',
      'porta-jusante': '🚪 Porta Jusante',
      
      // Porta Montante
      'porta-montante-base-principal': '🚪 Porta Montante - Base',
      'porta-montante-regua-principal': '🚪 Porta Montante - Regua',
      'contrapeso-montante-direito': '⚖️ Contrapeso Montante Direito',
      'contrapeso-montante-esquerdo': '⚖️ Contrapeso Montante Esquerdo',
      
      // Enchimento
      'pipe-system-principal': '🔧 Sistema de Tubulações',
      'valvula-X00': '🔧 Válvula X00',
      'valvula-X01': '🔧 Válvula X01',
      'valvula-X02': '🔧 Válvula X02',
      'valvula-X04': '🔧 Válvula X04',
      'valvula-X05': '🔧 Válvula X05',
      'valvula-X06': '🔧 Válvula X06',
      'VD0': '🔧 Válvula Direcional VD0',
      'VD1': '🔧 Válvula Direcional VD1',
      'VD2': '🔧 Válvula Direcional VD2',
      'VD3': '🔧 Válvula Direcional VD3',
      'VD4': '🔧 Válvula Direcional VD4',
      'VD5': '🔧 Válvula Direcional VD5',
      'VG0': '🔧 Válvula Gaveta VG0',
      'VG1': '🔧 Válvula Gaveta VG1',
      'VG2': '🔧 Válvula Gaveta VG2',
      'VG3': '🔧 Válvula Gaveta VG3',
      'VG4': '🔧 Válvula Gaveta VG4',
      'VG5': '🔧 Válvula Gaveta VG5',
      'VH0': '🔧 Válvula Horizontal VH0',
      'VH1': '🔧 Válvula Horizontal VH1',
      'VF0': '🔧 Válvula Flange VF0',
      'VF1': '🔧 Válvula Flange VF1',
      'VF2': '🔧 Válvula Flange VF2',
      'VF3': '🔧 Válvula Flange VF3',
      'VF4': '🔧 Válvula Flange VF4',
      'VF5': '🔧 Válvula Flange VF5',
      'base-pistao-enchimento-esquerdo': '🏗️ Base Pistão Esquerdo',
      'base-pistao-enchimento-direito': '🏗️ Base Pistão Direito',
      'pistao-enchimento-esquerdo': '🔧 Pistão Esquerdo',
      'pistao-enchimento-direito': '🔧 Pistão Direito',
      'cilindro-enchimento-esquerdo': '🔩 Cilindro Esquerdo',
      'cilindro-enchimento-direito': '🔩 Cilindro Direito',
      'motor-enchimento-esquerdo': '⚙️ Motor Esquerdo',
      'motor-enchimento-direito': '⚙️ Motor Direito',
      'enchimento-tanque-principal': '🏗️ Tanque de Enchimento',
      'enchimento-bomba-principal': '🚿 Bomba de Enchimento',
      'enchimento-valvula-entrada': '🔧 Válvula de Entrada',
      'enchimento-valvula-saida': '🔧 Válvula de Saída',
      'enchimento-sensor-nivel': '📊 Sensor Nível Enchimento',
      'enchimento-motor-bomba': '⚙️ Motor da Bomba',
      'enchimento-controlador': '🎛️ Controlador de Enchimento',
      
      // Eclusa (Dashboard)
      'caldeira-principal': '🔥 Caldeira Principal',
      'parede-principal': '🧱 Parede Principal',
      'nivel-principal': '📊 Sensor de Nível',
      'semaforo': '🚦 Semáforo Principal',
      'semaforo-1': '🚦 Semáforo 1',
      'semaforo-2': '🚦 Semáforo 2', 
      'semaforo-3': '🚦 Semáforo 3',
      
      // Componentes Gerais
      'motor-principal': '⚙️ Motor Principal',
      'valvula-principal': '� Válvula Principal',
    };

    return componentNames[componentId] || `🔧 ${componentId.charAt(0).toUpperCase() + componentId.slice(1).replace(/-/g, ' ')}`;
  };

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

  // 🔄 SISTEMA UNIFICADO DE DETECÇÃO DE COMPONENTES - SEM REDUNDÂNCIAS
  useEffect(() => {
    if (!editMode) return;

    const detectComponents = () => {
      const found: ComponentData[] = [];
      const allComponents: string[] = [];
      
      // Debug: Lista TODOS os componentes no localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('component-')) {
          allComponents.push(key.replace('component-', ''));
        }
      }
      
      console.log(`🔍 [DEBUG] TODOS os componentes no localStorage:`, allComponents);
      console.log(`🔍 [DEBUG] PageFilter ativo: ${pageFilter}`);
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('component-')) {
          const componentId = key.replace('component-', '');
          
          console.log(`🔍 [DEBUG] Verificando componente: ${componentId}`);
          
          // Filtrar por página se pageFilter for fornecido
          if (pageFilter) {
            // Lógica melhorada: inclui componentes específicos para cada página
            let shouldInclude = false;
            
            if (pageFilter === 'enchimento') {
              // Para página de enchimento: inclui componentes relacionados ao sistema de enchimento
              shouldInclude = componentId.startsWith('enchimento-') || 
                             componentId.startsWith('pipe-system-') ||
                             componentId.startsWith('valvula-X') ||  // ✅ Válvulas X00-X06
                             componentId.startsWith('VD') ||  // ✅ NOVO: Válvulas Direcionais VD0-VD5
                             componentId.startsWith('VG') ||  // ✅ NOVO: Válvulas Gaveta VG0-VG5
                             componentId.startsWith('VH') ||  // ✅ NOVO: Válvulas Horizontais VH0-VH1
                             componentId.startsWith('VF') ||  // ✅ NOVO: Válvulas Flange VF0-VF5
                             componentId.startsWith('base-pistao-enchimento-') ||  // ✅ NOVO: Bases dos pistões
                             componentId.startsWith('pistao-enchimento-') ||  // ✅ NOVO: Pistões
                             componentId.startsWith('cilindro-enchimento-') ||  // ✅ NOVO: Cilindros
                             componentId.startsWith('motor-enchimento-') ||  // ✅ NOVO: Motores
                             componentId.includes('enchimento') ||
                             componentId.includes('valvula') ||
                             componentId.includes('pistao') ||
                             componentId.includes('cilindro') ||
                             componentId.includes('motor');
              
              console.log(`🔍 [DEBUG] ${componentId} -> shouldInclude: ${shouldInclude}`);
            } else {
              // Lógica original para outras páginas
              const filterTerms = pageFilter.split('-');
              shouldInclude = filterTerms.some(term => componentId.includes(term));
            }
            
            if (!shouldInclude) {
              console.log(`❌ [DEBUG] Componente ${componentId} REJEITADO pelo filtro ${pageFilter}`);
              continue;
            } else {
              console.log(`✅ [DEBUG] Componente ${componentId} ACEITO pelo filtro ${pageFilter}`);
            }
          }
          
          const configData = localStorage.getItem(key);
          
          if (configData) {
            try {
              const configs = JSON.parse(configData);
              found.push({ id: componentId, configs });
              if (process.env.NODE_ENV === 'development') {
                console.log(`✅ Componente ${componentId} adicionado`);
              }
            } catch (error) {
              if (process.env.NODE_ENV === 'development') {
                console.error(`Erro ao carregar ${componentId}:`, error);
              }
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
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 GlobalControls detectou ${found.length} componentes:`, found.map(c => c.id));
      }
    };

    // Detecta inicial
    detectComponents();

    // � LISTENER UNIFICADO PARA MUDANÇAS EM TEMPO REAL
    const handleComponentChange = (e: Event) => {
      const customEvent = e as CustomEvent; // eslint-disable-line @typescript-eslint/no-unused-vars
      const isStorageEvent = e.type === 'storage';
      
      if (isStorageEvent) {
        const storageEvent = e as StorageEvent;
        if (storageEvent.key?.startsWith('component-')) {
          if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Storage change detectado:', storageEvent.key);
          }
          detectComponents();
        }
      } else if (e.type === 'component-config-changed') {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Component config change detectado');
        }
        // Redetecção imediata para novos componentes
        detectComponents();
      }
    };

    // Registra listeners unificados
    window.addEventListener('storage', handleComponentChange);
    window.addEventListener('component-config-changed', handleComponentChange);

    return () => {
      window.removeEventListener('storage', handleComponentChange);
      window.removeEventListener('component-config-changed', handleComponentChange);
    };
  }, [editMode, selectedComponent, pageFilter]);
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
        x: Math.round(Number(currentConfig.x)) || 74,
        y: Math.round(Number(currentConfig.y)) || 70,
        width: Math.round(Number(currentConfig.width)) || 400,
        height: Math.round(Number(currentConfig.height)) || 200,
        scale: Number(currentConfig.scale) || 1,
        zIndex: Math.round(Number(currentConfig.zIndex)) || 1,
        opacity: Number(currentConfig.opacity) || 1,
        rotation: Math.round(Number(currentConfig.rotation)) || 0
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

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        console.error('Erro detalhado:', {
          status: saveResponse.status,
          statusText: saveResponse.statusText,
          componentId,
          breakpoint: strapiBreakpoint,
          url: saveResponse.url,
          errorText
        });
        throw new Error(`Erro HTTP ${saveResponse.status}: ${errorText}`);
      }
      
      alert(`✅ ${componentId} salvo no PostgreSQL!`);
      
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      alert(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // EXCLUSÃO DE COMPONENTE
  const deleteComponent = (componentId: string) => {
    if (!componentId) return;
    
    const confirmed = window.confirm(
      `🗑️ Tem certeza que deseja EXCLUIR o componente "${componentId}"?\n\n` +
      `Esta ação irá:\n` +
      `• Remover todas as configurações do localStorage\n` +
      `• Remover o componente da tela\n` +
      `• Esta ação é IRREVERSÍVEL!\n\n` +
      `Digite "EXCLUIR" para confirmar:`
    );
    
    if (!confirmed) return;
    
    const doubleConfirm = window.prompt(
      `⚠️ CONFIRMAÇÃO FINAL\n\nDigite "EXCLUIR" em maiúsculas para confirmar a exclusão do componente "${componentId}":`,
      ""
    );
    
    if (doubleConfirm !== "EXCLUIR") {
      alert("❌ Exclusão cancelada. Você deve digitar exatamente 'EXCLUIR' para confirmar.");
      return;
    }
    
    try {
      // Remove do localStorage
      localStorage.removeItem(`component-${componentId}`);
      
      // Remove do estado local
      setComponents(prev => prev.filter(c => c.id !== componentId));
      
      // Limpa seleção se era o selecionado
      if (selectedComponent === componentId) {
        const remainingComponents = components.filter(c => c.id !== componentId);
        setSelectedComponent(remainingComponents.length > 0 ? remainingComponents[0].id : '');
      }
      
      // Dispara evento para remover da tela
      window.dispatchEvent(new CustomEvent('component-deleted', { 
        detail: { componentId } 
      }));
      
      alert(`🗑️ Componente "${componentId}" excluído com sucesso!`);
      
    } catch (error) {
      console.error('❌ Erro ao excluir componente:', error);
      alert(`❌ Erro ao excluir: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
      {/* Header - MELHORADO */}
      <div className={`drag-handle bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 p-3 rounded-t-lg flex items-center justify-between select-none ${
        isDragging ? 'cursor-grabbing bg-gradient-to-r from-purple-100 to-blue-100' : 'cursor-grab hover:from-purple-100 hover:to-blue-100'
      }`}>
        <div className="flex items-center gap-3 pointer-events-none">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <span className="text-sm font-semibold text-gray-800">⚙️ Controles Globais</span>
          <span className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full font-medium">{breakpoint}</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Componente</label>
                <select 
                  value={selectedComponent}
                  onChange={(e) => setSelectedComponent(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="">Escolha um componente...</option>
                  {components.map(comp => (
                    <option key={comp.id} value={comp.id}>
                      {getComponentDisplayName(comp.id)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Controles de Seleção Visual */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Edição Visual</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (selectedComponent) {
                        setActiveComponentForEdit(selectedComponent);
                        window.dispatchEvent(new CustomEvent('select-component', {
                          detail: { componentId: selectedComponent }
                        }));
                      }
                    }}
                    disabled={!selectedComponent}
                    className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    🎯 Selecionar
                  </button>
                  <button
                    onClick={() => {
                      setActiveComponentForEdit('');
                      window.dispatchEvent(new CustomEvent('deselect-all-components'));
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    ✖️ Desselecionar
                  </button>
                </div>
                {activeComponentForEdit && (
                  <p className="text-xs text-blue-600 mt-1">
                    🔷 Editando: <strong>{getComponentDisplayName(activeComponentForEdit)}</strong>
                  </p>
                )}
              </div>
            </div>
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
              
              {/* Posição - COM INPUTS PRECISOS */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Posição
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">X (pixels)</label>
                    <input
                      type="number"
                      min="0"
                      max={window.innerWidth}
                      value={Math.round(currentConfig.x || 0)}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'x', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Y (pixels)</label>
                    <input
                      type="number"
                      min="0"
                      max={window.innerHeight}
                      value={Math.round(currentConfig.y || 0)}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'y', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Dimensões - COM INPUTS PRECISOS */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Dimensões
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Largura (pixels)</label>
                    <input
                      type="number"
                      min="10"
                      max="2000"
                      value={Math.round(currentConfig.width || 0)}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'width', parseInt(e.target.value) || 10)}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Altura (pixels)</label>
                    <input
                      type="number"
                      min="10"
                      max="1500"
                      value={Math.round(currentConfig.height || 0)}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'height', parseInt(e.target.value) || 10)}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="200"
                    />
                  </div>
                </div>
              </div>
              {/* Transformações - COM INPUTS PRECISOS */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Transformações
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Escala</label>
                    <input
                      type="number"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={Number((currentConfig.scale || 1).toFixed(1))}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'scale', parseFloat(e.target.value) || 1)}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="1.0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Rotação (°)</label>
                    <input
                      type="number"
                      min="-360"
                      max="360"
                      step="15"
                      value={Math.round(currentConfig.rotation || 0)}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'rotation', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Opacidade</label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={Number((currentConfig.opacity || 1).toFixed(1))}
                      onChange={(e) => updateComponentConfig(selectedComponent, 'opacity', parseFloat(e.target.value) || 1)}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="1.0"
                    />
                  </div>
                </div>
              </div>

              {/* Camadas - COM INPUT PRECISO */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Camadas
                </h4>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Z-Index (camada)</label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={Math.round(currentConfig.zIndex || 1)}
                    onChange={(e) => updateComponentConfig(selectedComponent, 'zIndex', parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="1"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Maior = frente, Menor = atrás
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
                    🎯 Centralizar
                  </button>
                  <button 
                    onClick={() => {
                      updateComponentConfig(selectedComponent, 'rotation', 0);
                      updateComponentConfig(selectedComponent, 'opacity', 1);
                      updateComponentConfig(selectedComponent, 'scale', 1);
                    }}
                    className="px-2 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>

              {/* Zona de Perigo - Exclusão */}
              <div className="pt-3 border-t border-red-200 bg-red-50 rounded p-3 -m-1">
                <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Zona de Perigo
                </h4>
                <button 
                  onClick={() => deleteComponent(selectedComponent)}
                  className="w-full px-2 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs flex items-center justify-center gap-2"
                  disabled={!selectedComponent}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  Excluir Componente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
