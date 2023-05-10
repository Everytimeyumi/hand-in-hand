<template>
    <view class="aswer">
        <view class="cu-card article no-card">
            <view class="cu-item shadow">
                <view class="title text-cyan">
                    <view class="text-cut">{{ questionData.infoScore.totalSocreText }}</view>
                </view>
                <view class="content">
                    <view class="desc">
                        <view>
                            <view class="cu-tag bg-red light sm round">阳性因子: {{ questionData.infoScore.positiveNum }}</view>
                            <view class="cu-tag bg-green light sm round">阴性因子{{ questionData.infoScore.negativeNum }}</view>
                        </view>
                        <view class="text-content margin-top"><text class="text-cyan">可能表现:</text> {{
                            questionData.infoScore.infoText }}</view>

                    </view>
                </view>
            </view>
        </view>
        <view class=" margin-top aswer__chats flex align-center justify-center response bg-white">
            <l-echart ref="chart" style="width:300px; height:280px;"></l-echart>
        </view>
    </view>
</template>
  
<script setup>
import { ref, onMounted } from "vue";
import LEchart from "../../components/lime-echart-taro/index.vue";
import { questionIndexStore } from '../../stores/question'
import * as echarts from 'echarts/core';
import { ToolboxComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([
    ToolboxComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout
]);

//-------------------------------------

const questionData = questionIndexStore()

let chart = ref(null);
onMounted(async () => {
    await questionData.getAswer()
    let option = {
        toolbox: {
            show: false,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        series: [
            {
                name: 'Nightingale Chart',
                type: 'pie',
                radius: '50%',
                center: ['50%', '50%'],
                roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                data: questionData.chatList
            }
        ]
    };
    if (chart.value) {
        chart.value.init(echarts, (chart) => {
            chart.setOption(option);
        });
    }
    questionData.text()
});
</script>
  
<style lang="scss"  >
.aswer {
    .aswer__scroll-view {
        height: 100vh;
    }

    .aswer__result {
        height: 488px;
        width: 100%;
        // line-height: 30px;
        // background-size: cover;
        // background-position: center;
        // background-color: #fff;
        // background-image: url('https://image-1317015482.cos.ap-shanghai.myqcloud.com/hand-in-hand/R-C.jpg');
    }

    .cu-card.article>.cu-item .content .text-content {
        font-size: 28rpx;
        color: #888;
        height: auto !important;
        overflow: hidden;
    }

}
</style>
  