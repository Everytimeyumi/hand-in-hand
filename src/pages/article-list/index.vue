<template>
    <view class="article">
        <scroll-view class="article__scroll-view" :scroll-y="true" @scrolltolower="lower">
            <view class="cu-card article" v-for="item in articleAction.articleList" @tap="navigateToGO(item.id)">
                <view class="cu-item shadow">
                    <view class="content">
                        <view class="desc">
                            <view class="text-content">
                                {{ item.title }}
                            </view>
                            <view>
                                <view class="cu-tag bg-red light sm round">{{ item.author }}</view>
                                <view class="cu-tag bg-green light sm round">{{ item.updateTime }}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="cu-load text-cyan " :class="!isLoad ? 'loading' : 'over'"></view>
        </scroll-view>
    </view>
</template>
  
<script >
import { reactive, toRefs, onMounted, } from 'vue';
import Taro from '@tarojs/taro';
import "taro-ui-vue3/dist/style/components/input.scss";
import { articleIndexStore } from '../../stores/article'
import Login from '../../components/login.vue'
import _ from 'lodash'
export default {
    name: 'article',
    components: {
        Login
    },
    setup() {
        const state = reactive({
            isLoad: false,
        });
        const articleAction = articleIndexStore()
        articleAction.articleList = []
        articleAction.queryArticleList()
        state.isLoad = false
        articleAction.articleList = []
        const lower = async () => {
            const { pageNum, pageSize, pages } = articleAction.paginationSetting
            if (pages <= pageNum) return
            const newPageNum = pageNum + 1
            articleAction.paginationSetting = { pageNum: newPageNum, pageSize, pages }
            state.isLoad = false
            await articleAction.queryArticleList()
            state.isLoad = true
        }
        const navigateToGO = (id) => {
            Taro.navigateTo({ url: `/pages/article/index?id=${id}` })
        }
        const filterValue = (content) => {
            return _.truncate(content, { length: 20, omission: '...' })
        }
        return {
            ...toRefs(state),
            navigateToGO,
            articleAction,
            filterValue,
            lower,
        }
    }
}
</script>
  
<style lang="scss"  >
.article {
    .article__scroll-view {
        height: 100vh;
    }

    .cu-card.article>.cu-item .content {
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        padding: 30px 30px !important;
    }

    .cu-card.article>.cu-item .content>image {
        width: 180px !important;
        height: 180px !important;
        margin-right: 20rpx;
        border-radius: 6rpx;
    }

    .cu-card.article>.cu-item {
        padding-bottom: 0px !important;
    }

    .cu-card.article>.cu-item .content .text-content {
        font-size: 28px;
        font-weight: bold;
        color: #888;
        height: auto !important;
        overflow: hidden;
    }
}</style>
  