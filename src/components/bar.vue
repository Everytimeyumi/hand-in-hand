<template>
    <view class="cu-bar tabbar  bg-white" >
        <view class="action " :class="actionTab==='home' ?'text-cyan':''" @tap="goPage('home')">
            <view class="cuIcon-homefill"></view> 首页
        </view>
        <view class="action text-gray add-action">
            <button class="cu-btn cuIcon-add bg-cyan shadow" @tap="goCommunity('add-community')"></button>
            发布
        </view>
        <view class="action " :class="actionTab==='mine'?'text-cyan':''"  @tap="goPage('mine')">
            <view class="cuIcon-my">
            </view>
            我的
        </view>
</view>
</template>
  
<script lang="ts">
import {  defineComponent, toRefs ,reactive} from 'vue'
import Taro from '@tarojs/taro';
import _ from 'lodash'
import { useIndexStore } from '../stores/index'
export default defineComponent({
    name: "Panel",
    props: {
        title: {
            type: String,
            default: '',
            required: true
        },
        noPadding: Boolean
    },

    setup(props, ) {
        const state = reactive({
            actionTab:'home'
         });
         const login = useIndexStore()
        const pages = Taro.getCurrentPages();
        const currentPage = pages[pages.length - 1].route
        const varValue = 'home';
        if (_.includes(currentPage, varValue)) {
            state.actionTab='home'   
        }else{
            state.actionTab='mine'   
        }
        
       const goCommunity=(params:string)=>{
            Taro.navigateTo({url:`/pages/${params}/index`}) 
        }
        const goPage = (params:string)=>{
           if(params === state.actionTab) return
                state.actionTab =params
               Taro.redirectTo({url:`/pages/${params}/index`})
            //    Taro.navigateTo({url:`/pages/login/index`})  
        }
        return {
            ...toRefs(props),
            ...toRefs(state),
            // contentClasses,
            goPage,
            login,
            goCommunity
        }
    }
})
</script>
  
<style lang="scss">

</style>