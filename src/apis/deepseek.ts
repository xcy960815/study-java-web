import { request } from '@utils/request'

/**
 * 获取模型列表
 * @returns
 */
export const getModels = <T extends DeepSeekVo.Models>() => {
  return request.get<ResponseResult<T>, ResponseResult<T>>('/deepseek/models')
}

/**
 * 获取余额
 * @returns
 */
export const getBalance = <T extends DeepSeekVo.Balance>() => {
  return request.get<ResponseResult<T>, ResponseResult<T>>('/deepseek/balance')
}
