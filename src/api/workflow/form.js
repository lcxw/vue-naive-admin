import { request } from '@/utils'

// 查询流程表单列表
export function listForm(query) {
  return request({
    url: '/workflow/form/list',
    method: 'get',
    params: query,
  })
}

// 查询流程表单详细
export function getForm(formId) {
  return request({
    url: `/workflow/form/${formId}`,
    method: 'get',
  })
}

// 新增流程表单
export function addForm(data) {
  return request({
    url: '/workflow/form',
    method: 'post',
    data,
  })
}

// 修改流程表单
export function updateForm(data) {
  return request({
    url: '/workflow/form',
    method: 'put',
    data,
  })
}
// 挂载表单
export function addDeployForm(data) {
  return request({
    url: '/workflow/form/addDeployForm',
    method: 'post',
    data,
  })
}

// 删除流程表单
export function delForm(formId) {
  return request({
    url: `/workflow/form/${formId}`,
    method: 'delete',
  })
}
