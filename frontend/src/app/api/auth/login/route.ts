import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();
    
    console.log('Tentando login com:', identifier);
    
    // Fazer login no Strapi
    const strapiResponse = await fetch('http://localhost:1337/api/auth/local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: identifier,
        password: password
      })
    });

    const strapiData = await strapiResponse.json();
    
    console.log('Resposta do Strapi:', strapiData);

    if (strapiResponse.ok) {
      // Login bem-sucedido
      return NextResponse.json({
        jwt: strapiData.jwt,
        user: {
          id: strapiData.user.id,
          username: strapiData.user.username,
          email: strapiData.user.email,
          role: strapiData.user.role
        }
      });
    } else {
      // Login falhou
      console.error('Erro de login:', strapiData);
      return NextResponse.json(
        { error: 'Credenciais inválidas', details: strapiData }, 
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error }, 
      { status: 500 }
    );
  }
}