import { request } from '@/utils'

// 撤回任务
export function revokeProcess(data) {
  return request({
    url: '/workflow/task/revokeProcess',
    method: 'post',
    data,
  })
}
