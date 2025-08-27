// API service for Strapi users management
const STRAPI_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:1337' 
  : window.location.origin.includes('ngrok') 
    ? 'https://c009668a8a39.ngrok-free.app'  // Backend ngrok
    : import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

export interface UserRole {
  id: number;
  name: string;
  description?: string;
  type: string;
  displayName?: string;
  permissions?: any[];
  users?: User[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider?: string;
  confirmed: boolean;
  blocked: boolean;
  role?: UserRole;
  createdAt: string;
  updatedAt: string;
}

export const strapiUsersApi = {
  // Get all users
  async getUsers(): Promise<User[]> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${STRAPI_BASE_URL}/api/user-manager/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro ao buscar usuários:', errorData);
        throw new Error(errorData.error?.message || 'Erro ao buscar usuários');
      }

      const data = await response.json();
      return data.users || [];

    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user roles
  async getRoles(): Promise<UserRole[]> {
    try {
      const response = await fetch(`${STRAPI_BASE_URL}/api/user-manager/roles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro ao buscar roles:', errorData);
        throw new Error(errorData.error?.message || 'Erro ao buscar roles');
      }

      const data = await response.json();
      return data.roles || [];

    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  // Create user
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${STRAPI_BASE_URL}/api/user-manager/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao criar usuário');
      }

      const data = await response.json();
      console.log('✅ Usuário criado com sucesso!', data.message);
      return data.user;

    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(userId: number, userData: Partial<User>): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${STRAPI_BASE_URL}/api/user-manager/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao atualizar usuário');
      }

      const data = await response.json();
      console.log('✅ Usuário atualizado com sucesso!', data.message);
      return data.user;

    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(userId: number): Promise<boolean> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${STRAPI_BASE_URL}/api/user-manager/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao deletar usuário');
      }

      const data = await response.json();
      console.log('✅ Usuário deletado com sucesso!', data.message);
      return true;

    } catch (error) {
      console.error('❌ Erro ao deletar usuário:', error);
      throw error;
    }
  },

  // Mock data para desenvolvimento/teste
  getMockUsers(): User[] {
    return [
      {
        id: 1,
        username: 'admin',
        email: 'admin@sistema.com',
        confirmed: true,
        blocked: false,
        role: {
          id: 1,
          name: 'admin',
          displayName: 'Administrador',
          description: 'Acesso total ao sistema',
          type: 'admin',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        username: 'gerente01',
        email: 'gerente@empresa.com',
        confirmed: true,
        blocked: false,
        role: {
          id: 2,
          name: 'gerente',
          displayName: 'Gerente',
          description: 'Gerenciamento operacional',
          type: 'gerente',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z'
      },
      {
        id: 3,
        username: 'operador01',
        email: 'operador1@empresa.com',
        confirmed: true,
        blocked: false,
        role: {
          id: 3,
          name: 'operador',
          displayName: 'Operador',
          description: 'Operação do sistema',
          type: 'operador',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        createdAt: '2024-02-01T00:00:00.000Z',
        updatedAt: '2024-02-01T00:00:00.000Z'
      },
      {
        id: 4,
        username: 'tecnico01',
        email: 'tecnico@empresa.com',
        confirmed: true,
        blocked: false,
        role: {
          id: 4,
          name: 'tecnico',
          displayName: 'Técnico',
          description: 'Suporte técnico',
          type: 'tecnico',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        createdAt: '2024-02-10T00:00:00.000Z',
        updatedAt: '2024-02-10T00:00:00.000Z'
      },
      {
        id: 5,
        username: 'terceirizado01',
        email: 'terceirizado@externa.com',
        confirmed: false,
        blocked: true,
        role: {
          id: 5,
          name: 'terceirizado',
          displayName: 'Terceirizado',
          description: 'Acesso limitado de terceiros',
          type: 'terceirizado',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        createdAt: '2024-02-20T00:00:00.000Z',
        updatedAt: '2024-02-20T00:00:00.000Z'
      }
    ];
  },

  getMockRoles(): UserRole[] {
    return [
      {
        id: 1,
        name: 'admin',
        displayName: 'Administrador',
        description: 'Acesso total ao sistema',
        type: 'admin',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        name: 'superadmin',
        displayName: 'Super Administrador',
        description: 'Acesso máximo com privilégios especiais',
        type: 'superadmin',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 3,
        name: 'gerente',
        displayName: 'Gerente',
        description: 'Gerenciamento operacional',
        type: 'gerente',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 4,
        name: 'operador',
        displayName: 'Operador',
        description: 'Operação do sistema',
        type: 'operador',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 5,
        name: 'tecnico',
        displayName: 'Técnico',
        description: 'Suporte técnico e manutenção',
        type: 'tecnico',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 6,
        name: 'terceirizado',
        displayName: 'Terceirizado',
        description: 'Acesso limitado de terceiros',
        type: 'terceirizado',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ];
  }
};

export type { User, UserRole };