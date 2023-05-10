<template>
  <view>
    <form @submit="savleUseInfo">
      <button class="cu-btn content cu-form-group margin-top" open-type="chooseAvatar" @chooseavatar="chengeAvatar">
        <view class="title">头像</view>
        <view class="cu-avatar radius bg-gray" :style="{ backgroundImage: `url(${useAction.useAuth.avatarUrl})` }"></view>
      </button>
      <view class="cu-form-group ">
        <view class="title">昵称</view>
        <input placeholder="请选择昵称" type="nickname" :value="useAction.useAuth.nickName" @Blur="chengeNickname"
          name="input" />
      </view>

      <view class="cu-form-group">
        <view class="title">紧急联系人</view>
        <input placeholder="填写紧急联系人" v-model="useAction.useAuth.emergencyContact" />
      </view>
      <view class="cu-form-group">
        <view class="title">紧急联系人电话</view>
        <input placeholder="填写紧急联系人电话" maxlength="11" type="number" v-model="useAction.useAuth.emergencyContactPhone"
          name="input" />
      </view>
      <view class="padding flex flex-direction">
        <button class="cu-btn bg-cyan lg" form-type="submit">保存</button>
      </view>
    </form>
    <AtMessage />
  </view>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue';
import { useIndexStore } from '../../stores/index';
import { communityIndexStore } from '../../stores/community'
import api from '../../services/api'
import Taro from '@tarojs/taro';
import _ from 'lodash'
var CosAuth = require('../../services/cos-auth');
var Bucket = 'image-1317015482';
var Region = 'ap-shanghai';
var ForcePathStyle = false;
export default {
  components: {
  },
  name: 'mine',
  setup() {
    const state = reactive({
      show: false,

    });
    const useAction = useIndexStore()

    const handleClick = (type, msg, cover = false) => {
      Taro.navigateTo({ url: '/pages/aswer/index' })
    }
    const GonavigateTo = () => {
      Taro.navigateTo({ url: '/pages/aswer/index' })
    }
    const chengeAvatar = async (e) => {
      await UploadFile(e.detail.avatarUrl)
    }
    const chengeNickname = (e) => {
      useAction.useAuth.nickName = e.detail.value

    }
    const savleUseInfo = async (e) => {
      const { emergencyContactPhone, emergencyContact, id, avatarUrl, nickName } = useAction.useAuth
      const parmas = { userId: id, emergencyContact, emergencyContactPhone, avatarUrl, nickName }
      await useAction.saveEmergency(parmas)
       Taro.atMessage({
        message: '保存成功',
        type: 'success',
        duration:'500'
      })
      setTimeout(() => {
        Taro.navigateBack({
          delta: 1
        })
      }, 700)

    }
    const uploadAction = communityIndexStore()
    const getAuthorization = (credentials) => {
            return {
                XCosSecurityToken: credentials.sessionToken,
                Authorization: CosAuth({
                    SecretId: credentials.tmpSecretId,
                    SecretKey: credentials.tmpSecretKey,
                    Method: 'POST',
                    Pathname: '/',
                }),
            }
        }
    const UploadFile = async (url) => {
      await uploadAction.getCosSession()
        var Key = url.substr(url.lastIndexOf('/') + 1); // 这里指定上传的文件名
        var signPathname = '/' + Key;
        var prefix = `https://${Bucket}.cos.${Region}.myqcloud.com/`;
        const credentials = uploadAction.credentials
        const AuthData = getAuthorization(credentials)
        Taro.uploadFile({
          url: prefix, //仅为示例，非真实的接口地址
          filePath: url,
          name: 'file',
          formData: {
            'key': Key,
            'success_action_status': 200,
            'Signature': AuthData.Authorization,
            'x-cos-security-token': AuthData.XCosSecurityToken,
            'Content-Type': '',
          },
          success: (uploadFileRes) => {
            const url = `${prefix}${Key}`
            useAction.useAuth.avatarUrl = url
            Taro.atMessage({
              message: '上传成功',
              type: 'success',
              duration:'500'
            })
          },
          fail: () => {
            useAction.useAuth.avatarUrl = ''
            Taro.atMessage({
              message: '上传失败',
              type: 'error',
              duration:'500'
            })
          }
        });
    }
    return {
      savleUseInfo,
      ...toRefs(state),
      handleClick,
      GonavigateTo,
      useAction,
      chengeAvatar,
      chengeNickname
    }
  }
}
</script>

<style>
.cu-form-group .title {
  min-width: calc(4em + 15px);
}
</style>
