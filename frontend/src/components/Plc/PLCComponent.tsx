// src/components/Plc/PLCComponent.tsx - REFATORADO COMPLETO
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePLC } from '@/hooks/usePLC';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Plus, Edit, Trash2, Server, Tag, Power, PowerOff, X, RefreshCw } from 'lucide-react';

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

interface Props {
  plcs: PLC[];
  tags: Tag[];
  loading: boolean;
  onSuccess: (message: string) => void;
}

const PLCComponent = ({ plcs, tags, loading, onSuccess }: Props) => {
  const { refresh, createPLC, updatePLC, deletePLC, createTag, updateTag, deleteTag } = usePLC();
  const [activeTab, setActiveTab] = useState<'plcs' | 'tags'>('plcs');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'plc' | 'tag'>('plc');
  const [editingItem, setEditingItem] = useState<PLC | Tag | null>(null);
  const [selectedPLC, setSelectedPLC] = useState<number | null>(null);

  // Form PLC
  const plcForm = useForm<Omit<PLC, 'id'>>({
    defaultValues: { name: '', ip_address: '', rack: 0, slot: 1, active: true }
  });

  // Form Tag
  const tagForm = useForm<Omit<Tag, 'id' | 'current_value'>>({
    defaultValues: { address: '', name: '', data_type: 'INT', plc_device: 0 }
  });

  // Atualizar dados
  const handleRefresh = async () => {
    await refresh();
    onSuccess('Dados atualizados!');
  };

  // Modal
  const openModal = (type: 'plc' | 'tag', item?: PLC | Tag) => {
    setModalType(type);
    setEditingItem(item || null);
    
    if (type === 'plc' && item) {
      plcForm.reset(item as PLC);
    } else if (type === 'tag' && item) {
      tagForm.reset({
        address: (item as Tag).address,
        name: (item as Tag).name,
        data_type: (item as Tag).data_type,
        plc_device: (item as Tag).plc_device
      });
    } else if (type === 'plc') {
      plcForm.reset();
    } else {
      tagForm.reset({ plc_device: selectedPLC || 0 });
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    plcForm.reset();
    tagForm.reset();
  };

  // Submit PLC
  const onPLCSubmit = async (data: Omit<PLC, 'id'>) => {
    try {
      if (editingItem && 'rack' in editingItem) {
        await updatePLC({ ...data, id: editingItem.id });
        onSuccess('PLC atualizado!');
      } else {
        await createPLC(data);
        onSuccess('PLC criado!');
      }
      closeModal();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  // Submit Tag
  const onTagSubmit = async (data: Omit<Tag, 'id' | 'current_value'>) => {
    try {
      if (editingItem && 'address' in editingItem) {
        await updateTag({ ...data, id: editingItem.id, current_value: null });
        onSuccess('Tag atualizada!');
      } else {
        await createTag(data);
        onSuccess('Tag criada!');
      }
      closeModal();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  // Delete handlers
  const handleDeletePLC = async (id: number) => {
    if (confirm('Deletar PLC?')) {
      try {
        await deletePLC(id);
        onSuccess('PLC deletado!');
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (confirm('Deletar Tag?')) {
      try {
        await deleteTag(id);
        onSuccess('Tag deletada!');
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const filteredTags = selectedPLC ? tags.filter(t => {
    const plcDevice = t.plc_device;
    return typeof plcDevice === 'object' && plcDevice !== null 
      ? (plcDevice as any).id === selectedPLC
      : plcDevice === selectedPLC;
  }) : tags;

  const getPLCName = (plcDevice: any) => {
    if (typeof plcDevice === 'object' && plcDevice !== null) {
      return plcDevice.name || 'PLC sem nome';
    }
    const plc = plcs.find(p => p.id === plcDevice);
    return plc?.name || 'PLC não encontrado';
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'plcs' ? 'default' : 'secondary'}
            onClick={() => setActiveTab('plcs')}
          >
            <Server className="w-4 h-4 mr-2" />
            PLCs ({plcs.length})
          </Button>
          <Button
            variant={activeTab === 'tags' ? 'default' : 'secondary'}
            onClick={() => setActiveTab('tags')}
          >
            <Tag className="w-4 h-4 mr-2" />
            Tags ({tags.length})
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="secondary" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={() => openModal(activeTab === 'plcs' ? 'plc' : 'tag')}>
            <Plus className="w-4 h-4 mr-2" />
            {activeTab === 'plcs' ? 'Novo PLC' : 'Nova Tag'}
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'plcs' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plcs.map((plc) => (
            <div key={plc.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {plc.active ? (
                    <Power className="w-5 h-5 text-green-500" />
                  ) : (
                    <PowerOff className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-semibold">{plc.name}</h3>
                    <p className="text-sm text-gray-500">{plc.ip_address}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="secondary" onClick={() => openModal('plc', plc)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleDeletePLC(plc.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Rack: {plc.rack} | Slot: {plc.slot}</p>
                <p>Tags: {tags.filter(t => {
                  const plcDevice = t.plc_device;
                  return typeof plcDevice === 'object' && plcDevice !== null 
                    ? (plcDevice as any).id === plc.id
                    : plcDevice === plc.id;
                }).length}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {/* Filter */}
          <div className="mb-4">
            <select
              value={selectedPLC || ''}
              onChange={(e) => setSelectedPLC(e.target.value ? parseInt(e.target.value) : null)}
              className="border rounded px-3 py-2"
            >
              <option value="">Todos os PLCs</option>
              {plcs.map(plc => (
                <option key={plc.id} value={plc.id}>{plc.name}</option>
              ))}
            </select>
          </div>

          {/* Tags Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTags.map((tag) => (
              <div key={tag.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{tag.name}</h3>
                    <p className="text-sm text-gray-500">{getPLCName(tag.plc_device)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="secondary" onClick={() => openModal('tag', tag)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleDeleteTag(tag.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Endereço: <code className="bg-gray-100 px-1 rounded">{tag.address}</code></p>
                  <p>Tipo: {tag.data_type}</p>
                  <p>Valor: {tag.current_value !== null ? String(tag.current_value) : 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingItem ? 'Editar' : 'Novo'} {modalType === 'plc' ? 'PLC' : 'Tag'}
              </h2>
              <Button variant="secondary" size="sm" onClick={closeModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4">
              {modalType === 'plc' ? (
                <form onSubmit={plcForm.handleSubmit(onPLCSubmit)} className="space-y-4">
                  <Input
                    {...plcForm.register('name', { required: 'Nome obrigatório' })}
                    placeholder="Nome do PLC"
                    error={plcForm.formState.errors.name?.message}
                  />
                  <Input
                    {...plcForm.register('ip_address', { required: 'IP obrigatório' })}
                    placeholder="192.168.1.100"
                    error={plcForm.formState.errors.ip_address?.message}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      {...plcForm.register('rack', { valueAsNumber: true })}
                      type="number"
                      placeholder="Rack"
                    />
                    <Input
                      {...plcForm.register('slot', { valueAsNumber: true })}
                      type="number"
                      placeholder="Slot"
                    />
                  </div>
                  <Checkbox
                    {...plcForm.register('active')}
                    label="PLC Ativo"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingItem ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={closeModal}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={tagForm.handleSubmit(onTagSubmit)} className="space-y-4">
                  <Input
                    {...tagForm.register('name', { required: 'Nome obrigatório' })}
                    placeholder="Nome da Tag"
                    error={tagForm.formState.errors.name?.message}
                  />
                  <Input
                    {...tagForm.register('address', { required: 'Endereço obrigatório' })}
                    placeholder="DB1.DBD0"
                    error={tagForm.formState.errors.address?.message}
                  />
                  <select
                    {...tagForm.register('data_type')}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="INT">INT</option>
                    <option value="REAL">REAL</option>
                    <option value="BOOL">BOOL</option>
                    <option value="DINT">DINT</option>
                    <option value="STRING">STRING</option>
                    <option value="ARRAY">ARRAY</option>
                  </select>
                  <select
                    {...tagForm.register('plc_device', { valueAsNumber: true, required: 'PLC obrigatório' })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Selecione um PLC</option>
                    {plcs.map(plc => (
                      <option key={plc.id} value={plc.id}>{plc.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingItem ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={closeModal}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PLCComponent;