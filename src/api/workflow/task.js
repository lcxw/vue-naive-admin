import { request } from '@/utils'

// 完成任务
export function complete(data) {
  return request({
    url: '/workflow/task/complete',
    method: 'post',
    data,
  })
}

// 委派任务
export function delegate(data) {
  return request({
    url: '/workflow/task/delegate',
    method: 'post',
    data,
  })
}

// 转办任务
export function transfer(data) {
  return request({
    url: '/workflow/task/transfer',
    method: 'post',
    data,
  })
}

// 退回任务
export function returnTask(data) {
  return request({
    url: '/workflow/task/return',
    method: 'post',
    data,
  })
}

// 拒绝任务
export function rejectTask(data) {
  return request({
    url: '/workflow/task/reject',
    method: 'post',
    data,
  })
}

// 签收任务
export function claimTask(data) {
  return request({
    url: '/workflow/task/claim',
    method: 'post',
    data,
  })
}

// 可退回任务列表
export function returnList(data) {
  return request({
    url: '/workflow/task/returnList',
    method: 'post',
    data,
  })
}
