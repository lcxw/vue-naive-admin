/**
 * 根据参数name获取地址栏的参数
 * @param name 地址栏参数的key
 * @returns string|null
 */
export function getQueryString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  const searchStr = window.location.search
  const r = searchStr.substring(1).match(reg)

  if (r != null) {
    return decodeURIComponent(r[2])
  }

  return null
}
