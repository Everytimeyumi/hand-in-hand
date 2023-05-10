<template>
  <view class="community">
    <scroll-view class="community__scroll-view" :scroll-y="true" @scrolltolower="lower">
      <view v-for="item in community.communityList">
        <view class="cu-card dynamic ">
          <view class="cu-item shadow">
            <view class="cu-list menu-avatar" @tap.stop="toDetali(item)">
              <view class="cu-item">
                <view class="cu-avatar round lg"
                  :style="{ backgroundImage: `url(${item.avatarUrl ? item.avatarUrl : 'https://image-1317015482.cos.ap-shanghai.myqcloud.com/VQ6dsRcmJK4Q77bc7849549a7e9e35177794676dd896.jpg'})` }">
                </view>
                <view class="content flex-sub">
                  <view>{{ item.nickName || 'yumi' }}</view>
                  <view class="text-gray text-sm flex justify-between">
                    {{ timeFormat(item.publishTime) }}
                  </view>
                </view>
              </view>
            </view>
            <view class="text-content" @tap.stop="toDetali(item)">
              {{ item.content }}
            </view>
            <view @tap.stop="toDetali(item)" class="grid flex-sub padding-lr "
              :class="item.imageList.length > 1 ? 'col-3 grid-square' : 'col-1'">
              <view class="bg-img" :class="item.imageList.length > 1 ? '' : 'only-img'" v-for="image in item.imageList"
                :style="{ backgroundImage: `url(${image});` }"></view>
            </view>
            <view class="text-cyan text-sm text-right padding">
              <text v-show="showLikes(item)" class="cuIcon-favorfill margin-lr-xs"
                @tap.stop="favorfill(item.id)"></text>  {{
                 showLikes(item)? item.collectNum:'' }}
              <text class="cuIcon-messagefill margin-lr-xs" @tap.stop="toDetali(item)"></text> {{ item.commentNum }}
              <text v-if="type == 'mine'" class="cuIcon-delete  text-red margin-lr-xs" @tap.stop="remove(item.id)"></text>
            </view>

          </view>
        </view>

      </view>
      <view class="cu-load text-cyan " :class="!isLoad ? 'loading' : 'over'"></view>
    </scroll-view>
    <AtMessage />
  </view>
</template>
<script >
import { reactive, ref, onMounted, toRefs, computed } from 'vue';
import Taro from '@tarojs/taro';
import Login from '../../components/login.vue'
import { communityIndexStore } from '../../stores/community'
import { useIndexStore } from '../../stores/index';
import TabBar from '../../components/bar.vue'
import moment from 'moment'
export default {
  name: 'mine',
  components: {
    Login,
    TabBar
  },
  setup() {
    const state = reactive({
      isLoad: false,
      type: null
    });
    const community = communityIndexStore()
    const loginAction = useIndexStore()
    community.communityList = []
    const $instancthise = Taro.getCurrentInstance()
    const { type } = $instancthise.router.params
    state.type = type
    community.queryCommunity(type)
    state.isLoad = true
   const showLikes=(item)=>{
     if(type == 'mine') return false
     if(item.userId == loginAction.auth.id) return false
     return true
   }
   
    const toDetali = (item) => {
      community.communityComment = item
      Taro.navigateTo({ url: `/pages/community-detail/index?id=${item.id}` })
    }
    const addClever = () => {
      Taro.navigateTo({ url: '/pages/add-community/index' })
    }
    const lower = async () => {
      state.isLoad = true
      const { pageNum, pageSize, pages } = community.paginationSetting
      if (pages <= pageNum) return
      const newPageNum = pageNum + 1
      community.paginationSetting = { pageNum: newPageNum, pageSize, pages }
      state.isLoad = false
      await community.queryCommunity()
      state.isLoad = true
    }
    const timeFormat = (value) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
    const favorfill = (trendsId) => {
      Taro.showModal({
        title: '提示',
        content: '确定要收藏此动态吗',
        success: async (res) => {
          if (res.confirm) {
            await community.favorfill({ trendsId, type: 'list' })
          } else if (res.cancel) {
          }
        }
      })
    }
    const remove = async (trendsId) => {
      Taro.showModal({
        title: '提示',
        content: '确定要删除此动态吗',
        success: async (res) => {
          if (res.confirm) {
            await community.remove(trendsId)
            Taro.atMessage({
              message: '删除成功',
              type: 'success',
              duration:'500'
            })
          } else if (res.cancel) {
          }
        }
      })

    }
    return {
      ...toRefs(state),
      community,
      timeFormat,
      favorfill,
      addClever,
      lower,
      toDetali,
      remove,
      showLikes ,
      loginAction

    };
  }
}
</script>
  
<style lang="scss"  >
.community {
  .community__scroll-view {
    height: 100vh;
  }

  .clever {
    position: fixed;
    right: 30px;
    top: 300px;
  }

}
</style>
  