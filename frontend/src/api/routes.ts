// API routes handler for Vite - simulates Next.js API routes
// This file is imported into App.tsx to set up route handlers

import { authApi } from './auth';

// Mock fetch interceptor to handle /api routes
const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input.toString();
  
  // Handle login API route
  if (url === '/api/auth/login' && init?.method === 'POST') {
    try {
      const body = JSON.parse(init.body as string);
      const result = await authApi.login(body);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Login failed' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // For all other requests, use the original fetch
  return originalFetch(input, init);
};

// Export empty object to satisfy import
export {};