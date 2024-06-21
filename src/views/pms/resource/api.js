/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2024/04/01 15:52:04
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import axios from 'axios'
import { request } from '@/utils'

export default {
  getMenuTree: () => request.get('/oidc-server/permission/permissionTree'),
  getButtons: ({ parentId }) => request.get(`/oidc-server/permission/${parentId}`),
  getComponents: () => axios.get(`${import.meta.env.VITE_PUBLIC_PATH}components.json`),
  addPermission: data => request.post('/oidc-server/permission/add', data),
  savePermission: (id, data) => request.patch(`/permission/${id}`, data),
  deletePermission: id => request.post(`/oidc-server/permission/delete/${id}`),
}
