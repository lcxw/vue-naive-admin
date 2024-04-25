/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:27
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  create: (data) => request.post('/oidc-server/system/client/add', data),
  read: (params = {}) => request.get('/oidc-server/system/client/data', { params }),
  update: (data) => request.patch(`/oidc-server/system/client/edit/${data.id}`, data),
  delete: (id) => request.delete(`/oidc-server/system/client/remove/${id}`),
  getDetails: (id) => request.get(`/oidc-server/client/details/${id}`),
}
