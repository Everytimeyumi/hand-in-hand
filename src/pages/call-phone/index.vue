<template>
    <view class="call-phone ">
        <scroll-view class="call-phone__scroll-view" :scroll-y="true">
            <view class="cu-list menu sm-border card-menu margin-top">
                <view class="cu-item " @tap="callPhone('12355')">
                    <view class="content">
                        <text class="cuIcon-dianhua text-green"></text>
                        <text class="text-grey">青少年心里咨询热线</text>
                    </view>
                </view>
                <view class="cu-item " @tap="callPhone('0371-86169595')">
                    <view class="content">
                        <text class="cuIcon-dianhua text-green"></text>
                        <text class="text-grey">奇才心理热线(白天)</text>
                    </view>
                </view>
                <view class="cu-item " @tap="callPhone('0371-22993442')">
                    <view class="content">
                        <text class="cuIcon-dianhua text-green"></text>
                        <text class="text-grey">奇才心理热线(晚上)</text>
                    </view>
                </view>
                <view class="cu-item " @tap="callPhone('025-86528082')">
                    <view class="content">
                        <text class="cuIcon-dianhua text-green"></text>
                        <text class="text-grey">南京自杀干预中心救助热线</text>
                    </view>
                </view>
                <view class="cu-item " @tap="callPhone('027-8584666')">
                    <view class="content">
                        <text class="cuIcon-dianhua text-green"></text>
                        <text class="text-grey">武汉市精神卫生中心危机干预中心救助热线</text>
                    </view>  
                </view>
                <view class="cu-item " @tap="callPhone('023-66699199')">
                    <view class="content">
                        <text class="cuIcon-dianhua text-green"></text>
                        <text class="text-grey">生命求助热线危机干预热线</text>
                    </view>  
                </view> 
                <view class="cu-item " @tap="callPhone('020-81899120')">
                    <view class="content">
                        <text class="cuIcon-dianhua text-green"></text>
                        <text class="text-grey">广州心理危机研究与干预中心心理热线</text>
                    </view>  
                </view>
            </view>
        </scroll-view>
    </view>
</template>
  
<script>
import { reactive, toRefs, onMounted } from 'vue';
import Taro from '@tarojs/taro';
export default {
    components: {
    },
    name: 'mine',
    setup() {

        const state = reactive({

        });

        const callPhone = (phone) => {
            Taro.makePhoneCall({
                phoneNumber: phone, success: () => {
                }
            })
        }
        return {
            ...toRefs(state),
            callPhone,
        }
    }
}
</script>
  
<style lang="scss" >
.call-phone {
    width: 100%;

    .call-phone__scroll-view {
        height: calc(100vh - 150px - env(safe-area-inset-bottom) / 2);
    }
}
</style>
  