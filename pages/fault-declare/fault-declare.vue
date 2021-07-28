<template>
	<view class="content">

		<view class="scan-wrapper">

			<view class="title">输入/扫描租赁物品编号</view>

			<input v-model="bicycleNumber" type="number" maxlength="20" placeholder="输入/扫描租赁物品编号" />

			<text class="iconfont icon-scan" @click="scan()"></text>

		</view>

		<view class="fault-wrapper">

			<view class="title">请选择故障类型</view>

			<view class="flex-wrapper">

				<view class="flex-item-wrapper" @click="selectFault" v-for="(item, index) in faultArr" :key="index"
					:data-index="index">
					<view class="flex-item"
						:style="index === faultIndex ? 'color:' + globalData.mainColor + ';border:1rpx solid ' + globalData.mainColor : ''">
						{{item}}
					</view>
				</view>

			</view>

		</view>

		<view class="remark-wrapper">

			<view class="title">备注说明</view>

			<textarea v-model="remarkContent" maxlength=200 class="remark-input" placeholder="备注说明" />

		</view>

		<button class="submit-btn"
			:style="{'color':globalData.textColor,'border-color':globalData.mainColor,'background-color':globalData.mainColor}"
			size="default" hover-class="none" @click="submitFault()">提交</button>

	</view>
</template>

<script>
	const app = getApp();
	import {
		request_post
	} from '../../utils/http.js';
	export default {
		data() {
			return {
				globalData: getApp().globalData,
				faultIndex: 0,
				index: 0,
				faultArr: ["其它故障", "刹车故障", "二维码故障", "仪表故障", "转把故障", "电池故障", "租赁物品丢失"],
				remarkContent: '',
				bicycleNumber: ''
			}
		},
		onLoad(options) {
			var vehicleNo = typeof options.vehicleNo != "undefined" ? options.vehicleNo : '';
			this.bicycleNumber = vehicleNo;
		},
		methods: {
			selectFault(e) {
				let index = e.currentTarget.dataset.index;
				this.faultIndex = index
			},

			scan() {
				this.bicycleNumber = "";
				uni.scan({
					scanType: ['qrCode'],
					success: (res) => {
						this.bicycleNumber = res.code;
					},
				});
			},

			selectFault(e) {
				let data = e.target.dataset.data,
					index = e.target.dataset.index;
				this.faultIndex = index;
			},

			submitFault() {

				let data = {};

				if (!this.bicycleNumber) {
					uni.showToast({
						icon: 'none',
						title: '请输入或扫描租赁物品编号',
						duration: 3000
					});
					return;
				}

				if (this.data.faultIndex === "") {
					uni.showToast({
						icon: 'none',
						title: '请选择故障类型',
						duration: 3000
					});
					return;
				}

				if (this.faultIndex === 0 && !this.remarkContent) {
					uni.showToast({
						icon: 'none',
						title: '请输入备注说明',
						duration: 3000
					});
					return;
				}

				data.vehicleNo = this.bicycleNumber;
				data.suggestionType = this.faultIndex;
				data.content = this.remarkContent;

				let url = `${app.globalData.baseUrl}/report/fault`;

				request_post(url, data, (res) => {

					if (res.data.ret) {

						uni.showModal({
							title: '温馨提示',
							content: `申报成功,后续请在【主页】通知中查看结果`,
							confirmText: '好的',
							success: (result) => {
								if (result.confirm) {
									uni.navigateBack();
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
				});
			},
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

	.fault-wrapper {
		margin-top: 50rpx;
	}

	.flex-wrapper {
		/* background-color: pink; */
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.flex-item-wrapper {
		margin-bottom: 40rpx;
		text-align: center;
		width: 216.6rpx;
		height: 70rpx;
		line-height: 70rpx;
		font-weight: 600;
		color: #909399;
	}

	.flex-item {
		margin: 0 auto;
		width: 85%;
		font-size: 28rpx;
		color: #909399;
		border: 1rpx solid #909399;
		border-radius: 36rpx;
	}

	.remark-wrapper {
		margin-top: 10rpx;
	}

	.remark-input {
		padding: 20rpx;
		height: 300rpx;
		background-color: #DEDFE1;
	}

	.submit-btn {
		margin: 60rpx auto 0;
		width: 60%;
		border-radius: 12rpx;
	}
</style>
