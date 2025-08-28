// API service for Strapi component layout management

const STRAPI_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:1337' 
  : window.location.origin.includes('ngrok') 
    ? 'https://c009668a8a39.ngrok-free.app'  // Backend ngrok
    : import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

interface ComponentLayout {
  componentId: string;
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl';
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
  zIndex?: number;
  opacity?: number;
  rotation?: number;
}

interface StrapiComponentLayout extends ComponentLayout {
  id?: number;
  documentId?: string;
}

export const strapiApi = {
  // Get component layouts
  async getComponentLayouts(componentId?: string, breakpoint?: string): Promise<StrapiComponentLayout[]> {
    try {
      let url = `${STRAPI_BASE_URL}/api/component-layouts`;
      const params = new URLSearchParams();
      
      if (componentId) {
        params.append('filters[componentId][$eq]', componentId);
      }
      
      if (breakpoint) {
        params.append('filters[breakpoint][$eq]', breakpoint);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch component layouts: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data?.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        ...item.attributes
      })) || [];

    } catch (error) {
      console.error('Error fetching component layouts:', error);
      return [];
    }
  },

  // Create component layout
  async createComponentLayout(layout: ComponentLayout): Promise<StrapiComponentLayout | null> {
    try {
      const response = await fetch(`${STRAPI_BASE_URL}/api/component-layouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: layout
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create component layout: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        id: data.data.id,
        documentId: data.data.documentId,
        ...data.data.attributes
      };

    } catch (error) {
      console.error('Error creating component layout:', error);
      return null;
    }
  },

  // Update component layout
  async updateComponentLayout(documentId: string, layout: Partial<ComponentLayout>): Promise<StrapiComponentLayout | null> {
    try {
      const response = await fetch(`${STRAPI_BASE_URL}/api/component-layouts/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: layout
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update component layout: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        id: data.data.id,
        documentId: data.data.documentId,
        ...data.data.attributes
      };

    } catch (error) {
      console.error('Error updating component layout:', error);
      return null;
    }
  },

  // Delete component layout
  async deleteComponentLayout(documentId: string): Promise<boolean> {
    try {
      const response = await fetch(`${STRAPI_BASE_URL}/api/component-layouts/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.ok;

    } catch (error) {
      console.error('Error deleting component layout:', error);
      return false;
    }
  }
};

export type { ComponentLayout, StrapiComponentLayout };
