/**
 * user-manager controller - Solução simples para criar usuários
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::user-manager.user-manager', ({ strapi }) => ({
  
  // Lista todos os usuários
  async listUsers(ctx) {
    try {
      const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
        populate: ['role']
      });
      
      ctx.body = { users };
    } catch (error) {
      ctx.throw(500, `Erro ao buscar usuários: ${error.message}`);
    }
  },

  // Lista todas as roles
  async listRoles(ctx) {
    try {
      const roles = await strapi.entityService.findMany('plugin::users-permissions.role');
      ctx.body = { roles };
    } catch (error) {
      ctx.throw(500, `Erro ao buscar roles: ${error.message}`);
    }
  },

  // Criar usuário
  async createUser(ctx) {
    try {
      const { username, email, password, role } = ctx.request.body;

      // Validação básica
      if (!username || !email || !password || !role) {
        return ctx.throw(400, 'Username, email, password e role são obrigatórios');
      }

      // Verificar se usuário já existe
      const existingUser = await strapi.entityService.findMany('plugin::users-permissions.user', {
        filters: {
          $or: [
            { email: email },
            { username: username }
          ]
        }
      });

      if (existingUser && existingUser.length > 0) {
        return ctx.throw(400, 'Usuário com este email ou username já existe');
      }

      // Verificar se a role existe
      const roleExists = await strapi.entityService.findOne('plugin::users-permissions.role', role);
      if (!roleExists) {
        return ctx.throw(400, 'Role inválida');
      }

      // Criar usuário usando o service do users-permissions
      const newUser = await strapi.plugins['users-permissions'].services.user.add({
        username,
        email, 
        password,
        role,
        confirmed: true,
        blocked: false,
        provider: 'local'
      });

      // Buscar usuário com role populada
      const userWithRole = await strapi.entityService.findOne('plugin::users-permissions.user', newUser.id, {
        populate: ['role']
      });

      ctx.body = { user: userWithRole, message: 'Usuário criado com sucesso!' };
      
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      ctx.throw(500, `Erro ao criar usuário: ${error.message}`);
    }
  },

  // Atualizar usuário
  async updateUser(ctx) {
    try {
      const { id } = ctx.params;
      const { username, email, password, role, blocked, confirmed } = ctx.request.body;

      const updateData: any = {
        username,
        email,
        blocked,
        confirmed
      };

      // Se senha foi fornecida, incluir
      if (password && password.trim()) {
        updateData.password = password;
      }

      // Se role foi fornecida, validar e incluir
      if (role) {
        const roleExists = await strapi.entityService.findOne('plugin::users-permissions.role', role);
        if (!roleExists) {
          return ctx.throw(400, 'Role inválida');
        }
        updateData.role = role;
      }

      // Usar o service do users-permissions para atualizar
      const updatedUser = await strapi.plugins['users-permissions'].services.user.edit({ id }, updateData);

      // Buscar usuário com role populada
      const userWithRole = await strapi.entityService.findOne('plugin::users-permissions.user', updatedUser.id, {
        populate: ['role']
      });

      ctx.body = { user: userWithRole, message: 'Usuário atualizado com sucesso!' };
      
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      ctx.throw(500, `Erro ao atualizar usuário: ${error.message}`);
    }
  },

  // Deletar usuário
  async deleteUser(ctx) {
    try {
      const { id } = ctx.params;
      
      await strapi.plugins['users-permissions'].services.user.remove({ id });
      
      ctx.body = { message: 'Usuário deletado com sucesso!' };
      
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      ctx.throw(500, `Erro ao deletar usuário: ${error.message}`);
    }
  }
  
}));