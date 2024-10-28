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
    // 添加请求头
    config.headers['Authorization'] = `Bearer ${getToken()}`
    return config
  },
  (error) => {}
)

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)
export { request }
