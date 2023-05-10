import { defineStore } from 'pinia'
import Taro from '@tarojs/taro'
import api from '../services/api'
import _ from 'lodash'
import { useIndexStore } from './index'
export const communityIndexStore = defineStore({
    id: 'community',
    state: () => ({
        prompt: '',
        communityComment: {
        },
        commentList: [],
        uploadParams: {
            total: 0,
            successs: 0,
            uploadUrls: []
        },

        paginationSetting: {
            pageNum: 1, //请求分页当前页
            pageSize: 10, //请求分页每页个数
            pages: 0,
            total: 0
        },
        credentials: {
            sessionToken: '',
            tmpSecretId: '',
            tmpSecretKey: "",
        },
        tempFilePaths: [],
        imgList: [],
        modalName: null,
        textareaAValue: '',
        communityList: []

    }),
    getters: {
        percent(state) {
            const total = state.uploadParams.total
            const success = state.uploadParams.successs
            if (!total) return 20
            return _.round(success / total * 100, 2);
        }
    },
    actions: {
        // 动态列表
        setCommunityList(collection) {
            const { pageNum, rows, pageSize, pages, total } = collection
            const result = _.map(rows, (obj) => {
                if (_.isString(obj.imgUrl) && _.includes(obj.imgUrl, ',')) {
                    return { ...obj, imageList: _.split(obj.imgUrl, ',') };
                } else {
                    if (obj.imgUrl) return { ...obj, imageList: [obj.imgUrl] }
                    return { ...obj, imageList: [] }
                }
            });

            this.communityList = _.concat(this.communityList, result)
            this.paginationSetting = {
                pageNum,
                pageSize,
                pages,
                total
            }
        },
        //查询评论
        async queryCommunityComment(id) {
            const trendsId = { trendsId: id }
            const collection = await api.post(`user/listTrendsComment`, trendsId)
            this.commentList = collection.data.data
        },
        // 查询动态
        async queryCommunity(type) {
            const { pageNum, pageSize, pages } = this.paginationSetting

            let params
            if (type == 'mine') {
                const useIndex = useIndexStore()
                const { id } = useIndex.useAuth
                params = { userId: id, pageNum, pageSize, pages }

            } else {
                params = { pageNum, pageSize, pages }
            }
            const { data } = await api.post('user/trends/pageList', params)
            if (data && data.code == 0) {
                this.setCommunityList(data.data)
            }

        },
        // 收藏动态
        async favorfill({ trendsId, type }) {
            const useIndex = useIndexStore()
            const { id } = useIndex.useAuth
            const data = await api.post('user/addCollect', { userId: id, trendsId })
             if (data.data.code == 0) {
                if (type == 'detail') {
                    this.communityComment.collectNum++
                }
                const index = _.findIndex(this.communityList, (item: any) => {
                    return item.id == trendsId
                })
                this.communityList[index].collectNum++
                Taro.atMessage({
                    message: '收藏成功',
                    type: 'success',
                    duration:'500'
                })
            } else {
                Taro.atMessage({
                    message: '你已经收藏过',
                    type: 'error',
                    duration:'500'
                })
            }

        },
        // cos凭证
        async getCosSession() {
            const data = await api.get('cos' ,{ baseConfig:'cos'})
            const credentials = data.data.credentials
            this.credentials = credentials
        },
        // 添加动态
        async addCommunityList() {
            const useIndex = useIndexStore()
            const { id } = useIndex.useAuth
            const params = {
                userId: id, //用户id
                content: this.textareaAValue, //动态内容
                imgUrlList: this.uploadParams.uploadUrls,
                satus: 0
            }
             await api.post('user/publishTrends', params)

        },
        // 评论动态
        async sendMessage(trendsId) {
            const useIndex = useIndexStore()
            const userId = useIndex.useAuth.id
            const params = {
                userId,
                trendsId,
                // commentId:0,
                content: this.prompt
            }
            const collection = await api.post('user/addComment', params)
            if (collection.data.code == 0) {
                this.communityComment.commentNum++
            }
        },
        clearText() {
            this.prompt = ''
        },
        async remove(id) {
            const collection = await api.post(`user/delTrends?id=${id}`)
            if (collection && collection.data.code == 0) {
                _.remove(this.communityList, (o: any) => { return o.id == id });
            }

        }

    },
})

