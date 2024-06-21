import { cloneDeep } from 'lodash-es'
import api from '@/api'
import { basePermissions } from '@/settings'

export async function getUserInfo() {
  const res = await api.getUser()
  const { id, username, profile } = res.data || {}
  const rolesList = [
    {
      id: 1,
      code: 'SUPER_ADMIN',
      name: '超级管理员',
      enable: true,
    },
    {
      id: 2,
      code: 'ROLE_QA',
      name: '质检员',
      enable: true,
    },
  ]
  const currentRoleInUse = {
    id: 1,
    code: 'SUPER_ADMIN',
    name: '超级管理员',
    enable: true,
  }
  return {
    id,
    username,
    avatar: profile?.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
    nickName: profile?.nickName,
    gender: profile?.gender,
    address: profile?.address,
    email: profile?.email,
    roles: rolesList,
    currentRole: currentRoleInUse,
  }
}

export async function getPermissions() {
  let asyncPermissions = []
  try {
    const res = await api.getRolePermissions()
    asyncPermissions = res?.data || []
  }
  catch (error) {
    console.error(error)
  }
  return cloneDeep(basePermissions).concat(asyncPermissions)
}
