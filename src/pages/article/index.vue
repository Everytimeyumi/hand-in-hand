<template>
  <scroll-view class="article__scroll-view bg-white" :scroll-y="true">
    <view class="bg-white padding-lr">
      <view class=" padding-xs flex align-center">
        <view class="flex-sub ">
          <view class=" text-xl padding text-center">
            <text class="text-black text-bold text-cut">{{ articleAction.articleDetail.title }}</text>
          </view>
          <view class="padding text-right text-grey ">{{ articleAction.articleDetail.createTime }}&nbsp;&nbsp;&nbsp; {{
            articleAction.articleDetail.author }}</view>
        </view>
      </view>
      <view>
        <rich-text class="text-df" :nodes="articleAction.articleDetail.content"></rich-text>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue';
import "taro-ui-vue3/dist/style/components/article.scss";
import { articleIndexStore } from '../../stores/article'
import Taro from '@tarojs/taro';
export default {
  name: 'mine',
  components: {
  },
  setup() {
    const state = reactive({
      show: false,
      cover: false,
    });
    const articleAction = articleIndexStore()
    onMounted(async () => {
      const $instancthise = Taro.getCurrentInstance()
      const { id } = $instancthise.router.params
      articleAction.queryArticleDetail(id)
    })
    const handleClick = (type, msg, cover = false) => {
    };
    return {
      ...toRefs(state),
      handleClick,
      articleAction
    }
  }
}
</script>

<style lang="scss" >
.article__scroll-view {
  height: 100vh;
}
</style>
