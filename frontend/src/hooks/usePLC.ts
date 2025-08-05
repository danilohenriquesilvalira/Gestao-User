import { useState } from 'react';

interface PLC {
  id: number;
  name: string;
  ip_address: string;
  rack: number;
  slot: number;
  active: boolean;
}

interface Tag {
  id: number;
  address: string;
  name: string;
  data_type: 'INT' | 'REAL' | 'BOOL' | 'DINT' | 'STRING' | 'ARRAY';
  current_value: any;
  plc_device: number;
}

export const usePLC = () => {
  const [plcs, setPLCs] = useState<PLC[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar PLCs
  const loadPLCs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/plc');
      const result = await response.json();
      setPLCs(result.data || []);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar PLCs');
      setPLCs([]);
    } finally {
      setLoading(false);
    }
  };

  // Buscar Tags
  const loadTags = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tags');
      const result = await response.json();
      setTags(result.data || []);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar tags');
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar tudo
  const refresh = async () => {
    await Promise.all([loadPLCs(), loadTags()]);
  };

  // Criar PLC
  const createPLC = async (data: Omit<PLC, 'id'>) => {
    try {
      const response = await fetch('/api/plc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Erro ao criar PLC');
      
      await loadPLCs();
      return await response.json();
    } catch (err) {
      setError('Erro ao criar PLC');
      throw err;
    }
  };

  // Atualizar PLC
  const updatePLC = async (data: PLC) => {
    try {
      const response = await fetch('/api/plc', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Erro ao atualizar PLC');
      
      await loadPLCs();
      return await response.json();
    } catch (err) {
      setError('Erro ao atualizar PLC');
      throw err;
    }
  };

  // Deletar PLC
  const deletePLC = async (id: number) => {
    try {
      const response = await fetch(`/api/plc?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao deletar PLC');
      await loadPLCs();
    } catch (err) {
      setError('Erro ao deletar PLC');
      throw err;
    }
  };

  // Criar Tag
  const createTag = async (data: Omit<Tag, 'id' | 'current_value'>) => {
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Erro ao criar tag');
      
      // Refresh imediato para atualizar a lista de tags
      await loadTags();
      return await response.json();
    } catch (err) {
      setError('Erro ao criar tag');
      throw err;
    }
  };

  // Atualizar Tag
  const updateTag = async (data: Tag) => {
    try {
      const { current_value, ...tagData } = data;
      const response = await fetch('/api/tags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagData)
      });
      
      if (!response.ok) throw new Error('Erro ao atualizar tag');
      
      // Refresh imediato para atualizar a lista de tags
      await loadTags();
      return await response.json();
    } catch (err) {
      setError('Erro ao atualizar tag');
      throw err;
    }
  };

  // Deletar Tag
  const deleteTag = async (id: number) => {
    try {
      const response = await fetch(`/api/tags?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao deletar tag');

      // Refresh imediato para atualizar a lista de tags
      await loadTags();
    } catch (err) {
      setError('Erro ao deletar tag');
      throw err;
    }
  };

  return {
    plcs,
    tags,
    loading,
    error,
    loadPLCs,
    loadTags,
    refresh,
    createPLC,
    updatePLC,
    deletePLC,
    createTag,
    updateTag,
    deleteTag,
    setError
  };
};