<template>
	<view class="content">
		<v-tabs :height="100 + 'rpx'" :bgColor="'#'+'00CCCC'" :lineColor="'#FFF'" :color="'#FFF'" :activeColor="'#FFF'"
			:lineHeight="'6rpx'" :fontSize="'32rpx'" class="tabs-wrapper" v-model="activeTab" :scroll="false"
			@change="changeTab" :tabs="tabs">
		</v-tabs>
		<view v-if="activeTab == 0">
			<view class="tab-content">

				<view class="item-wrapper"  v-for="(item, index) in infoData1" :key="index" :data-data="item"
				:data-index="index">

					<view class="item-top">{{item.title}}</view>
					<view class="item-middle">
						<text class="iconfont icon-time"></text>
						{{item.createTime}}
					</view>
					<view class="item-bottom">
						{{item.content}}
					</view>

				</view>

				<view class="bottom-tips">没有更多未读消息</view>

			</view>
		</view>

		<view v-if="activeTab == 1">
			<view class="tab-content">

				<view class="item-wrapper" v-for="(item, index) in infoData2" :key="index" :data-data="item"
					:data-index="index">

					<view class="item-top">{{item.title}}</view>
					<view class="item-middle">
						<text class="iconfont icon-time"></text>
						{{item.createTime}}
					</view>
					<view class="item-bottom">
						{{item.content}}
					</view>

				</view>

				<view class="bottom-tips">没有更多未读消息</view>

			</view>
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
				tabs: ['通知', '告警'],
				infoData1: [],
				infoData2: [],
			}
		},
		onLoad() {
			this.getInfoData();
			app.setNavigationBarColor();
		},
		methods: {
			changeTab(index) {
				this.activeTab = index;
			},

			getInfoData() {

				let url1 =
					`${app.globalData.baseUrl}/customer/notify?mapType=${app.globalData.mapType}&notifyType=1&pageSize=100`,
					url2 =
					`${app.globalData.baseUrl}/customer/notify?mapType=${app.globalData.mapType}&notifyType=2&pageSize=100`;

				request_get(url1, (res) => {
					if (res.data.ret) {
						let data = res.data.data;
						this.infoData1 = data

						// 获取通知数据后标记已读
						let url = `${app.globalData.baseUrl}/customer/notify/read?notifyType=1`;

						request_post(url, {}, (res) => {
							console.log("通知已读res: ", res.data);
						});
					}
				});

				request_get(url2, (res) => {
					if (res.data.ret) {
						let data = res.data.data;
						this.infoData2 = data
					}
				});
			},

			handleTabClick({
				index,
				tabsName
			}) {
				this.tabsName = [index]
				if (index === 1) { // 用户点击告警
					// 用户点击告警后标记已读
					let url = `${app.globalData.baseUrl}/customer/notify/read?notifyType=2`;

					request_post(url, {}, (res) => {
						console.log("告警已读res: ", res.data);
					});
				}
			},

			handleTabChange({
				index,
				tabsName
			}) {
				this.tabsName = [index]
			},

			onPullDownRefresh() {
				// 监听页面下拉刷新事件
				let that = this;
				uni.stopPullDownRefresh({
					complete(res) {
						that.getInfoData();
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
		position: relative;
		margin-bottom: 12rpx;
		padding: 40rpx;
		font-size: 30rpx;
		background-color: #fff;
	}

	.item-top {}

	.item-middle {
		margin: 12rpx 0 20rpx;
		font-size: 28rpx;
		color: #909399;
	}

	.item-middle>.iconfont {
		margin-right: 10rpx;
		font-size: 26rpx;
		color: #303133;
	}

	.item-bottom {
		margin-top: 12rpx;
		line-height: 48rpx;
		font-size: 28rpx;
		color: #606266;
	}

	.bottom-tips {
		padding: 24rpx 0 48rpx;
		text-align: center;
		font-size: 26rpx;
		color: #909399;
	}
</style>
