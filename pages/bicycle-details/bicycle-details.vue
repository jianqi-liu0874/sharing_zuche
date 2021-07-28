<template>
	<view class="content">
		<view>
			<swiper :autoplay="false" :circular="true" :indicator-dots="true">
				<swiper-item v-for="(item, index) in bicycleData.scrollImageIds" :key="index">
					<image mode="scaleToFill" class="swiper-item" :src="globalData.baseUrl + '/image?imageId=' + item">
					</image>
				</swiper-item>
			</swiper>
		</view>
		<view class="rent-method-wrapper">
			<view class="rent-text">租赁方式</view>
			<view :style="{'display': 'flex','justify-content': flexJustify,'flex-wrap': 'wrap'}">
				<view class="flex-item-wrapper" v-for="(item, index) in bicycleData.rentPricingList" :key="index"
					:data-data="item" :data-index="index" @click="selectRentMethod">
					<view class="flex-item"
						:style="index === rentMethodIndex ? 'color: #fff' + ';border:1rpx solid ' + globalData.mainColor + ';backgroundColor:' + globalData.mainColor : ''">
						<view class="flex-item-top" v-if="item.periodUnit === 7">分钟租</view>
						<view class="flex-item-top" v-if="item.periodUnit === 0">时租</view>
						<view class="flex-item-top" v-else-if="item.periodUnit === 1">日租</view>
						<view class="flex-item-top" v-else-if="item.periodUnit === 5">周租</view>
						<view class="flex-item-top" v-else-if="item.periodUnit === 2">月租</view>
						<view class="flex-item-top" v-else-if="item.periodUnit === 3">季租</view>
						<view class="flex-item-top" v-else-if="item.periodUnit === 4">年租</view>
						<view class="flex-item-top" v-else-if="item.periodUnit === 6">以租代购</view>
						<view :class="['flex-item-bottom', index === rentMethodIndex ? 'active' : '']">
							￥{{item.feePerRentPeriod}}元/
							<text v-if="item.periodUnit === 7">分钟</text>
							<text v-if="item.periodUnit === 0">小时</text>
							<text v-else-if="item.periodUnit === 1">日</text>
							<text v-else-if="item.periodUnit === 5">周</text>
							<text v-else-if="item.periodUnit === 2">月</text>
							<text v-else-if="item.periodUnit === 3">季</text>
							<text v-else-if="item.periodUnit === 4">年</text>
							<text v-else-if="item.periodUnit === 6">月</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="rent-description-wrapper" v-if="isReplaceSell.isShow">
			<view class="rent-text">以租代购说明</view>
			<view class="rent-description-area">
				<view class="rent-description-item">
					1.
					<view class="rent-description-content">
						该车型需连续、按月租满{{isReplaceSell.data.monthThreshold?isReplaceSell.data.monthThreshold+"月":''}}，方能满足购车条件。
					</view>
				</view>
				<view class="rent-description-item">
					2.
					<view class="rent-description-content">
						该车型市场参考价格：{{isReplaceSell.data.purchasePrice?isReplaceSell.data.purchasePrice+"元":'暂无价格'}}，以租代购更划算。
					</view>
				</view>
			</view>
		</view>
		<uni-collapse class="collapse">
			<uni-collapse-item title="选择周期" class="collapse-item" showAnimation>
				<view class="item-content content1">
					<view :class="['rent-index',index === rentTimeIndex ? 'index-active' : '']"
						v-for="(item, index) in circleArr" :key="index" :data-data="item" :data-index="index"
						@click="selectTime">
						<text
							:style="{color: index === rentTimeIndex ? '#fff;' : '#303133;'}">{{item.name.split('￥')[0]}}</text>
						<text
							:style="{color: index === rentTimeIndex ? '#fff;' : '#303133;'}">{{item.name.split("￥")[1]}}元</text>
					</view>
					<input placeholder="自定义" type="number" class="rent-index" v-model="rentNum" @input="bindRentInput"
						@focus="clearRentTimeIndex" />
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<uni-collapse class="collapse">
			<uni-collapse-item title="周期扣款" class="collapse-item" showAnimation>
				<view class="item-content">
					<text>周期扣款说明：</text>
					<text
						style="display: block;width:100%;margin-top: 10rpx;font-size: 24rpx; color: #333;">您已签约周期扣款，下一周期将自动扣款。</text>
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<uni-collapse class="collapse">
			<uni-collapse-item title="租车说明" class="collapse-item" showAnimation>
				<view class="item-content">
					<view class="rent-description-wrapper">
						<view v-if="bicycleData.preAuthDeposit && payOnline" class="rent-description-area">
							<view class="rent-description-item">
								1.
								<view class="rent-description-content">
									芝麻信用分良好的用户可享受免押租赁，否则需缴纳押金{{bicycleData.deposit}}元，押金支持随时退。</view>
							</view>
							<view class="rent-description-item">
								2.
								<view class="rent-description-content">请您爱惜租赁物品，否则可能要缴纳额外的损耗费。</view>
							</view>
						</view>
						<!-- 不需要押金 -->
						<view v-else class="rent-description-area">
							<view class="rent-description-item">
								1.
								<view class="rent-description-content">请您爱惜租赁物品，否则可能要缴纳额外的损耗费。</view>
							</view>
						</view>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<view class="rent-description-wrapper">
			<view class="rent-text">配件展示</view>
			<view class="bicycle-list-item" v-for="(item,index) in partsList" :key="index">
				<view class="item-left">
					<image class="bicycle-img" mode="scaleToFill"
						:src="globalData.baseUrl + '/image?imageId=' + item.bannerImageId"></image>
				</view>
				<view class="item-right">
					<view class="item-right-top">
						<text class="bicycle-name" :style="{'color':globalData.mainColor}">{{item.goodsName}}</text>
					</view>
					<view class="item-right-bottom">
						<view class="item-right-bottom-item">
							<text>配件价格: {{item.tmpSkuPrice}}</text>
						</view>
						<view class="item-right-bottom-item">
							<text>描述: {{item.spotlight}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="rent-btn-wrapper">
			<view class="rent-tips">
				<!-- 点击即同意 -->
				<view style="display:inline">
					<checkbox @click="radioChange" :checked="isAgree" style="margin-bottom:5rpx;"></checkbox>
					已阅读并同意
				</view>
				<text :style="{'color':globalData.mainColor}" @click="toAgreement">《用户协议》</text>
				<text :style="{'color':globalData.mainColor}" @click="toDisclaimer">《免责声明》</text>
			</view>
			<button v-if="isRenew" class="rent-btn-sm"
				:style="{'color':globalData.textColor,'border-color':globalData.mainColor,'background-color':globalData.mainColor}"
				size="default" hover-class="none" @click="reRent">
				立即续租
			</button>
			<block v-else>
				<button :class="[bicycleData.preAuthDeposit && bicycleData.payOnline ? 'rent-btn' : 'rent-btn-sm']"
					:style="{'color':globalData.textColor,'border-color':globalData.mainColor,'background-color':globalData.mainColor}"
					size="default" hover-class="none" @click="rent">
					<block v-if="bicycleData.preAuthDeposit && bicycleData.payOnline">
						免押金租借
						<text class="btn-small-text">（芝麻信用分{{bicycleData.antThreshold}}分以上）</text>
					</block>
					<block v-else>
						立即租赁
					</block>
				</button>
			</block>
		</view>

	</view>
</template>

<script>
	const app = getApp();
	import {
		goPage,
		getQueryValue
	} from '../../utils/util.js';
	import {
		request_get,
		request_post
	} from '../../utils/http.js';
	export default {
		data() {
			return {
				globalData: getApp().globalData,
				index: 1,
				rentMethodIndex: 0,
				bicycleData: {},
				partsList: [], // 配件列表
				isRenew: false,
				circleArr: [],
				circleArrIndex: 0,
				flexJustify: 'center',
				payOnline: false,
				isReplaceSell: {
					isShow: false,
					data: null
				},
				rentNum: '',
				rentTimeIndex: ''
			}
		},
		onLoad(data) {
			if (data.data) {
				data = JSON.parse(data.data)
			}
			app.getBaseData(() => {
				if (data.isRenew == "true" || data.isRenew == true) {
					this.init(data);
					app.setNavigationBarColor();
				} else {
					let url = `${app.globalData.baseUrl}/vehicle/status?mapType=${app.globalData.mapType}`;
					request_get(url, (res) => {
						if (res.data.ret) {
							uni.showModal({
								title: '温馨提示',
								content: '您已有租用租赁物品,请返回主页查看',
								buttonText: '确定',
								success: () => {
									uni.reLaunch({
										url: '/pages/index/index'
									});
								},
							});

						} else {
							this.init(data);
							app.setNavigationBarColor();
						}
					})
				}
			});

		},
		onUnload() {
			if (app.globalData.qrCode) {
				app.globalData.qrCode = '';
			}
		},
		onShow() {
			let vehicleNo = uni.getStorageSync('vehicleNo')

			if (vehicleNo) {
				this.getBicycleData(vehicleNo, {
					type: 'vehicleNo'
				})

			}
		},
		methods: {

			radioChange(e) {
				this.isAgree = !this.isAgree
			},
			init(data) {

				this.globalData = app.globalData;
				// 获取配件
				if (data.isRenew == "true" || data.isRenew == true) {
					uni.setNavigationBarTitle({
						title: '续租'
					});
					this.isRenew = true;
				} else if (!data.isRenew) {
					uni.setNavigationBarTitle({
						title: '租赁'
					});
				}
				if (app.globalData.qrCode && app.globalData.qrCode.length > 0) { //如果是外部扫码
					let qr = app.globalData.qrCode.split('vehicleNo=')[1]
					if (qr) {
						uni.setStorageSync('vehicleNo', qr.split("&")[0]);
					}

					this.getBicycleData(app.globalData.qrCode.indexOf('=') > -1 ? getQueryValue(app.globalData.qrCode,
						'vehicleNo') : app.globalData.qrCode, {
						type: 'vehicleNo'
					});

				} else {
					// 从上一页面传来的数据会被转换为字符串
					if (data.payOnline == "true" || data.payOnline == true) {
						this.payOnline = true;
					} else if (data.payOnline == "false" || data.payOnline == false) {
						this.payOnline = false
					}
					this.getBicycleData(data.goodsId, {
						type: 'vehicleTypeId'
					});
				}

			},

			getBicycleData(value, paramType) {
				let url = '';

				if (paramType.type == 'vehicleNo') {
					url = `${app.globalData.baseUrl}/vehicleType?vehicleNo=${value}`;
				} else
					url = `${app.globalData.baseUrl}/goods/c/infoPage?goodsId=${value}`;
				request_get(url, (res) => {
					if (res.data.ret) {
						if (typeof res.data.data != 'undefined') {
							if (paramType.type == 'vehicleNo') {
								this.bicycleData = res.data.data
								this.payOnline = res.data.data.payOnline
							} else

								this.bicycleData = res.data.data

							let chargeTypes = this.bicycleData.rentPricingList;


							if (!chargeTypes || !chargeTypes.length) { // 如果无chargeTypes数据，不执行下面的代码
								return;
							}

							if (chargeTypes.length > 3) {
								this.flexJustify = 'left' // “租赁方式”大于3时，flex调整为向左对齐布局
							}

							this.generateCircleArr(chargeTypes[0]);
						} else
							uni.showToast({
								icon: 'none',
								title: '未查询到计费信息',
								duration: 2000
							});
						this.getParts();

					}
				});
			},

			selectRentMethod(e) {
				let data = e.currentTarget.dataset.data,
					index = e.currentTarget.dataset.index;

				this.rentMethodIndex = index
				this.isReplaceSell = {
					isShow: data.period === 6 ? true : false,
					data: data
				}

				this.generateCircleArr(data);
			},

			selectTime(e) {
				let index = e.currentTarget.dataset.index;
				this.rentTimeIndex = index
				this.rentNum = ''
			},

			bindObjPickerChange(e) {
				this.circleArrIndex = e.detail.value;
			},

			// 生成租赁周期与价格
			generateCircleArr(chargeTypes) {

				let circleArr = [];

				switch (chargeTypes.periodUnit) {
					case 0:
						for (let i = 1; i <= 7; i++) {
							let tempObj = {
								id: i,
								name: `${i}小时 ￥${(i * chargeTypes.feePerRentPeriod).toFixed(2)}`
							}
							circleArr.push(tempObj);
						}
						break;

					case 1:
						for (let i = 1; i <= 7; i++) {
							let tempObj = {
								id: i,
								name: `${i}日 ￥${(i * chargeTypes.feePerRentPeriod).toFixed(2)}`
							}
							circleArr.push(tempObj);
						}
						break;
					case 5:
						for (let i = 1; i <= 5; i++) {
							let tempObj = {
								id: i,
								name: `${i}周 ￥${(i * chargeTypes.feePerRentPeriod).toFixed(2)}`
							}
							circleArr.push(tempObj);
						}
						break;

					case 2:
						for (let i = 1; i <= 7; i++) {
							let tempObj = {
								id: i,
								name: `${i}个月 ￥${(i * chargeTypes.feePerRentPeriod).toFixed(2)}`
							}
							circleArr.push(tempObj);
						}
						break;

					case 3:
						for (let i = 1; i <= 4; i++) {
							let tempObj = {
								id: i,
								name: `${i}季 ￥${(i * chargeTypes.feePerRentPeriod).toFixed(2)}`
							}
							circleArr.push(tempObj);
						}
						break;

					case 4:
						for (let i = 1; i <= 3; i++) {
							let tempObj = {
								id: i,
								name: `${i}年 ￥${(i * chargeTypes.feePerRentPeriod).toFixed(2)}`
							}
							circleArr.push(tempObj);
						}
						break;
					case 6:
						for (let i = 1; i <= chargeTypes.monthThreshold; i++) {
							let tempObj = {
								id: i,
								name: `${i}月 ￥${(i * chargeTypes.feePerRentPeriod).toFixed(2)}`
							}
							circleArr.push(tempObj);
						}
						break;
					case 7:
						for (let i = 1; i <= 59; i++) {
							let tempObj = {
								id: i,
								name: `${i}分钟 ￥${(i * chargeTypes.feePerRentPeriod).toFixed(2)}`
							}
							if (i % 5 == 0) {
								circleArr.push(tempObj);
							}
						}
						break;
				}

				this.circleArr = circleArr;
			},

			rent() {
				if (this.isAgree == false || this.isAgree == 'false') {
					uni.showToast({
						icon: 'none',
						title: '请先勾选用户协议'
					});
					return;
				}
				if (this.rentTimeIndex === '' && this.rentNum === '') {
					uni.showToast({
						icon: 'none',
						title: '请选择租赁周期'
					});
					return;
				}
				uni.showLoading({
					title: '请稍候'
				});
				let vehicleNoSync = uni.getStorageSync('vehicleNo')
				app.judgeIfLoginedCallback(() => {
					if ((app.globalData.qrCode && app.globalData.qrCode.length > 0) || vehicleNoSync) { //外部扫码
						console.log('外部扫码流程')
						let url = app.globalData.baseUrl + "/rentBiz/v2/rent";
						let param = {}
						// 如果缓存中有设备编号，说明是未登录外部扫码租赁，直接使用缓存里的设备编号
						if (vehicleNoSync) {
							param = {
								rpId: this.bicycleData.rentPricingList[this.rentMethodIndex]
									.rentPricingId,
								periodUnitNum: this.rentNum ? this.rentNum : this.rentTimeIndex + 1,
								itemNo: vehicleNoSync,
								payMethod: 2
							};
						} else {
							param = {
								rpId: this.bicycleData.rentPricingList[this.rentMethodIndex]
									.rentPricingId,
								periodUnitNum: this.rentNum ? this.rentNum : this.rentTimeIndex + 1,
								itemNo: app.globalData.qrCode.indexOf('=') > -1 ? getQueryValue(app.globalData
									.qrCode, 'vehicleNo') : app.globalData.qrCode,
								payMethod: 2
							};
						}

						request_post(url, param, (res) => {
							uni.hideLoading();
							if (res.data.ret) {
								res.data.data.payOnline = res.data.data.payMethod == 1
								if (res.data.data.preAuthKey) {

									res.data.data.orderStr = res.data.data.preAuthKey
								}
								uni.setStorageSync('orderData', res.data.data);
								goPage('/pages/order-detail/order-detail');
							} else {
								let subCode = res.data.subCode;
								if (subCode === 102) {
									// 订单已创建、未支付
									uni.showModal({
										title: '温馨提示',
										content: '存在未支付的租赁订单',
										confirmText: '去支付',
										cancelText: '取消',
										success: (result) => {
											if (res.data.data.octxList[0].octx.orderBiz == 3) {
												goPage(
													'/pages/parts-order-detail/parts-order-detail'
												);
											} else {
												if (result.confirm) {
													uni.setStorageSync('orderData', res.data
														.data);
													goPage('/pages/order-detail/order-detail');
												}
											}
										},
									});
								} else if (subCode === 103) {
									// 订单已创建、已支付
									uni.showModal({
										title: '温馨提示',
										content: '存在进行中的订单',
										buttonText: '我知道了'
									});
								} else if (subCode === 111) {
									// 首租的时候扫了一个物品未支付，又扫另一个物品
									uni.showModal({
										title: '温馨提示',
										content: '存在未支付的租赁订单',
										confirmText: '去支付',
										cancelText: '取消未支付订单',
										success: (result) => {
											if (result.confirm) {
												// 去支付未支付的订单
												uni.setStorageSync('orderData', res.data.data);
												// goPage('/pages/order-detail/order-detail');
												uni.navigateTo({
													url: '../order-detail/order-detail'
												})
											} else {
												// 取消之前的订单
												uni.showLoading({
													title: '加载中...',
													delay: 500,
												});
												let billSn = res.data.billSn;
												let url =
													`${app.globalData.baseUrl}/customer/bill/cancel?billSn=${billSn}`;
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
										'改租赁物品故障，无法租用', '该租赁物品报废，无法租用', '该租赁物品超期未还', '该租赁物品已售出'
									];
									uni.showToast({
										icon: 'none',
										title: des[res.data.data.itemState],
										duration: 3000
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
													companyId: this.bicycleData
														.shopId
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
								} else if (subCode === 6100) {
									uni.showModal({
										title: '温馨提示',
										content: '该门店需实名认证，审核通过方可租车',
										confirmText: '去提交',
										cancelText: '取消',
										success: (result) => {
											if (result.confirm) {
												goPage(
													`/pages/real-name-authentication/real-name-authentication?shopId=${this.bicycleData.shopId}`
												);
											}
										},
									});
								} else {
									uni.showToast({
										icon: 'none',
										title: res.data.msg,
										duration: 2000
									});
								}
							}
						});

					} else {
						uni.hideLoading();
						let param = {
							companyId: this.bicycleData.shopId,
							chargeTypeId: this.bicycleData.rentPricingList[this.rentMethodIndex]
								.rentPricingId,
							buyPeriodsAmount: this.rentNum ? this.rentNum : this.rentTimeIndex + 1,
						};
						goPage('../scan/scan', param, {
							type: 'navigateTo'
						})
					}

				});

			},

			reRent() {
				uni.showLoading({
					title: '请稍候',
					delay: 1000
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 15000);

				let url = app.globalData.baseUrl + "/rentBiz/reRent";
				let param = {
					rentPricingId: this.bicycleData.rentPricingList[this.rentMethodIndex].rentPricingId,
					periodUnitNum: this.circleArrIndex + 1
				};

				request_post(url, param, (res) => {
					uni.hideLoading();
					if (res.data.ret) {
						let data = res.data.data;
						data.isRenew = true;
						uni.setStorageSync('orderData', data);
						goPage('/pages/order-detail/order-detail');
					} else {
						let subCode = res.data.subCode;
						if (subCode === 102) {
							// 订单已创建、未支付
							uni.showModal({
								title: '温馨提示',
								content: '存在未支付的租赁订单',
								confirmText: '去支付',
								cancelText: '取消',
								success: (result) => {
									if (result.confirm) {
										let data = res.data.data;
										data.isRenew = true;
										uni.setStorageSync('orderData', res.data.data);
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

						} else if (subCode === 113) {

							let des = ['该租赁物品已被租用', '该租赁物品待投放', '该租赁物品待调度', '该租赁物品可被租用', '改租赁物品故障，无法租用',
								'该租赁物品报废，无法租用', '该租赁物品超期未还'
							];

							uni.showToast({
								icon: 'none',
								title: des[res.data.data.itemState],
								duration: 3000
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
			},

			// 获取商品配件
			getParts() {
				let url = app.globalData.baseUrl + `/goods/c/infoPage?goodsId=${this.bicycleData.goodsId}`;

				request_get(url, (res) => {
					if (res.data.ret) {
						this.partsList = res.data.data.relatedGoods
					}
				})
			},

			toAgreement() {
				goPage('/pages/agreement/agreement');
			},

		}
	}
</script>

<style>
	.content {
		background-color: #F1F0F6;
	}

	.swiper-item {
		display: block;
		height: 500rpx;
		width: 100%;
	}

	.rent-method-wrapper,
	.rent-description-wrapper,
	.rent-btn-wrapper {
		width: 710rpx;
		/* margin-top: 10rpx; */
		background-color: #fff;
		margin: 10rpx auto 0;
		border-radius: 25rpx;
	}

	.rent-description-wrapper {
		margin-bottom: 200rpx;
	}

	.rent-btn-wrapper {
		position: fixed;
		bottom: 0rpx;
		left: 20rpx;
	}

	.rent-text {
		margin: 24rpx;
		font-size: 28rpx;
		color: #303133;
	}

	.rent-text2 {
		display: inline-block;
		margin: 24rpx;
		font-size: 28rpx;
		color: #303133;
	}

	.flex-item-wrapper {
		margin-bottom: 23rpx;
		text-align: center;
		width: 350rpx;
		height: 89rpx;
		/* line-height: 89rpx; */
		font-weight: 600;
		color: white;
	}

	.flex-item {
		margin: 0 auto;
		width: 80%;
		color: #909399;
		border: 1rpx solid #909399;
		border-radius: 18rpx;
	}

	.flex-item-top {
		font-size: 24rpx;
		font-weight: 600;
		margin: 12rpx 0 17rpx;
	}

	.flex-item-bottom {
		font-size: 18rpx;
		margin-bottom: 13rpx;
	}

	.flex-item-bottom.active {
		color: #fff;
	}

	.row {
		display: inline-block;
		padding: 10rpx 40rpx;
		border-bottom: 1rpx solid #909399;
	}

	.row-extra {
		color: #303133;
	}

	.rent-description-area {
		padding: 0 28rpx 28rpx;
		font-size: 28rpx;
		color: #888;
	}

	.rent-description-item {
		margin-bottom: 10rpx;
		display: flex;
	}

	.rent-description-content {
		display: inline-block;
		margin-left: 10rpx;
		vertical-align: top;
		/* width: 660rpx; */
	}

	.rent-tips {
		padding: 18rpx 0;
		font-size: 28rpx;
		color: #888;
		text-align: center;
	}

	.rent-btn {
		position: relative;
		margin: 0 auto 30rpx;
		width: 650rpx;
		height: 150rpx;
		font-size: 36rpx;
		border-radius: 24rpx;
	}

	.rent-btn-sm {
		position: relative;
		margin: 0 auto 30rpx;
		width: 650rpx;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 36rpx;
		border-radius: 24rpx;
	}

	.btn-small-text {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 650rpx;
		font-size: 28rpx;
	}

	.bicycle-list-item {
		margin-bottom: 20rpx;
		/* padding: 25rpx 0; */
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

	.collapse {
		width: 710rpx;
		margin: 0 auto;
		margin-top: 18rpx;
	}

	.am-collapse-item {
		border-radius: 20rpx;
	}

	.uni-collapse {
		margin-bottom: 30rpx;
	}

	.uni-collapse-item {
		margin-bottom: 30rpx;
	}

	.item-content {
		padding: 30rpx;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.rent-index {
		width: 138rpx;
		height: 69rpx;
		border-radius: 15rpx;
		border: 1px solid #00CCCC;
		display: flex;
		align-items: center;
		text-align: center;
		flex-wrap: wrap;
		margin: 0 20rpx 23rpx 0;
	}

	.rent-index text {
		/* display: block; */
		width: 100%;
		font-size: 20rpx;
		color: #00CCCC;
	}

	.index-active {
		color: #FFF;
		background-color: #00CCCC;
	}

	.content1 {
		height: 350rpx;
	}

	.data-v-8f47561c {
		background-color: #fff;
		border-radius: 20rpx;
	}
</style>
