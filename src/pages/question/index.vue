<template>
  <view class="question ">
    <scroll-view :scroll-x="true" class="bg-white padding response cu-steps steps-bottom"
      :scroll-into-view="'scroll-' + current" scroll-with-animation>
      <view class="cu-item padding-lr-xl" :class="index > current ? '' : 'text-cyan'"
        v-for="(item, index) in questionData.questionsList" :key="index" :id="'scroll-' + index">
        第 {{ index + 1 }}题 <text class="num" :data-index="index + 1"  @tap="chengeCurrent(index)"></text>
      </view>
    </scroll-view>
    <swiper class="question-swiper margin-top-sm" :current="current" @change="swiperChange($event)">
      <swiper-item v-for="(item, index) in questionData.questionsList" :key="index">
        <view class="cu-bar bg-white solid-bottom">
          <view class="action">
            <text class="cuIcon-titles text-orange"></text> {{ item.questionTitle }}
          </view>
        </view>
        <view>
          <at-radio :options="item.itrQuestionOptions"     :value="questionData.questionValue[index]" @click="handleRadioChange($event, item.id)" />
        </view>
      </swiper-item>
    </swiper>
    <view class="padding flex flex-direction">
      <button class="cu-btn bg-cyan lg" v-if="current === questionData.questionsList.length - 1"
        @tap="submit()">提交答案</button>
      <block v-else>
        <button class="cu-btn  bg-cyan lg" v-if="current === 0" @tap="nextSteps()">下一题</button>
            <button class="cu-btn  bg-cyan lg" v-else @tap="returnSteps()">上一题</button>
      </block>
    </view>
    <AtMessage />
  </view>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue';
import { questionIndexStore } from '../../stores/question'
import _, { cloneDeep } from 'lodash'
import Taro from '@tarojs/taro';
import Login from '../../components/login.vue'
export default {
  name: 'mine',
  components: {
    Login
  },
  setup() {
    const state = reactive({
      current: 0,
    
    });
    const questionData = questionIndexStore()
    questionData.AswerLoad()
    const swiperChange = (event) => {
      state.current = event.detail.current
    
    }
    const chengeCurrent =(index)=>{
      state.current=index
    }
    const handleRadioChange = (value, id) => {
      const userIndex = _.findIndex(questionData.questionsList, { id });
      if (userIndex !== -1) {
         questionData.questionValue[userIndex] = Number(value)
        setTimeout(() => {
          const length = questionData.questionsList.length
          if (userIndex >= length - 1) return
          state.current = userIndex + 1
        }, 100);
      }
    }
    const submit = async () => {
      const aswer = questionData.questionValue
      const flag = _.every(aswer, (x) => { return x.value != 0 })
      if (flag) {
        // 计算成绩  
      
        const F1 = _.defaultTo(_.sum(_.at(aswer, [1, 4, 12, 27, 40, 42, 48, 49, 52, 53, 56, 58]

        )), 0);

        const scoreF1 = _.round((F1 / 12), 2);
        const F2 = _.defaultTo(_.sum(_.at(aswer,
          [3, 9, 10, 28, 38, 45, 46, 51, 55, 65]
        )), 0);
        const scoreF2 = _.round((F2 / 10), 2);
        const F3 = _.defaultTo(_.sum(_.at(aswer,
          [6, 21, 34, 36, 37, 41, 61, 69, 73,]
        )), 0);
        const scoreF3 = _.round((F3 / 9), 2);

        const F4 = _.defaultTo(_.sum(_.at(aswer,
          [5, 14, 15, 20, 22, 26, 29, 30, 31, 32, 54, 71, 79]
        )), 0);
        const scoreF4 = _.round((F4 / 13), 2);

        const F5 = _.defaultTo(_.sum(_.at(aswer,
          [2, 17, 23, 33, 39, 57, 72, 78, 80, 86]
        )), 0);
        const scoreF5 = _.round((F5 / 10), 2);

        const F6 = _.defaultTo(_.sum(_.at(aswer,
          [11, 24, 63, 67, 74, 81]
        )), 0);
        const scoreF6 = _.round((F6 / 6), 2);

        const F7 = _.defaultTo(_.sum(_.at(aswer,
          [13, 25, 47, 50, 70, 75, 82]
        )), 0);
        const scoreF7 = _.round((F7 / 7), 2);

        const F8 = _.defaultTo(_.sum(_.at(aswer,
          [8, 18, 43, 68, 76, 83]
        )), 0);
        const scoreF8 = _.round((F8 / 6), 2);

        const F9 = _.defaultTo(_.sum(_.at(aswer,
          [7, 16, 35, 62, 77, 84, 85, 87, 88, 90]
        )), 0);
        const scoreF9 = _.round((F9 / 10), 2);

        const F10 = _.defaultTo(_.sum(_.at(aswer,
          [19, 44, 59, 60, 64, 66, 89]
        )), 0);
        const scoreF10 = _.round((F10 / 7), 2);
        const result = {
          scoreF1, scoreF2, scoreF3, scoreF4, scoreF5, scoreF6, scoreF7, scoreF8, scoreF9, scoreF10
        }
        const resultNum = {
          totalF1: F1, totalF2: F2, totalF3: F3, totalF4: F4, totalF5: F5, totalF6: F6, totalF7: F7, totalF8: F8, totalF9: F9, totalF10: F10,
        }
        questionData.submitSult(result, resultNum)
        Taro.atMessage({
          message: '提交成功',
          type: 'success',
          duration:'500'
        })
        Taro.redirectTo({
          url: '/pages/aswer/index'
        })

      } else {
      const inde=  _.map(_.keys(_.pickBy(aswer, (val) => val === 0)), (index) => parseInt(index) + 1)
        Taro.atMessage({
          message: `你还有${inde}没有做`,
          type: 'error',
          duration:'500'
        })
      }
    }
    const nextSteps = () => {
     
      if (!questionData.questionValue[state.current]) {
        Taro.atMessage({
          message: '请选择一项答案',
          type: 'error',
          duration:'500'
        })
        return
      }
      state.current = state.current == questionData.questionsList.length - 1 ? questionData.questionsList.length - 1 : state.current + 1
    }
    const returnSteps = () => {
      state.current = state.current == 0 ? 0 : state.current - 1
    }
    return {
      ...toRefs(state),
      submit,
      questionData,
      handleRadioChange,
      swiperChange,
      nextSteps,
      returnSteps,
      chengeCurrent
    };
  }

}
</script>

<style lang="scss" >
.question {
  .question-swiper {
    height: 642px;
  }
}
</style>
