/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:27
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  create: data => request.post('/oidc-server/system/role/add', data),
  read: (params = {}) => request.get('/oidc-server/role/page', { params }),
  update: data => request.patch(`/role/${data.id}`, data),
  delete: id => request.delete(`/role/${id}`),

  getAllPermissionTree: () => request.get('/oidc-server/permission/permissionTree'),
  getAllUsers: (params = {}) => request.post('/oidc-server/users', { params }),
  addRoleUsers: (roleId, data) => request.patch(`/role/users/add/${roleId}`, data),
  removeRoleUsers: (roleId, data) => request.patch(`/role/users/remove/${roleId}`, data),
}
