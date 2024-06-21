<script setup>
import { useRoute, useRouter } from 'vue-router'
import { AxiosHeaders as Buffer } from 'axios'
import api from '@/api'
import { useAuthStore } from '@/store/index.js'

onMounted(async () => {
  await handleCodeToToken()
})
async function handleCodeToToken() {
  const authStore = useAuthStore()

  const route = useRoute()
  const router = useRouter()
  console.log(route.path)
  console.log(route.hash)
  console.log(route.query)
  const clientId = route.params.clientId
  const authorizationCode = route.query.code
  const state = route.query.state
  console.log(clientId)
  console.log(authorizationCode)
  console.log(state)

  const formData = new FormData()
  // formData.append('client_id', 'vueClient')
  formData.append('code', authorizationCode)
  formData.append('grant_type', 'authorization_code')
  // formData.append('client_secret', 'vueClient')
  formData.append('redirect_uri', 'http://localhost:3200/login/oauth2/callback/vueClient')
  formData.append('state', state)

  const formObject = {
    'client-id': 'vueClient',
    'code': authorizationCode,
    'grant_type': 'authorization_code',
    'client_secret': clientId,
    'redirect_uri': 'http://localhost:3200/login/oauth2/callback/vueClient',
    'state': state,
  }
  const token = `BASIC vueClient:vueClient`
  const encodedToken = Buffer.from(token).toString('base64')
  const res = await api.getToken(formData)
  console.log(res)
  authStore.setToken({
    accessToken: res.access_token,
    refreshToken: res.refresh_token,
    idToken: res.id_token,
  })
  $message.loading('登录中...', { key: 'login' })
  try {
    $message.success('登录成功', { key: 'login' })
    if (route.query.redirect) {
      const path = route.query.redirect
      delete route.query.redirect
      router.replace({ path, query: route.query })
    }
    else {
      router.push({ path: '/' })
      // router.replace({ name: 'Home', params: { username: 'eduardo' } })
    }
  }
  catch (error) {
    console.error(error)
    $message.destroy('login')
  }
}
</script>

<template>
  <CommonPage show-footer>
    <div>Login success</div>
  </CommonPage>
</template>

<style scoped></style>
