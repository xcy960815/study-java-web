import { request } from '@utils/request'

export interface LoginRequestParams {
  username: string
  password: string
  rememberMe: boolean
}

interface LoginResponse {
  address: string
  createTime: string
  id: number
  introduceSign: string
  loginName: string
  nickName: string
  token: string
}

/**
 * 登入接口
 * @param {LoginRequestParams} requestParams
 * @returns {Promise<ResponseResult<T>>}
 */
export function login<T extends LoginResponse>(
  requestParams: LoginRequestParams
) {
  const url = `/login`
  return request.post<ResponseResult<T>, ResponseResult<T>>(
    url,
    requestParams
  )
}
