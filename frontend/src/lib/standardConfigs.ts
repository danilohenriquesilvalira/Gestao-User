// Configurações padronizadas para ResponsiveWrapper
// Sistema robusto e consistente para todas as páginas

export interface ResponsiveConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  zIndex: number;
  opacity: number;
  rotation: number;
}

export type ConfigSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'BACKGROUND' | 'CUSTOM';

export enum ComponentPriority {
  LOW = 0,     // Backgrounds, sistemas grandes
  NORMAL = 1,  // Componentes normais
  HIGH = 2     // Válvulas, componentes críticos
}

// Configurações base padronizadas - NUNCA mais piscamento ou conflitos
export const STANDARDIZED_CONFIGS: Record<ConfigSize, Record<string, ResponsiveConfig>> = {
  // Componentes pequenos (válvulas, indicadores)
  SMALL: {
    xs: { x: 100, y: 100, width: 80, height: 80, scale: 1, zIndex: 20, opacity: 1, rotation: 0 },
    sm: { x: 150, y: 120, width: 90, height: 90, scale: 1, zIndex: 20, opacity: 1, rotation: 0 },
    md: { x: 200, y: 150, width: 100, height: 100, scale: 1, zIndex: 20, opacity: 1, rotation: 0 },
    lg: { x: 250, y: 180, width: 110, height: 110, scale: 1, zIndex: 20, opacity: 1, rotation: 0 },
    xl: { x: 300, y: 200, width: 120, height: 120, scale: 1, zIndex: 20, opacity: 1, rotation: 0 },
    '2xl': { x: 350, y: 220, width: 130, height: 130, scale: 1, zIndex: 20, opacity: 1, rotation: 0 },
    '3xl': { x: 400, y: 240, width: 140, height: 140, scale: 1, zIndex: 20, opacity: 1, rotation: 0 },
    '4xl': { x: 450, y: 260, width: 150, height: 150, scale: 1, zIndex: 20, opacity: 1, rotation: 0 }
  },
  
  // Componentes médios (motores, bases pequenas)
  MEDIUM: {
    xs: { x: 150, y: 150, width: 160, height: 120, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
    sm: { x: 200, y: 180, width: 180, height: 140, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
    md: { x: 250, y: 200, width: 200, height: 160, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
    lg: { x: 300, y: 250, width: 220, height: 180, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
    xl: { x: 350, y: 300, width: 240, height: 200, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
    '2xl': { x: 400, y: 350, width: 260, height: 220, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
    '3xl': { x: 450, y: 400, width: 280, height: 240, scale: 1, zIndex: 15, opacity: 1, rotation: 0 },
    '4xl': { x: 500, y: 450, width: 300, height: 260, scale: 1, zIndex: 15, opacity: 1, rotation: 0 }
  },
  
  // Componentes grandes (bases principais, sistemas)
  LARGE: {
    xs: { x: 50, y: 100, width: 300, height: 200, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
    sm: { x: 100, y: 150, width: 350, height: 250, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
    md: { x: 150, y: 200, width: 400, height: 300, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
    lg: { x: 200, y: 250, width: 450, height: 350, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
    xl: { x: 250, y: 300, width: 500, height: 400, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
    '2xl': { x: 300, y: 350, width: 550, height: 450, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
    '3xl': { x: 350, y: 400, width: 600, height: 500, scale: 1, zIndex: 10, opacity: 1, rotation: 0 },
    '4xl': { x: 400, y: 450, width: 650, height: 550, scale: 1, zIndex: 10, opacity: 1, rotation: 0 }
  },
  
  // Sistemas de fundo (tubulações, backgrounds)
  BACKGROUND: {
    xs: { x: 0, y: 0, width: 800, height: 600, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    sm: { x: 0, y: 0, width: 1000, height: 700, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    md: { x: 0, y: 0, width: 1200, height: 800, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    lg: { x: 0, y: 0, width: 1400, height: 900, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    xl: { x: 0, y: 0, width: 1600, height: 1000, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '2xl': { x: 0, y: 0, width: 1800, height: 1100, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '3xl': { x: 0, y: 0, width: 2000, height: 1200, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '4xl': { x: 0, y: 0, width: 2200, height: 1300, scale: 1, zIndex: 1, opacity: 1, rotation: 0 }
  },

  // Para componentes que precisam de configuração personalizada
  CUSTOM: {
    xs: { x: 74, y: 70, width: 400, height: 200, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    sm: { x: 74, y: 70, width: 400, height: 200, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    md: { x: 74, y: 70, width: 400, height: 200, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    lg: { x: 74, y: 70, width: 400, height: 200, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    xl: { x: 74, y: 70, width: 400, height: 200, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '2xl': { x: 100, y: 70, width: 400, height: 200, scale: 1, zIndex: 1, opacity: 1, rotation: 0 },
    '3xl': { x: 120, y: 70, width: 400, height: 200, scale: 1, zIndex: 1, rotation: 0 },
    '4xl': { x: 150, y: 70, width: 400, height: 200, scale: 1, zIndex: 1, opacity: 1, rotation: 0 }
  }
};

// Função para obter configuração padronizada
export function getStandardizedConfig(
  configSize: ConfigSize, 
  breakpoint: string,
  customOverrides?: Partial<ResponsiveConfig>
): ResponsiveConfig {
  const baseConfig = STANDARDIZED_CONFIGS[configSize][breakpoint] || STANDARDIZED_CONFIGS[configSize].lg;
  
  if (customOverrides) {
    return { ...baseConfig, ...customOverrides };
  }
  
  return baseConfig;
}

// Área de seleção inteligente - evita componentes pequenos difíceis de selecionar
export function getSelectionDimensions(config: ResponsiveConfig) {
  const MIN_SELECTION_SIZE = 60;
  const baseWidth = config.width;
  const baseHeight = config.height;
  
  // Se componente é muito pequeno, usar área mínima para seleção
  const selectionWidth = Math.max(baseWidth, MIN_SELECTION_SIZE);
  const selectionHeight = Math.max(baseHeight, MIN_SELECTION_SIZE);
  
  // Centralizar área de seleção se for maior que componente
  const offsetX = baseWidth < MIN_SELECTION_SIZE ? (MIN_SELECTION_SIZE - baseWidth) / 2 : 0;
  const offsetY = baseHeight < MIN_SELECTION_SIZE ? (MIN_SELECTION_SIZE - baseHeight) / 2 : 0;
  
  return {
    selectionWidth,
    selectionHeight,
    contentWidth: baseWidth,
    contentHeight: baseHeight,
    offsetX,
    offsetY,
    isEnlarged: baseWidth < MIN_SELECTION_SIZE || baseHeight < MIN_SELECTION_SIZE
  };
}

// Sistema de transições controladas - elimina piscamento
export function getTransitionStyle(editMode: boolean, isDragging: boolean): string {
  if (editMode && isDragging) {
    return 'none'; // Sem transição durante drag
  }
  
  if (editMode && !isDragging) {
    return 'all 0.2s ease-out'; // Transição suave para snap/resize
  }
  
  return 'opacity 0.3s ease-in-out'; // Transição apenas para aparição inicial
}