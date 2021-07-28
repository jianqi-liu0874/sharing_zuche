<template>
	<view class="content">

		<view v-if="nearbyStoresData.length > 0">
			<view class="item-wrapper" @click="toStoreDetail" v-for="(item, index) in nearbyStoresData" :key="index"
				:data-data="item" :data-index="index">

				<view class="item-left">
					<image class="store-img" mode="scaleToFill"
						:src="globalData.baseUrl + '/image?imageId=' + item.bannerImageId"></image>
				</view>

				<view class="item-right">

					<view class="item-right-top" :style="{'color':globalData.commonTextColor1}">
						<text class="store-name">{{item.companyName}}</text>
						<text class="distance">离我: {{item.distance|setMorKm}}</text>
					</view>

					<view class="item-right-bottom" :style="{'color':globalData.commonTextColor2}">

						<view class="item-right-bottom-item">
							<text class="iconfont icon-yonghu2" :style="{'color':globalData.mainColor}"></text>
							<text>{{item.contact}}</text>
						</view>

						<view class="item-right-bottom-item">
							<text class="iconfont icon-dianhua" :style="{'color':globalData.mainColor}"></text>
							<text>{{item.phone}}</text>
						</view>

						<view class="item-right-bottom-item">
							<text class="iconfont icon-weizhi" :style="{'color':globalData.mainColor}"></text>
							<view class="address">{{item.address}}</view>
						</view>

					</view>

				</view>

			</view>

		</view>

		<view v-else-if="nearbyStoresData.length === 0 && hadGetData" class="no-nearby-stores-wrapper"
			:style="{'color':globalData.mainColor}">
			<view>
				<text class="iconfont icon-info"></text>
				<view class="no-nearby-stores-text">附近无门店</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		request_get
	} from '../../utils/http.js';
	import {
		goPage,
	} from '../../utils/util.js'
	const app = getApp();
	export default {
		data() {
			return {
				globalData: getApp().globalData,
				nearbyStoresData: [],
				hadGetData: false
			}
		},
		onLoad(data) {
			this.init(data);
			app.setNavigationBarColor();
		},
		methods: {
			init(data) {
				this.getNearbyStoresData(data);
			},
			getNearbyStoresData(data) {
				let url =
					`${app.globalData.baseUrl}/shop/nearbyShops?lonC=${data.longitude}&latC=${data.latitude}&userLonC=${data.userLongitude}&userLatC=${data.userLatitude}&mapType=${app.globalData.mapType}&appId=${app.globalData.appId}&scale=20000`;
				request_get(url, (res) => {
					if (res.data.ret) {
						this.hadGetData = true;
						if (res.data.data.length > 0) {
							this.nearbyStoresData = res.data.data;
						}
					}
				});
			},

			toStoreDetail(e) {
				let shopId = e.currentTarget.dataset.data.shopId;
				// goPage('/pages/store-detail/store-detail', data);
				uni.navigateTo({
					url: `../store-details/store-details?shopId=${shopId}`
				})
			},
		}
	}
</script>

<style>
	.content {
		background-color: #F1F0F6;
	}

	.item-wrapper {
		margin-bottom: 12rpx;
		padding: 24rpx 10rpx;
		width: 100%;
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

	.store-img {
		width: 255rpx;
		height: 150rpx;
		border-radius: 4rpx;
	}

	.item-right-bottom {
		margin-top: 16rpx;
	}

	.item-right-bottom-item {
		margin: 16rpx 0;
		font-size: 30rpx;
	}

	.item-right-bottom-item>.iconfont {
		margin-right: 16rpx;
	}

	.address {
		display: inline;
		vertical-align: top;
		width: 410rpx;
	}

	.store-name {
		font-weight: 600;
		font-size: 34rpx;
	}

	.distance {
		float: right;
		padding-right: 15rpx;
		font-size: 25rpx;
	}

	.no-nearby-stores-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		width: 100vw;
		height: 100vh;
		background-color: #fff;
	}

	.icon-info {
		display: block;
		margin-top: -130rpx;
		font-size: 72rpx;
	}

	.no-nearby-stores-text {
		margin-top: 20rpx;
		font-weight: 600;
		font-size: 36rpx;
	}
</style>
