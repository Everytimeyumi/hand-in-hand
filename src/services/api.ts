


import Taro from '@tarojs/taro'
import { HTTP_STATUS } from '../constants/status'
import { baseApiUrl, baseCosUrl, baseNodeUrl } from '../config'
import { logError } from '../utils/error'
import { getStorageSync } from '../stores/store'
import { useIndexStore } from '../stores/index'


export default {
  baseOptions(params, method = 'GET') {
    const login = useIndexStore()
    const useToken = login.useToken || getStorageSync({ key: 'token', value: null })
    let { url, data, action } = params
    const contentType = action?.contentType ? action.contentType : 'application/json'
    const responseType = action?.responseType ? action.responseType : null
    const enableChunked = action?.enableChunked ? true : false
    const baseConfig = action?.baseConfig ? action?.baseConfig : false
    const baseUrl = (baseConfig === 'cos') ? baseCosUrl :(baseConfig === 'node') ? baseNodeUrl : baseApiUrl;
    console.log(baseUrl,'baseUrl')

    type OptionType = {
      url: string,
      data?: object | string,
      method?: any,
      header: object,
      success: any,
      error: any,
      responseType: any,
      enableChunked: any,
    }
    data = {
      ...data,
    }
    const option: OptionType = {

      url: url.indexOf('http') !== -1 ? url : baseUrl + url,
      data: data,
      method: method,
      responseType,
      enableChunked,
      header: {
        'content-type': contentType,
        'authorization': action?.useToken ? action.useToken : useToken
      },
      success(res) {
        const code = res.data.code
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          return logError('api', '请求资源不存在')
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return logError('api', '服务端出现了问题')
        } else if (code === HTTP_STATUS.AUTHENTICATE) {
          return logError('api', '请先授权用户信息')
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          return res.data
        }
      },
      error(e) {
        logError('api', '请求接口出现问题', e)
      },

    }
    // eslint-disable-next-line
    return Taro.request(option)
  },
  get(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option)
  },
  post(url, data?: object, action?: object) {
    let params = { url, data, action }
    return this.baseOptions(params, 'POST')
  },
  put(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option, 'PUT')
  },
  delete(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option, 'DELETE')
  }
}
