// API service for authentication with Strapi

const STRAPI_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:1337' 
  : import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

interface LoginCredentials {
  identifier: string;
  password: string;
}

interface LoginResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: any;
  };
}

interface ApiError {
  error: string;
  details?: any;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('Tentando login com:', credentials.identifier);
      
      // Fazer login diretamente no Strapi
      const strapiResponse = await fetch(`${STRAPI_BASE_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: credentials.identifier,
          password: credentials.password
        })
      });

      const strapiData = await strapiResponse.json();
      
      console.log('Resposta do Strapi:', strapiData);

      if (strapiResponse.ok) {
        // Login bem-sucedido
        return {
          jwt: strapiData.jwt,
          user: {
            id: strapiData.user.id,
            username: strapiData.user.username,
            email: strapiData.user.email,
            role: strapiData.user.role
          }
        };
      } else {
        // Login falhou
        console.error('Erro de login:', strapiData);
        throw new Error('Credenciais inválidas');
      }
      
    } catch (error) {
      console.error('Erro interno:', error);
      throw new Error('Erro interno do servidor');
    }
  }
};

// Utility functions for token management
export const tokenStorage = {
  set(token: string) {
    localStorage.setItem('auth_token', token);
  },
  
  get(): string | null {
    return localStorage.getItem('auth_token');
  },
  
  remove() {
    localStorage.removeItem('auth_token');
  },
  
  isValid(): boolean {
    const token = this.get();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }
};