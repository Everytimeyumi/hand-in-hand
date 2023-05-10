import Taro from '@tarojs/taro'
interface  params {
   key:string;
   value:any   
}
export const getStorageSync = (data:params)=>{
    const {key} =data
    // console.log(Taro,'taro')
    const value = Taro.getStorageSync(key)
    if(value) return JSON.parse(value)
  }
export const setStorage =(data:params)=>{
    const {key, value} =data
    const storeLoacton:string = JSON.stringify(value)
    Taro.setStorage({
      key,
      data:storeLoacton
    }) 
  }


  