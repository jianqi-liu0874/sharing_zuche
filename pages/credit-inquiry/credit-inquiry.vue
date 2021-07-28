<template>
	<view class="content">
		<view class="credit-wrapper">
			<view class="zhima-score-area">
				<view class="zhima-score">{{zhimaScore}}</view>
				<view class="zhima-score-text">芝麻分</view>
			</view>
			<view v-if="zhimaScore >= 650" class="zhima-desc-area">
				<text class="iconfont icon-zhengque"></text>
				您的芝麻信用良好，可以享受免押租赁。
			</view>
			<view v-else-if="zhimaScore < 650" class="zhima-desc-area">
				<text class="iconfont icon-cuowu"></text>
				您的芝麻信用分不足，需要先进行实名认证，并缴纳押金300元。
			</view>
		</view>
		<view class="btn-wrapper">
			<button v-if="zhimaScore >= 650" size="default" hover-class="none">立即租赁</button>
			<button v-else-if="zhimaScore < 650" size="default" hover-class="none" @click="toRealName">立即认证</button>
		</view>
	</view>
</template>

<script>
	import {
		goPage
	} from '../../utils/util.js';
	export default {
		data() {
			return {
				zhimaScore: 450,
			}
		},
		methods: {
			toRealName() {
				goPage('/pages/real-name-authentication/real-name-authentication');
			},
		}
	}
</script>

<style>
	.credit-wrapper {
		margin: 0 auto;
		width: 85%;
		border-bottom: 1rpx solid #E8E8E8;
	}

	.zhima-score-area {
		margin: 60rpx auto 40rpx;
		padding-top: 1rpx;
		text-align: center;
		width: 200rpx;
		height: 200rpx;
		background: url("../../static/zhima_circle.png");
		background-size: 200rpx 200rpx;
		background-repeat: no-repeat;
	}

	.zhima-score {
		margin-top: 36rpx;
		font-size: 64rpx;
		font-weight: 600;
	}

	.zhima-score-text {
		margin-top: 10rpx;
		font-size: 28rpx;
	}

	.zhima-desc-area {
		margin: 60rpx auto;
		line-height: 60rpx;
		text-align: center;
	}

	.icon-zhengque,
	.icon-cuowu {
		margin-right: 16rpx;
		font-size: 36rpx;
		color: #00CCCC;
	}

	.btn-wrapper {
		margin: 120rpx auto 0;
		width: 80%;
	}

	.btn-wrapper>button {
		color: #fff;
		border-color: #00CCCC;
		background-color: #00CCCC;
		border-radius: 12rpx;
	}
</style>
