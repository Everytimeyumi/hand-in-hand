<template>
	<view>
		<UploadImage ref="child" :limit="limit" />
		<view>
			<view class="cu-form-group margin-top-lg">
				<textarea :maxlength="290" showCount="true" :disabled="community.modalName != null" @input="textareaAInput"
					placeholder="输入动态"></textarea>
				<AtTextarea :maxLength="200" showCount="true" :disabled="community.modalName != null"
					@Change="textareaAInput" :value="community.textareaAValue" placeholder="输入动态"></AtTextarea>
			</view>
			<view class="cu-bar bg-white margin-top-lg">
				<view class="action">
					图片上传
				</view>
				<view class="action">
					{{ uploadUrlsLength }}/9
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item, index) in community.uploadParams.uploadUrls" :key="index"
						@tap="ViewImage" :data-url="item">
						<image :src="item" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="uploadUrlsLength < 9">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-cyan lg" @tap="addCommunity()">发布</button>
			</view>
		</view>
	</view>
</template>

<script>
import Taro from '@tarojs/taro'
import { eactive, ref, onMounted, getCurrentInstance, computed, reactive, toRefs } from 'vue'
import '../../common/css/ui-scss/main.css'
import '../../common/css/ui-scss/icon.css'
import { communityIndexStore } from '../../stores/community'
import UploadImage from '../../components/upload.vue'
import Login from '../../components/login.vue'
import _ from 'lodash'
export default ({
	components: {
		UploadImage,
		Login
	},
	setup(props) {

		const state = reactive({
			flag: false,
		});
		const community = communityIndexStore()
		const childRef = ref(null)
		onMounted(() => {
			childRef.value = getCurrentInstance().refs.child
		})
		const uploadUrlsLength = computed(() => {
			return community.uploadParams.uploadUrls.length
		})

		const limit = computed(() => {
			return 9 - community.uploadParams.uploadUrls.length
		})

		const ChooseImage = () => {
			childRef.value.UploadImage()
		}
		const ViewImage = (e) => {
			Taro.previewImage({
				urls: community.imgList,
				current: e.currentTarget.dataset.url
			});
		}
		const DelImg = (e) => {
			Taro.showModal({
				title: '是否删除',
				content: '确定要删除这图片吗？',
				cancelText: '再看看',
				confirmText: '再见',
				success: res => {
					if (res.confirm) {
						community.uploadParams.uploadUrls.splice(e.currentTarget.dataset.index, 1)
					}
				}
			})
		}
		const textareaAInput = (e) => {
			community.textareaAValue = e
		}
		const addCommunity = async () => {

			if (!community.textareaAValue) {
				Taro.atMessage({
					message: '请添加动态',
					type: 'success',
					duration:'500'
				})
				return
			}
			if (state.flag) return
			state.flag = true
			const params = { images: community.imgList, text: community.textareaAValue }
			await community.addCommunityList(params)
			 Taro.atMessage({
				message: '发布成功',
				type: 'success',
				duration:'500'
			})
			setTimeout(() => {
				state.flag = false
				community.textareaAValue = ''
				community.uploadParams = {
					total: 0,
					successs: 0,
					uploadUrls: []
				}
					Taro.navigateBack({ url: '/pages/community/index' })

			}, 700)

		}
		return {
			...toRefs(state),
			community,
			ChooseImage,
			ViewImage,
			textareaAInput,
			addCommunity,
			uploadUrlsLength,
			childRef
		}
	}
})
</script>

<style>
.cu-form-group .title {
	min-width: calc(4em + 15px);
}

.at-textarea {
	border: none !important;
}
</style>
