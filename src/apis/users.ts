import { request } from "@utils/request"
import type { ResponseResult } from "@utils/request"
import type { User } from "../App.vue"
interface GetUserListParams {
    pageSize: number
    pageNum: number
}
/**
 * 获取用户列表请求参数类型
 * @param queryFormData 
 * @returns {Promise<ResponseResult<T>>}
 */
export const getUserList = <T = any>(queryFormData: GetUserListParams): Promise<ResponseResult<T>> => {
    const { pageSize, pageNum, ...otherQueryFormData } = queryFormData
    const url = `/user/getUserList?pageSize=${pageSize}&pageNum=${pageNum}`
    return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
        params: otherQueryFormData
    })
}

/**
 * 更新用户请求参数类型
 * @param params 
 * @returns {Promise<ResponseResult<T>>}
 */
export const updateUser = <T = any>(params: Partial<User>): Promise<ResponseResult<T>> => {
    const url = `/user/updateUser`
    return request.post<ResponseResult<T>, ResponseResult<T>>(url, params)
}

export const insertUser = <T = any>(params: Partial<User>): Promise<ResponseResult<T>> => {
    const url = `/user/insertUser`
    return request.post<ResponseResult<T>, ResponseResult<T>>(url, params)
}

export const deleteUser = <T = any>(params: Partial<User>): Promise<ResponseResult<T>> => {
    const url = `/user/deleteUser`
    return request.delete<ResponseResult<T>, ResponseResult<T>>(url, {
        data: params
    })
}