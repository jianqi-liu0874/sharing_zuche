<template>
	<view class="content">
		<view style="display: flex; flex-direction: column; height: 100vh;">
			<view class="top-wrapper">
				<view @click="toUserCenter" class="top-icon-left tac f1">
					<text :style="{'color':globalData.mainColor}" class="iconfont icon-yonghu top-icon"></text>
				</view>
				<view class="search-item tac" @click="searchLocation">搜索位置查找附近门店</view>
				<view class="top-icon-right tac f1">
					<view @click="toInfo" :style="{'color':globalData.mainColor}"
						class="iconfont icon-message top-icon"></view>
				</view>
			</view>
			<view class="top-float-wrapper" v-if="hadLogined && showTopFloat">
				<!-- 顶部状态、续租、解锁等按钮 -->
				<view class="top-bikeStatus-wrapper">
					<view class="top-bikeStatus-top">
						<view class="top-item inline3">
							<view class="inline3-top" :style="{'color':globalData.mainColor}">
								{{bicycleData.batDt ? bicycleData.batDt.substring(5,16) : '无信号'}}
							</view>
							<view class="inline3-bottom">信号时间</view>
						</view>
						<view class="top-item inline3">
							<view class="inline3-top" v-if="bicycleData.battery >= 0"
								:style="{'color':globalData.mainColor}">{{bicycleData.battery}}%
							</view>
							<view v-else class="inline3-top" :style="{'color':globalData.mainColor}">无数据</view>
							<view class="inline3-bottom">剩余电量</view>
						</view>
						<view class="top-item inline3">
							<view class="inline3-top" :style="{'color':globalData.mainColor}">{{bicycleData.mileage}}km
							</view>
							<view class="inline3-bottom">续航里程</view>
						</view>
						<view class="top-item inline3">
							<view class="inline3-top" :style="{'color':globalData.mainColor}">加锁</view>
							<!-- 						<view class="inline3-top" :style="{'color':globalData.mainColor}">解锁</view>
							<view :style="{'color':globalData.mainColor}">
								启动</view> -->
							<view class="inline3-bottom">当前状态</view>
						</view>
					</view>
				</view>
				<!-- 顶部消息通知 -->
				<cover-view>
					<cover-view class="top-info-wrapper" v-if="lastInfoContent && !hadViewedInfo"
						@click="toChangeBicycleResult">
						<cover-view class="iconfont icon-info" :style="{'color':globalData.mainColor}"></cover-view>
						<cover-view>{{lastInfoContent}}</cover-view>
						<cover-view class="iconfont icon-right" style="position:absolute;right:24rpx;"></cover-view>
					</cover-view>
				</cover-view>
			</view>
			<map style="width: 100%;" id="map" class="map" @regionchange="regionchange" :longitude="mapData.longitude"
				:latitude="mapData.latitude" :controls="controls" @controltap="controltap" show-location
				:polygons="polygon" :markers="markers" @markertap="toStoreDetail">
			</map>
		</view>
		<view v-if="!hadLogined" class="top-tips-wrapper"
			:style="{'color':globalData.commonTextColor2,'background':'#fff'}" @click="toLogin">
			<view class="iconfont icon-tips" :style="{'color':globalData.mainColor}"></view>
			<view class="tips-text">您还未登录，请点击登录</view>
			<view class="iconfont icon-right"></view>
		</view>
		<view v-if="hadLogined && havePartsOrder" class="top-tips-wrapper"
			:style="{'color':globalData.commonTextColor2,'background':'#fff'}" @click="toParts">
			<view class="iconfont icon-tips" :style="{'color':globalData.mainColor}"></view>
			<view class="tips-text">您有一条订单待支付</view>
			<view class="iconfont icon-right"></view>
		</view>
		<view @click="toContract" v-if="hadLogined && papcData.nextPayDate" class="top-tips-wrapper"
			:style="{'color':globalData.commonTextColor2,'background':'#fff','margin-top': '100rpx'}">
			<view class="iconfont icon-tips" :style="{'color':globalData.mainColor}"></view>
			<view class="tips-text">您已签约周期扣款，预计扣款日{{papcData.nextPayDate}}</view>
			<view class="iconfont icon-right"></view>
		</view>
		<cover-image class="map-center-marker" mode="aspectFit" src="/static/pin.png"></cover-image>
		<view v-if="hadLogined && showTopFloat" class='footerClass'
			:style="{'background':globalData.mainColor,'color':'#ffffff'}">
			<view class="station-header" style="margin-top:0rpx;margin-bottom:20rpx;" @click="toggle">
				<text v-if="expand" class="arrow-down"></text>
				<text v-if="!expand" class="arrow-up"></text>
			</view>
			<view :class="['scan-btn-wrapper', !expand ? 'mask-show' : '']" style="margin-bottom:30rpx;">
				<view class="scan-btn-item" @click="startBicycle">
					<text class="iconfont icon-power"></text>
					<text class="scan-text">启动</text>
				</view>
				<view v-if="!bicycleData.lockState" class="scan-btn-item" @click="lockBicycle">
					<text class="iconfont icon-lock"></text>
					<text class="scan-text">加锁</text>
				</view>
				<view v-else class="scan-btn-item" @click="unlockBicycle">
					<text class="iconfont icon-unlock"></text>
					<text class="scan-text">解锁</text>
				</view>
				<view class="scan-btn-item" @click="renewBicycle">
					<text class="iconfont icon-renew"></text>
					<text class="scan-text">{{bicycleData.endTime.split(" ")[0]}}到期</text>
				</view>
				<view class="scan-btn-item">
					<text class="iconfont icon-huan" @click="transferBicycle"></text>
					<text class="scan-text">换车/电</text>
				</view>
				<view class="scan-btn-item" @click="returnBicycle">
					<text class="iconfont icon-huankuan"></text>
					<text class="scan-text">还车/电</text>
				</view>
			</view>
		</view>
		<view v-else class='footerClass_new'>
			<view class="scan-btn-wrapper">
				<view class="scan-btn-content" style="height:auto">
					<view
						style="height:110rpx;width:100%;display:flex;justify-content: center;align-items: center;margin-bottom:40rpx;">
						<view class='scan-btn_new' :style="{'background':globalData.mainColor}" @click="toScan">
							<view class="scan-btn-view">
								<text class="iconfont icon-scan"></text>
								<text class="scan-text1">扫码租车/电</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	import {
		goPage,
		getDistance
	} from '../../utils/util.js'
	import {
		request_get,
		request_post
	} from '../../utils/http.js'
	export default {
		data() {
			return {
				globalData: app.globalData,
				hadLogined: false,
				showTopFloat: false, //租车状态框标识
				showPopup: false,
				hadViewedInfo: true,
				infoNum: 0,
				lastInfoContent: "",
				bicycleData: {},
				renewData: {},
				mode: 'aspectFit',
				mapData: {
					scale: 14,
					longitude: "",
					latitude: "",
					mapSetting: {
						// 指南针，为1表示显示，为0表示不显示
						showCompass: 0,
						// 双手下滑，为1表示支持，为0表示不支持
						tiltGesturesEnabled: 0,
					}
				},
				controls: [{
						id: 1,
						iconPath: "../../static/question.png",
						position: {
							right: 8,
							top: 331,
							width: 44,
							height: 44
						},
						clickable: true
					},
					{
						id: 2,
						iconPath: "../../static/dw.png",
						position: {
							right: 8,
							top: 384,
							width: 44,
							height: 44
						},
						clickable: true
					}
				], // idea中图片无法显示，真机、模拟器正常
				markers: [],
				polygon: [],
				bicycleIconPath: '', //`${app.globalData.imagesUrl}/${app.globalData.brandId}/map/bicycle.png`,
				storeIconPath: '', //`${app.globalData.imagesUrl}/${app.globalData.brandId}/map/store.png`,
				getBicycleDataTimer: null,
				getInfoDataTimer: null,
				expand: true,
				havePartsOrder: false, // 是否有配件订单
				partsOrderData: [],
				mapCtx: '',
				papcData: {}
			}
		},
		onLoad() {
			// 页面加载完成
			this.mapCtx = uni.createMapContext('map');
		},

		onShow() {
			console.log('onShow');

			let that = this;
			that.moveToLocation();
			that.judgeIfLogined(); //判断是否登录
			if (this.hadLogined) { // 已登录
				console.log('已登录');
				app.getBaseData_index_onshow(() => {
					that.globalData = app.globalData
					console.log('经纬度', this.mapData.longitude);
					that.bicycleIconPath = `${app.globalData.imagesUrl}/${app.globalData.brandId}/map/bicycle.png`
					that.storeIconPath = `${app.globalData.imagesUrl}/${app.globalData.brandId}/map/store.png`
					that.globalData = app.globalData;
					this.getBicycleData();
					if (!that.showTopFloat)
						this.getBicycleDataInterval();
					this.getInfoData();
					this.getInfoDataInterval();
					this.getPartsOrderData();
				});

			}

		},
		onReady() {
			console.log('onReady');
			let that = this;

			if (uni.getLocation) {
				uni.getLocation({ // 获取用户手机定位
					type: 'gcj02',
					success(res) {
						console.log("***用户定位：", JSON.stringify(res));
						that.initLon = res.longitude;
						that.initLat = res.latitude;
						that.mapData.longitude = res.longitude;
						that.mapData.latitude = res.latitude;
						app.getBaseData(() => {
							that.globalData = app.globalData;
							that.bicycleIconPath =
								`${app.globalData.imagesUrl}/${app.globalData.brandId}/map/bicycle.png`;
							that.storeIconPath =
								`${app.globalData.imagesUrl}/${app.globalData.brandId}/map/store.png`;
							uni.setNavigationBarTitle({
								title: app.globalData.name
							});
							that.getNearbyStoreData(res.longitude, res.latitude);
						});
					},
					fail() {
						uni.showToast({
							icon: 'none',
							title: '定位失败'
						});
					}
				});
			}


		},

		onHide() {
			// 页面隐藏
			this.clearAllInterval(); // 离开页面时，清除定时器
		},

		onUnload() {
			// 页面被关闭
			this.clearAllInterval(); // 离开页面时，清除定时器
		},

		methods: {
			toInfo: function() {
				goPage('/pages/info/info')
			},

			init() {
				this.getMainData();
			},

			//获取品牌信息、初始化数据
			getMainData() {

				if (this.hadLogined) { // 已登录
					console.log("已登录");
					this.getBicycleData();
					this.getBicycleDataInterval();
					this.getInfoData();
					this.getInfoDataInterval();
				} else { // 未登录
					console.log("未登录");
					this.clearAllInterval();
					this.getNearbyStoreData();
				}


			},

			// 点击地图控件
			controltap(e) {
				const {
					controlId
				} = e;
				if (controlId === 2) {
					this.moveToLocation();
				} else if (controlId === 1) {
					this.toHelp();
				} else if (controlId == 3) {
					this.toScan();
				}
			},

			toggle() {
				let that = this;
				if (!this.hadToggle) {
					setTimeout(function() {
						that.hadToggle = false;
					}, 500);
					this.hadToggle = true;
					let p = !this.expand;
					this.expand = p;
				}
			},

			clearAllInterval() {
				console.log("clear all interval...");
				clearInterval(this.getBicycleDataTimer);
				clearInterval(this.getInfoDataTimer);
				this.getBicycleDataTimer = null;
				this.getInfoDataTimer = null;
				this.infoNum = 0;
				this.lastInfoContent = "";
			},

			toLogin() {
				let that = this;
				if (!this.hadClickToLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					});
					setTimeout(function() {
						that.hadClickToLogin = false;
					}, 3000);
					this.hadClickToLogin = true;
				}

			},

			toParts() {
				let that = this;
				if (!this.hadClickToParts) {
					if (this.partsOrderData.goodsOrders[0].orderBiz == 3) {
						uni.navigateTo({
							url: '/pages/parts-order-detail/parts-order-detail'
						});
					} else {
						uni.navigateTo({
							url: '/pages/order-detail/order-detail'
						});
					}
					setTimeout(function() {
						that.hadClickToParts = false;
					}, 3000);
					this.hadClickToParts = true;
				}

			},

			//续租
			renewBicycle() {
				let that = this;

				if (!this.hadClickRenewBicycle) {
					setTimeout(function() {
						that.hadClickRenewBicycle = false;
					}, 3000);
					this.hadClickRenewBicycle = true;
					let url = `${app.globalData.baseUrl}/rentBiz/reRentPageData`;

					request_post(url, {}, (res) => {
						if (res.data.ret) {
							let data = res.data.data;
							data.isRenew = true;
							// goPage('../bicycle-detail/bicycle-detail', data);
							uni.navigateTo({
								url: `../bicycle-details/bicycle-details?data=${JSON.stringify(data)}`
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg,
								duration: 3000
							});
						}
					});
				}

			},

			//换车
			transferBicycle: function() {

				let that = this;

				if (!this.hadClickTransferBicycle) {
					setTimeout(function() {
						that.hadClickTransferBicycle = false;
					}, 3000);
					this.hadClickTransferBicycle = true;
					goPage('/pages/scan/scan', {
						isTransfer: true
					});
				}

			},

			//跳转到扫码
			toScan: function() {

				let that = this;

				if (!this.hadClickToScan) {
					setTimeout(function() {
						that.hadClickToScan = false;
					}, 3000);
					this.hadClickToScan = true;

					goPage('/pages/scan/scan', {
						isScanFromMap: true
					});
				}

			},


			// 获取租赁物品数据
			getBicycleData() {
				let url = `${app.globalData.baseUrl}/vehicle/status?mapType=${app.globalData.mapType}`;
				request_get(url, (res) => {
					if (res.data.ret) {
						let data = res.data.data;
						let bicycleData = {
							vehicleNo: data.lease.item.itemNo,
							machineNo: data.lease.item.machineNo,
							batDt: data.status.batDt,
							battery: data.status.socPercent,
							mileage: data.status.surplusMileage,
							lockState: data.status.lock,
							startState: data.status.start,
							endTime: data.lease.endTime.slice(5, 16),
							companyId: data.lease.shopId,
							"mapData.longitude": data.status.lonC,
							"mapData.latitude": data.status.latC
						}

						this.bicycleData = bicycleData
						if (data.papc) {
							this.papcData = data.papc;
						};
						if (!this.showTopFloat) { // 这里做个判断是为了防止页面不必要的闪烁
							this.showTopFloat = true
							this.markers = [];
						}
						this.changeBicycleMarker(data);
					} else {
						this.showTopFloat = false
						this.bicycleData = {}
					}
				});
			},

			// 轮询获取租赁物品物品信息
			getBicycleDataInterval() {
				if (this.getBicycleDataTimer) {
					clearInterval(this.getBicycleDataTimer);
					this.getBicycleDataTimer = null;
				}
				this.getBicycleDataTimer = setInterval(() => {
					let url = `${app.globalData.baseUrl}/vehicle/status?mapType=${app.globalData.mapType}`;
					if (this.hadLogined) {
						request_get(url, (res) => {
							if (res.data.ret) {
								let data = res.data.data;
								let bicycleData = {
									vehicleNo: data.lease.item.itemNo,
									machineNo: data.lease.item.machineNo,
									batDt: data.status.batDt,
									battery: data.status.socPercent,
									mileage: data.status.surplusMileage,
									lockState: data.status.lock,
									startState: data.status.start,
									// endTime: data.lease.endTime.slice(5, 10),
									endTime: data.lease.endTime.slice(5, 16),
									companyId: data.lease.shopId
								}
								this.bicycleData = bicycleData;
								this.markers = [];
								if (data.papc) {
									this.papcData = data.papc;
								};
								if (!this.showTopFloat) { // 这里做个判断是为了防止页面不必要的闪烁
									this.showTopFloat = true
								}
								this.changeBicycleMarker(data);

							} else {
								this.showTopFloat = false;
								this.bicycleData = {};
								this.markers = [];
								clearInterval(this.getBicycleDataTimer);
								this.getBicycleDataTimer = null;
								this.getNearbyStoreData();
							}
						});
					} else {
						clearInterval(this.getBicycleDataTimer);
						this.getBicycleDataTimer = null;
					}
				}, 30000);
			},

			// 立即获取消息通知
			getInfoData() {
				let url = `${app.globalData.baseUrl}/customer/notify/num`;
				request_get(url, (res) => {
					// 未读消息数量数据
					if (res.data.ret) {
						let data = res.data.data;
						this.infoNum = data.totalUnreadNum;
					}
				});
			},

			// 轮询获取消息通知
			getInfoDataInterval() {
				if (this.getInfoDataTimer) {
					clearInterval(this.getInfoDataTimer);
					this.getInfoDataTimer = null;
				}
				this.getInfoDataTimer = setInterval(() => {

					let url = `${app.globalData.baseUrl}/customer/notify/num`;
					if (app.globalData.hadLogined) {
						request_get(url, (res) => {
							// 轮询未读消息数量数据
							if (res.data.ret) {
								let data = res.data.data;
								this.infoNum = data.totalUnreadNum;
							}
						});
					} else {
						clearInterval(this.getInfoDataTimer);
						this.getInfoDataTimer = null;
					}
				}, 30000);
			},

			// 地图附近的门店数据
			getNearbyStoreData(lon, lat) {

				let that = this;
				if (typeof lon != 'undefined' && typeof lat != 'undefined') {
					// （传了经纬度） 如果用户没租车，滑动地图，获取地图中心附近（20km？）门店的门店数据，展示电子围栏
					let url =
						`${app.globalData.baseUrl}/shop/nearbyShops?lonC=${lon}&latC=${lat}&userLonC=${lon}&userLatC=${lat}&mapType=${app.globalData.mapType}&appId=${app.globalData.appId}&scale=20000`;

					request_get(url, (res) => {

						let data = res.data.data;

						if (data.length) {
							const closestDistance = Math.min.apply(Math, data.map(item => item
								.distance)); // 距离用户最近的门店
							const closestDistanceIndex = data.findIndex(item => closestDistance === item.distance);
							const closestStore = data[closestDistanceIndex];


							let geo = closestStore.svcArea;

							// 加载电子围栏
							if (geo) {

								let points = [],
									geoPoints = [];

								geoPoints = geo.pointsStrC.split(";");

								for (let i = 0; i < geoPoints.length; i++) {
									let geoPoint = {
										longitude: geoPoints[i].split(",")[0],
										latitude: geoPoints[i].split(",")[1]
									}
									points.push(geoPoint);
								}

								let polygon = [{
									points,
									color: '#FF000099',
									fillColor: '#FF000015',
									width: 4,
								}];

								that.polygon = polygon;
								that.mapData.longitude = that.endLon ? that.endLon : lon;
								that.mapData.latitude = that.endLat ? that.endLat : lat;
								that.mapData.scale = that.endScale ? that.endScale : 14;
							} else {
								that.polygon = [];
								that.mapData.longitude = that.endLon ? that.endLon : lon;
								that.mapData.latitude = that.endLat ? that.endLat : lat;
								that.mapData.scale = that.endScale ? that.endScale : 14;
							}

							let storeArrData = [];

							// 如果用户没有租车，地图上展示门店位置
							if (!that.showTopFloat) {
								console.log("用户没有租车，地图上展示门店位置")
								const closestDistance = Math.min.apply(Math, data.map(item => item
									.distance)); // 距离用户最近的门店
								const closestDistanceIndex = data.findIndex(item => closestDistance === item
									.distance);

								for (let i = 0; i < data.length; i++) {
									let storeDataObj = {
										iconPath: that.storeIconPath,
										id: parseInt(data[i].shopId),
										latitude: data[i].lat,
										longitude: data[i].lon,
										width: 46,
										height: 50
									}
									if (i === closestDistanceIndex) {
										storeDataObj.label = {
											content: "离我最近的门店",
											color: "#000000",
											fontSize: 12,
											borderRadius: "5",
											bgColor: "#ffffff",
											padding: 10,
										}
									} else {
										storeDataObj.label = {
											content: data[i].shopName,
											color: "#000000",
											fontSize: 12,
											borderRadius: "5",
											bgColor: "#ffffff",
											padding: 10,
										}
									}
									storeArrData.push(storeDataObj);
								}

								let markers = [];

								for (let i = 0; i < storeArrData.length; i++) {
									markers[i] = storeArrData[i];
								}

								that.markers = markers
							}
						}

					});

				} else {
					// （没传经纬度） 如果用户没租车，获取用户位置附近(20km)的门店数据；如果用户租了车，获取用户租车的门店数据
					if (typeof that.initLon != 'undefined' && typeof that.initLat != 'undefined') {
						let url =
							`${app.globalData.baseUrl}/shop/nearbyShops?lonC=${that.initLon}&latC=${that.initLat}&userLonC=${that.initLon}&userLatC=${that.initLat}&mapType=${app.globalData.mapType}&appId=${app.globalData.appId}&scale=20000`;

						request_get(url, (res) => {
							console.log("门店数据：", res.data, that.initLon);
							if (res.data.ret) {
								if (res.data.data.length > 0) {
									let data = res.data.data;

									let storeData = {};

									if (that.showTopFloat) { // 如果用户租了车，获取用户租车所在的门店
										let shopId = that.bicycleData.companyId;
										let rentStore = data.filter(item => {
											return item.shopId == shopId;
										})
										if (rentStore.length) {
											storeData = rentStore[0];
										}
										console.log("用户租车的门店数据：", storeData);
									} else { // 如果用户没有租车，获取用户位置附近的门店
										const closestDistance = Math.min.apply(Math, data.map(item => item
											.distance)); // 距离用户最近的门店
										const closestDistanceIndex = data.findIndex(item => closestDistance ===
											item.distance);
										storeData = data[closestDistanceIndex];
										console.log("距离用户最近的门店数据：", storeData);
									}

									let geo = storeData.svcArea;

									// 加载电子围栏
									if (geo) {

										let points = [],
											geoPoints = [];

										geoPoints = geo.pointsStrC.split(";");

										for (let i = 0; i < geoPoints.length; i++) {
											let geoPoint = {
												longitude: geoPoints[i].split(",")[0],
												latitude: geoPoints[i].split(",")[1]
											}
											points.push(geoPoint);
										}

										let polygon = [{
											points,
											color: '#FF000099',
											fillColor: '#FF000015',
											width: 4,
										}];
										that.polygon = polygon;
										that.mapData.longitude = that.initLon;
										that.mapData.latitude = that.initLat;
										that.mapData.scale = 14;
									}

									let storeArrData = [];

									// 如果用户没有租车，地图上展示门店位置
									if (!that.showTopFloat) {
										console.log("用户没有租车，地图上展示门店位置")
										const closestDistance = Math.min.apply(Math, data.map(item => item
											.distance)); // 距离用户最近的门店
										const closestDistanceIndex = data.findIndex(item => closestDistance ===
											item.distance);
										for (let i = 0; i < data.length; i++) {
											let storeDataObj = {
												iconPath: that.storeIconPath,
												id: parseInt(data[i].shopId),
												latitude: data[i].lat,
												longitude: data[i].lon,
												width: 46,
												height: 50
											}
											if (i === closestDistanceIndex) {
												storeDataObj.label = {
													content: "离我最近的门店",
													color: "#000000",
													fontSize: 12,
													borderRadius: "5",
													bgColor: "#ffffff",
													padding: 10,
												}
											} else {
												storeDataObj.label = {
													content: data[i].shopName,
													color: "#000000",
													fontSize: 12,
													borderRadius: "5",
													bgColor: "#ffffff",
													padding: 10,
												}
											}
											storeArrData.push(storeDataObj);
										}

										let markers = [];

										for (let i = 0; i < storeArrData.length; i++) {
											markers[i] = storeArrData[i];
										}
										that.markers = [1, 0, ...markers]
									}

								} else {
									uni.showToast({
										icon: 'none',
										title: '附近无门店'
									});
								}
							}
						});
					}

				}

			},

			// 设置租赁物品物品在地图中显示
			changeBicycleMarker(data) {

				let bicycleMarker = {
					iconPath: this.bicycleIconPath,
					id: data.lease.item.machineNo,
					latitude: data.status.latC,
					longitude: data.status.lonC,
					width: 38,
					height: 40,
					label: {
						content: `${data.lease.item.itemNo}`,
						color: "#000000",
						fontSize: 12,
						borderRadius: "3",
						bgColor: "#ffffff",
						padding: 10
					}
				}

				let markers = this.markers;
				let hadFoundBicycle = false;

				// 多次获取租赁物品物品数据的时候租赁物品租赁物品marke租赁物品盖旧租赁物品marker
				for (let i = 0; i < markers.length; i++) {
					if (markers[i].iconPath === this.bicycleIconPath) {
						hadFoundBicycle = true;
						markers[i] = bicycleMarker;
					}
				}

				if (!hadFoundBicycle) {
					markers = markers.concat([bicycleMarker]);
				}
				this.markers = [1, 0, ...markers];

			},

			// 启动租赁物品物品
			startBicycle() {
				this.sendControl(11, 1, "启动");
			},

			// 加锁租赁物品物品
			lockBicycle() {
				this.sendControl(1, 1, "加锁");
			},

			// 解锁租赁物品物品
			unlockBicycle() {
				this.sendControl(2, 1, "解锁");
			},

			sendControl(type, controlType, controlName) {
				let url = app.globalData.baseUrl + "/machine/operate",
					param = {
						param: type,
						controlType
					};

				request_post(url, param, (res) => {
					if (res.data.ret) {
						// 成功获取操作流水号
						uni.showToast({
							icon: 'none',
							title: '请稍候'
						});

						let serialNo = res.data.data,
							url = `${app.globalData.baseUrl}/machine/operate?serialNo=${serialNo}`;

						// 启动轮询线程
						let count = 0,
							timer = null;

						if (timer) {
							clearInterval(timer);
						}

						timer = setInterval(() => {

							request_get(url, (res) => {

								if (res.data.ret) {
									let data = res.data.data;

									if (data.success === -1) {
										clearInterval(timer);
										uni.hideToast();
										uni.showToast({
											icon: 'none',
											title: `${controlName}失败`,
											duration: 3000
										});

									} else if (data.success === 1) {

										clearInterval(timer);
										uni.hideToast();
										uni.showToast({
											type: 'success',
											title: `${controlName}成功`,
											duration: 3000
										});

										this.getBicycleData();

									} else if (data.success === 0) {
										uni.hideToast();
										uni.showToast({
											icon: 'none',
											title: '等待响应...'
										});

										count++;
										if (count > 15) {
											clearInterval(timer);
											uni.hideToast();
											uni.showToast({
												icon: 'none',
												title: `${controlName}失败，终端未响应`,
												duration: 3000
											});
										}

									}
								}

							});

						}, 2000);


					} else {
						uni.showToast({
							icon: 'none',
							title: `${controlName}失败`,
							duration: 3000
						});
					}
				});
			},

			// 判断是否登录
			judgeIfLogined() {
				app.judgeIfLogined();
				this.hadLogined = app.globalData.hadLogined;
			},

			initPageData() {
				this.showTopFloat = false;
				this.bicycleData = {};
				this.markers = [];
			},

			returnBicycle() {
				let that = this;
				if (!this.hadClickReturnBicycle) {
					setTimeout(function() {
						that.hadClickReturnBicycle = false;
					}, 3000);
					that.hadClickReturnBicycle = true;
					uni.showModal({
						title: '温馨提示',
						content: '确认还车吗？',
						success: (result) => {
							if (result.confirm) {
								let url =
									`${app.globalData.baseUrl}/rentBiz/return?mapType=${app.globalData.mapType}`;
								request_post(url, {}, (res) => {
									if (res.data.ret) {
										uni.showToast({
											icon: 'none',
											title: '还车成功',
											duration: 3000
										});
										this.initPageData();
										this.getBicycleData();
										this.getInfoData();
									} else {
										if (res.data.subCode == 108 || res.data.subCode == 112 || res
											.data
											.subCode == 105 || res.data.subCode == 109 || res.data
											.subCode == 106) {
											let data = res.data.data;
											uni.showModal({
												title: '温馨提示',
												content: `还车失败：${res.data.msg},门店：${data.shopName},地址:${data.address}`,
												success: (result) => {
													if (result.confirm) {
														uni.openLocation({
															longitude: data.lonC,
															latitude: data.latC,
															name: data.shopName,
															address: data.address,
														});
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
						},
					});

				}
			},

			searchLocation() {
				this.chooseLocation();
			},

			chooseLocation() {
				if (!this.hadClickChooseLocation) {
					this.hadClickChooseLocation = true;
					uni.chooseLocation({
						success: (res1) => {
							uni.getLocation({ // 获取用户手机定位
								success(res2) {
									res1.userLongitude = res2.longitude;
									res1.userLatitude = res2.latitude;
									goPage('/pages/nearby-stores/nearby-stores', res1);
								},
								fail() {
									uni.showToast({
										icon: 'none',
										title: '定位失败'
									});
								}
							});
							this.hadClickChooseLocation = false;
						},
						fail: (error) => {
							this.hadClickChooseLocation = false;
						},
					});
				}
			},

			closePopup() {
				if (this.showPopup) {
					this.showPopup = false
				}
			},

			moveToLocation() {
				let that = this;
				this.mapCtx.moveToLocation({
					longitude: that.mapData.longitude,
					latitude: that.mapData.latitude
				})
				this.getNearbyStoreData();
			},

			//地图视野变化
			regionchange(e) {

				if (e.type === "begin") {
					this.beginLon = e.longitude;
					this.beginLat = e.latitude;
				}
				if (e.type === "end") {
					this.endLon = e.longitude;
					this.endLat = e.latitude;
					this.endScale = e.scale;
					let distance = getDistance(this.beginLon, this.beginLat, this.endLon, this.endLat) * 1000;
					if (!isNaN(distance) && distance > 1000 && !this.showTopFloat) {
						this.getNearbyStoreData(this.endLon, this.endLat);
					}
				}
			},

			///换车
			toChangeBicycleResult() {
				this.hadViewedInfo = true
				goPage('/pages/change-bicycle-result/change-bicycle-result');
			},

			//个人中心
			toUserCenter() {
				let that = this;
				if (!this.hadClickToUserCenter) {
					setTimeout(function() {
						that.hadClickToUserCenter = false;
					}, 3000);
					this.hadClickToUserCenter = true;
					goPage('/pages/user-center/user-center');
				}

			},

			toInfo() {
				let that = this;
				if (!this.hadClickToInfo) {
					this.hadClickToInfo = true;
					setTimeout(function() {
						that.hadClickToInfo = false;
					}, 3000);
					if (this.hadLogined) {
						goPage('/pages/info/info');
					} else {
						uni.showToast({
							icon: 'none',
							title: '请先登录'
						});
						goPage('/pages/login/login');
					}
				}
			},

			toHelp() {
				let vehicleNo = '';
				if (typeof this.bicycleData.vehicleNo != 'undefined') {
					vehicleNo = this.bicycleData.vehicleNo;
				}
				goPage('/pages/help/help', {
					vehicleNo: vehicleNo
				});
			},

			toStoreDetail(data) {
				// 暂时认为markerId长度为9的是设备编号，代表点击的marker是租赁物品物品而不是门店，此时不跳转页面
				if (data.detail.markerId.toString().length != 9) {
					// goPage('/pages/store-detail/store-detail', data);
					let markerId = data.detail.markerId;
					uni.navigateTo({
						url: `../store-details/store-details?markerId=${markerId}`
					})
				}
			},

			// 获取配件订单
			getPartsOrderData() {
				let url = `${app.globalData.baseUrl}/customer/bill/processing`
				request_get(url, (res) => {
					if (res.data.ret) {
						this.partsOrderData = res.data.data
						if (res.data.data) {
							this.havePartsOrder = true
						} else {
							this.havePartsOrder = false
						}

					}
				});
			},
		},



	}
</script>

<style>
	.top-wrapper {
		height: 100rpx;
		display: flex;
		align-items: center;
	}

	.search-item {
		width: 70%;
		color: #91949A;
		border-left: 1rpx solid #DFDFDF;
		border-right: 1rpx solid #DFDFDF;
	}

	.tac {
		text-align: center;
	}

	.f1 {
		flex: 1;
	}

	.top-item {
		text-align: center;
		width: 100%;
	}

	.top-icon {
		font-size: 55rpx;
	}

	.inline3 {
		display: inline-block;
		width: 187.5rpx;
		height: 100rpx;
	}

	.inline3-top {
		margin: 13rpx 0;
		font-size: 30rpx;
		font-weight: 600;
	}

	.inline3-bottom {
		font-size: 24rpx;
		color: #606266;
	}

	.tips-text {
		margin-left: 64rpx;
	}

	.map {
		flex: 1;
	}

	.top-bikeStatus-wrapper {
		border: none;
		height: 110rpx;
	}

	.top-bikeStatus-top {
		display: flex;
		padding-left: 20rpx;
		/* background-color: pink; */
	}

	.top-bikeStatus-bottom {
		/* background-color: blue; */
	}

	.top-info-wrapper {
		width: 100%;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 26rpx;
		color: #606266;
		position: fixed;
		/* top: 300rpx; */
	}

	.icon-info {
		margin: 0 24rpx;
		vertical-align: sub;
		font-size: 40rpx;
	}

	.top-tips-wrapper {
		position: fixed;
		top: 120rpx;
		left: 50%;
		transform: translateX(-50%);
		padding: 24rpx 16rpx;
		width: 90%;
		font-size: 27rpx;
		border-radius: 30rpx;
	}

	.top-tips-wrapper>.iconfont {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		font-size: 40rpx;
	}

	.top-tips-wrapper>.icon-tips {
		left: 24rpx;
	}

	.top-tips-wrapper>.icon-right {
		right: 24rpx;
	}

	.scan-btn-wrapper {
		display: flex;
		flex-direction: row;
		background-color: rgba(0, 0, 0, 0);
		justify-content: space-around;
		align-items: center;
		margin-top: 10rpx;
	}

	.scan-btn-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 187.5rpx;
	}

	.scan-btn-item-1 {
		color: #303133;
		border: 1rpx solid #DFDFDF;
	}

	.icon-power,
	.icon-lock,
	.icon-unlock {
		font-size: 60rpx;
	}

	.icon-renew,
	.icon-huankuan,
	.icon-huan {
		font-size: 55rpx;
	}

	.scan-text {
		margin-top: 15rpx;
		font-size: 24rpx;
		color: #fff;
	}

	.popup-wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 600rpx;
		height: 500rpx;
		text-align: center;
		border-radius: 12rpx;
		box-shadow: 0 0 16rpx #303133;
		overflow: visible;
		z-index: 10000;
	}

	.popup-title {
		display: block;
		margin: 50rpx 0;
		font-size: 36rpx;
	}

	.popup-content {
		display: inline-block;
		line-height: 80rpx;
		color: #303133;
	}

	.popup-close-btn {
		position: absolute;
		bottom: -75rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		border-radius: 50%;
		font-size: 40rpx;
		color: #fff;
		border: 1rpx solid #fff;
		background-color: #777;
	}

	.popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		background-color: #000;
		opacity: 0.4;
		z-index: 9999;
	}

	.map-wrapper {
		/* flex: 1; */
	}

	.map-content {}

	.map-object {
		height: calc(100vh - 100rpx);
	}

	.map-center-marker {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 100;
		height: 70rpx;
		width: 40rpx;
	}

	.station-header {
		position: relative;
	}

	.mask-show {
		display: none;
	}

	.station-header .arrow-up {
		position: absolute;
		top: -30rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 40rpx;
		background: url(https://zcclient.uqbike.com/images/default/map/up.png) center no-repeat;
		background-size: 55rpx 36rpx;
	}

	.station-header .arrow-down {
		position: absolute;
		top: -30rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 40rpx;
		background: url(https://zcclient.uqbike.com/images/default/map/down.png) center no-repeat;
		background-size: 55rpx 36rpx;
	}

	.top-tips-wrapper {
		position: fixed;
		top: 120rpx;
		left: 50%;
		transform: translateX(-50%);
		padding: 24rpx 16rpx;
		width: 90%;
		font-size: 27rpx;
		border-radius: 30rpx;
	}

	.top-tips-wrapper>.iconfont {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		font-size: 40rpx;
	}

	.top-tips-wrapper>.icon-tips {
		left: 24rpx;
	}

	.top-tips-wrapper>.icon-right {
		right: 24rpx;
	}

	.scan-btn {
		border-radius: 50rpx;
		position: fixed;
		padding: 20rpx;
		position: fixed;
		bottom: 100rpx;
		left: 50%;
		transform: translateX(-50%);
		box-shadow: rgba(200, 200, 200, 0.50);
		width: 320rpx;
		z-index: 900;
		height: 80rpx;
	}

	.scan-btn-content {
		height: 400rpx;
		width: 95%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.scan-btn_new {
		width: 100%;
		color: #ffffff;
		border-radius: 10rpx;
	}

	.scan-btn-view {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 100rpx;
	}

	.scan-btn-view .scan-text1 {
		font-size: 35rpx;
		margin-left: 20rpx;
	}

	.scan-btn-view .icon-scan {
		font-size: 55rpx;
	}

	.footerClass {
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		padding-top: 44rpx;
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		z-index: 900;
		background: #fff;
		box-shadow: 0 -1rpx 0 0 #EAEAEA, 0 -5rpx 20rpx 0 rgba(200, 200, 200, 0.50);
		transition: all .32s ease-out;
		transition: all .32s ease-in-out;
	}

	.footerClass_new {
		background: #f8f9fb;
		padding-bottom: 0rpx;
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		z-index: 900;
		box-shadow: 0 -1rpx 0 0 #EAEAEA, 0 -5rpx 20rpx 0 rgba(200, 200, 200, 0.50);
		transition: all .32s ease-out;
		transition: all .32s ease-in-out;
	}
</style>
