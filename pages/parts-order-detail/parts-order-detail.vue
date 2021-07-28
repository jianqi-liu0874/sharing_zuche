<template>
	<view class="content">
		<view class="info-wrapper info-wrapper1">
			<image class="bicycle-img" mode="scaleToFill" src="../../static/vehicle.jpg"></image>
			<view class="bicycle-info" :style="{'color':globalData.commonTextColor1}">
				<view class="bicycle-name" :style="{'color':globalData.mainColor}">{{item.goodsName}}</view>
				<view>描述: {{item.spotlight}}</view>
			</view>
		</view>
		<view class="info-wrapper info-wrapper3" :style="{'color':globalData.commonTextColor2}">
			<view>
				<text>租借点</text>
				<text class="right-text">{{orderData.shopName}}</text>
			</view>
			<view>
				<text>租金费用</text>
				<text class="right-text">{{orderData.totalPayAmount}}元</text>
			</view>
			<view>
				<text>注意</text>
				<text class="right-text">还车/电需要到门店</text>
			</view>
			<view v-if="orderData.payMethod == 0" :style="{'color':globalData.mainColor}">
				<text class="right-text">本门店仅支持线下支付</text>
				<text class="iconfont icon-info right-text"></text>
			</view>
		</view>
		<view class="btn-wrapper">
			<button v-if="orderData.payMethod == 1"
				:style="{'color':globalData.textColor,'border-color':globalData.mainColor,'background-color':globalData.mainColor}"
				size="default" hover-class="none">立即支付</button>
			<button a:else
				:style="{'color':globalData.textColor,'border-color':globalData.mainColor,'background-color':globalData.mainColor}"
				size="default" hover-class="none">线下支付</button>
			<text class="help-text" :style="{'color':globalData.mainColor}">使用帮助</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				globalData: getApp().globalData
			}
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		background-color: #F1F0F6;
	}

	.info-wrapper {
		position: relative;
		margin-bottom: 12rpx;
		padding: 10rpx 40rpx;
		background-color: #fff;
	}

	.info-wrapper2 {

		text-align: center;
	}

	.bicycle-img {
		width: 230rpx;
		height: 176rpx;
		vertical-align: top;
	}

	.bicycle-info {
		display: inline-block;
		margin: 20rpx 0 0 70rpx;
	}

	.bicycle-info>view {
		margin-bottom: 10rpx;
	}

	.bicycle-name {
		font-size: 34rpx;
	}

	.start-time,
	.end-time {
		position: absolute;
		top: 24rpx;
		display: inline-block;
	}

	.start-time {
		left: 40rpx;
	}

	.end-time {
		right: 40rpx;
	}

	.date {
		font-size: 34rpx;
	}

	.time {
		margin-top: 10rpx;
		font-size: 30rpx;
	}

	.rent-time {
		display: inline-block;
		margin: 20rpx 0;
	}

	.arrow-right {
		width: 320rpx;
		height: 20rpx;
	}

	.info-wrapper3 {
		padding: 40rpx;
		font-size: 30rpx;
	}

	.info-wrapper3>view {
		margin-bottom: 18rpx;
	}

	.right-text {
		float: right;
	}

	.btn-wrapper {
		margin-top: 40rpx;
		text-align: center;
	}

	.btn-wrapper>button {
		margin: 0 auto 24rpx;
		width: 60%;
		border-radius: 12rpx;
	}

	.help-text {
		font-size: 26rpx;
	}
</style>
