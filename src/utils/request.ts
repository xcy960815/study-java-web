import axios from 'axios'
const baseUrl = import.meta.env.VITE_API_DOMAIN_PREFIX

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
    console.log('response', response)

    if (responseData.code !== 200) {
      return Promise.reject(responseData)
    }

    return responseData
  },
  (error) => {
    return Promise.reject(error)
  }
)
export { request }
