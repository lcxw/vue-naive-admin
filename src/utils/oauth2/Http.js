// index.ts
import axios from 'axios'

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  // axios 实例
  instance
  // 基础配置，url和超时时间
  baseConfig = {}

  constructor(config) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config))

    this.instance.interceptors.request.use(
      (config) => {
        // 一般会请求拦截里面加token，用于后端的验证
        const token = localStorage.getItem('accessToken')
        if (token && config.url !== '/oauth2/token') {
          config.headers.Authorization = `${token.token_type} ${token.access_token}`
        }

        return config
      },
      (err) => {
        // 请求错误，这里可以用全局提示框进行提示
        return Promise.reject(err)
      },
    )

    this.instance.interceptors.response.use(
      (res) => {
        // 直接返回res，当然你也可以只返回res.data
        // 系统如果有自定义code也可以在这里处理
        return res.data
      },
      (err) => {
        if (err.code === 'ERR_NETWORK') {
          return Promise.reject(err)
        }
        // 这里用来处理http常见错误，进行全局提示
        let messageText = ''
        switch (err.response.status) {
          case 400:
            messageText = '请求参数错误(400)'
            break
          case 401:
            messageText = '未授权，请重新登录(401)'
            // 这里可以做清空storage并跳转到登录页的操作
            break
          case 403:
            messageText = '拒绝访问(403)'
            break
          case 404:
            messageText = '请求路径出错(404)'
            break
          case 408:
            messageText = '请求超时(408)'
            break
          case 500:
            messageText = '服务器错误(500)'
            break
          case 501:
            messageText = '服务未实现(501)'
            break
          case 502:
            messageText = '网络错误(502)'
            break
          case 503:
            messageText = '服务不可用(503)'
            break
          case 504:
            messageText = '网络超时(504)'
            break
          case 505:
            messageText = 'HTTP版本不受支持(505)'
            break
          default:
            messageText = `连接出错(${err.response.status})!`
        }
        err.response.statusText = messageText
        // 这里错误消息可以使用全局弹框展示出来
        // 比如element plus 可以使用 ElMessage
        // ElMessage({
        //   showClose: true,
        //   message: `${message}，请检查网络或联系管理员！`,
        //   type: "error",
        // });
        // 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可
        return Promise.reject(err.response)
      },
    )
  }

  // 定义请求方法
  request(config) {
    return this.instance.request(config)
  }

  get(config) {
    return this.request({ ...config, method: 'GET' })
  }

  post(config) {
    return this.request({ ...config, method: 'POST' })
  }

  delete(config) {
    return this.request({ ...config, method: 'DELETE' })
  }

  put(config) {
    return this.request({ ...config, method: 'put' })
  }

  patch(config) {
    return this.request({ ...config, method: 'PATCH' })
  }
}

// 默认导出Request实例
export default Request
