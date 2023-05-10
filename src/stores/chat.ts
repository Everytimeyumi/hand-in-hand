import { defineStore } from 'pinia'
import api from '../services/api'
import { getStorageSync, setStorage } from './store'
import _ from 'lodash'
import { useIndexStore } from './index'
import moment from 'moment'
export const chatIndexStore = defineStore({
  id: 'chat',
  state: () => ({
    chatList: [],
    chat: {},
    prompt: '',
    message:'',
    loadingText: '',
    scroll:0,
    

  }),
  getters: {

  },
  actions: {
    onLoadChat() {
      const list = getStorageSync({ key: 'chatList', value: null })
      if (list) this.chatList = list
    },
    removeChat(){
      setStorage({key:'chatList',value:null})
    },
    clearText() {
      this.prompt = ''
    },
    savePrompt() {
      const chat = {
        dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        text: this.message,
        type: 'me'
      }
      this.chatList.push(chat)
     
    },
    async sendMessage() {
      const data = {
        prompt: this.message,
        options: {},
        systemMessage: '',
      }
      const useIndex = useIndexStore()
      const userId = useIndex.useAuth.id
      await this.savePrompt()
      this.scroll= this.chatList.length-1
      await api.post('user/addUserChatRecord', {
        userId,
        chatContent: this.message,
        type: 1,
        sendTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
    
      const res = await api.post('api/chat-process', data, { useToken: 'Bearer liu7770687' ,baseConfig:'node'})
      const messages = res.data.split('\n')
        .filter(chunk => chunk.trim())
        .map(chunk => JSON.parse(chunk)
        )
      const sentence = _.findLast(messages, obj => obj.text !== "").text
      const chat = {
        dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        text: sentence,
        type: 'robot'
      }
      this.chatList.push(chat)
      this.scroll= this.chatList.length-1
      await api.post('user/addUserChatRecord', {
        userId,
        chatContent: sentence,
        type: 2,
        sendTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
      setStorage({ key: 'chatList', value: this.chatList })
    },
  },
})

