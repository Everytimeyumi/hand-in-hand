<template>
	<view class="page">
		<view class="load-progress" :class="loadProgress != 0 && showProgress ? 'show' : 'hide'"
			:style="[{ top: CustomBar + 'px' }]">
			<view class="load-progress-bar bg-green"
				:style="[{ transform: 'translate3d(-' + (100 - loadProgress) + '%, 0px, 0px)' }]"></view>
			<view class="load-progress-spinner text-green"></view>
		</view>
		<scroll-view class="page-scroll-view" enhanced :scroll-y="true" @scrolltoupper="upper" @scrolltolower="lower"
			  :scroll-into-view="'scroll-' + chatStore.scroll" >
			<view class="cu-chat" id="scrolltop">
				<view v-for="(item,index) in chatStore.chatList">
					<view class="cu-item self" v-if="item.type === 'me'"   :id="'scroll-' + index">
						<view class="main">
							<view class="content bg-green shadow">
								<text>{{ item.text }}</text>
							</view>
						</view>
						<view class="cu-avatar radius" :style="`background-image:url(${useIndex.auth.avatarUrl});`">
						</view>
						<view class="date">{{ item.dateTime }}</view>
					</view>
					<!-- 左边 -->
					<view class="cu-item" v-else  :id="'scroll-' + index">
						<view class="cu-avatar radius"
							style="background-image:url(https://image-1317015482.cos.ap-shanghai.myqcloud.com/hand-in-hand/bot-logo);">
						</view>
						<view class="main">
							<view class="content shadow">
								<text>{{ item.text }}</text>
							</view>
						</view>
						<view class="date "> {{ item.dateTime }}</view>
					</view>
				</view>
			</view>
			<view class="scroll-view-botton" id="scrollbottom"></view>
		</scroll-view>
		<view class="cu-bar foot input" :style="[{ bottom: InputBottom + 'px' }]">
			<view class="action" @tap="delChat">
				<text class="cuIcon-delete text-grey"></text>
			</view>
			<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
				@focus="InputFocus" @blur="InputBlur" v-model="chatStore.prompt" />
			<view>
				<button class="cu-btn shadow" :class="flag ? 'bg-grey' : 'bg-green'" @tap="tapSendMessage">发送</button>
			</view>

		</view>
		<AtMessage />
	</view>
</template>
  
<script >
import { reactive, toRefs, ref, onMounted, nextTick } from 'vue';
import Taro from '@tarojs/taro';
import { chatIndexStore } from '../../stores/chat'
import { useIndexStore } from '../../stores/index'
import Login from '../../components/login.vue'
export default {
	name: 'Index',
	components: {
		Login
	},
	setup() {
		const state = reactive({
			toView: 'scrolltop',
			scrollTop: 0,
			loadProgress: 0,
			CustomBar: 0,
			showProgress: true,
			flag: false,
			InputBottom: 0,
		});

		const scrollViewRef = ref(null);
		const useIndex = useIndexStore()
		const chatStore = chatIndexStore()
		const InputFocus = (e) => {
			state.InputBottom = e.detail.height
		}
		const InputBlur = (e) => {
			state.InputBottom = 0
		}
		onMounted(() => {
			// bottomEvent()
		chatStore.onLoadChat()
			setTimeout(()=>{
				nextTick(()=>{
					chatStore.scroll =chatStore.chatList.length-1
				})
			},1000)
		
		})
		const navigateToGO = (url) => {
			Taro.navigateTo({ url, })
		}

		const tapSendMessage = async () => {
			if (!chatStore.prompt) {
				Taro.atMessage({
					message: '您没有输入消息',
					type: 'error',
					duration:'500'
				})
				return
			}
			if (state.flag) return
			chatStore.message = chatStore.prompt
			chatStore.clearText()
			state.flag = true
			state.showProgress = true
			LoadProgress()
			await chatStore.sendMessage()
			state.loadProgress = 100
			state.showProgress = false
			
			setTimeout(() => {
				state.loadProgress = 0
				state.showProgress = true
				state.flag = false
			}, 500)
	
		}
	
		const LoadProgress = (e) => {
			state.loadProgress = state.loadProgress + 3;
			if (state.loadProgress < 80) {
				setTimeout(() => {
					LoadProgress();
				}, 100)
			}
		}
		const upper = (e) => {
		}

		const lower = (e) => {
		}

		const scroll = (e) => {
		}
		const delChat = () => {
			if (chatStore.chatList.length) {
				Taro.showModal({
					title: '提示',
					content: '删除聊天记录吗',
					success: (res) => {
						if (res.confirm) {
							chatStore.removeChat()
							chatStore.chatList = []
						} else if (res.cancel) {
						}
					}
				})
			} else {
				Taro.atMessage({
					message: '您暂时没有聊天记录',
					type: 'error',
					duration:'500'
				})
			}


		}
		return {
			...toRefs(state),
			chatStore,
			navigateToGO,
			InputFocus,
			InputBlur,
			tapSendMessage,
			useIndex,
			upper,
			lower,
			scroll,
			LoadProgress,
			delChat
		}
	}
}
</script>
  
<style lang="scss"  >
.page {
	.page-scroll-view {
		height: calc(100vh - 130px - env(safe-area-inset-bottom) / 2);
	}
}
</style>
  