// components/ResponsiveWrapper.tsx - CORRIGIDO
'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`component-${componentId}`);
      if (saved) {
        try {
          setConfigs(JSON.parse(saved));
        } catch (e) {
          console.error('Erro ao carregar config:', e);
        }
      }
      setIsLoaded(true);
    }
  }, [componentId]);

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

  const saveConfig = useCallback((newConfig: ResponsiveConfig) => {
    const updated = { ...configs, [breakpoint]: newConfig };
    setConfigs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`component-${componentId}`, JSON.stringify(updated));
    }
    onConfigChange?.(updated);
  }, [configs, breakpoint, componentId, onConfigChange]);

  useEffect(() => {
    const handleConfigChange = (e: CustomEvent) => {
      if (e.detail.componentId === componentId) {
        const updated = { ...configs, [breakpoint]: e.detail.config };
        setConfigs(updated);
      }
    };

    window.addEventListener('component-config-changed', handleConfigChange as EventListener);
    return () => window.removeEventListener('component-config-changed', handleConfigChange as EventListener);
  }, [componentId, configs, breakpoint]);

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

  // 🔥 FIX: Função para clonar children sem props DOM inválidos
  const renderChildren = () => {
    if (!React.isValidElement(children)) {
      return children;
    }

    // Se é um elemento DOM (string), NÃO injeta props customizados
    if (typeof children.type === 'string') {
      return children;
    }

    // Se é um componente React (função/class), PODE injetar props
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
          opacity: currentConfig.opacity,
          ...(editMode && {
            boxShadow: '0 0 0 2px #3b82f6',
            outline: '2px solid #3b82f6',
            outlineOffset: '2px'
          })
        }}
        onMouseDown={handleMouseDown}
      >
        {/* 🔥 RENDERIZAÇÃO CORRIGIDA */}
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

            <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs font-mono">
              {componentId} | {Math.round(currentConfig.width)}×{Math.round(currentConfig.height)} | Z:{currentConfig.zIndex}
            </div>
          </>
        )}
      </div>
    </>
  );
}