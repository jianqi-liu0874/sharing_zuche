<template>
	<view class="content">
		<view class="info-wrapper info-wrapper1">
			<image class="bicycle-img" mode="scaleToFill" src="../../static/vehicle.jpg"></image>
			<view class="bicycle-info" :style="{'color':globalData.commonTextColor1}">
				<view class="bicycle-name" :style="{'color':globalData.mainColor}">{{orderData.goodsName || '优驱'}}
				</view>
				<view>原编号: {{orderData.oldItemNo || '080024713'}}</view>
				<view>更换为: {{orderData.newItemNo || '080077778'}}</view>
			</view>
		</view>
		<view class="info-wrapper info-wrapper2">
			<view class="start-time" :style="{'color':globalData.commonTextColor1}">
				<view class="date">{{(orderData.startTime.split(" ")[0]).slice(5, 10) || '05-11'}}</view>
				<view class="time">{{orderData.startTime.split(" ")[1] || '10:07:54'}}</view>
			</view>
			<view class="rent-time">
				<view :style="{'color':globalData.mainColor}">{{orderData.periodRemark || '当天到期'}}</view>
				<image class="arrow-right" mode="scaleToFill" src="../../static/arrow_right.png" />
				<view :style="{'color':globalData.mainColor}">租用周期</view>
			</view>
			<view class="end-time" :style="{'color':globalData.commonTextColor1}">
				<view class="date">{{(orderData.endTime.split(" ")[0]).slice(5, 10) || '05-11'}}</view>
				<view class="time">{{orderData.endTime.split(" ")[1] || '11:07:54'}}</view>
			</view>
		</view>
		<view class="info-wrapper info-wrapper3" :style="{'color':globalData.commonTextColor2}">
			<!--<view><text>订单编号</text><text class="right-text">20200408050089654</text></view>
    -->
			<!--<view><text>剩余天数</text><text class="right-text">50天</text></view>
    -->
			<view style=" font-size:28rpx;">
				<text>说明:</text>
				<view class="desc">
					<view>1. 暂时只支持同一种租赁类目更换业务。</view>
					<view>2. 超期未还设备不允许更换，请先续租延期。</view>
					<view>3. 请您爱惜租赁物品，如有损坏需支付损耗费。</view>
					<view>4. 提交申请后，需店主审核成功，方能更换。</view>
					<!--<view>4. 审核结果请留意短信和首页审核通知。</view>-->
				</view>
			</view>
		</view>
		<view class="btn-wrapper">
			<button @click="confirmTransfer"
				:style="{'color':globalData.textColor,'border-color':globalData.mainColor,'background-color':globalData.mainColor}"
				size="default" hover-class="none">立即申请</button>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	import {
		request_post,
		request_get
	} from '../../utils/http.js';
	export default {
		data() {
			return {
				globalData: app.globalData,
				orderData: '',
				vehicleNo: ''
			}
		},
		onLoad(data) {
			if (data.vehicleNo) {
				this.vehicleNo = data.vehicleNo;
				this.getChangeVehicleData(data.vehicleNo)
			}
		},
		methods: {
			getChangeVehicleData(vehicleNo) {

				app.getBaseData(() => {
					this.globalData = app.globalData;
					let url = `${app.globalData.baseUrl}/rentBiz/chgItem?itemNo=${vehicleNo}`;
					request_get(url, (res) => {
						if (res.data.ret) {
							if (typeof res.data.data != 'undefined') {
								let periodRemark = '',
									startTime = '',
									endTime = '';
								if (res.data.data.startTime && res.data.data.endTime) {

									startTime = new Date(res.data.data.startTime.replace(/-/g, "/"))
										.getTime();
									endTime = new Date(res.data.data.endTime.replace(/-/g, "/")).getTime();
									res.data.data.periodRemark = (endTime - startTime) / (1000 * 60 * 60 *
											24) < 1 ? "当天到期" :
										`剩余 ${Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24))}天`

								}
								this.orderData = res.data.data;

							} else
								uni.showToast({
									icon: 'none',
									title: '未查询到数据',
									duration: 2000
								});
						} else if (res.data.subCode === 113) {
							let des = ['该租赁物品已被租用', '该租赁物品待投放', '该租赁物品待调度', '该租赁物品可被租用', '该租赁物品故障，无法租用',
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
								duration: 2000
							})
						}
					});
				});

			},

			//确认更换
			confirmTransfer: function() {
				let url = `${app.globalData.baseUrl}/rentBiz/chgItem?itemNo=${this.vehicleNo}`;
				request_post(url, {}, (res) => {
					if (res.data.ret) {
						setTimeout(function() {
							uni.showToast({
								icon: 'none',
								title: '申请成功,请联系管理员审核，方能更换'
							});
						}, 300);
						uni.redirectTo({
							url: '/pages/index/index'
						});
					} else if (res.data.subCode === 113) {
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
							duration: 2000
						})
					}
				});

			}
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
		top: 30rpx;
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

	.desc {
		display: inline-block;
		vertical-align: top;
		margin-left: 20rpx;
		width: 580rpx;
	}

	.desc view {
		margin-bottom: 15rpx;
	}
</style>
