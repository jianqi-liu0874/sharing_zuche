<template>
	<view class="content">

		<image class="top-img" mode="scaleToFill" :src="topImg" />

		<view class="input-wrapper">

			<view class="input-item">
				<text class="iconfont icon-yonghu3" :style="{'color':globalData.mainColor}"></text>
				<input v-model="name" onInput="bindInputName" placeholder="请输入真实姓名" />
			</view>

			<view class="input-item">
				<text class="iconfont icon-idcard" :style="{'color':globalData.mainColor}"></text>
				<input v-model="idCard" type="idcard" placeholder="请输入身份证号" />
			</view>

		</view>

		<view class="btn-wrapper">
			<button
				:style="{'color':globalData.textColor,'border-color':globalData.mainColor,'background-color':globalData.mainColor}"
				size="default" hover-class="none" @click="sendIdentify">立即认证</button>
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
				globalData: getApp().globalData,
				// topImg: `${app.globalData.imagesUrl}/${uni.getStorageSync({ key: 'userInfo' }).data.brandId}/bg2.png`,
				topImg: '../../static/vehicle.jpg',
				name: '',
				idCard: ''
			}
		},
		onLoad(option) {
			this.topImg = `${app.globalData.imagesUrl}/${app.globalData.brandId}/bg2.png`

			if (option.shopId) {
				this.shopId = option.shopId;
			}
		},
		methods: {
			// 发送验证
			sendIdentify: function() {
				let url = app.globalData.baseUrl + '/customer/identify';
				let param = {
					name: this.name,
					idCard: this.idCard,
					shopId: this.shopId
				}
				request_post(url, param, (res) => {
					if (res.data.ret) {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: '验证成功',
								duration: 2000
							});
						}, 500);
						uni.navigateBack();
					} else {
						uni.showToast({
							icon: 'fail',
							title: res.data.msg,
							duration: 2000
						});
					}
				})
			}
		}
	}
</script>

<style>
	.top-img {
		width: 100%;
	}

	.input-wrapper {
		margin: 120rpx auto;
		width: 65%;
	}

	.input-item {
		margin: 20rpx 0;
		display: flex;
	}

	.iconfont {
		margin-right: 16rpx;
		font-size: 46rpx;
	}

	.input-item>input {
		width: 400rpx;
		vertical-align: top;
		border-bottom: 1rpx solid #E8E8E8;
	}

	.btn-wrapper {
		margin: 0 auto;
		width: 65%;
	}

	.btn-wrapper>button {
		border-radius: 12rpx;
	}
</style>
