import axios from 'axios'
import { useRouter } from 'vue-router'
import { eventEmitter } from './event-emits'
const baseUrl = import.meta.env.VITE_API_DOMAIN_PREFIX
const router = useRouter()
const getToken = (): string => {
  const token = localStorage.getItem('token') || ''
  return token
}
const request = axios.create({
  baseURL: baseUrl,
  timeout: 1000
})

request.interceptors.request.use(
  (config) => {
    if (!config.url?.includes('/login')) {
      // 添加请求头
      config.headers[
        'Authorization'
      ] = `Bearer ${getToken()}`
    }

    return config
  },
  (error) => {}
)
/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response) => {
    const responseData = response.data
    if (responseData.code == 401) {
      console.log('request 登录失效')

      eventEmitter.emit('token-invalid')
      return Promise.reject(responseData)
    }

    return responseData
  },
  (error) => {
    return Promise.reject(error)
  }
)
export { request }
