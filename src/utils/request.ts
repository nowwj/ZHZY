/**
 * @description [ axios 请求封装]
 */
import store from '@/store'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
// import { Message, Modal } from 'view-design' // UI组件库
import router from '../router'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * @description 设置为true，则会在请求过程中显示loading动画，直到请求结束才消失
     */
    loading?: boolean
  }
}
const request = axios.create({
  baseURL: '/api', // url = base url + request url
  timeout: 5000,
  withCredentials: true // send cookies when cross-domain requests
  // headers: {
  // clear cors
  // 'Cache-Control': 'no-cache',
  // Pragma: 'no-cache'
  // }
})

// Request interceptors
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Add Authorization header to every request, you can add other custom headers here
    // 在此处添加请求头等，如添加 token
    if (config.loading) {
      store.commit('setLoading', true)
    }
    return config
  },
)

//Response interceptors
request.interceptors.response.use(
   (config:AxiosResponse)=>{
    store.commit('setLoading',false)
    return config
   }
)

export default request
