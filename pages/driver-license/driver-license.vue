<template>
	<view class="content">
		<view
			style=" width:95%;display: flex; margin:20rpx; flex-direction: row; justify-content: space-around;flex-wrap: wrap">
			<view>
				<image @click="upImg" data-no="1" mode="aspectFill" :src='front' style='width:200rpx;height:200rpx;'>
				</image>
				<view class="delete-btn">驾照正面</view>
			</view>
			<view>
				<image @click="upImg" data-no="2" mode="aspectFill" style='width:200rpx;height:200rpx;' :src='back'>
				</image>
				<view class="delete-btn">驾照反面</view>
			</view>
		</view>
		<view class="split"></view>
		<view class="inputInfo">
			<text style='width:200rpx;padding-left:10rpx;'>申请备注</text>
			<input v-model="reason" />
		</view>
		<view class="split"></view>
		<view class="submit">
			<button
				:style="{'color':globalData.textColor,'border-color':globalData.mainColor,'background-color':globalData.mainColor}"
				size="default" hover-class="none" @click="submit">提交</button>
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
				front: '../../static/image.png',
				back: '../../static/image.png',
				frontId: '',
				backId: '',
				companyId: "",
				reason: ''
			}
		},
		onLoad(data) {
			if (data) {
				if (typeof data.companyId != 'undefined') {
					this.companyId = data.companyId
				}
			}
			app.getBaseData(() => {
				this.globalData = app.globalDatal;
			})
		},
		methods: {
			submit(e) {
				uni.showLoading({
					title: '提交中...'
				});
				let param = {
					reason: this.reason,
					frontImgId: this.frontId,
					backImgId: this.backId,
					shopId: this.companyId
				}

				let url = app.globalData.baseUrl + "/customer/uploadDriverLicense";

				request_post(url, param, (res) => {
					if (res.data.ret) {
						setTimeout(function() {
							uni.showToast({
								icon: 'none',
								title: '提交成功，审核结果将以短信通知到您',
								duration: 2000
							});
						}, 500);
						uni.navigateBack();
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg,
							duration: 2000
						});
					}

				});
			},

			upImg(e) {
				let that = this;
				uni.chooseImage({
					sourceType: ['camera', 'album'],
					sizeType: ['compressed'],
					count: 1,
					success: (res) => {

						var no = e.currentTarget.dataset.no;
						if (no == 1) {
							that.front = res.tempFilePaths[0];
						} else if (no == 2) {
							that.back = res.tempFilePaths[0];
						}

						that.uploadImg(no, res.tempFilePaths)

					},
					fail: () => {
						uni.showToast({
							icon: 'none',
							title: '照片选择失败，请重新选择'
						});
					}
				})
			},

			uploadImg: function(no, picture) {
				let that = this;
				uni.showLoading({
					title: '上传中....'
				});
				console.log(uni.getStorageSync('userInfo').token, "uni.getStorageSync('userInfo')");
				uni.uploadFile({
					url: app.globalData.baseUrl + `/image/v2/upload?token=${uni.getStorageSync('userInfo').token}`,
					fileType: 'image',
					name: 'file',
					filePath: picture[0],
					headers: {
						// 'token': uni.getStorageSync('userInfo').token
					},
					success: function(resp) {
						var resp = JSON.parse(resp.data);

						if (resp.ret) {
							if (no == 1)
								that.frontId = resp.data.imageId;
							else if (no == 2)
								that.backId = resp.data.imageId;

							uni.hideLoading();

							uni.showToast({
								title: '上传成功',
								icon: 'success',
								duration: 2000
							})
						} else {
							uni.hideLoading();

							if (no == 1) {
								that.front = ''
								that.frontId = ''
							} else if (no == 2) {
								that.back = ''
								that.backId = ''
							}
							uni.showToast({
								icon: 'none',
								title: '上传失败'
							});
						}



					},
					fail: function(res) {
						console.log('错误信息：', res);

					},
					complete: function() {

					}
				});

			},
		}
	}
</script>

<style>
	.content {
		font-size: 16px;
		width: 100%;
		color: #1f2d3d;
	}

	.inputInfo {
		display: flex;
		flex-direction: row;
		margin: 15px 0px 15px 15px;
		justify-content: flex-start;
	}

	.split {
		border-top: 1px solid #e5e5e5;
	}

	.delete-btn {
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 30px;
		font-size: 15px;
		margin-right: 7px;
		color: white;
		background: rgba(0, 0, 0, 0.5);
		text-align: center;
		line-height: 30px;
	}

	input {
		width: 90%;
	}

	.inputInfo text {
		width: 150rpx;
	}

	text {
		line-height: 50rpx;
	}

	.submit {
		display: flex;
		flex-direction: row;
		margin-top: 30rpx;
	}

	.submit button {
		margin: 10rpx auto 0;
		width: 75%;
		border-radius: 12rpx;
	}

	.login-btn2 {
		margin: 10rpx auto 0;
		width: 75%;
		border-radius: 12rpx;
	}
</style>
