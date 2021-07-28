<script>
	export default {
		globalData: {
			baseUrl: "",
			brandId: 98, // 测试品牌：122 优驱租车：98 骑达达：161 西域闪租：163
			appId: "",

			initUrl: "https://zcclienttest.uqbike.com", //测试域名："https://zcclienttest.uqbike.com"（注意管理平台开发配置域名也需要修改成测试域名）  正式域名：https://zcclient.uqbike.com
			imagesUrl: "https://zcclient.uqbike.com/images",
			serviceUrl: "https://zcclient.uqbike.com/userAgreement",

			mainColor: "#FFFFFF", // 主色调,默认为白色
			headColor: "#FFFFFF", // 头部色调,默认为白色
			textColor: "#FFFFFF", // 文字颜色,默认为白色
			servicePhone: "", // 客服电话

			mapType: 1,
			hadLogined: false, // 用户是否登录，true已登录，false未登录
			token: "",
			phone: "",
			consumerId: "",
			balance: "",
			deposit: "",
			identified: false,
			qrCode: "",

			commonTextColor1: "#303133", // 主要文字颜色
			commonTextColor2: "#606266", // 次要文字颜色
			commonTextColor3: "#909399", // 次次要文字颜色

			authFreezeStateArr: {
				"0": "未授权",
				"1": "已授权",
				"2": "已取消",
				"3": "已退款",
				"4": "转支付失败",
				"5": "已解冻",
				"6": "转支付",
			},
		},
		onLaunch(options) {
			console.log("小程序初始化", options);
			const appIdRes = uni.getAccountInfoSync();
			this.globalData.appId = appIdRes.miniProgram.appId;

			let that = this;

			uni.request({
				// url: `${this.globalData.initUrl}/meta?brandId=${this.globalData.brandId}&type=devMode`,
				url: `${this.globalData.initUrl}/meta?appId=${this.globalData.appId}&type=devMode`,
				method: 'GET',
				success: function(res) {
					console.log("***品牌配置信息：", res.data.data);
					if (res.data.ret) {
						let data = res.data.data;
						that.globalData.baseUrl = data.baseUrl;
						that.globalData.name = data.name;
						that.globalData.mainColor = data.mainColor;
						that.globalData.headColor = data.headColor;
						that.globalData.textColor = data.textColor;
						that.globalData.servicePhone = data.phone;
						that.globalData.brandId = data.brandId;

						//获取关联普通二维码的码值，放到全局变量qrCode中
						if (options.query && options.query.qrCode) {
							that.globalData.qrCode = options.query.qrCode +
								`&vehicleNo=${options.query.vehicleNo}`;
						}

						if (that.baseDataCallback) {
							that.baseDataCallback(data);
						}
						console.log(that.baseDataCallback_index_onshow, 'baseDataCallback_index_onshow123');
						if (that.baseDataCallback_index_onshow) {
							that.baseDataCallback_index_onshow(data);
						}
					}
				},
				fail: function(res) {
					console.log("***品牌配置信息 fail：", res.data);
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			setNavigationBarColor() {
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: this.globalData.headColor
				})
			},
			//获取基础数据回调
			getBaseData(cb) {
				console.log('查询基础数据', this.globalData.baseUrl)


				if (!this.globalData.baseUrl || this.globalData.baseUrl == '') {
					this.baseDataCallback = data => {
						if (data) {
							console.log('回调查询基础数据', JSON.stringify(data))

							this.globalData.baseUrl = data.baseUrl;
							this.globalData.name = data.name;
							this.globalData.mainColor = data.mainColor;
							this.globalData.headColor = data.headColor;
							this.globalData.textColor = data.textColor;
							this.globalData.servicePhone = data.phone;
							this.globalData.brandId = data.brandId;

							cb && cb()
						}
					}

				} else cb && cb();
			},

			judgeIfLogined() {
				// 登录成功后保存的数据
				let res = uni.getStorageSync('userInfo');
				this.globalData.hadLogined = res ? true : false;
				this.globalData.token = res ? res.token : "";
			},

			judgeIfLoginedCallback(callback) {
				// 登录成功后保存的数据
				let res = uni.getStorageSync('userInfo');
				this.globalData.hadLogined = res ? true : false;
				this.globalData.token = res ? res.token : "";

				if (this.globalData.hadLogined) {
					callback && callback();
				} else {
					uni.hideLoading();
					uni.showModal({
						title: '温馨提示',
						content: '请先登录',
						confirmText: '好的',
						cancelText: '取消',
						success: (result) => {
							if (result.confirm) {
								uni.reLaunch({
									url: '/pages/login/login'
								});
							}
						},
					});
				}
			},

			//获取基础数据回调
			getBaseData(cb) {
				console.log('查询基础数据', this.globalData.baseUrl)


				if (!this.globalData.baseUrl || this.globalData.baseUrl == '') {
					this.baseDataCallback = data => {
						if (data) {
							console.log('回调查询基础数据', JSON.stringify(data))

							this.globalData.baseUrl = data.baseUrl;
							this.globalData.name = data.name;
							this.globalData.mainColor = data.mainColor;
							this.globalData.headColor = data.headColor;
							this.globalData.textColor = data.textColor;
							this.globalData.servicePhone = data.phone;
							this.globalData.brandId = data.brandId;

							cb && cb()
						}
					}

				} else cb && cb();
			},
			getBaseData_index_onshow(cb) {
				if (!this.globalData.baseUrl || this.globalData.baseUrl == '') {
					this.baseDataCallback_index_onshow = data => {
						if (data) {
							this.globalData.globalData.baseUrl = data.baseUrl;
							this.globalData.globalData.name = data.name;
							this.globalData.globalData.mainColor = data.mainColor;
							this.globalData.globalData.headColor = data.headColor;
							this.globalData.globalData.textColor = data.textColor;
							this.globalData.globalData.servicePhone = data.phone;
							this.globalData.globalData.brandId = data.brandId;

							cb && cb()
						}
					}

				} else cb && cb();
			},
		}
	}
</script>

<style>
	@import url("@/common/iconfont/iconfont.css");

	/*每个页面公共css */
	page {
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex: 1;
		background-color: #fff;
		font-family: PingFangSC-Regular;
		-webkit-font-smoothing: antialiased;
	}

	.content {
		width: 750rpx;
		overflow-x: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		color: #303133;
	}

	.red-text {
		color: #EA4142;
	}

	.green-text {
		color: #00AC56;
	}
</style>
