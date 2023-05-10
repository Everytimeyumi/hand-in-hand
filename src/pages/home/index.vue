<template>
  <view class="bg-white home">
    <scroll-view class="page-scroll-view " enhanced :scroll-y="true">
      <view class="slide-swiper flex align-center  justify-end flex-direction text-xxl text-white">
          <text >欢迎</text>
          <text class="margin-top-sm margin-bottom-xl">让我们敞开心扉吧</text>
      </view>
      <background-card  @tap="navigateToGO('/pages/chat/index')" colorName="cpink" title="倾述场所" textInfo="树洞机器人欢迎咨询"
        class="margin-top-xl padding-lr-lg"></background-card>
      <background-card @tap="navigateToGO('/pages/question/index')" colorName="cbrown" title="心理测试" textInfo="想了解自己状况吗"
        class="margin-top-xl padding-lr-lg"></background-card>
      <background-card @tap="navigateToGO('/pages/article-list/index')" colorName="cyan" title="公益好文"
        textInfo="这里可能有你想要了解的" class="margin-top-xl padding-lr-lg"></background-card>
      <background-card @tap="navigateToGO('/pages/community/index')" colorName="cgrey" title="社区动态" textInfo="这里可能有你想要了解的"
        class="margin-top-xl padding-lr-lg padding-bottom-xl"></background-card>
    </scroll-view>
    <AtMessage />
    <view class="ui-tar-bar">
      <TabBar></TabBar>
    </view>
    
  </view>
</template>

<script >;
import BackgroundCard from '../../components/card.vue'
import TabBar from '../../components/bar.vue'
import Taro from '@tarojs/taro';
import { reactive, toRefs } from 'vue'

export default {
  name: 'Index',
  components: {
    BackgroundCard,
    TabBar
  },
  setup() {

    const state = reactive({
      current: 1,
      isCircular: false,
      isAutoplay: false,
      showLogin: false,

    });
    const navigateToGO = (url) => {
      Taro.navigateTo({ url, })
    }

    const callPhone = (phone) => {
      Taro.makePhoneCall({
        phoneNumber: phone, success: () => {
        }
      })
    }
    return {
      ...toRefs(state),
      navigateToGO,
      callPhone
    }
  }
}
</script>

<style lang="scss"  >
.home {
  height: 100vh;
  .page-scroll-view {
		height: calc(100vh - 130px - env(safe-area-inset-bottom) / 2);
    background: linear-gradient(#48b2fe, #06edfe 40%, #ffffff) !important;
	}
  .slide-swiper {
    width: 100%;
      height: 480px !important;

  }

}
</style>
