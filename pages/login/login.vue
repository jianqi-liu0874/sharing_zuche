<template>
	<view class="content">
		<image class="top-img" mode="scaleToFill" :src="topImg"></image>
		<view class="login-area">
			<view v-if="loginType === 1">
				<button class="login-btn1"
					:style="{'color':app.textColor,'border-color':app.mainColor,'background-color':app.mainColor}"
					size="default" @getphonenumber="getUserInfo" open-type="getPhoneNumber">
					微信快捷登录
				</button>
			</view>
			<view v-if="loginType === 2">
				<view class="input-area">
					<view class="phone-input" style="display: flex;">
						<input v-model="phone" type="number" maxlength="11" placeholder="请输入手机号码"></input>
						<view :style="{'color':isGettingCode ? '#9D9FA4': app.mainColor}" class="get-code"
							@click="getCode()">{{codeText}}
						</view>
					</view>
					<input v-model="code" class="code-input" type="number" placeholder="请输入验证码"></input>
				</view>
				<button class="login-btn2"
					:style="{'color':app.textColor,'border-color':app.mainColor,'background-color':app.mainColor}"
					size="default" hover-class="none" @click="loginByPhone">登录
				</button>
			</view>
		</view>
		<view class="other-login" @click="switchLogin">
			<text v-if="loginType === 1">手机号码登录</text>
			<text v-else>微信快捷登录</text>
		</view>
		<view class="login-tips">
			<view style="display:inline">
				<checkbox @click="radioChange" :checked="isAgree" style="width:30rpx;height:30rpx;margin-bottom:8rpx;">
				</checkbox>
				<text style="margin-left: 30rpx;">已阅读并同意</text>
			</view>
			<text :style="{'color':app.mainColor}">《用户协议》</text>
		</view>
	</view>
</template>

