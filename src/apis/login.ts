import { request } from '@utils/request'

interface LoginRequestParams {
  username: string
  password: string
  rememberMe: boolean
}

/**
 * 登入接口
 * @param {LoginRequestParams} requestParams
 * @returns {Promise<ResponseResult<T>>}
 */
export function login<T>(
  requestParams: LoginRequestParams
) {
  const url = `/login`
  return request.post<ResponseResult<T>, ResponseResult<T>>(
    url,
    requestParams
  )
}
