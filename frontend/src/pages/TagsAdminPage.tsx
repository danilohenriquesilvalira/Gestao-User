// TagsAdminPage.tsx - Administração de Tags em Tempo Real
import React, { useState, useEffect } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationContainer from '@/components/ui/NotificationContainer';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Activity, 
  Settings, 
  Download, 
  Upload,
  Search,
  Filter,
  BarChart3,
  Zap,
  AlertTriangle,
  CheckCircle,
  Loader
} from 'lucide-react';

interface Tag {
  id?: number;
  name: string;
  value: number;
  type: string;
  offset?: number;
  description: string;
  unit?: string;
  min_value?: number;
  max_value?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface TagStats {
  total_tags: number;
  active_tags: number;
  connected_clients: number;
  last_update: string;
}

export default function TagsAdminPage() {
  const { isAdmin, user } = useAuth();
  
  // Controle de acesso - apenas administrador
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
          <p className="text-gray-300 mb-4">Esta página é restrita apenas para administradores.</p>
          <p className="text-sm text-gray-400">Usuário atual: {user?.name} ({user?.role?.name})</p>
        </div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <TagsAdminContent />
      <NotificationContainer />
    </NotificationProvider>
  );
}

function TagsAdminContent() {
  const [tags, setTags] = useState<Record<string, Tag>>({});
  const [stats, setStats] = useState<TagStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleLogout = () => {
    window.location.replace('/');
  };

  // Carregar tags e estatísticas
  const loadData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Carregar tags
      const tagsResponse = await fetch('http://localhost:1337/api/tags/', { headers });
      if (tagsResponse.ok) {
        const tagsData = await tagsResponse.json();
        setTags(tagsData.data || {});
      }

      // Carregar estatísticas
      const statsResponse = await fetch('http://localhost:1337/api/tags/stats', { headers });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data || null);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar dados' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Recarregar dados a cada 5 segundos
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filtrar tags
  const filteredTags = Object.entries(tags).filter(([name, tag]) => {
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tag.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'active' && tag.is_active) ||
                         (filterType === 'inactive' && !tag.is_active) ||
                         (filterType === tag.type);
    return matchesSearch && matchesFilter;
  });

  // Criar novo tag
  const handleCreateTag = async (tagData: Omit<Tag, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:1337/api/tags/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tagData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Tag criado com sucesso!' });
        setShowCreateModal(false);
        loadData();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erro ao criar tag' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao criar tag' });
    }
  };

  // Atualizar valor do tag
  const handleUpdateValue = async (tagName: string, newValue: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:1337/api/tags/${tagName}/value`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: newValue })
      });

      if (response.ok) {
        // Atualizar localmente
        setTags(prev => ({
          ...prev,
          [tagName]: { ...prev[tagName], value: newValue }
        }));
      }
    } catch (error) {
      console.error('Erro ao atualizar valor:', error);
    }
  };

  // Deletar tag
  const handleDeleteTag = async (tagName: string) => {
    if (!confirm(`Tem certeza que deseja deletar o tag "${tagName}"?`)) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:1337/api/tags/${tagName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Tag deletado com sucesso!' });
        loadData();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao deletar tag' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ModernSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ModernHeader title="Administração de Tags" onLogout={handleLogout} />
        
        <main className="flex-1 overflow-hidden">
          <div className="w-full h-full pl-4 pr-4 py-4 md:pl-24">
            <div className="w-full h-full bg-white rounded-2xl shadow-lg p-6 overflow-auto">
              
              {/* Mensagem de Feedback */}
              {message && (
                <div className={`flex items-center gap-3 p-4 rounded-lg border mb-6 ${
                  message.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <span>{message.text}</span>
                  <button 
                    onClick={() => setMessage(null)}
                    className="ml-auto text-sm opacity-70 hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Header com Estatísticas */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Total Tags</p>
                        <p className="text-2xl font-bold">{stats?.total_tags || 0}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Tags Ativos</p>
                        <p className="text-2xl font-bold">{stats?.active_tags || 0}</p>
                      </div>
                      <Activity className="w-8 h-8 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Clientes WebSocket</p>
                        <p className="text-2xl font-bold">{stats?.connected_clients || 0}</p>
                      </div>
                      <Zap className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Última Atualização</p>
                        <p className="text-sm font-medium">
                          {stats?.last_update ? new Date(stats.last_update).toLocaleTimeString('pt-BR') : 'N/A'}
                        </p>
                      </div>
                      <Settings className="w-8 h-8 text-orange-200" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Controles */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                    <option value="real">Real</option>
                    <option value="bool">Bool</option>
                    <option value="int">Int</option>
                    <option value="string">String</option>
                  </select>

                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Tag
                  </button>
                </div>
              </div>

              {/* Lista de Tags */}
              <div className="space-y-3">
                {filteredTags.map(([name, tag]) => (
                  <TagCard 
                    key={name}
                    name={name}
                    tag={tag}
                    onUpdateValue={handleUpdateValue}
                    onEdit={setEditingTag}
                    onDelete={handleDeleteTag}
                  />
                ))}

                {filteredTags.length === 0 && (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum tag encontrado</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Modal de Criação */}
      {showCreateModal && (
        <CreateTagModal 
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTag}
        />
      )}
    </div>
  );
}

