<template>
	<view class="content">
		<view class="tab-content">
			<view class="item-wrapper" v-for="(item,index) in payHistoryList" :key="index">
				<view class="paid-item-top">
					<text :style="{'color':globalData.mainColor}">记录</text>
				</view>
				<view class="paid-item-bottom">
					<view class="paid-item-bottom-item">
						<text>金额</text>
						<text class="paid-item-bottom-item-right">{{item.amt}}</text>
					</view>
					<view class="paid-item-bottom-item">
						<text>支付时间</text>
						<text class="paid-item-bottom-item-right">{{item.dt}}</text>
					</view>
					<view class="paid-item-bottom-item">
						<text>扣款状态</text>
						<text class="paid-item-bottom-item-right">{{item.optState ? '扣款成功' : '扣款失败'}}</text>
					</view>
				</view>
			</view>
			<view class="bottom-tips">没有更多记录了</view>
		</view>
	</view>
</template>

<script>
	import {
		request_get
	} from '../../utils/http.js';

	const app = getApp();
	export default {
		data() {
			return {
				globalData: app.globalData,
				payHistoryList: []
			}
		},
		onLoad(options) {
			this.getPayHistory(options.ktNo)
			app.setNavigationBarColor();
		},
		methods: {
			getPayHistory(ktNo) {
				let url = app.globalData.baseUrl + `/papc/payHistory?ktNo=${ktNo}`
				request_get(url, (res) => {
					if (res.data.ret) {
						this.payHistoryList = res.data.data;

					}
				})
			},
		}
	}
</script>

<style>
	page {
		background-color: #F1F0F6;
	}

	.tabs-wrapper {
		width: 100vw;
	}

	.tab-content {
		background-color: #F1F0F6;
	}

	.item-wrapper {
		margin-bottom: 12rpx;
		padding: 40rpx 40rpx 20rpx;
		font-size: 30rpx;
		background-color: #fff;
	}

	.paid-item-top {
		padding-bottom: 18rpx;
		border-bottom: 1rpx solid #E3E3E3;
	}

	.paid-item-bottom {
		margin-top: 18rpx;
	}

	.pay-money {
		float: right;
		color: #EA4142;
	}

	.paid-item-bottom-item {
		margin: 10rpx 0;
		color: #303133;
	}

	.paid-item-bottom-item-right {
		float: right;
	}

	.bottom-tips {
		padding: 24rpx 0 48rpx;
		text-align: center;
		font-size: 26rpx;
		color: #909399;
	}

	.btn-wrapper {
		margin-top: 18rpx;
		height: 55rpx;
	}

	.pay-btn,
	.cancel-btn {
		float: right;
		padding: 10rpx 16rpx;
		text-align: center;
		font-size: 26rpx;
		color: #898989;
		border: 1rpx solid #898989;
		border-radius: 10rpx;
	}

	.pay-btn {
		width: 90rpx;
	}

	.cancel-btn {
		margin-right: 20rpx;
		width: 110rpx;
	}

	.am-collapse-item-title {
		padding: 0;
		margin: 0;
	}
</style>
