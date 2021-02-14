import { getToken } from './session'
import axios from 'axios'
import { ResResult } from './type'
import { ElMessage } from 'element-plus'

// 配置默认请求api的路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 设置axios的请求拦截器
axios.interceptors.request.use(
  config => {
    // 在请求头中添加token
    config.headers.Authorization = getToken() || ''
    return config
  },
  err => {
    return err
  }
)

/**
 * 显示响应体返回的成功或错误信息
 *
 * @param res 返回的响应数据
 * @param cb  成功的回调函数
 */
export const showMsg = (res: ResResult, cb?: Function, isSuccess = false) => {
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  if (isSuccess) ElMessage.success(res.meta.msg)
  cb && cb(res.data)
}

/**
 * get请求
 *
 * @param api     请求的api
 * @param params  请求参数
 * @param cb      成功的回调函数
 * @param isSuccess 是否显示成功信息
 */
export const getParams = (api: string, params?: object, cb?: Function, isSuccess = false): Promise<ResResult> => {
  return axios.get(api, params).then(
    response => {
      showMsg(response.data, cb, isSuccess)
      return response.data
    },
    err => {
      return err
    }
  )
}

/**
 * get请求
 *
 * @param api       请求的api
 * @param cb        成功的回调函数
 * @param isSuccess 是否显示成功信息
 */
export const get = (api: string, cb?: Function, isSuccess = false): Promise<ResResult> => {
  return axios.get(api).then(
    response => {
      showMsg(response.data, cb, isSuccess)
      return response.data
    },
    err => {
      return err
    }
  )
}

/**
 * post请求
 *
 * @param api     请求的api
 * @param params  请求参数
 * @param cb      成功的回调函数
 * @param isSuccess 是否显示成功信息
 */
export const post = (api: string, params?: object, cb?: Function, isSuccess = false): Promise<ResResult> => {
  return axios.post(api, params).then(
    response => {
      showMsg(response.data, cb, isSuccess)
      return response.data
    },
    err => {
      return err
    }
  )
}
