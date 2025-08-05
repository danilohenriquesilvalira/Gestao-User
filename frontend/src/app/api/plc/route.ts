// src/app/api/plc/route.ts - REFATORADO COMPLETO
import { NextRequest } from 'next/server';

const STRAPI_URL = 'http://localhost:1337';

export async function GET() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/plcs?populate=*`);
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Erro ao buscar PLCs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${STRAPI_URL}/api/plcs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: body })
    });
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Erro ao criar PLC' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...body } = await request.json();
    
    const response = await fetch(`${STRAPI_URL}/api/plcs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: body })
    });
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Erro ao atualizar PLC' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await fetch(`${STRAPI_URL}/api/plcs/${id}`, { method: 'DELETE' });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Erro ao deletar PLC' }, { status: 500 });
  }
}