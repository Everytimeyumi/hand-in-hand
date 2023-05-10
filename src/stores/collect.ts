import { defineStore } from 'pinia'
import api from '../services/api'
import _ from 'lodash'
import { useIndexStore } from './index'
export const collectIndexStore = defineStore({
    id: 'collect',
    state: () => ({
        paginationSetting: {
            pageNum: 1, //请求分页当前页
            pageSize: 10, //请求分页每页个数
            pages: 0,
            total: 0
        },
        collectList: [],
        
    }),
    getters: {

    },
    actions: {
     
        setCollectList(collection) {
            const { pageNum, rows, pageSize, pages, total } = collection
            const result = _.map(rows, (obj) => {
                if (_.isString(obj.imgUrl) && _.includes(obj.imgUrl, ',')) {
                  return { ...obj, imageList: _.split(obj.imgUrl, ',') };
                }else{
                    if(obj.imgUrl) return {...obj,imageList:[obj.imgUrl] }
                    return {...obj,imageList:[] }
                }
              });
            this.collectList = _.concat(this.collectList, result)
            this.paginationSetting = {
                pageNum,
                pageSize,
                pages,
                total
            }
        },
        async queryCollectList() {
            const useIndex =useIndexStore()
            const {id} = useIndex.useAuth
            const { pageNum, pageSize } = this.paginationSetting
            let params = { pageNum, pageSize,userId:id }
            const { data } = await api.post('user/collect/pageList', params)
            if (data && data.code == 0) {
                this.setCollectList(data.data)
            }

        },
        async remove(id){
            await api.post(`user/delCollect?id=${id}`, id)  
            setTimeout(()=>{
                _.remove(this.collectList, (o:any)=> { return o.id == id });
            },1000)

        }

    },
})
