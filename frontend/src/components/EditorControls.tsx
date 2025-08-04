// components/EditorControls.tsx
'use client';
import React from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface EditorControlsProps {
  editMode: boolean;
  onToggleEdit: () => void;
  components?: string[];
  onResetComponent: (componentId: string) => void;
}

export default function EditorControls({ 
  editMode, 
  onToggleEdit, 
  components = [], 
  onResetComponent 
}: EditorControlsProps) {
  const breakpoint = useBreakpoint();
  
  return (
    <div className="fixed top-20 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleEdit}
            className={`px-4 py-2 rounded font-medium ${
              editMode 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {editMode ? 'Sair do Editor' : 'Entrar no Editor'}
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          <div>Breakpoint atual: <span className="font-mono font-bold">{breakpoint}</span></div>
          <div>Resolução: <span className="font-mono">{typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : ''}</span></div>
        </div>
        
        {editMode && components.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Componentes:</h4>
            {components.map(comp => (
              <div key={comp} className="flex justify-between items-center mb-2">
                <span className="text-sm">{comp}</span>
                <button
                  onClick={() => onResetComponent(comp)}
                  className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                >
                  Reset
                </button>
              </div>
            ))}
          </div>
        )}
        
        {editMode && (
          <div className="text-xs text-gray-500 border-t pt-2">
            <p>• Arraste para mover</p>
            <p>• Use as alças para redimensionar</p>
            <p>• Configurações salvas por breakpoint</p>
          </div>
        )}
      </div>
    </div>
  );
}