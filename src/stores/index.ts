import { defineStore } from 'pinia'
import Taro from '@tarojs/taro'
import api from '../services/api'
import { getStorageSync, setStorage } from './store'
export const useIndexStore = defineStore({
  id: 'card',
  state: () => ({
    useToken: getStorageSync({ key: 'token', value: null }) || null,
    useAuth: getStorageSync({ key: 'auth', value: null }) || null,
    isOpened: {
      type: String,
      default: false,
    },
    value: Object,
    userInfo: Object
  }),
  getters: {
    isLogin(state) {
      const token = state.useToken
      const useAuth = state.useAuth ? state.useAuth.nickName : null
      if (token && useAuth) return true
      return false
    },
    token(state) {
      return state.useToken ? state.useToken : null
    },
    auth(state) {
      return state.useAuth ? state.useAuth : null
    }

  },
  actions: {

    setUseInfo(parmas) {
      const { data } = parmas
      const { token } = data
      setStorage({ key: 'auth', value: data })
      setStorage({ key: 'token', value: token })
    },
    updateUseInfo(parmas) {
      const useAuth = this.useAuth
      const { avatarUrl, city, country, gender, language, nickName, province } = parmas
      const data = { ...useAuth, avatarUrl, city, country, gender, language, nickName, province }
      this.useAuth = data
      setStorage({ key: 'auth', value: data })

    },
    async saveEmergency(parmas) {
      await api.post('user/addeMergencyContact', parmas)
    },
    async wxLogin() {
      // 接口访问方式
      await Taro.login({
        success: async (res) => {
          if (res.code) {
            //发起网络请求
            const { data } = await api.post('sys/login', { appid: "wx4bcc2635bcc549b5", code: res.code })
            if (data) {
              this.useAuth = data.data
              this.useToken = data.data.token
              this.setUseInfo(data)
            }
          } else {
          }
        }
      })



    },





  },
})

