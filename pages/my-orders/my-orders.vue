<template>
	<view class="content">
		<v-tabs v-model="activeTab" :height="100 + 'rpx'" :bgColor="'#'+'00CCCC'" :lineColor="'#FFF'" :color="'#FFF'"
			:activeColor="'#FFF'" :lineHeight="'6rpx'" :fontSize="'32rpx'" :scroll="false" @change="changeTab"
			:tabs="tabs"></v-tabs>
		<view class="tab-content" v-if="activeTab == 0">
			<view class="item-wrapper" v-for="(item, index) in orderData1" :key="index" :data-data="item"
				:data-index="index">
				<view class="paid-item-top">
					<text :style="{'color':globalData.mainColor}">未支付</text>
					<text class="pay-money" v-if="item.payAmt">{{item.payAmt}}元</text>
				</view>
				<view class="paid-item-bottom">
					<view class="paid-item-bottom-item">
						<text>交易创建时间</text>
						<text class="paid-item-bottom-item-right">{{item.createTime}}</text>
					</view>
					<view class="paid-item-bottom-item" v-if="orderData1.octxList[0].octx.orderBiz !== 3">
						<text>租赁开始时间</text>
						<text class="paid-item-bottom-item-right">{{item.octxList[0].octx.startTime}}</text>
					</view>
					<view class="paid-item-bottom-item" v-if="orderData1.octxList[0].octx.orderBiz !== 3">
						<text>租赁结束时间</text>
						<text class="paid-item-bottom-item-right">{{item.octxList[0].octx.endTime}}</text>
					</view>
					<view class="paid-item-bottom-item">
						<text>租借门店</text>
						<text class="paid-item-bottom-item-right">{{item.shop.shopName}}</text>
					</view>
					<view class="paid-item-bottom-item" v-if="orderData1.octxList[0].octx.orderBiz !== 3">
						<text>租借周期</text>
						<text class="paid-item-bottom-item-right">
							{{item.octxList[0].octx.periodUnit === 0 ? item.octxList[0].octx.periodUnitNum + "小时" : 
                 item.octxList[0].octx.periodUnit === 7 ? item.octxList[0].octx.periodUnitNum + "分钟" : 
                item.octxList[0].octx.periodUnit === 1 ? item.octxList[0].octx.periodUnitNum + "天" : 
                item.octxList[0].octx.periodUnit === 5 ? item.octxList[0].octx.periodUnitNum + "周" : 
                item.octxList[0].octx.periodUnit === 2 ? item.octxList[0].octx.periodUnitNum + "月" : 
                item.octxList[0].octx.periodUnit === 3 ? item.octxList[0].octx.periodUnitNum + "季" : 
                item.octxList[0].octx.periodUnit === 4 ? item.octxList[0].octx.periodUnitNum + "年" : 
                item.octxList[0].octx.periodUnitNum + '月(以租代购)'}}
						</text>
					</view>
					<!--<view class="paid-item-bottom-item"><text>类型</text><text class="paid-item-bottom-item-right">{{item.tradeRemark}}</text></view> -->
					<view class="paid-item-bottom-item" v-if="orderData1.octxList[0].octx.orderBiz !== 3">
						<text>车辆编号</text>
						<text class="paid-item-bottom-item-right">{{item.item.itemNo}}</text>
					</view>
					<view class="paid-item-bottom-item">
						<text>租金</text>
						<text class="paid-item-bottom-item-right">{{item.octxList[0].octx.payAmt}}元</text>
					</view>
					<view v-if="item.octxList[0].deposit && orderData1.octxList[0].octx.orderBiz !== 3"
						class="paid-item-bottom-item">
						<text>押金</text>
						<text class="paid-item-bottom-item-right">{{item.octxList[0].deposit}}元</text>
					</view>
					<view v-if="item.octxDep && item.octxDep.orderType == 1" class="paid-item-bottom-item">
						<text>预授权状态</text>
						<text
							class="paid-item-bottom-item-right">{{globalData.authFreezeStateArr[item.octxDep.orderState]}}</text>
					</view>
					<view v-if="item.octxDep && item.octxDep.orderType == 1" class="paid-item-bottom-item">
						<text>预授权资金</text>
						<text class="paid-item-bottom-item-right">{{item.octxDep.paAmt}}元</text>
					</view>
					<view class="paid-item-bottom-item">
						<text>支付方式</text>
						<text v-if="item.payMethod == 1" class="paid-item-bottom-item-right">线上支付</text>
						<text v-else class="paid-item-bottom-item-right">线下支付</text>
					</view>
					<view v-if="item.payMethod == 0" class="paid-item-bottom-item">
						<text>支付情况</text>
						<text class="paid-item-bottom-item-right" style="color:#EA4142;">请与店家确认支付情况</text>
					</view>
				</view>
				<view class="btn-wrapper">
					<view v-if="item.payMethod == 1" class="pay-btn" @click="goPay" :data-data="item">
						去支付
					</view>
					<view @click="cancelOrder" :data-data="item" class="cancel-btn"
						:style="{'margin-right': item.payMethod == 1 ? '' : '0'}">
						取消订单
					</view>
				</view>
			</view>
			<view class="bottom-tips">没有更多记录了</view>
		</view>

		<!-- 已支付 -->
		<view class="tab-content" v-else-if="activeTab === 1">
			<view class="item-wrapper" v-for="(item, index) in orderData2" :key="index" :data-data="item"
				:data-index="index">
				<view class="paid-item-top">
					<text :style="{'color':globalData.mainColor}">已支付</text>
					<text class="pay-money">-{{item.payAmt}}元</text>
				</view>
				<view class="paid-item-bottom">
					<view class="paid-item-bottom-item">
						<text>交易创建时间</text>
						<text class="paid-item-bottom-item-right">{{item.createTime}}</text>
					</view>
					<view class="paid-item-bottom-item" v-if="item.octxList[0].octx.orderBiz !== 3">
						<text>租赁开始时间</text>
						<text class="paid-item-bottom-item-right">{{item.octxList[0].octx.startTime}}</text>
					</view>
					<view class="paid-item-bottom-item" v-if="item.octxList[0].octx.orderBiz !== 3">
						<text>租赁结束时间</text>
						<text class="paid-item-bottom-item-right">{{item.octxList[0].octx.endTime}}</text>
					</view>
					<view class="paid-item-bottom-item">
						<text>租借门店</text>
						<text class="paid-item-bottom-item-right">{{item.shop.shopName}}</text>
					</view>
					<view class="paid-item-bottom-item" v-if="item.octxList[0].octx.orderBiz !== 3">
						<text>租借周期</text>
						<text class="paid-item-bottom-item-right">
							{{item.octxList[0].octx.periodUnit === 0 ? item.octxList[0].octx.periodUnitNum + "小时" : 
                item.octxList[0].octx.periodUnit === 7 ? item.octxList[0].octx.periodUnitNum + "分钟" : 
                item.octxList[0].octx.periodUnit === 1 ? item.octxList[0].octx.periodUnitNum + "天" : 
                item.octxList[0].octx.periodUnit === 5 ? item.octxList[0].octx.periodUnitNum + "周" : 
                item.octxList[0].octx.periodUnit === 2 ? item.octxList[0].octx.periodUnitNum + "月" : 
                item.octxList[0].octx.periodUnit === 3 ? item.octxList[0].octx.periodUnitNum + "季" : 
                item.octxList[0].octx.periodUnit === 4 ? item.octxList[0].octx.periodUnitNum + "年" : 
                item.octxList[0].octx.periodUnitNum + '月(以租代购)'}}
						</text>
					</view>
					<view class="paid-item-bottom-item" v-if="item.octxList[0].octx.orderBiz !== 3">
						<text>车辆编号</text>
						<text class="paid-item-bottom-item-right">{{item.item.itemNo}}</text>
					</view>
					<view class="paid-item-bottom-item">
						<text>租金</text>
						<text class="paid-item-bottom-item-right">{{item.octxList[0].octx.payAmt}}元</text>
					</view>
					<view v-if="item.octxList[0].deposit" class="paid-item-bottom-item">
						<text>押金</text>
						<text class="paid-item-bottom-item-right">{{item.octxList[0].deposit}}元</text>
					</view>
					<view v-if="item.octxDep && item.octxDep.orderType == 1" class="paid-item-bottom-item">
						<text>预授权状态</text>
						<text
							class="paid-item-bottom-item-right">{{globalData.authFreezeStateArr[item.octxDep.orderState]}}</text>
					</view>
					<view v-if="item.octxDep && item.octxDep.orderType == 1" class="paid-item-bottom-item">
						<text>预授权资金</text>
						<text class="paid-item-bottom-item-right">{{item.octxDep.paAmt}}元</text>
					</view>
					<view class="paid-item-bottom-item">
						<text>支付方式</text>
						<text v-if="item.payMethod == 1" class="paid-item-bottom-item-right">线上支付</text>
						<text v-else class="paid-item-bottom-item-right">线下支付</text>
					</view>
				</view>
			</view>
			<view class="bottom-tips">没有更多记录了</view>
		</view>

		<!-- 已关闭 -->
		<view v-else-if="activeTab === 2" class="tab-content">
			<view class="item-wrapper" v-for="(item, index) in orderData3" :key="index" :data-data="item"
				:data-index="index">
				<view class="paid-item-top">
					<text :style="{'color': globalData.mainColor}">已关闭</text>
					<text class="pay-money" v-if="item.payAmt">{{item.payAmt}}元</text>
				</view>
				<view class="paid-item-bottom">
					<view class="paid-item-bottom-item">
						<text>交易创建时间</text>
						<text class="paid-item-bottom-item-right">{{item.createTime}}</text>
					</view>
					<view class="paid-item-bottom-item" v-if="item.octxList[0].octx.orderBiz !== 3">
						<text>租赁开始时间</text>
						<text class="paid-item-bottom-item-right">{{item.octxList[0].octx.startTime}}</text>
					</view>
					<view class="paid-item-bottom-item" v-if="item.octxList[0].octx.orderBiz !== 3">
						<text>租赁结束时间</text>
						<text class="paid-item-bottom-item-right">{{item.octxList[0].octx.endTime}}</text>
					</view>
					<view class="paid-item-bottom-item">
						<text>租借门店</text>
						<text class="paid-item-bottom-item-right">{{item.shop.shopName}}</text>
					</view>
					<view class="paid-item-bottom-item" v-if="item.octxList[0].octx.orderBiz !== 3">
						<text>租借周期</text>
						<text class="paid-item-bottom-item-right">
							{{item.octxList[0].octx.periodUnit === 0 ? item.octxList[0].octx.periodUnitNum + "小时" : 
                  item.octxList[0].octx.periodUnit === 7 ? item.octxList[0].octx.periodUnitNum + "分钟" : 
                item.octxList[0].octx.periodUnit === 1 ? item.octxList[0].octx.periodUnitNum + "天" : 
                item.octxList[0].octx.periodUnit === 5 ? item.octxList[0].octx.periodUnitNum + "周" : 
                item.octxList[0].octx.periodUnit === 2 ? item.octxList[0].octx.periodUnitNum + "月" : 
                item.octxList[0].octx.periodUnit === 3 ? item.octxList[0].octx.periodUnitNum + "季" : 
                item.octxList[0].octx.periodUnit === 4 ? item.octxList[0].octx.periodUnitNum + "年" : 
                item.octxList[0].octx.periodUnitNum + '月(以租代购)'}}
						</text>
					</view>
					<view class="paid-item-bottom-item" v-if="item.octxList[0].octx.orderBiz !== 3">
						<text>车辆编号</text>
						<text class="paid-item-bottom-item-right">{{item.item.itemNo}}</text>
					</view>
					<view class="paid-item-bottom-item">
						<text>租金</text>
						<text class="paid-item-bottom-item-right">{{item.octxList[0].octx.payAmt}}元</text>
					</view>
					<view v-if="item.octxList[0].deposit" class="paid-item-bottom-item">
						<text>押金</text>
						<text class="paid-item-bottom-item-right">{{item.octxList[0].deposit}}元</text>
					</view>
					<view v-if="item.octxDep && item.octxDep.orderType == 1" class="paid-item-bottom-item">
						<text>预授权状态</text>
						<text
							class="paid-item-bottom-item-right">{{globalData.authFreezeStateArr[item.octxDep.orderState]}}</text>
					</view>
					<view v-if="item.octxDep && item.octxDep.orderType == 1" class="paid-item-bottom-item">
						<text>预授权资金</text>
						<text class="paid-item-bottom-item-right">{{item.octxDep.paAmt}}元</text>
					</view>
					<view class="paid-item-bottom-item">
						<text>支付方式</text>
						<text v-if="item.payMethod == 1" class="paid-item-bottom-item-right">线上支付</text>
						<text a:else class="paid-item-bottom-item-right">线下支付</text>
					</view>
				</view>
			</view>
			<view class="bottom-tips">没有更多记录了</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	import {
		request_get,
		request_post
	} from '../../utils/http.js';
	export default {
		data() {
			return {
				globalData: app.globalData,
				activeTab: 0,
				tabs: ['未支付', '已支付', '已关闭'],
				orderData1: [], // 未支付
				orderData2: [], // 已支付
				orderData3: [], // 已关闭
			}
		},
		onLoad() {
			this.getOrderData();
			app.setNavigationBarColor();
		},
		methods: {
			changeTab(index) {
				console.log('当前选中的项：' + index)
				this.activeTab = index;
				console.log(this.activeTab);
			},

			getOrderData() {
				let url1 = `${app.globalData.baseUrl}/customer/v3/bill?billState=0&pageSize=100`,
					url2 = `${app.globalData.baseUrl}/customer/v3/bill?billState=1&pageSize=100`,
					url3 = `${app.globalData.baseUrl}/customer/v3/bill?billState=2&pageSize=100`;
				request_get(url1, (res) => {
					if (res.data.ret) {
						this.orderData1 = res.data.data
					}
				});
				request_get(url2, (res) => {
					if (res.data.ret) {
						this.orderData2 = res.data.data
					}
				});
				request_get(url3, (res) => {
					if (res.data.ret) {
						this.orderData3 = res.data.data
					}
				});
			},

			// 去支付
			goPay() {

			},

			// 取消订单
			cancelOrder(e) {
				let data = e.currentTarget.dataset.data;
				if (data.billSn) {

					uni.showModal({
						title: '温馨提示',
						content: '确定取消此订单吗？',
						success: (result) => {
							if (result.confirm) {
								let url =
									`${app.globalData.baseUrl}/customer/bill/cancel?billSn=${data.billSn}`;
								request_post(url, {}, (res) => {
									if (res.data.ret) {
										uni.removeStorageSync('orderData');
										uni.showToast({
											icon: 'none',
											title: '取消订单成功',
											duration: 3000
										});
										this.getOrderData();
									}
								});
							}
						},
					});

				}
			},

			handleTabClick({
				index,
				tabsName
			}) {
				this.tabsName = [index]
			},

			handleTabChange({
				index,
				tabsName
			}) {
				this.tabsName = [index]
			},

			onPullDownRefresh() {
				// 监听页面下拉刷新事件
				let that = this;
				uni.stopPullDownRefresh({
					complete(res) {
						that.getOrderData();
					}
				})
			},
		}
	}
