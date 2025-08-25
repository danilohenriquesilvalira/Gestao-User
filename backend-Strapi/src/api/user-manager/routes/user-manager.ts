/**
 * user-manager router - Rotas simples para gerenciar usuários
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/user-manager/users',
      handler: 'user-manager.listUsers',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/user-manager/roles',
      handler: 'user-manager.listRoles',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/user-manager/create',
      handler: 'user-manager.createUser',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/user-manager/update/:id',
      handler: 'user-manager.updateUser',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/user-manager/delete/:id',
      handler: 'user-manager.deleteUser',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};