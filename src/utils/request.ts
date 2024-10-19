
import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_DOMAIN_PREFIX;

export type ResponseResult<T = any> = {
    code:number
    data:T
    message:string
}
const request = axios.create({
    baseURL: baseUrl,
    timeout: 1000,
});

request.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        return Promise.reject(error)
    }
)
export { request }