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
    // component: () => import('@/views/login/index.vue'),
    component: () => import('@/views/login/Login2.vue'),
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
    path: '/consent',
    name: 'consent',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/oauth2/consent/Consent.vue'),
  },
  {
    path: '/activate',
    name: 'activate',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/oauth2/device/Activate.vue'),
  },
  {
    path: '/activated',
    name: 'activated',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/oauth2/device/Activated.vue'),
  },
  {
    path: '/PkceRedirect',
    name: 'PkceRedirect',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/oauth2/login/PkceRedirect.vue'),
  },
  {
    path: '/OAuth2Redirect',
    name: 'OAuth2Redirect',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/oauth2/login/OAuthRedirect.vue'),
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
]
