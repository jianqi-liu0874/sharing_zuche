<template>
	<view class="content">
		<view class="tab-content">
			<view class="item-wrapper" v-for="(item,index) in papcList" :key="index" :data-data="item"
				:data-index="index">
				<view class="paid-item-top">
					<text :style="{'color':globalData.mainColor}">已签约</text>
					<!--<text class="pay-money">-{{item.payAmt}}元</text> -->
				</view>
				<view class="paid-item-bottom">
					<view class="paid-item-bottom-item">
						<text>签约号</text>
						<text class="paid-item-bottom-item-right">{{item.ktNo}}</text>
					</view>
					<view class="paid-item-bottom-item">
						<text>下次扣款时间</text>
						<text class="paid-item-bottom-item-right">{{item.nextPayDate}}</text>
					</view>
					<view class="paid-item-bottom-item">
						<text>租赁周期</text>
						<text class="paid-item-bottom-item-right" v-if="item.periodUnit == 0">按小时租</text>
						<text class="paid-item-bottom-item-right" v-if="item.periodUnit == 7">按分钟租</text>
						<text class="paid-item-bottom-item-right" v-if="item.periodUnit == 1">按天租</text>
						<text class="paid-item-bottom-item-right" v-if="item.periodUnit == 5">按周租</text>
						<text class="paid-item-bottom-item-right" v-if="item.periodUnit == 2">按月租</text>
						<text class="paid-item-bottom-item-right" v-if="item.periodUnit == 3">按季租</text>
						<text class="paid-item-bottom-item-right" v-if="item.periodUnit == 4">按年租</text>
						<text class="paid-item-bottom-item-right" v-if="item.periodUnit == 6">按月租（以租代购）</text>
					</view>
					<view class="btn-wrapper">
						<view class="pay-btn" :data-data="item.ktNo" @click="toHistory">
							查看扣款记录
						</view>
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
	import {
		goPage
	} from '../../utils/util.js'

	const app = getApp();
	export default {
		data() {
			return {
				globalData: app.globalData,
				papcList: [],
				payHistoryList: {}
			}
		},
		onLoad() {
			this.getPapcList();
			app.setNavigationBarColor();
		},
		methods: {
			getPapcList() {
				let url = app.globalData.baseUrl + '/papc/c/list'
				request_get(url, (res) => {
					if (res.data.ret) {
						this.papcList = res.data.data
					}
				})
			},

			toHistory(e) {
				let ktNo = e.currentTarget.dataset.data
				goPage(`/pages/deductionRecord/deductionRecord?ktNo=${ktNo}`)
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
		width: 200rpx;
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
