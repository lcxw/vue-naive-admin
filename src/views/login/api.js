/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:28:30
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  toggleRole: data => request.post('/auth/role/toggle', data),
  login: data => request.post('/oidc-server/login', data, { needToken: false }),
  getUser: () => request.get('/user/detail'),
  // 获取图像验证码
  getCaptcha: () => request.get('/oidc-server/getCaptcha', { needToken: false }),
  // 获取图片验证码
  getImageCaptcha: () => request.get('/oidc-server/getCaptcha', { needToken: false }),
  // 提交登录表单
  loginSubmitPassword: data => request.post('/oidc-server/login', data, { needToken: false }),
  loginSubmitCaptcha: data => request.post('/oidc-server/login/captcha', data, { needToken: false }),
  // 生成二维码
  generateQrCode: () => request.get('/oidc-server/qrCode/login/generateQrCode', { needToken: false }),

  // 获取二维码信息
  fetchByQrCodeId: qrCodeId =>
    request.get(`/oidc-server/qrCode/login/fetch/${qrCodeId}`, { needToken: false }),

  // 根据手机号获取短信验证码
  getSmsCaptchaByPhone: params => request.get(`/oidc-server/getSmsCaptcha?${params}`, { needToken: false }),
}
