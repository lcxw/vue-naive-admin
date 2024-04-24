<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:50:42
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div class="flex cursor-pointer items-center">
      <n-avatar round :size="36" :src="userStore.avatar" />
      <div v-if="userStore.userInfo" class="ml-12 flex-col flex-shrink-0 items-center">
        <span class="text-14">{{ userStore.nickName ?? userStore.username }}</span>
        <span class="text-12 opacity-50">[{{ userStore.currentRole?.name }}]</span>
      </div>
    </div>
  </n-dropdown>

  <RoleSelect ref="roleSelectRef" />
</template>

<script setup>
import { useUserStore, useAuthStore, usePermissionStore } from '@/store'
import { RoleSelect } from '@/layouts/components'
import { initUserAndPermissions } from '@/router'
import api from '@/api'
import { AxiosHeaders as Buffer } from 'axios'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const permissionStore = usePermissionStore()

const options = reactive([
  {
    label: '个人资料',
    key: 'profile',
    icon: () => h('i', { class: 'i-material-symbols:person-outline text-14' }),
    show: computed(() => permissionStore.accessRoutes?.some((item) => item.path === '/profile')),
  },
  {
    label: '切换角色',
    key: 'toggleRole',
    icon: () => h('i', { class: 'i-basil:exchange-solid text-14' }),
    show: computed(() => userStore.roles.length > 1),
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h('i', { class: 'i-mdi:exit-to-app text-14' }),
  },
  {
    label: '刷新状态',
    key: 'refresh',
    icon: () => h('i', { class: 'i-mdi:exit-to-app text-14' })
  }
])

const roleSelectRef = ref(null)
function handleSelect(key) {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'toggleRole':
      roleSelectRef.value?.open({
        onOk() {
          initUserAndPermissions().then(() => {
            router.replace('/')
          })
        }
      })
      break
    case 'logout':
      $dialog.confirm({
        title: '提示',
        type: 'info',
        content: '确认退出？',
        async confirm() {
          try {
            await api.logout()
          } catch (error) {
            console.error(error)
          }
          authStore.logout()
          $message.success('已退出登录')
        }
      })
      break
    case 'refresh':
      let refreshToken = authStore.refreshToken
      if (refreshToken) {
        let formData = new FormData()
        // formData.append('client_id', 'ff9685b0-ac9b-4188-835d-1b8ced815acb')
        formData.append('grant_type', 'refresh_token')
        // formData.append('client_secret', 'vueClient')
        formData.append('refresh_token', refreshToken)
        const token = `BASIC vueClient:vueClient`
        const encodedToken = Buffer.from(token).toString('base64')
        btoa("xxxx" + ":" + "xxxx");
        let refreshTokenResponse = api.refreshToken(formData, {
          headers: {
            'Authorization': encodedToken
          }
          // auth: {
          //   username: 'ff9685b0-ac9b-4188-835d-1b8ced815acb',
          //   password: 'vueClient'
          // }
        }).then(res => {
          console.log(res)
          authStore.setToken({
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
            idToken: res.id_token
          })
        })
          .catch(error => {
            console.error(error)
            authStore.setToken({ accessToken: null, refreshToken: null, idToken: null })
          })
      }else {
        console.debug("no refresh token found")
        authStore.$reset()
      }
      break
  }
}
</script>
