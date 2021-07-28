<template>
	<view class="content">
		<view :style="{'background-color':globalData.headColor}">

			<view class="top-wrapper" @click="toLogin()">

				<image class="avatar" mode="scaleToFill" :src="defaultAvatar" />

				<text v-if="hadLogined" class="phone">{{userData.phone}}</text>
				<text v-else class="login-text">点击登录</text>

			</view>

			<view class="main-wrapper">

				<view class="main-info-area" v-if="hadLogined">

					<view class="main-info-item" :style="{'color':globalData.commonTextColor1}" @click="toRecharge()">
						<view class="main-info-text1">
							<text style="font-size:50rpx;">{{userData.balance}}</text>
							<text>元</text>
						</view>
						<view class="main-info-text2">
							余额
						</view>
					</view>

					<view class="main-info-item" :style="{'color':globalData.commonTextColor1}">
						<view class="main-info-text1">

							<block v-if="userData.depositState == 1">
								<text style="font-size:50rpx;">{{userData.deposit}}</text>
								<text>元</text>
							</block>

							<block v-else-if="userData.depositState == 20">
								<text>无押金</text>
							</block>

							<block v-else-if="userData.depositState == 100">
								<text>信用免押</text>
							</block>

						</view>
						<view class="main-info-text2">
							押金
						</view>
					</view>

				</view>

				<view class="main-list-area">

					<view v-if="hadLogined" class="main-list-item" @click="toMyOrders()">
						<text class="iconfont icon-dingdan" :style="{'color':globalData.mainColor}"></text>
						<text>我的订单</text>
						<text class="iconfont icon-right arrow"></text>
					</view>

					<view v-if="hadLogined" class="main-list-item" @click="toConsumeDetail()">
						<text class="iconfont icon-money" :style="{'color':globalData.mainColor}"></text>
						<text>消费明细</text>
						<text class="iconfont icon-right arrow"></text>
					</view>

					<view v-if="hadLogined" class="main-list-item" @click="toUseAgreement()">
						<text class="iconfont icon-yonghu3" :style="{'color':globalData.mainColor}"></text>
						<text>用户协议</text>
						<text class="iconfont icon-right arrow"></text>
					</view>
					<view v-if="hadLogined" class="main-list-item" @click="toContract">
						<text class="iconfont icon-yonghu3" :style="{'color':globalData.mainColor}"></text>
						<text>我的签约</text>
						<text class="iconfont icon-right arrow"></text>
					</view>
					<view class="main-list-item">
						<text class="iconfont icon-banbenhao" :style="{'color':globalData.mainColor}"></text>
						<text>版本号</text>
						<text style="margin-left:6rpx;">v1.3.4</text>
					</view>

					<view v-if="hadLogined" class="main-list-item" @click="logOut()">
						<text class="iconfont icon-tuichu" :style="{'color':globalData.mainColor}"></text>
						<text>退出登录</text>
					</view>

				</view>

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
				globalData: app.globalData,
				hadLogined: false,
				userData: {},
				defaultAvatar: `${app.globalData.imagesUrl}/default/default_avatar.png`
			}
		},
		onLoad() {
			getApp().setNavigationBarColor();
		},
		onShow: function() {
			this.init();
		},
		methods: {
			// 初始化
			init() {
				this.judgeIfLogined();

				if (this.hadLogined) { // 已登录
					console.log("已登录", JSON.stringify(app.globalData));
					this.getUserData();
				} else { // 未登录
					console.log("未登录", JSON.stringify(app.globalData));
				}
			},

			getUserData() {
				let url = `${app.globalData.baseUrl}/customer`;

				request_get(url, (res) => {
					if (res.data.ret) {
						let data = res.data.data;
						// 获取登录保存的用户数据（可能不是最新的）
						let userData = {
							phone: data.phone,
							balance: data.balance,
							deposit: data.deposit,
							depositState: data.depositState,
							identified: data.identified,
						}

						// 设置用户数据
						this.userData = userData;
					}
				});
			},

			// 判断是否登录
			judgeIfLogined() {
				app.judgeIfLogined();
				this.hadLogined = app.globalData.hadLogined;
			},

			logOut() {
				uni.clearStorageSync();
				this.init();
				uni.reLaunch({
					url: '/pages/index/index'
				});
			},

			toLogin() {
				if (!this.hadLogined) {
					goPage('/pages/login/login');
				}
			},

			toUseAgreement() {
				goPage('/pages/agreement/agreement');
			},

			toRecharge() {
				// goPage('/pages/recharge/recharge');
			},

			toMyOrders() {
				goPage('/pages/my-orders/my-orders');
			},

			toConsumeDetail() {
				goPage('/pages/consume-detail/consume-detail');
			},

			toContract() {
				goPage('/pages/contract/contract');
			},
		}
	}
</script>

<style>
	.top-wrapper {
		text-align: center;
		width: 750rpx;
		height: 300rpx;
	}

	.avatar {
		margin-top: 60rpx;
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		box-shadow: 0 0 6rpx rgba(0, 0, 0, .3);
	}

	.phone {
		display: block;
		margin-top: 10rpx;
		height: 50rpx;
		line-height: 50rpx;
		font-size: 34rpx;
		color: #fff;
	}

	.login-text {
		display: block;
		margin: 10rpx auto 0;
		width: 200rpx;
		height: 50rpx;
		line-height: 50rpx;
		font-size: 34rpx;
		color: #fff;
	}

	.main-wrapper {
		min-height: calc(100vh - 300rpx);
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		background-color: #fff;
	}

	.main-info-area {
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
	}

	.main-info-item {
		display: inline-block;
		margin-top: 30rpx;
		width: 50%;
		height: 140rpx;
		text-align: center;
	}

	.main-info-text1 {
		font-size: 34rpx;
		font-weight: 600;
	}

	.main-info-text2 {
		margin-top: 14rpx;
		font-size: 28rpx;
	}

	.main-list-area {
		margin: 0 auto;
		width: 640rpx;
	}

	.main-list-item {
		height: 130rpx;
		line-height: 130rpx;
		color: #303133;
		border-top: 1rpx solid #E3E3E3;
	}

	.main-list-item>.iconfont {
		margin: 0 24rpx 0 20rpx;
		font-size: 36rpx;
	}

	.arrow {
		float: right;
		margin-right: 30rpx;
		color: #606266;
	}
</style>
