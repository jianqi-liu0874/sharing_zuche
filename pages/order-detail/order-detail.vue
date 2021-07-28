<template>
	<view class="content" v-if="Object.keys(orderData).length !== 0">
		<view class="info-wrapper info-wrapper1">
			<image class="bicycle-img" mode="scaleToFill"
				:src="globalData.baseUrl + '/image?imageId=' + orderData.octxList[0].goods.bannerImageId"></image>
			<view class="bicycle-info" :style="{'color':globalData.commonTextColor1}">
				<view class="bicycle-name" :style="{'color':globalData.mainColor}">
					{{orderData.octxList[0].goods.goodsName}}
				</view>
				<view>编号: {{orderData.item.itemNo}}</view>
				<view>特色: {{orderData.octxList[0].goods.spotlight}}</view>
			</view>
		</view>
		<view class="info-wrapper info-wrapper2">
			<view class="start-time" :style="{'color':globalData.commonTextColor1}">
				<view class="date">{{(orderData.octxList[0].octx.startTime.split(" ")[0]).slice(5, 10)}}</view>
				<view class="time">{{orderData.octxList[0].octx.startTime.split(" ")[1]}}</view>
			</view>
			<view class="rent-time">
				<view :style="{'color':globalData.mainColor}">
					{{orderData.octxList[0].octx.periodUnit === 7 ? orderData.octxList[0].octx.periodUnitNum + "分钟" : 
        orderData.octxList[0].octx.periodUnit === 0 ? orderData.octxList[0].octx.periodUnitNum + "小时" : 
        orderData.octxList[0].octx.periodUnit === 1 ? orderData.octxList[0].octx.periodUnitNum + "天" : 
        orderData.octxList[0].octx.periodUnit === 5 ? orderData.octxList[0].octx.periodUnitNum + "周" : 
        orderData.octxList[0].octx.periodUnit === 2 ? orderData.octxList[0].octx.periodUnitNum + "月" : 
        orderData.octxList[0].octx.periodUnit === 3 ? orderData.octxList[0].octx.periodUnitNum + "季" : 
        orderData.octxList[0].octx.periodUnit === 4 ? orderData.octxList[0].octx.periodUnitNum + "年" : 
        orderData.octxList[0].octx.periodUnitNum + '月(以租代购)'}}
				</view>
				<image class="arrow-right" mode="scaleToFill" src="../../static/arrow_right.png" />
				<view :style="{'color':globalData.mainColor}">租用周期</view>
			</view>
			<view class="end-time" :style="{'color':globalData.commonTextColor1}">
				<view class="date">
					{{(orderData.octxList[0].octx.endTime.split(" ")[0]).slice(5, 10)}}
				</view>
				<view class="time">
					{{orderData.octxList[0].octx.endTime.split(" ")[1]}}
				</view>
			</view>
		</view>
		<view class="info-wrapper info-wrapper3" :style="{'color':globalData.commonTextColor2}">
			<view>
				<text>租借点</text>
				<text class="right-text">{{orderData.shop.shopName}}</text>
			</view>
			<view>
				<text>租金费用</text>
				<text class="right-text">{{orderData.octxList[0].octx.payAmt}}元</text>
			</view>
			<view v-if="!orderData.isRenew">
				<text>押金</text>
				<text v-if="orderData.octxDep && orderData.octxDep.orderType == 0"
					class="right-text">{{orderData.octxDep.payAmt}}元</text>
				<text v-if="orderData.octxDep && orderData.octxDep.orderType == 1"
					class="right-text">{{orderData.octxDep.payAmt}}元</text>
				<text v-else class="right-text">{{orderData.depositRemark}}</text>
			</view>
			<view>
				<text>费用说明</text>
				<!-- <text class="right-text">{{orderData.amountRemark}}</text> -->
				<text class="right-text">
					按{{orderData.octxList[0].octx.periodUnit === 0 ? "小时" : 
					       orderData.octxList[0].octx.periodUnit === 7 ? "分钟":
					        orderData.octxList[0].octx.periodUnit === 1 ? "天" : 
					        orderData.octxList[0].octx.periodUnit === 5 ? "周" : 
					        orderData.octxList[0].octx.periodUnit === 2 ? "月" : 
					        orderData.octxList[0].octx.periodUnit === 3 ? "季" : 
					        orderData.octxList[0].octx.periodUnit === 4 ? "年" : 
        '月(以租代购)'}}租,{{orderData.octxList[0].octx.payAmt}}元
					<text
						v-if="orderData.octxDep && orderData.octxDep.orderType == 0">,交押金{{orderData.octxDep.payAmt}}元</text>
					<text v-if="orderData.octxDep && orderData.octxDep.orderType == 1">,交押金{{orderData.octxDep.paAmt}}元
					</text>
				</text>
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
			<button v-if="orderData.payMethod > 0"
				:style="{'color':globalData.textColor,'border-color':globalData.mainColor,'background-color':globalData.mainColor}"
				size="default" hover-class="none" @click="payOnline">立即支付</button>
			<button v-else
				:style="{'color':globalData.textColor,'border-color':globalData.mainColor,'background-color':globalData.mainColor}"
				size="default" hover-class="none" @click="payOffline">线下支付</button>
			<text class="help-text" :style="{'color':globalData.mainColor}" @click="toHelp">使用帮助</text>
		</view>
	</view>
</template>

<script>
	import {
		request_post
	} from '../../utils/http.js';

	const app = getApp();
	export default {
		data() {
			return {
				globalData: app.globalData,
				orderData: {},
				lockBtn: false,
				rpId: ''
			}
		},
		onLoad(options) {
			this.orderData = uni.getStorageSync('orderData');
			if (options) this.rpId = options.rpId
		},
		methods: {
			payOffline() {

				let url = app.globalData.baseUrl + "/rentBiz/pay/offline";

				request_post(url, {}, (res) => {
					if (res.data.ret) {
						uni.showModal({
							title: '温馨提示',
							content: '已申请线下支付，待店家确认',
							confirmText: '好的',
							success: () => {
								uni.reLaunch({
									url: '/pages/index/index'
								});
							}
						});
						// 完成后清除缓存中的设备编号
						uni.removeStorageSync('vehicleNo');
					} else {
						uni.showToast({
							icon: 'none',
							content: res.data.msg,
							duration: 3000
						});
					}
				});

			},

			payOnline() {
				console.log(this.orderData, 'orderData');
				if (this.lockBtn) return;
				let that = this;
				this.lockBtn = true;
				uni.showLoading({
					title: '请稍后'
				})
				console.log(this.orderData.otp.epochSecond, 'epochSecond');
				console.log(this.orderData.otp.wxNonceStr, 'wxNonceStr');
				console.log(this.orderData.otp.wxPkg, 'wxPkg');
				console.log(this.orderData.otp.wxSign, 'wxSign');
				wx.requestPayment({
					timeStamp: toString(this.orderData.otp.epochSecond),
					nonceStr: this.orderData.otp.wxNonceStr,
					package: this.orderData.otp.wxPkg,
					signType: 'RSA',
					paySign: this.orderData.otp.wxSign,
					success: function(res) {
						console.log(res)
						uni.hideLoading();
					},
					fail: function(res) {
						console.log(res,'fail');
					},
					complete(res) {
						console.log(res,'complate');
					}
				})
			},

			toHelp() {
				uni.navigateTo({
					url: '/pages/help/help'
				})
			},
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
