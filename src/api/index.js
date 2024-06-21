/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:50:38
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  // 获取用户信息
  getUser: () => request.get('/oidc-server/user/info'),
  // 获取token
  getToken: data =>
    request.post('/oidc-server/oauth2/token', data, {
      noNeedToken: true,
      noNeedTip: true,
      headers: {
        Authorization: `Basic dnVlQ2xpZW50OnZ1ZUNsaWVudA==`,
      },
    }),
  // 刷新token
  refreshToken: data =>
    request.post('/oidc-server/oauth2/token', data, {
      noNeedToken: true,
      noNeedTip: false,
      headers: {
        Authorization: `Basic dnVlQ2xpZW50OnZ1ZUNsaWVudA==`,
      },
    }),
  // 登出
  logout: () => request.post('/flowable-server/auth/logout'),
  // 切换当前角色
  switchCurrentRole: role => request.post(`/auth/current-role/switch/${role}`),
  // 获取角色权限
  getRolePermissions: () => request.get('/oidc-server/permission/permissionTree'),
  // 验证菜单路径
  validateMenuPath: path => request.get(`/permission/menu/validate?path=${path}`),
}
