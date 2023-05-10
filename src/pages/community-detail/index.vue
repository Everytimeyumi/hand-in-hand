<template>
  <view class="page">
    <scroll-view class="page-scroll-view" :scroll-y="true" @scrolltoupper="upper" @scrolltolower="lower">
      <view>
        <view>
          <view class="cu-card dynamic no-card">
            <view class="cu-item shadow">
              <view class="cu-list menu-avatar">
                <view class="cu-item">
                  <view class="cu-avatar round lg"
                    :style="{ backgroundImage: `url(${community.communityComment.avatarUrl ? community.communityComment.avatarUrl : 'https://image-1317015482.cos.ap-shanghai.myqcloud.com/VQ6dsRcmJK4Q77bc7849549a7e9e35177794676dd896.jpg'})` }">
                  </view>
                  <view class="content flex-sub">
                    <view>{{ community.communityComment.name }}</view>
                    <view class="text-gray text-sm flex justify-between">
                      {{ timeFormat(community.communityComment.publishTime) }}
                    </view>
                  </view>
                </view>
              </view>
              <view class="text-content">
                {{ community.communityComment.content }}
              </view>

              <view class="grid flex-sub padding-lr "
                :class="community.communityComment.imageList.length > 1 ? 'col-3 grid-square' : 'col-1'">
                <view class="bg-img" :class="community.communityComment.imageList.length > 1 ? '' : 'only-img'"
                  v-for="image in community.communityComment.imageList" :style="{ backgroundImage: `url(${image});` }">
                </view>
              </view>
              <view class="text-cyan text-sm text-right padding">
                <text class="cuIcon-favorfill margin-lr-xs" @tap.stop="favorfill(community.communityComment.id)"></text> {{
                  community.communityComment.collectNum }}
                <text class="cuIcon-messagefill margin-lr-xs" ></text> {{
                  community.communityComment.commentNum }}
              </view>
              <view class="cu-list menu-avatar comment " >
                <view class="cu-item solids-top" v-for="message in community.commentList">
                  <view class="content">
                    <view class="  radius  text-sm">
                      <view class="flex">
                        <view>{{ message.nickName  }}：</view>
                        <view class="flex-sub">{{ message.content }}</view>
                      </view>
                    </view>
                    <view class="margin-top-sm flex justify-end">
                      <view class="text-gray text-df text-right">{{ timeFormat( message.createTime) || '2022-10-08' }}</view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="cu-bar foot input" :style="[{ bottom: InputBottom + 'px' }]">
      <input class=" bg-gray" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
        @focus="InputFocus" @blur="InputBlur" v-model="community.prompt" />
      <view>
        <button class="cu-btn shadow" :class="flag ? 'bg-grey' : 'bg-cyan'" @tap="tapSendMessage">发布</button>
      </view>

    </view>
    <AtMessage />

  </view>
</template>
<script >
import { reactive, ref, toRefs, onMounted } from 'vue';
import Taro from '@tarojs/taro';
import Login from '../../components/login.vue'
import { communityIndexStore } from '../../stores/community'
import TabBar from '../../components/bar.vue'
import moment from 'moment'
export default {
  name: 'mine',
  components: {
    // Comment,
    Login,
    TabBar
  },
  setup() {
    const state = reactive({
      InputBottom: 0,
      flag: false
    });

    const community = communityIndexStore()

    const queryCommunityComment = (id) => {
      community.queryCommunityComment(id)
    }
    onMounted(() => {
      const $instancthise = Taro.getCurrentInstance()
      const { id } = $instancthise.router.params
      queryCommunityComment(id)
    })
    const timeFormat = (value) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }

    const addClever = () => {
      Taro.navigateTo({ url: '/pages/add-community/index' })
    }
    const lower = () => {
      community.queryCommunity()
    }
    const upper = () => {
    }
    const InputFocus = (e) => {
      state.InputBottom = e.detail.height
    }
    const InputBlur = (e) => {
      state.InputBottom = 0
    }
    const favorfill = (trendsId) => {
      Taro.showModal({
        title: '提示',
        content: '确定要收藏此动态吗',
        success: async (res) => {
          if (res.confirm) {
            await community.favorfill({trendsId,type:'datail'})
           
          } else if (res.cancel) {
          }
        }
      })
    }
    const tapSendMessage = async () => {
      if (!community.prompt) {
        Taro.atMessage({
          message: '您没有输入评论',
          type: 'error',
          duration:'500'
        })
        return
      }
      if (state.flag) return
      state.flag = true
      await community.sendMessage(community.communityComment.id)
      await queryCommunityComment(community.communityComment.id)
      
      setTimeout(() => {
        state.flag = false
      }, 500)
      community.clearText()
    }
    return {
      ...toRefs(state),
      community,
      InputFocus,
      timeFormat,
      addClever,
      favorfill,
      upper,
      lower,
      tapSendMessage,
      InputBlur
    };
  }
}
</script>
  
<style lang="scss"  >
.page {

  // position: relative;
  .page-scroll-view {
    height: calc(100vh - 130px - env(safe-area-inset-bottom) / 2);
  }
  .cu-list.menu-avatar.comment>.cu-item {
    padding: 30px 30px 10px 120px;
    height: auto;
  }
  .clever {
    position: fixed;
    right: 30px;
    top: 500px;
  }

}
</style>
  