<script>
	import {
		request_get,
		request_post
	} from '../../utils/http.js';
	import {
		goPage,
	} from '../../utils/util.js'
	const app = getApp();
	export default {
		data() {
			return {
				topImg: '',
				app: getApp().globalData,
				loginType: 1,
				phone: '',
				code: '',
				loginCode: '',
				isAgree: false,
				codeText: "获取验证码",
				isGettingCode: false,
			}
		},
		onLoad() {
			this.topImg = `${this.app.imagesUrl}/${this.app.brandId}/login/bg.png`;
			this.toLogin();
		},
		methods: {
			radioChange(e) {
				this.isAgree = !this.isAgree
			},

			switchLogin() {
				if (this.isAgree == true || this.isAgree == "true")
					this.loginType = this.loginType === 1 ? 2 : 1
				else
					uni.showToast({
						icon: 'none',
						title: '请先勾选用户协议',
					});

			},

			toLogin: function() {
				let that = this;
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						that.loginCode = loginRes.code;
					}
				})
			},

			getUserInfo: function(e) {
				console.log(e);
				if (this.isAgree == false) {
					uni.showToast({
						icon: 'none',
						title: '请先勾选用户协议'
					})
					return;
				}
				let that = this;
				// let url = app.globalData.baseUrl + `/customer/login`
				let url = 'https://zcclienttest.uqbike.com' + `/customer/login`
				if (e.detail.encryptedData && e.detail.iv) {
					uni.showLoading({
						title: '加载中...',
						delay: 500,
					});
					let param = {
						appId: this.app.appId,
						loginType: 2,
						ecp: e.detail.encryptedData,
						iv: e.detail.iv,
						wxLoginCode: that.loginCode
					}
					request_post(url, param, (res) => {
						if (res.data.ret) {
							uni.setStorageSync('userInfo', res.data.data);
							setTimeout(function() {
								uni.showToast({
									icon: 'none',
									title: '登陆成功'
								});
							}, 10);
							uni.reLaunch({
								url: '../index/index'
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg,
								duration: 2000
							});
						}
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '拒绝授权可能会导致功能无法正常使用'
					})
					that.toLogin();
				}

			},

			// 获取验证码
			getCode() {
				let time = 60;
				let that = this;
				if (!this.phone) {
					uni.showToast({
						icon: 'none',
						title: '请填写手机号'
					})
					return;
				}
				if (!this.isGettingCode) {
					this.codeText = "获取中..";
					this.isGettingCode = true;

					let url = app.globalData.baseUrl + "/customer/login/sms";

					let param = {
						phone: this.phone,
						appId: app.globalData.appId,
						wxLoginCode: that.loginCode,
						loginType: 1
					};

					request_post(url, param, (res) => {
						console.log(res.data);
						if (res.data.ret) {
							if (that.data.timer)
								clearInterval(that.data.timer);
							that.data.timer = setInterval(function() {
								if (time <= 0) {
									that.codeText = "获取验证码"
									that.isGettingCode = false
									clearInterval(that.data.timer);
									return;
								}
								that.codeText = `重新获取(${time}s)`
								time--;
							}, 1000);
						} else {
							that.isGettingCode = false;
							that.codeText = "获取验证码";
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
						}
					});
				}
			},

			loginByPhone() {

				setTimeout(() => {
					if (!this.phone) {
						uni.showToast({
							icon: 'none',
							title: '请输入手机号'
						});
						return;
					}
					if (this.phone.length != 11) {
						uni.showToast({
							icon: 'none',
							title: '请输入正确格式的手机号'
						});
						return;
					}
					if (!this.code) {
						uni.showToast({
							icon: 'none',
							title: '请输入验证码'
						});
						return;
					}

					uni.showLoading({
						title: '加载中...',
						delay: 500,
					});

					let url = app.globalData.baseUrl + "/customer/login";
					// let url = 'http://192.168.1.248:9083' + "/customer/login";
					let param = {
						loginType: 1,
						phone: this.phone,
						code: this.code,
						wxLoginCode: this.loginCode,
						appId: app.globalData.appId
					};

					request_post(url, param, (res) => {
						if (res.data.ret) {
							uni.showToast({
								icon: 'none',
								title: '登录成功'
							});
							uni.setStorageSync('userInfo', res.data.data)
							let vehicleNoSync = uni.getStorageSync('vehicleNo')

							// 如果是外部扫码登录后跳转回租赁页面
							if (vehicleNoSync) {
								uni.navigateTo({
									url: `/pages/bicycle-detail/bicycle-detail`
								});
							} else {
								uni.reLaunch({
									url: '/pages/index/index'
								});

							}
							// uni.navigateBack();
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
						}
						uni.hideLoading();
					});
				}, 500);

			},
		}
	}
</script>

<style>
	page {
		position: relative;
	}

	.top-img {
		width: 100%;
	}

	.login-area {
		width: 100%;
		padding-top: 90rpx;
	}

	.login-btn1 {
		margin: 0 auto;
		width: 85%;
		border-radius: 12rpx;
	}

	.login-btn2 {
		margin: 10rpx auto 0;
		width: 75%;
		border-radius: 12rpx;
	}

	.input-area {
		position: relative;
		margin: 0 auto;
		width: 75%;
	}

	.phone-input,
	.code-input {
		width: 100%;
		margin-bottom: 50rpx;
		padding-bottom: 15rpx;
		border-bottom: 1rpx solid #E8E8E8;
	}

	.get-code {
		/* 		position: absolute;
		right: 10rpx;
		top: 6rpx; */
	}

	.other-login {
		margin-top: 32rpx;
		text-align: center;
		font-size: 28rpx;
		color: #606266;
	}

	.login-tips {
		position: absolute;
		bottom: 100rpx;
		left: 0;
		width: 100%;
		text-align: center;
		font-size: 28rpx;
		color: #606266;
	}

	.gray-text {
		color: #9D9FA4;
	}
</style>
