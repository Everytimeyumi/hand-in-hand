<template>
    <view class="collect">
        <scroll-view class="collect__scroll-view" :scroll-y="true" @scrolltolower="lower">
            <view class="cu-list menu-avatar">
                <view class="cu-item margin-top-sm" :class="modalName == 'move-box-' + index ? 'move-cur' : ''"
                    v-for="(item, index) in collectAction.collectList" :key="index" @touchstart="ListTouchStart" @touchmove="ListTouchMove"
                    @touchend="ListTouchEnd" :data-target="'move-box-' + index" >
                    <view class="cu-avatar round lg" :style="[{backgroundImage:`url(${item.avatarUrl})`}]"></view>
                    <view class="content" @tap="navigateToGO(item)">
                        <view class="text-grey">{{ item.nickName || 'yumi' }}</view>
                        <view class="text-gray text-sm collection-text">
                            <text class=" text-red  margin-right-xs"></text> {{ item.content || 'WIS故意啊傻大个' }}
                        </view>
                    </view>
                    <view class="move">
                        <view class="bg-red" @tap="remove(item.id)">删除</view>
                    </view>
                </view>
            </view>
            <view class="cu-load text-cyan " :class="!isLoad ? 'loading' : 'over'"></view>
        </scroll-view>
       
    </view>
</template>
  
<script >
import { reactive, toRefs, onMounted,onHide } from 'vue';
import Taro from '@tarojs/taro';
import { collectIndexStore } from '../../stores/collect'
import { communityIndexStore } from '../../stores/community'
import "taro-ui-vue3/dist/style/components/input.scss";
export default {
    name: 'collect',
    components: {
    },
    setup() {
        const state = reactive({
            modalName: null,
            listTouchStart: 0,
            listTouchDirection: null,
            isLoad: false,
        })
        const collectAction = collectIndexStore()
        const community = communityIndexStore()
        onMounted(async () => {
            collectAction.collectList=[]
            collectAction.queryCollectList()
            state.isLoad = true
        })
        const lower = async () => {
            const { pageNum, pageSize, pages } = collectAction.paginationSetting
            if (pages <= pageNum) return
            const newPageNum = pageNum + 1
            collectAction.paginationSetting = { pageNum: newPageNum, pageSize, pages }
            state.isLoad = false
            await collectAction.queryCollectList()
            state.isLoad = true
        }
        const ListTouchStart = (e) => {
            state.listTouchStart = e.touches[0].pageX
        }
        const ListTouchMove = (e) => {
            state.listTouchDirection = e.touches[0].pageX - state.listTouchStart > 0 ? 'right' : 'left'
        }
        // ListTouch计算滚动
        const ListTouchEnd = (e) => {
            if (state.listTouchDirection == 'left') {
                state.modalName = e.currentTarget.dataset.target
            } else {
                state.modalName = null
            }
            state.listTouchDirection = null
        }
        const navigateToGO = (item) => {
            community.communityComment = item
            community.queryCommunityComment(item.id)
        Taro.navigateTo({ url: `/pages/community-detail/index?id=${item.id}` })
        }
        const remove = (id) => {
            collectAction.remove(id)
            //  collectAction.queryCollectList()
        }
        return {
            ...toRefs(state),
            collectAction,
            navigateToGO,
            ListTouchStart,
            ListTouchMove,
            ListTouchEnd,
            remove,
            lower
        }
    }
}
</script>
  
<style lang="scss"  >
.collect__scroll-view {
    height: 100vh;
    .collection-text{
        white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
    }
}
</style>
  