</script>

<style>
	page {
		background-color: #F1F0F6;
	}

	.tabs-wrapper {
		width: 100vw;
	}

	.tab-content {
		background-color: #F1F0F6;
	}

	.item-wrapper {
		margin-bottom: 12rpx;
		padding: 40rpx 40rpx 20rpx;
		font-size: 30rpx;
		background-color: #fff;
	}

	.paid-item-top {
		padding-bottom: 18rpx;
		border-bottom: 1rpx solid #E3E3E3;
	}

	.paid-item-bottom {
		margin-top: 18rpx;
	}

	.pay-money {
		float: right;
		color: #EA4142;
	}

	.paid-item-bottom-item {
		margin: 10rpx 0;
		color: #303133;
	}

	.paid-item-bottom-item-right {
		float: right;
	}

	.bottom-tips {
		padding: 24rpx 0 48rpx;
		text-align: center;
		font-size: 26rpx;
		color: #909399;
	}

	.btn-wrapper {
		margin-top: 18rpx;
		height: 55rpx;
	}

	.pay-btn,
	.cancel-btn {
		float: right;
		padding: 10rpx 16rpx;
		text-align: center;
		font-size: 26rpx;
		color: #898989;
		border: 1rpx solid #898989;
		border-radius: 10rpx;
	}

	.pay-btn {
		width: 90rpx;
	}

	.cancel-btn {
		margin-right: 20rpx;
		width: 110rpx;
	}
</style>
