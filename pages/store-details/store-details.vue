<template>
	<view class="content">
		<view>
			<swiper :autoplay="true" :circular="true" interval="5000">
				<swiper-item v-for="(item, index) in storeData.scrollImageIds" :key="index">
					<image mode="scaleToFill" class="swiper-item" :src="globalData.baseUrl + '/image?imageId=' + item">
					</image>
				</swiper-item>
			</swiper>
		</view>
		<view class="store-info-wrapper">
			<view class="store-info-top">
				<text class="store-name">{{storeData.companyName}}</text>
				<button class="daohang-btn" size="mini" hover-class="none" @click="openLocation()">
					<text class="iconfont icon-daohang"></text>
					<text>导航</text>
				</button>
			</view>
			<view class="store-info-bottom">
				<view class="store-info-bottom-item">
					<text class="iconfont icon-yonghu2" :style="{'color':globalData.mainColor}"></text>
					<text>{{storeData.contact}}</text>
				</view>
				<view class="store-info-bottom-item">
					<text class="iconfont icon-dianhua" :style="{'color':globalData.mainColor}"></text>
					<text :style="{'color':globalData.mainColor}" :data-phone="storeData.phone"
						@click="makePhoneCall">{{storeData.phone}}</text>
				</view>
				<view class="store-info-bottom-item">
					<text class="iconfont icon-weizhi" :style="{'color':globalData.mainColor}"></text>
					<view class="address">{{storeData.address}}</view>
				</view>
			</view>
		</view>
		<view v-if="bicyclesData.length > 0" class="bicycle-list-wrapper">
			<view class="bicycle-list-item" @click="toBicycleDetail" :data-data="item"
				v-for="(item, index) in bicyclesData" :key="index">
				<view class="item-left">
					<image class="bicycle-img" mode="scaleToFill"
						:src="globalData.baseUrl + '/image?imageId=' + item.bannerImageId"></image>
				</view>
				<view class="item-right">
					<view class="item-right-top">
						<text class="bicycle-name" :style="{'color':globalData.mainColor}">{{item.goodsName}}</text>
						<text class="iconfont icon-right"></text>
						<text class="detail">详情</text>
					</view>
					<view class="item-right-bottom">
						<view class="item-right-bottom-item">
							<text>可租: {{item.remains}}辆</text>
						</view>
						<view class="item-right-bottom-item">
							<text>押金: {{item.deposit}}元</text>
							<text v-if="item.allowAntAsDeposit && storeData.payOnline"
								:style="{'color':globalData.mainColor,'margin-left':'12rpx'}">支持信用免押金</text>
						</view>
						<view v-if="item.spotlight" class="item-right-bottom-item">
							<text>特色: {{item.spotlight}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="no-bicycle-wrapper">暂无租赁物品信息</view>
	</view>
</template>

<script>
	import {
		request_get,
		request_post
	} from '../../utils/http.js';
	import {
		goPage
	} from '../../utils/util.js'
	const app = getApp();
	export default {
		data() {
			return {
				globalData: app.globalData,
				storeData: {},
				bicyclesData: []
			}
		},
		onLoad(data) {
			this.init(data);
		},
		methods: {
			init(data) {
				this.getStoreData(data.shopId || data.markerId);
			},

			getStoreData(shopId) {
				let url = `${app.globalData.baseUrl}/shop`;
				let param = {
					shopId: shopId
				};
				request_post(url, param, (res) => {
					if (res.data.ret) {
						this.storeData = res.data.data;
						this.bicyclesData = res.data.data.goodsList;
					}
				});
			},

			makePhoneCall(e) {
				let phone = e.currentTarget.dataset.phone;
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},

			openLocation() {
				uni.openLocation({
					longitude: this.storeData.lonC,
					latitude: this.storeData.latC,
					name: this.storeData.shopName,
					address: this.storeData.address,
				});
			},

			toBicycleDetail(e) {
				let data = e.currentTarget.dataset.data;
				data.payOnline = this.storeData.payOnline;
				if (data.remains > 0) {
					// goPage('/pages/bicycle-detail/bicycle-detail', data);
					uni.navigateTo({
						url: `../bicycle-details/bicycle-details?data=${JSON.stringify(data)}`
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '暂无可租租赁物品',
						duration: 1000
					});
				}
			},
		}
	}
</script>

<style>
	.content {
		background-color: #F1F0F6;
	}

	swiper {
		height: 500rpx;
	}

	.swiper-item {
		display: block;
		height: 500rpx;
		width: 100%;
	}

	.store-info-wrapper {
		position: absolute;
		top: 430rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 80%;
		height: 210rpx;
		padding: 36rpx 50rpx;
		border-radius: 30rpx;
		background-color: #fff;
	}

	.store-name {
		font-size: 40rpx;
		color: #303133;
	}

	.daohang-btn {
		position: absolute;
		right: 50rpx;
		top: 36rpx;
		width: 160rpx;
		height: 55rpx;
		font-size: 24rpx;
		color: #fff;
		background-color: #797979;
		border-color: #797979;
		border-radius: 16rpx;
	}

	.icon-daohang {
		vertical-align: middle;
		margin-right: 6rpx;
	}

	.store-info-bottom-item {
		margin: 16rpx 0;
		font-size: 28rpx;
		color: #909399;
	}

	.store-info-bottom-item>.iconfont {
		vertical-align: middle;
		margin-right: 16rpx;
	}

	.address {
		display: inline-block;
		width: 540rpx;
	}

	.no-bicycle-wrapper {
		position: absolute;
		bottom: 0;
		width: 100vw;
		height: calc(100vh - 730rpx);
		text-align: center;
		font-size: 26rpx;
		color: #888;
	}

	.bicycle-list-wrapper {
		position: absolute;
		bottom: 0;
		width: 100vw;
		height: calc(100vh - 730rpx);
		overflow-y: auto;
	}

	.bicycle-list-item {
		margin-bottom: 14rpx;
		padding: 25rpx 0;
		background-color: #fff;
		display: flex;
		flex-direction: row;
	}



	.item-left {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 300rpx;
	}

	.item-right {
		flex: 1;

	}

	.bicycle-img {

		width: 255rpx;
		height: 150rpx;
		border-radius: 4rpx;
	}

	.item-right-bottom {
		margin-top: 24rpx;
	}

	.item-right-bottom-item {
		margin: 20rpx 0;
		font-size: 30rpx;
		color: #909399;
	}

	.item-right-bottom-item:last-child {
		margin-bottom: 0;
	}

	.bicycle-name {
		font-weight: 600;
		font-size: 34rpx;
	}

	.detail,
	.icon-right {
		float: right;
		font-size: 26rpx;
		color: #909399;
	}
</style>
