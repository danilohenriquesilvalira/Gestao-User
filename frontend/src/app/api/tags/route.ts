import { NextRequest } from 'next/server';

const STRAPI_URL = 'http://localhost:1337';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const plcId = searchParams.get('plc_id');

    const url = plcId
      ? `${STRAPI_URL}/api/tags?populate[plc_device][fields][0]=id&populate[plc_device][fields][1]=name&filters[plc_device][id][$eq]=${plcId}`
      : `${STRAPI_URL}/api/tags?populate[plc_device][fields][0]=id&populate[plc_device][fields][1]=name`;

    const response = await fetch(url);
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Erro ao buscar tags' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${STRAPI_URL}/api/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: body })
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Erro ao criar tag' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...body } = await request.json();

    const response = await fetch(`${STRAPI_URL}/api/tags/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: body })
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Erro ao atualizar tag' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'ID obrigatório' }, { status: 400 });
    }

    const response = await fetch(`${STRAPI_URL}/api/tags/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Erro ao deletar' }, { status: 500 });
  }
}