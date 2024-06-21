<script setup lang="js">
import { createDiscreteApi } from 'naive-ui'
import { router } from '@/router/index.js'
import { getToken } from '@/views/oauth2/login/index.js'
import { generateCodeVerifier } from '@/utils/oauth2/pkce/index.js'
import { getQueryString } from '@/utils/oauth2/GlobalUtils'

const { message } = createDiscreteApi(['message'])

// 生成state
const state = generateCodeVerifier()

// 获取地址栏授权码
const code = getQueryString('code')
if (code) {
  // 从缓存中获取 codeVerifier
  const state = localStorage.getItem('state')
  // 校验state，防止cors
  const urlState = getQueryString('state')
  if (urlState !== state) {
    message.warning('state校验失败.')
  }
  else {
    // 从缓存中获取 codeVerifier
    getToken({
      grant_type: 'authorization_code',
      client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
      client_secret: import.meta.env.VITE_OAUTH_CLIENT_SECRET,
      redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
      code,
      state,
    })
      .then((res) => {
        localStorage.setItem('accessToken', JSON.stringify(res))
        router.push({ path: '/' })
      })
      .catch((e) => {
        message.warning(`请求token失败：${e.data.error || e.message || e.statusText}`)
      })
  }
}
else {
  // 缓存state
  localStorage.setItem('state', state)
  window.location.href = `${import.meta.env.VITE_OAUTH_ISSUER}/oauth2/authorize?client_id=${
    import.meta.env.VITE_OAUTH_CLIENT_ID
  }&response_type=code&scope=openid%20profile&redirect_uri=${
    import.meta.env.VITE_OAUTH_REDIRECT_URI
  }&state=${state}`
}
</script>

<template>
  加载中...
</template>
