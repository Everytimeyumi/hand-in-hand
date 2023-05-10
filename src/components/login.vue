<template>
    <view>
        <view class="cu-modal bottom-modal " :class="isOpened ? 'show' : ''">
            <view class="cu-dialog">
                <view class="cu-bar bg-white">
                    <view class="action text-green">授权用户信息</view>
                    <view class="action text-blue" @tap="cancel">取消</view>
                </view>
                <view class="padding flex flex-direction">
                    <button class="cu-btn bg-green lg" openType="getUserInfo" @tap="getUserInfo">授权用户信息</button>
                </view>
            </view>
        </view>
        <AtMessage />
    </view>
</template>
  
<script lang="ts">
import { defineComponent, toRefs, reactive, onMounted } from 'vue'
import { useIndexStore } from '../stores/index'
import Taro from '@tarojs/taro';
import api from '../services/api'
import _ from 'lodash'

export default defineComponent({
    name: "login",
    setup(props,) {
        const state = reactive({
            isOpened: false
        });
        const login = useIndexStore()
        onMounted(async () => {
            const isLogin = login.isLogin
            if (!isLogin) {
                state.isOpened = true
             }
        })
        const cancel = () => {
            state.isOpened = false
        }
        const getUserInfo = async () => {
            let code
            Taro.login({
                success: async (parmas) => {
                    code = parmas.code
                }
            })
            Taro.getUserProfile({
                desc: '用于完善用户资料',
                success: async (res) => {
                    const { sessionKey } = login.useAuth
                    const { encryptedData, iv, } = res
                    const data = { encryptedData, sessionKey, iv, code }
                    const collection = await api.post('sys/decodeUserInfo',
                        data)
                    if (collection) {
                        state.isOpened = false
                        login.updateUseInfo(res.userInfo)
                        Taro.atMessage({
                            message: '登录成功',
                            type: 'success',
                            duration:'500'
                        })

                    }


                }
            })

        }
        return {
            ...toRefs(props),
            login,
            getUserInfo,
            cancel,
            ...toRefs(state),


        }
    }
})
</script>
