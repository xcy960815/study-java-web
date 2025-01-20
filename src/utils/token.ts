const TOKENNAME = 'BearToken'
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL
/**
 * 获取请求头的token
 * @returns {Promise<string | null>}
 */
export const getToken = async () => {
  const tokenOption = await cookieStore.get(TOKENNAME)
  return tokenOption?.value
}

/**
 * 设置请求头的token
 * @param token {String}
 * @returns
 */
export const setToken = (token: string) => {
  return cookieStore.set({
    name: TOKENNAME,
    value: token,
    path: VITE_BASE_URL
  })
}

/**
 * 删除请求头的token
 * @returns {Promise<void>}
 */
export const removeToken = async () => {
  return await cookieStore.delete({
    name: TOKENNAME,
    path: VITE_BASE_URL
  })
}
