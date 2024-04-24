export const basicRoutes = [
  {
    name: 'oauth2-callback',
    path: '/login/oauth2/callback/:clientId',
    component: () => import('@/views/login/oauth2-callback.vue'),
    meta: {
      title: 'oauth2授权码回调',
      layout: 'empty',
    },
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录页',
      layout: 'empty',
    },
  },

  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
    },
  },

  {
    name: '404',
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      title: '页面飞走了',
      layout: 'empty',
    },
  },

  {
    name: '403',
    path: '/403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      title: '没有权限',
      layout: 'empty',
    },
  },
{
    name: 'role',
    path: '/pms/role',
    component: () => import('@/views/pms/role/index.vue'),
    meta: {
        title: '角色管理',
        layout: 'empty',
    },
},
]
