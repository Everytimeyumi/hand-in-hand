<template>
	<view class="doc-card">
		<view class="flex radius doc-card-navigator" :class="['bg-' + colorName + '-gradient']">
			<view class="flex-sub p-4 doc-text">
				<view class="doc-title">{{ title }}</view>
				<view class="text-lg text-Abc text-lighter doc-name">{{ textInfo }}</view>
			</view>
			<view class="mt-2 mr-1 pt-4 pr-4 pl-2 doc-icon"><text class="icon-xl text-xl"></text></view>
			<view class="doc-dot doc-dot1" :class="['bg-' + colorName + '-gradient']"></view>
			<view class="doc-dot doc-dot2" :class="['bg-' + colorName + '-gradient']"></view>
			<view class="doc-dot doc-dot3" :class="['bg-' + colorName + '-gradient']"></view>
		</view>
		<view class="doc-bg" :class="['bg-' + colorName]"></view>
	</view>
</template>
  
<script>
import { reactive, ref, onMounted } from 'vue';


export default {
	props: {
		colorName: String,
		title: String,
		textInfo: String
	},
	data() {
		return {
			// colorname: 'cyan'
		}
	},
	setup() {
		const state = reactive({


		});

	}
}
</script>
  
<style lang="scss" >
.doc-card {
	position: relative;

	.doc-card-navigator {
		position: relative;
		z-index: 2;
		overflow: hidden;
		padding: 26px;
	}

	.doc-bg {
		position: relative;
		z-index: 2;
		text-shadow: 2px 3px 5px rgba(0, 0, 0, .1);
	}

	.radius {
		border-radius: 15px !important;
	}

	.doc-title {
		position: relative;
		display: inline-block;
		padding-bottom: 20px;
		font-size: 34px;

		&::after {
			content: '';
			position: absolute;
			width: calc(100% + 20px);
			height: 2px;
			background-color: currentColor;
			left: 0;
			bottom: 0;
		}
	}

	.doc-text {
		font-size: 28px;
	}

	.doc-name {
		position: relative;
		display: block;
		padding-top: 20px;

		&::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 1px;
			background-color: currentColor;
			left: 0;
			top: 0;
		}
	}

	.doc-text {
		position: relative;
		z-index: 2;
		padding-right: 50px !important;
	}

	.doc-icon {
		position: absolute;
		z-index: 2;
		right: 0;
	}

	.doc-dot {
		position: absolute;
		z-index: 1;
		border-radius: 50%;
		transition: all 0.6s cubic-bezier(.08, .82, .17, 1);
		opacity: .3;

		&.doc-dot1 {
			width: 400px;
			height: 400px;
			left: 0;
			top: auto;
			right: auto;
			bottom: -300px;
			filter: hue-rotate(30deg) brightness(160%);
		}

		&.doc-dot2 {
			left: -40px;
			top: auto;
			right: auto;
			bottom: -20px;
			width: 300px;
			height: 300px;
			filter: brightness(80%);
		}

		&.doc-dot3 {
			top: -120px;
			right: -120px;
			opacity: 0.6;
			width: 240px;
			height: 240px;
			filter: brightness(120%);
		}
	}

	.doc-bg {
		position: absolute;
		z-index: 0;
		width: calc(100% - 80px);
		height: 20px;
		bottom: -15px;
		left: 0;
		right: 0;
		margin: auto;
		border-radius: 10px;
		// filter: blur(10px);
		opacity: 0.2;
	}

	&:hover {
		.doc-dot1 {
			transform: translateX(-100px) translatey(-360px);
			filter: hue-rotate(-30deg) brightness(80%);
		}

		.doc-dot2 {
			transform: translateX(300px) translatey(0px);
			filter: brightness(120%);
		}

		.doc-dot3 {
			filter: brightness(80%);
			transform: translateX(-300px) translatey(240px);
		}
	}
}

