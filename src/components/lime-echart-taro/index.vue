<template>
  <view class="lime-echart" :style="props.customStyle" v-if="canvasId">
    <canvas
      class="lime-echart__canvas"
      v-if="use2dCanvas"
      type="2d"
      :id="canvasId"
      :class="canvasId"
      :disable-scroll="isDisableScroll"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    />
    <canvas
      class="lime-echart__canvas"
      v-else
      :canvas-id="canvasId"
      :class="canvasId"
      :id="canvasId"
      :disable-scroll="isDisableScroll"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    />
  </view>
</template>
<script setup >
import { defineProps, getCurrentInstance, defineExpose, nextTick } from "vue";
import uni, { compareVersion, wrapTouch, ENV_TYPE, sleep } from "./utils";
import { Canvas, setCanvasCreator, dispatch } from "./canvas";

const props = defineProps({
  type: {
    type: String,
    default: "2d",
  },
  isDisableScroll: Boolean, 
  customStyle: String,
  isClickable: Boolean,
});
const slef = getCurrentInstance();
const canvasId = `lime-echart${slef.uid}`;
let chart = null;

const use2dCanvas = props.type == "2d" && ENV_TYPE();

const getContext = () => {
  const { pixelRatio } = uni.getSystemInfoSync();
  if (use2dCanvas) {
    return new Promise((resolve) => {
      uni
        .createSelectorQuery()
        // .in(slef)
        .select(`.${canvasId}`)
        .fields({
          node: true,
          size: true,
        })
        .exec((res) => {
          let { node, width, height } = res[0];
          const ctx = node.getContext("2d");
          const canvas = new Canvas(ctx, canvasId, true, node);
          resolve({
            canvas,
            width,
            height,
            devicePixelRatio: pixelRatio,
          });
        });
    });
  } else {
    return new Promise((resolve) => {
      uni
        .createSelectorQuery()
        .in(slef)
        .select(`#${canvasId}`)
        .boundingClientRect()
        .exec((res) => {
          if (res) {
            let { width, height } = res[0];
            const ctx = uni.createCanvasContext(canvasId, slef);
            const canvas =
              uni.getEnv() == uni.ENV_TYPE.WEB && uni.isTaro
                ? document.querySelector(`#${canvasId}`)
                : new Canvas(ctx, canvasId, false);
            resolve({ canvas, width, height, devicePixelRatio: pixelRatio });
          }
        });
    });
  }
};

const init = async (echarts, cb) => {
  await nextTick();
  await sleep(30);
  let config = await getContext();
  if (typeof cb === "function") {
    if ((uni.getEnv() !== uni.ENV_TYPE.WEB && uni.isTaro) || !uni.isTaro) {
      setCanvasCreator(echarts, config);
    }
    chart = echarts.init(config.canvas, null, config);
    cb(chart, config);
  } else {
  }
};

const setOption = (...option) => {
  if (chart) {
    chart.setOption(option[0], option[1]);
  } else {
  }
};

const setChart = (cb) => {
  if (chart) {
    return cb(chart);
  } else {
  }
};

const getChart = () => {
  if (chart) {
    return chart;
  } else {
    return chart;
  }
};

const canvasToTempFilePath = () => {};
const touchStart = (e) => {
  if (chart && e.touches.length > 0) {
    const touch = e.touches[0];
    const handler = chart.getZr().handler;
    dispatch.call(handler, "mousedown", touch);
    dispatch.call(handler, "mousemove", touch);
    handler.processGesture(wrapTouch(e), "start");
  }
};
const touchMove = (e) => {
  if (chart && e.touches.length > 0) {
    const handler = chart.getZr().handler;
    dispatch.call(handler, "mousemove", e.touches[0]);
    handler.processGesture(wrapTouch(e), "change");
  }
};
const touchEnd = (e) => {
  if (chart) {
    const touch = e.changedTouches ? e.changedTouches[0] : {};
    const handler = chart.getZr().handler;
    dispatch.call(handler, "mouseup", touch);
    if (props.isClickable) {
      dispatch.call(handler, "click", touch);
    }
    handler.processGesture(wrapTouch(e), "end");
  }
};

defineExpose({
  init,
  setOption,
  getChart,
  setChart,
});
</script>
<style>
.lime-echart {
  position: relative;
  width: 100%;
  height: 100%;
}
.lime-echart__canvas {
  width: 100%;
  height: 100%;
}
</style>
