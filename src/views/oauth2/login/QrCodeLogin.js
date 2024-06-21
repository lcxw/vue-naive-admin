import loginRequest from '@/utils/oauth2/LoginRequest.js'

/**
 * 生成二维码
 */
export function generateQrCode() {
  return loginRequest.get({
    url: '/qrCode/login/generateQrCode',
  })
}

/**
 * 获取二维码信息
 * @param qrCodeId 二维码id
 */
export function fetch(qrCodeId) {
  return loginRequest.get ({
    url: `/qrCode/login/fetch/${qrCodeId}`,
  })
}
