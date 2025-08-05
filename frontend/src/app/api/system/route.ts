// src/app/api/system/route.ts
import { NextRequest } from 'next/server';

const STRAPI_URL = 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${STRAPI_TOKEN}`
};

interface SystemControlData {
  key: string;
  value: boolean;
}

export async function GET() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/system-controls`, { headers });
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Erro ao carregar controles do sistema' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SystemControlData = await request.json();
    const response = await fetch(`${STRAPI_URL}/api/system-controls`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data: body })
    });
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Erro ao criar controle do sistema' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { key, value }: SystemControlData = await request.json();
    
    // Busca o item existente pela key
    const searchResponse = await fetch(`${STRAPI_URL}/api/system-controls?filters[key][$eq]=${key}`, { headers });
    const searchData = await searchResponse.json();
    
    if (searchData.data && searchData.data.length > 0) {
      const id = searchData.data[0].id;
      const response = await fetch(`${STRAPI_URL}/api/system-controls/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ data: { key, value } })
      });
      const data = await response.json();
      return Response.json(data);
    } else {
      // Cria se não existir
      const response = await fetch(`${STRAPI_URL}/api/system-controls`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: { key, value } })
      });
      const data = await response.json();
      return Response.json(data);
    }
  } catch (error) {
    return Response.json({ error: 'Erro ao atualizar controle do sistema' }, { status: 500 });
  }
}