.ui-cards {
	display: block;
	overflow: hidden;

	& .ui-btn.badge {
		top: 0;
		right: 0;
		font-size: 24px;
		padding: 0px 15px;
		height: 40px;
	}

	&.no-card>.ui-item {
		margin: 0px;
		border-radius: 0px;
	}

	&>.ui-item {
		display: block;
		overflow: hidden;
		border-radius: 10px;
		margin: 30px;
	}

	&>.ui-item.shadow-blur {
		overflow: initial;
	}

	.grid.grid-square {
		margin-bottom: -20px;
	}

	&.article {
		display: block;

		&>.ui-item {
			padding: 30px;
			background-color: var(--box-bg);
			display: flex;
			align-items: flex-start;
		}

		&>.time {
			padding: 30px 0 0 30px;
		}

		&>.ui-item .title {
			font-size: 30px;
			font-weight: 900;
			color: #333333;
		}

		&>.ui-item .content {
			flex: 1;
		}

		&>.ui-item>image {
			width: 240px;
			height: 6.4em;
			margin-left: 20px;
			border-radius: 6px;
		}

		&>.ui-item .content .desc {
			font-size: 12px;
			color: var(--text-c);
		}

		&>.ui-item .content .text-content {
			font-size: 28px;
			color: #888;
		}
	}

	&.case {
		.image {
			position: relative;

			image {
				width: 100%;
				display: block;
			}

			.ui-tag {
				position: absolute;
				right: 0;
				top: 0;
			}

			.ui-bar {
				position: absolute;
				bottom: 0;
				width: 100%;
				background-color: transparent;
				padding: 0px 30px;
			}

			.bg-black {
				position: absolute;
				bottom: 0;
				width: 100%;
				background-color: rgba(0, 0, 0, 0.6);
			}
		}

		&.no-card .image {
			margin: 30px 30px 0;
			overflow: hidden;
			border-radius: 10px;
		}
	}

	&.dynamic {
		display: block;

		&>.ui-item {
			display: block;
			overflow: hidden;

			&>.text-content {
				padding: 0 30px 0;
				font-size: 30px;
				margin-bottom: 20px;
			}

			& .square-img {
				width: 100%;
				height: 200px;
				border-radius: 6px;
			}

			& .only-img {
				width: 100%;
				height: 320px;
				border-radius: 6px;
			}
		}
	}

	&.goods {
		display: block;

		&>.ui-item {
			padding: 30px;
			display: flex;
			position: relative;
			background-color: var(--ui-BG);

			&+.ui-item {
				border-top: 1px solid #eeeeee;
			}

			.content {
				width: 410px;
				padding: 0px;
			}

			.title {
				font-size: 30px;
				font-weight: 900;
				color: #333333;
				line-height: 1.4;
				height: 1.4em;
				overflow: hidden;
			}
		}

		&.col-goods.col-twice {
			display: flex;
			flex-wrap: wrap;
			padding-bottom: 30px;

			&>.ui-item {
				width: calc(50% - 30px);
				margin: 20px 20px 0px 20px;

				.content {
					padding: 20px;
				}
			}

			&>.ui-item:nth-child(2n) {
				margin-left: 0px;
			}
		}

		&.col-goods>.ui-item {
			padding: 0px;
			display: block;
			border: 0px;

			.content {
				width: 100%;
				padding: 30px;
			}
		}

		&.no-card>.ui-item .content {
			width: 470px;
			padding: 0px;
		}

		&.no-card>.ui-item .title,
		&.col-goods>.ui-item .title {
			height: 3em;
			overflow: hidden;
		}

		&>.ui-item .text-linecut-2 {
			-webkit-line-clamp: 1;
		}

		&.no-card>.ui-item .text-linecut-2,
		&.col-goods>.ui-item .text-linecut-2 {
			-webkit-line-clamp: 2;
			line-height: 1.6em;
			height: 3.2em;
		}

		&>.ui-item>image {
			width: 200px;
			height: 200px;
			margin-right: 20px;
			border-radius: 6px;
		}

		&.no-card>.ui-item>image {
			width: 220px;
			height: 170px;
		}

		&.col-goods>.ui-item>image {
			width: 100%;
			height: 340px;
			border-bottom-left-radius: 0px;
			border-bottom-right-radius: 0px;
			display: block;
		}

		&.col-goods.col-twice>.ui-item>image {
			height: 236px;
		}
	}

	&.loan {
		display: block;

		&>.ui-item {
			padding: 30px 0 30px 30px;
			display: flex;
			position: relative;
			background-color: var(--box-bg);

			.content {
				width: 450px;
				padding: 0px;

				.tag-list {
					width: 450px;
					display: flex;
					flex-wrap: wrap;
					font-size: 12px;
					margin-top: 18px;
				}
			}

			.action {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
			}
		}
	}

	&.houses {
		display: block;

		&>.ui-item {
			padding: 20px;
			display: flex;
			position: relative;
			background-color: var(--box-bg);

			.image {
				width: 230px;
				height: 180px;
				margin-right: 20px;
				border-radius: 6px;
			}

			.content {
				width: 400px;
				padding: 0px;

				.tag-list {
					width: 400px;
					display: flex;
					flex-wrap: wrap;
					font-size: 12px;
					margin-top: 10px;

					.ui-item {
						height: 20px;
						line-height: 20px;
					}
				}
			}

			.action {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
			}
		}
	}

	&.product {
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 30px;

		&>.ui-item {
			width: calc(100% - 15px);
			margin: 20px 20px 0px 20px;
			background-color: var(--box-bg);
			position: relative;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

			// display: flex;
			// flex-wrap: wrap;
			.content {
				padding: 20px;

				// width: calc(100% - 345px);
				.text-cut {
					font-size: 16px;
				}
			}

			.image {
				width: 100%;
				height: 240px;
				border-radius: 6px 0 0 6px;
				display: block;
			}

			.ui-progress-tag {
				width: 4em;
				text-align: right;
				font-size: 12px;
			}

			.border-top {
				width: 100%;
			}

			.ui-tag {
				position: absolute;
				top: 0;
				left: 0;
				border-radius: 6px 0 6px 0;
			}
		}

		// & > .ui-item:nth-child(2n) {
		// 	margin-left: 0px;
		// }
	}

	&.shop {
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 30px;

		&>.ui-item {
			width: calc(50% - 30px);
			margin: 20px 20px 0px 20px;
			background-color: var(--box-bg);
			padding: 20px;

			.content {
				margin-top: 15px;
			}

			.image {
				width: 100%;
				height: 285px;
				border-radius: 6px;
				display: block;
			}
		}

		&>.ui-item:nth-child(2n) {
			margin-left: 0px;
		}
	}

	&.orders .ui-item {
		margin-top: 30px;

		.address-box {
			padding: 15px;
			margin: 0 30px 30px;
			border: 1px solid;
			border-color: var(--main-a);
			border-radius: 10px;
			position: relative;

			.ui-form-group {
				min-height: 10px;
			}
		}
	}
}</style>
  