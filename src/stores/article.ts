import { defineStore,  } from 'pinia'
import api from '../services/api'
import _ from 'lodash'
export const articleIndexStore = defineStore({
    id: 'article',
    state: () => ({
        paginationSetting: {
            pageNum: 1, //请求分页当前页
            pageSize: 10, //请求分页每页个数
            pages: 0,
            total: 0
        },
        articleList: [],
        articleDetail: {}
    }),
    getters: {

    },
    actions: {
        async queryArticleDetail(id) {
            const { data } = await api.post(`article/detail?id=${id}`,)
            this.articleDetail = data.data

        },
        setArticleList(collection) {
            const { pageNum, rows, pageSize, pages, total } = collection
            this.articleList = _.concat(this.articleList, rows)
            this.paginationSetting = {
                pageNum,
                pageSize,
                pages,
                total
            }
        },
        async queryArticleList() {
            const { pageNum, pageSize, pages } = this.paginationSetting
            let params = { pageNum, pageSize, pages }
            const { data } = await api.post('article/pageList', params)
            if (data && data.code == 0) {
                this.setArticleList(data.data)
            }

        },

    },
})
