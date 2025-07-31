// src/middlewares/auditoria.ts
export default (config: any, { strapi }: { strapi: any }) => {
  return async (ctx: any, next: any) => {
    await next();
    
    // Capturar dados da requisição
    const usuario = ctx.state.user;
    const ip = ctx.request.ip;
    const userAgent = ctx.request.header['user-agent'];
    const metodo = ctx.method;
    const url = ctx.request.url;
    
    // Registrar auditoria apenas para operações importantes
    if (usuario && ['POST', 'PUT', 'DELETE'].includes(metodo)) {
      try {
        const acao = getAcao(metodo);
        const recurso = extrairRecurso(url);
        
        await strapi.entityService.create('api::auditoria.auditoria', {
          data: {
            usuario: usuario.id,
            acao,
            recurso,
            recurso_id: ctx.params.id || null,
            ip_address: ip,
            user_agent: userAgent,
            status: ctx.status >= 200 && ctx.status < 300 ? 'SUCCESS' : 'FAILED',
            publishedAt: new Date()
          }
        });
      } catch (error) {
        console.error('Erro ao registrar auditoria:', error);
      }
    }
  };
};

function getAcao(metodo: string): string {
  switch (metodo) {
    case 'POST': return 'CREATE';
    case 'PUT': return 'UPDATE';
    case 'DELETE': return 'DELETE';
    default: return 'READ';
  }
}

function extrairRecurso(url: string): string {
  const partes = url.split('/');
  return partes[2] || 'unknown';
}