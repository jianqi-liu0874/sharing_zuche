<template>
	<view class="content">
		<view class="scan-wrapper">
			<!--<view class="title">输入/扫描二维码</view>-->
			<input v-model="bicycleNumber" type="number" maxlength="20" placeholder="输入/扫描二维码" />
			<text class="iconfont icon-scan"></text>
		</view>
		<view>
			<button class="submit-btn"
				:style="{'color':globalData.textColor,'border-color':globalData.mainColor,'background-color':globalData.mainColor}"
				size="default" hover-class="none" @click="submit">确认</button>
		</view>
	</view>
</template>

<script>
	import {
		goPage,
		getDistance,
		getQueryValue
	} from '../../utils/util.js';
	import {
		request_get,
		request_post,
	} from '../../utils/http.js';
	const app = getApp();
	export default {
		data() {
			return {
				globalData: app.globalData,
				bicycleNumber: '',
				orderData: '',
				isTransfer: false,
				isScanFromMap: false
			}
		},
		onLoad(data) {
			if (data) {
				if (typeof data.isTransfer != 'undefined' && data.isTransfer == 'true') { //换车/电
					this.isTransfer = true
				} else if (typeof data.isScanFromMap != 'undefined' && data.isScanFromMap == 'true') { //地图上扫码租赁
					this.isScanFromMap = true;
					this.isTransfer = false;

				} else //扫码租赁
					this.orderData = data;
			}
		},
		methods: {
			scan() {

				this.bicycleNumber = "";
				uni.scan({
					scanType: ['qrCode'],
					success: (res) => {
						if (res.code.indexOf('?') > -1) {
							this.bicycleNumber = getQueryValue(res.code, 'vehicleNo');
						} else
							this.bicycleNumber = res.code;
					},
				});

			},

			submit() {
				let data = {};

				if (!this.bicycleNumber) {
					uni.showToast({
						icon: 'none',
						title: '请输入或扫描二维码',
						duration: 2000
					});
					return;
				} else {

					app.judgeIfLoginedCallback(() => {
						if (this.isTransfer) { //换车/电
							goPage('/pages/apply-change-bicycle/apply-change-bicycle', {
								vehicleNo: this.bicycleNumber
							});
						} else if (this.isScanFromMap) { //地图扫码租赁
							app.globalData.qrCode = this.bicycleNumber;
							// goPage('./bicycle-detail/bicycle-detail');
							uni.navigateTo({
								url: '../bicycle-details/bicycle-details'
							})
						} else { //扫码或者输入租赁
							let url = app.globalData.baseUrl + "/rentBiz/v2/rent";
							let param = {
								rpId: this.orderData.chargeTypeId,
								periodUnitNum: this.orderData.buyPeriodsAmount,
								itemNo: this.bicycleNumber,
								payMethod: 2
							};

							request_post(url, param, (res) => {
								uni.hideLoading();
								if (res.data.ret) {
									uni.setStorageSync('orderData', res.data.data);
									goPage('/pages/order-detail/order-detail');
								} else {
									let subCode = res.data.subCode;
									if (subCode === 102) {
										// 订单已创建、未支付
										uni.showModal({
											title: '温馨提示',
											content: '存在未支付的租赁订单,请先支付',
											confirmText: '去支付',
											cancelText: '取消',
											success: (result) => {
												if (result.confirm) {
													uni.setStorageSync('orderData', res.data
														.data);
													goPage('/pages/order-detail/order-detail');
												}
											},
										});
									} else if (subCode === 103) {
										// 订单已创建、已支付
										uni.showModal({
											title: '温馨提示',
											content: '存在进行中的订单',
											confirmText: '我知道了'
										});
									} else if (subCode === 63) {
										uni.showModal({
											title: '温馨提示',
											content: '该门店需上传电摩驾照，审核通过方可租车',
											confirmText: '去提交',
											cancelText: '取消',
											success: (result) => {
												if (result.confirm) {
													goPage('/pages/driver-license/driver-license', {
														companyId: this.orderData
															.companyId
													});
												}
											},
										});

									} else if (subCode === 64) {
										uni.showModal({
											title: '温馨提示',
											content: '您的驾照正在审核中，请联系门店咨询详情',
											confirmText: '确定'
										});
									} else if (subCode === 111) {
										// 首租的时候扫了一辆车/电未支付，又扫另一辆车/电
										uni.showModal({
											title: '温馨提示',
											content: '存在未支付的租赁订单',
											confirmText: '去支付',
											cancelText: '取消未支付订单',
											success: (result) => {
												if (result.confirm) {
													// 去支付未支付的订单
													uni.setStorageSync('orderData', res.data
														.data);
													goPage('/pages/order-detail/order-detail');
												} else {
													// 取消之前的订单
													uni.showLoading({
														title: '加载中...',
														delay: 500,
													});
													let outTradeNo = res.data.outTradeNo;
													let url =
														`${app.globalData.baseUrl}/order/cancel/${outTradeNo}`;
													request_get(url, (res) => {
														uni.hideLoading();
														if (res.data.ret) {
															uni.showToast({
																icon: 'none',
																title: '取消订单成功',
																duration: 3000
															});
														}
													});
												}
											},
										});
									} else if (subCode === 113) {
										let des = ['该租赁物品已被租用', '该租赁物品待投放', '该租赁物品待调度', '该租赁物品可被租用',
											'改租赁物品故障，无法租用', '该租赁物品报废，无法租用', '该租赁物品超期未还'
										];
										uni.showToast({
											icon: 'none',
											title: des[res.data.data.idleState],
											duration: 3000
										});
									} else if (subCode === 6100) {
										uni.showModal({
											title: '温馨提示',
											content: '该门店需实名认证，审核通过方可租车',
											confirmText: '去提交',
											cancelText: '取消',
											success: (result) => {
												if (result.confirm) {
													goPage(
														`/pages/real-name-authentication/real-name-authentication?shopId=${this.orderData.companyId}`
													);
												}
											},
										});
									} else {
										uni.showToast({
											icon: 'none',
											title: res.data.msg,
											duration: 3000
										});
									}
								}
							});
						}
					});

				}
			}
		}
	}
</script>

<style>
	.content {
		padding: 50rpx;
	}

	.scan-wrapper {
		position: relative;
	}

	.title {
		margin-bottom: 24rpx;
		font-size: 34rpx;
	}

	.scan-wrapper>input {
		padding-left: 20rpx;
		width: 610rpx;
		height: 70rpx;
		background-color: #DEDFE1;
	}

	.icon-scan {
		position: absolute;
		bottom: 7rpx;
		right: 20rpx;
		font-size: 60rpx;
		color: #606266;
	}

	.submit-btn {
		margin: 40rpx auto 0;
		width: 610rpx;
		border-radius: 12rpx;
	}
</style>
