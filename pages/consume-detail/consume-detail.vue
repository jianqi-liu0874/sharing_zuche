<template>
	<view class="content">
		<v-tabs v-model="activeTab" :height="100 + 'rpx'" :bgColor="'#'+'00CCCC'" :scroll="false" @change="changeTab" :tabs="tabs" :lineColor="'#FFF'" :color="'#FFF'" :activeColor="'#FFF'" :lineHeight="'6rpx'" :fontSize="'32rpx'"></v-tabs>
		<view class="tab-content" v-if="activeTab === 0">

			<view class="item-wrapper" v-for="(item, index) in consumeData1" :key="index" :data-data="item"
				:data-index="index">

				<view class="item-left">
					<view class="item-left-top">{{item.remark}}</view>
					<view class="item-left-bottom">
						<text class="iconfont icon-time"></text>
						{{item.recordTime}}
					</view>
				</view>

				<view class="item-right red-text">-{{item.amount}}元</view>

			</view>

			<view class="bottom-tips">没有更多记录了</view>

		</view>
		<view class="tab-content"  v-for="(item, index) in consumeData2" :key="index" :data-data="item"
				:data-index="index" v-else-if="activeTab === 1">

			<view class="item-wrapper">

				<view class="item-left">
					<view class="item-left-top">充值</view>
					<view class="item-left-bottom">
						<text class="iconfont icon-time"></text>
						{{item.recordTime}}
					</view>
				</view>

				<view class="item-right green-text">+{{item.amount}}元</view>

			</view>

			<view class="bottom-tips">没有更多记录了</view>

		</view>

		<view v-else-if="activeTab === 2" class="tab-content">

			<view class="item-wrapper"  v-for="(item, index) in consumeData3" :key="index" :data-data="item"
				:data-index="index">

				<view class="item-left">
					<view class="item-left-top">{{item.remark}}</view>
					<view class="item-left-bottom">
						<text class="iconfont icon-time"></text>
						{{item.recordTime}}
					</view>
				</view>

				<view class="item-right green-text" v-if="item.isIncome == false">+{{item.amount}}元
				</view>
				<view class="item-right red-text" v-if="item.isIncome == true">-{{item.amount}}元</view>
				<view class="item-right" v-if="item.isIncome == false && item.orderType == 1">
					{{item.amount}}元
				</view>

			</view>

			<view class="bottom-tips">没有更多记录了</view>

		</view>

	</view>
</template>

<script>
	const app = getApp();
	import {
		request_get,
		request_post
	} from '../../utils/http.js';
	export default {
		data() {
			return {
				globalData: app.globalData,
				activeTab: 0,
				tabs: ['消费', '充值', '押金'],
				consumeData1: [],
				consumeData2: [],
				consumeData3: [],
			}
		},
		onLoad() {
			this.getConsumeData();
			app.setNavigationBarColor();
		},
		methods: {
			changeTab(index) {
				this.activeTab = index;
			},
			getConsumeData() {
				let url = `${app.globalData.baseUrl}/customer/waterflow`;

				let param1 = {
					bizType: 0,
					pageSize: 100,
					pageNo: 1
				};
				let param2 = {
					bizType: 2,
					pageSize: 100,
					pageNo: 1
				};
				let param3 = {
					bizType: 1,
					pageSize: 100,
					pageNo: 1
				};
				request_post(url, param1, (res) => {
					if (res.data.ret) {
						this.consumeData1 = res.data.data;
					}
				});
				request_post(url, param2, (res) => {
					if (res.data.ret) {
						this.consumeData2 = res.data.data;
					}
				});

				request_post(url, param3, (res) => {
					if (res.data.ret) {
						this.consumeData3 = res.data.data;
					}
				});
			},

			handleTabClick({
				index,
				tabsName
			}) {
				this.tabsName = [index]
			},

			handleTabChange({
				index,
				tabsName
			}) {
				this.tabsName = [index]
			},

			onPullDownRefresh() {
				// 监听页面下拉刷新事件
				uni.stopPullDownRefresh({
					complete(res) {

					}
				});
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
		position: relative;
		margin-bottom: 6rpx;
		padding: 40rpx;
		font-size: 30rpx;
		background-color: #fff;
	}

	.item-left {
		color: #303133;
	}

	.item-left-top {
		font-size: 32rpx;
	}

	.item-left-bottom {
		margin-top: 10rpx;
		font-size: 28rpx;
		color: #909399;
	}

	.item-left-bottom>.iconfont {
		margin-right: 10rpx;
		font-size: 26rpx;
		color: #303133;
	}

	.item-right {
		position: absolute;
		right: 40rpx;
		top: 58rpx;
		font-size: 32rpx;
	}

	.bottom-tips {
		padding: 24rpx 0 48rpx;
		text-align: center;
		font-size: 26rpx;
		color: #909399;
	}
</style>
