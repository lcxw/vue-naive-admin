/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  create: data => request.post('/flowable-server/system/user/add', data),
  // read: (params = {}) => request.get('/flowable-server/workflow/deploy/list', params),
  read: (params = {}) => request.get('/flowable-server/workflow/process/todoList?pageNo=1&pageSize=10&page=1&limit=10&enable=1&pageNum=1', params),
  update: data => request.patch(`/user/${data.id}`, data),
  delete: id => request.delete(`/user/${id}`),
  resetPwd: (id, data) => request.patch(`/user/password/reset/${id}`, data),

  getAllRoles: () =>
    request.get('/oidc-server/role/page?pageNo=1&pageSize=10&page=1&limit=10&enable=1'),
}
