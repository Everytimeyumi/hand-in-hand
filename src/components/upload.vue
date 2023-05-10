<template>
    <view>
        <view v-if="isUpload">
            <view class="load-progress" :class=" isUpload? 'show' : 'hide'"
			:style="[{ top: CustomBar + 'px' }]">
			<view class="load-progress-bar bg-green"
				:style="[{ transform: 'translate3d(-' + (100 - uploadAction.percent) + '%, 0px, 0px)' }]"></view>
			<view class="load-progress-spinner text-green"></view>
		</view>
            
        </view>
      
        <AtMessage />
    </view>
</template>
  
<script >
import { defineComponent, ref, toRefs, onMounted, reactive } from 'vue'

import Taro from '@tarojs/taro'
var CosAuth = require('../services/cos-auth');
var Bucket = 'image-1317015482';
var Region = 'ap-shanghai';
var ForcePathStyle = false;
import api from '../services/api'
import { communityIndexStore } from '../stores/community'
import _ from 'lodash'
export default defineComponent({
    name: "login",
    props: {
        limit: {
            type: Number,
            default: 9,
            required: true
        },
        noPadding: Boolean
    },

    setup(props,) {
        const state = reactive({
            isUpload: false,
            CustomBar: 0
        });
        const uploadAction = communityIndexStore()
        const conts = ref("");
        const uploadLimit = 0
        const promiseurl = []
     
        const UploadImage = () => {
            Taro.chooseImage({
                count: props.limit, // 默认9
                sizeType: [ 'compressed'], 
                sourceType: ['album', 'camera'], 
                success: (res) => {
                    uploadAction.tempFilePaths = res.tempFilePaths
                    uploadAction.uploadParams.total = res.tempFilePaths.length
                    state.isUpload = true
                    UploadFile()
                }

            })


        }
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
        const UploadFile = () => {
            let tempFilePaths = uploadAction.tempFilePaths
            uploadAction.getCosSession()
            const up_img = (url) => {
                var Key = url.substr(url.lastIndexOf('/') + 1); // 这里指定上传的文件名
                var signPathname = '/' + Key;
                var prefix = `https://${Bucket}.cos.${Region}.myqcloud.com/`;
                const credentials = uploadAction.credentials
                const AuthData = getAuthorization(credentials)
                return new Promise((resolve, reject) => {
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
                            uploadAction.uploadParams.uploadUrls = _.concat(_.cloneDeep(uploadAction.uploadParams.uploadUrls), url);
                            uploadAction.uploadParams.successs++
                            resolve(url);
                        }
                    });
                    //  })
                })
            }
            tempFilePaths.forEach(async (item, index) => {
                promiseurl.push(up_img(item));

            });
            /* 所有图片上传完成后调用该方法 */
            Promise.all(promiseurl).then((res) => {
                // 关闭加载提示  
                state.isUpload = false
                Taro.atMessage({
                    message: '上传成功',
                    type: 'success',
                    duration:'500'
                })
            }).catch(error=>{
                state.isUpload = false
                Taro.atMessage({
                    message: '上传错误',
                    type: 'error',
                    duration:'500'
                })
            }
                
            );
        }
        return {
            ...toRefs(props),
            ...toRefs(state),
            UploadImage,
            conts,
            uploadAction,
            promiseurl
        }
    }
})
</script>
