declare const my: UNI
declare const jd: UNI
declare const uni: UNI
declare const plus: UNI
declare const swan: UNI
declare const wx: UNI
declare interface UNI {
    [key: string]: any
}

const _uni = (() => {
    try {
        // import Taro from "@tarojs/taro";
        const Taro = require('@tarojs/taro')
        Taro.isTaro = true
        return Taro
    } catch (error) {
        const UNDEFINED = 'undefined'
        if (typeof uni != UNDEFINED) {
            uni.isTaro = false
            uni.getEnv = () => {
                if (typeof my != UNDEFINED) {
                    return 'ALIPAY'
                }
                if (typeof jd != UNDEFINED) {
                    return 'JD'
                }
                if (typeof plus != UNDEFINED) {
                    return 'RN'
                }
                if (typeof swan != UNDEFINED) {
                    return 'SWAN'
                }
                if (typeof wx != UNDEFINED) {
                    return 'WEAPP'
                }
                if (typeof window != UNDEFINED) {
                    return 'WEB'
                }
            }
            uni.ENV_TYPE = {
                ALIPAY: "ALIPAY",
                JD: "JD",
                QQ: "QQ",
                RN: "RN",
                SWAN: "SWAN",
                TT: "TT",
                WEAPP: "WEAPP",
                WEB: "WEB"
            }
        }
    }
})()

export default _uni
// 计算版本
export function compareVersion(v1: string, v2: string) {
    const v3 = v1.split('.')
    const v4 = v2.split('.')
    const len = Math.max(v3.length, v4.length)
    while (v3.length < len) {
        v3.push('0')
    }
    while (v4.length < len) {
        v4.push('0')
    }
    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v3[i], 10)
        const num2 = parseInt(v4[i], 10)
        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }
    return 0
}

export function wrapTouch(event: MouseEvent) {
    for (let i = 0; i < event.touches.length; ++i) {
        const touch = event.touches[i];
        touch.offsetX = touch.x;
        touch.offsetY = touch.y;
    }
    return event;
}

export const ENV_TYPE = () => {
    const { SDKVersion } = _uni.getSystemInfoSync();
    const type = {
        WEAPP: "2.9.2",
        ALIPAY: "2.7.0",
        TT: "1.78.0",
    }[_uni.getEnv()];
    return type && compareVersion(SDKVersion, type) >= 0;
};

export const sleep = (time) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
};