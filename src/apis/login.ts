import { request } from '@utils/request'

interface LoginRequestParams {
  name: string
  password: string
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
