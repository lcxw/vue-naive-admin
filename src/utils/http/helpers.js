/**********************************
 * @FilePath: helpers.js
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:46:22
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { AxiosHeaders as Buffer } from 'axios'
import { useAuthStore } from '@/store'
import api from '@/api'

let isConfirming = false

export function resolveResError(code, message) {
  switch (code) {
    case 401: {
      const userStore = useAuthStore()
      const refreshToken = userStore.refreshToken
      if (refreshToken) {
        const formData = new FormData()
        // formData.append('client_id', 'ff9685b0-ac9b-4188-835d-1b8ced815acb')
        formData.append('grant_type', 'refresh_token')
        // formData.append('client_secret', 'vueClient')
        formData.append('refresh_token', refreshToken)
        const token = `BASIC vueClient:vueClient`
        const encodedToken = Buffer.from(token).toString('base64')
        const refreshTokenResponse = api
          .refreshToken(formData, {
            headers: {
              Authorization: encodedToken,
            },
            // auth: {
            //   username: 'ff9685b0-ac9b-4188-835d-1b8ced815acb',
            //   password: 'vueClient'
            // }
          })
          .then((res) => {
            console.log(refreshTokenResponse, res)
          })
          .catch((error) => {
            console.error(error)
            userStore.setToken({ accessToken: null, refreshToken: null, idToken: null })
          })
        userStore.setToken({
          accessToken: refreshTokenResponse.access_token,
          refreshToken: refreshTokenResponse.refresh_token,
          idToken: refreshTokenResponse.id_token,
        })
      }
      else {
        if (isConfirming)
          return
        isConfirming = true
        $dialog.confirm({
          title: '提示',
          type: 'info',
          content: '登录已过期，是否重新登录？',
          confirm() {
            useAuthStore().logout()
            window.$message?.success('已退出登录')
            isConfirming = false
          },
          cancel() {
            isConfirming = false
          },
        })
        return false
      }
    }
    case 11007:
    case 11008: {
      if (isConfirming)
        return
      isConfirming = true
      $dialog.confirm({
        title: '提示',
        type: 'info',
        content: `${message}，是否重新登录？`,
        confirm() {
          useAuthStore().logout()
          window.$message?.success('已退出登录')
          isConfirming = false
        },
        cancel() {
          isConfirming = false
        },
      })
      return false
    }
    case 403:
      message = '请求被拒绝'
      break
    case 404:
      message = '请求资源或接口不存在'
      break
    case 500:
      message = '服务器发生异常'
      break
    default:
      message = message ?? `【${code}】: 未知异常!`
      break
  }
  return message
}
