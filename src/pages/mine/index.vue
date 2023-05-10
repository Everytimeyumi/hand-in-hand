<template>
  <view class="mine  bg-white">
    <scroll-view class="mine__scroll-view bg-gray " :scroll-y="true">
      <view class="mine__top  flex align-center  justify-center flex-direction text-white">
        <view class="cu-avatar xl round margin-left" :style="`backgroundImage:url(${loginAction.useAuth?.avatarUrl})`">
        </view>
        <text class='text-xxl margin-top-xs'>{{ loginAction.useAuth?.nickName || '微信用户'}}</text>
      </view>
      <view class="cu-list grid col-3">
        <view class="cu-item" v-for="(item, index) in cuIconList" :key="index" @tap="goNavigate(item.path)">
          <view :class="['cuIcon-' + item.cuIcon, 'text-' + item.color]">
          </view>
          <text>{{ item.name }}</text>
        </view>
      </view>
      <view class="cu-list menu sm-border card-menu margin-top">
        <view class="cu-item arrow" @tap="goNavigate('/pages/mine-setting/index')">
          <view class="content">
            <text class="cuIcon-info text-pink"></text>
            <text class="text-grey">我的信息</text>
          </view>
        </view>
        <view class="cu-item arrow" @tap="goNavigate('/pages/aswer/index')">
          <view class="content">
            <text class="cuIcon-rankfill text-yellow"></text>
            <text class="text-grey">测验结果</text>
          </view>
        </view>
        <view class="cu-item arrow">
          <button class="cu-btn content" open-type="contact">
            <text class="cuIcon-servicefill text-olive"></text>
            <text class="text-grey">客服消息</text>
          </button>
        </view>

      </view>
    </scroll-view>
    <!-- <AtMessage /> -->
    <view class="ui-tar-bar bg-white">
      <TabBar></TabBar>
    </view>
    <Login></Login>
  </view>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue';
import { useIndexStore } from '../../stores/index';
import TabBar from '../../components/bar.vue'
import Login from '../../components/login.vue'
import Taro from '@tarojs/taro';
export default {
  components: {
    TabBar,
    Login
  },
  name: 'mine',
  setup() {

    const state = reactive({
      show: false,
      cover: false,
      cuIconList: [{
        cuIcon: 'favorfill',
        color: 'red',
        name: '收藏',
        path: '/pages/collect/index'
      }, {
        cuIcon: 'discoverfill',
        color: 'purple',
        name: '动态',
        path: '/pages/community/index?type=mine'
      }, {
        cuIcon: 'dianhua',
        color: 'cyan',
        name: '电话',
        path: '/pages/call-phone/index'
      },

      ],

    });
    const loginAction = useIndexStore()
    const handleClick = (type, msg, cover = false) => {
      Taro.navigateTo({ url: '/pages/aswer/index' })
    }
    const goNavigate = (url) => {
      Taro.navigateTo({ url })
    }
    return {
      ...toRefs(state),
      loginAction,
      handleClick,
      goNavigate,
    }
  }
}
</script>

<style lang="scss" >
.mine {
  width: 100%;
  height: 100vh;
  display: relative;

  .mine__scroll-view {
    height: calc(100vh - 130px - env(safe-area-inset-bottom) / 2);
  }
}

.mine__top {
  height: 488px;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-color: #fff;
  background-image: url('https://image-1317015482.cos.ap-shanghai.myqcloud.com/hand-in-hand/BasicsBg.png');
}
</style>
