<template>
	<view class="content">

		<view v-if="isPassed" class="info-wrapper info-wrapper0">
			<text class="iconfont icon-zhengque" :style="{'color':globalData.mainColor}"></text>
			<text class="result-text">审核通过</text>
		</view>
		<view v-else class="info-wrapper info-wrapper0">
			<text class="iconfont icon-cuowu"></text>
			<text class="result-text">审核不通过</text>
		</view>

		<view class="info-wrapper info-wrapper1">
			<image class="bicycle-img" mode="scaleToFill" src="../../static/vehicle.jpg"></image>
			<view class="bicycle-info">
				<view class="bicycle-name" :style="{'color':globalData.mainColor}">雅迪电动车</view>
				<view>原编号: 003465408</view>
				<view>更换为: 003456789</view>
				<view>申请时间: 2020-04-08 10:20:20</view>
				<view>审核实际: 2020-04-08 10:25:20</view>
			</view>
		</view>
		<view class="info-wrapper info-wrapper2">
			<view class="start-time">
				<view class="date">02月02日</view>
				<view class="time">08:00</view>
			</view>
			<view class="rent-time">
				<view :style="{'color':globalData.mainColor}">2个月</view>
				<image class="arrow-right" mode="scaleToFill" src="../../static/arrow_right.png" />
				<view :style="{'color':globalDa.mainColor}">周期</view>
			</view>
			<view class="end-time">
				<view class="date">02月02日</view>
				<view class="time">08:00</view>
			</view>
		</view>
		<view class="info-wrapper info-wrapper3">
			<view>
				<text>订单编号</text>
				<text class="right-text">20200408050089655</text>
			</view>
			<view>
				<text>剩余天数</text>
				<text class="right-text">50天</text>
			</view>
			<view>
				<text>损耗费</text>
				<text class="right-text">20元</text>
			</view>
			<view>
				<text>备注</text>
				<text v-if="isPassed" class="right-text red-text">租赁物品前轮破损，需支付损耗金20元</text>
				<text v-else class="right-text red-text">已修好，无须更换租赁物品</text>
			</view>
		</view>
		<view class="btn-wrapper">
			<button v-if="isPassed"
				:style="{'color':globalData.textColor,'border-color':globalData.mainColor,'background-color':globalData.mainColor}"
				size="default" hover-class="none">支付损耗金: 20元</button>
			<button v-else
				:style="{'color':globalData.textColor,'border-color':globalData.mainColor,'background-color':globalData.mainColor}"
				size="default" hover-class="none">我知道了</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				globalData: getApp().globalData,
				isPassed: true
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
		padding: 10rpx 30rpx;
	}

	.info-wrapper2 {
		text-align: center;
	}

	.bicycle-img {
		width: 180rpx;
		height: 180rpx;
		vertical-align: top;
		margin-top: 30rpx;
	}

	.bicycle-info {
		display: inline-block;
		margin-left: 50rpx;
		padding: 10rpx 0;
		font-size: 28rpx;
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
		top: 44rpx;
		display: inline-block;
		/* background-color: pink; */
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

	.info-wrapper0 {
		text-align: center;
		padding: 20rpx 0;
	}

	.result-text {
		font-size: 30rpx;
		font-weight: 600;
	}

	.icon-zhengque,
	.icon-cuowu {
		margin-right: 10rpx;
		font-size: 36rpx;
	}

	.icon-cuowu {
		color: #EA4142;
	}
</style>