// Componente TagCard
interface TagCardProps {
  name: string;
  tag: Tag;
  onUpdateValue: (name: string, value: number) => void;
  onEdit: (tag: Tag) => void;
  onDelete: (name: string) => void;
}

function TagCard({ name, tag, onUpdateValue, onEdit, onDelete }: TagCardProps) {
  const [editingValue, setEditingValue] = useState<number | null>(null);

  const handleValueSubmit = () => {
    if (editingValue !== null) {
      onUpdateValue(name, editingValue);
      setEditingValue(null);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'real': return 'bg-blue-100 text-blue-800';
      case 'bool': return 'bg-green-100 text-green-800';
      case 'int': return 'bg-purple-100 text-purple-800';
      case 'string': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`p-4 border rounded-lg transition-all ${
      tag.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(tag.type)}`}>
              {tag.type}
            </span>
            {!tag.is_active && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Inativo
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{tag.description}</p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Valor:</span>
              {editingValue !== null ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={editingValue}
                    onChange={(e) => setEditingValue(parseFloat(e.target.value))}
                    className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                    onKeyPress={(e) => e.key === 'Enter' && handleValueSubmit()}
                  />
                  <button
                    onClick={handleValueSubmit}
                    className="text-green-600 hover:text-green-700"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditingValue(null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span 
                  className="font-mono text-sm bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => setEditingValue(tag.value)}
                >
                  {tag.value} {tag.unit}
                </span>
              )}
            </div>
            
            {(tag.min_value !== undefined || tag.max_value !== undefined) && (
              <div className="text-xs text-gray-500">
                Range: {tag.min_value || '-∞'} → {tag.max_value || '+∞'}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit({ ...tag, name })}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(name)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal de Criação
interface CreateTagModalProps {
  onClose: () => void;
  onCreate: (tag: Omit<Tag, 'id' | 'created_at' | 'updated_at'>) => void;
}

function CreateTagModal({ onClose, onCreate }: CreateTagModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'real',
    description: '',
    unit: '',
    min_value: '',
    max_value: '',
    offset: '',
    is_active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagData = {
      name: formData.name,
      value: 0,
      type: formData.type,
      description: formData.description,
      unit: formData.unit || undefined,
      min_value: formData.min_value ? parseFloat(formData.min_value) : undefined,
      max_value: formData.max_value ? parseFloat(formData.max_value) : undefined,
      offset: formData.offset ? parseFloat(formData.offset) : 0,
      is_active: formData.is_active
    };

    onCreate(tagData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Criar Novo Tag</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ex: nivel_caldeira"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="real">Real (Float)</option>
              <option value="bool">Bool</option>
              <option value="int">Int</option>
              <option value="string">String</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição *</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ex: Nível da caldeira principal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Unidade</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="%, °C, bar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Offset PLC</label>
              <input
                type="number"
                step="0.1"
                value={formData.offset}
                onChange={(e) => setFormData(prev => ({ ...prev, offset: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Valor Mínimo</label>
              <input
                type="number"
                step="0.01"
                value={formData.min_value}
                onChange={(e) => setFormData(prev => ({ ...prev, min_value: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valor Máximo</label>
              <input
                type="number"
                step="0.01"
                value={formData.max_value}
                onChange={(e) => setFormData(prev => ({ ...prev, max_value: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="is_active" className="text-sm">Tag ativo</label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Criar Tag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}