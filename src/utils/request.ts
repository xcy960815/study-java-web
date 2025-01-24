import axios from 'axios'
import { ElMessage } from 'element-plus'
import { eventEmitter } from './event-emits'
import { getToken, removeToken } from './token'
const baseUrl = import.meta.env.VITE_API_DOMAIN_PREFIX

axios.defaults.withCredentials = false
const request = axios.create({
  baseURL: baseUrl,
  timeout: 1000
})

request.interceptors.request.use(
  async (config) => {
    const token = await getToken()
    if (!config.url?.includes('/login')) {
      // 添加请求头
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    const { message } = error
    ElMessage.error(message)
  }
)
/**
 * 响应拦截器
 */
request.interceptors.response.use(
  async (response) => {
    const responseData = response.data
    if (responseData.code === 401) {
      await removeToken()
      eventEmitter.emit('token-invalid')
      ElMessage({
        type: 'error',
        message: responseData.message
      })

      return Promise.reject(responseData)
    } else if (responseData.code == 500) {
      ElMessage({
        type: 'error',
        message: responseData.message
      })
      return Promise.reject(responseData)
    } else {
      return Promise.resolve(responseData)
    }
  },
  (error) => {
    const { message } = error

    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export { request }
