const app = getApp();

function request_post(url, data, func) {
	uni.request({
		url,
		method: 'POST',
		data,
		header: {
			'content-type': 'application/json', //默认值
			'token': uni.getStorageSync('userInfo').token ? uni.getStorageSync('userInfo').token : ''
		},
		dataType: 'json',
		success: function(res) {
			if (res.data.ret === 0 && res.data.subCode === 10) {
				//uni.showModal({content:`接口返回：${url},${app.globalData.token}`});
				uni.clearStorageSync();
				app.globalData.hadLogined = false;
				uni.showToast({
					icon: 'none',
					title: '请先登录',
					duration: 2000,
					success: function() {
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
				});

			} else if (res.data.ret === 0 && res.data.subCode === 11) {
				uni.showToast({
					icon: 'none',
					title: '系统繁忙，请稍候再试'
				});
			} else if (res.data.ret === 0 && res.data.subCode === 12) {
				uni.clearStorageSync();
				app.globalData.hadLogined = false;
				uni.showToast({
					icon: 'none',
					title: '您已在其他设备上登录，即将返回登录界面',
					duration: 2000,
					success: function() {
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
				});
			} else if (res.data.ret === 0 && res.data.subCode === 117) {
				uni.showToast({
					icon: 'none',
					title: '您已被商户拉黑，无法租借'
				});
			} else {
				func && func(res);
			}
		},
		fail: function(res) {
			console.log("接口错误信息：" + JSON.stringify(res));

			if (res.status == 404) {
				uni.showModal({
					title: '温馨提示',
					content: '未找到该请求连接'
				});
			} else if (res.status == 500 || res.status == 504) {
				uni.showModal({
					title: '温馨提示',
					content: '服务器错误，请联系客服'
				});
			} else if (res.error == 12) {
				// uni.showModal({
				//   title: '温馨提示',
				//   content: '网络出错'
				// });
			} else if (res.error == 13) {
				uni.showModal({
					title: '温馨提示',
					content: '请求超时，请稍后再试'
				});
			} else {
				// uni.showModal({
				//   title: '温馨提示',
				//   content: res.data
				// });
				console.log(res.data);
			}

		},
		complete: function(res) {
			uni.hideLoading();
		}
	});
}

function request_get(url, func) {
	uni.request({
		url,
		method: 'GET',
		header: {
			'content-type': 'application/json', //默认值
			'token': uni.getStorageSync('userInfo').token ? uni.getStorageSync('userInfo').token : ''
		},
		success: function(res) {
			if (res.data.ret === 0 && res.data.subCode === 10) {
				uni.clearStorageSync();
				app.globalData.hadLogined = false;
				uni.showToast({
					icon: 'fail',
					title: '请先登录',
					duration: 2000,
					success: function() {
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
				});

			} else if (res.data.ret === 0 && res.data.subCode === 11) {
				uni.showToast({
					type: 'exception',
					title: '系统繁忙，请稍候再试'
				});
			} else if (res.data.ret === 0 && res.data.subCode === 12) {
				uni.clearStorageSync();
				app.globalData.hadLogined = false;
				uni.showToast({
					icon: 'none',
					title: '您已在其他设备上登录，即将返回登录界面',
					duration: 2000,
					success: function() {
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
				});

			} else {
				func && func(res);
			}
		},
		fail: function(res) {

			if (res.status == 404) {
				uni.showToast({
					type: 'exception',
					title: '未找到该请求连接',
					duration: 1000
				});

			} else if (res.status == 500 || res.status == 504) {
				uni.showToast({
					type: 'exception',
					title: '服务器错误，请联系客服',
					duration: 1000
				});
			} else if (res.error == 12) {
				// uni.showModal({
				//   title: '温馨提示',
				//   title: '网络出错'
				// });
			} else if (res.error == 13) {
				uni.showToast({
					type: 'exception',
					title: '请求超时，请稍后再试',
					duration: 1000
				});

			} else {
				// uni.showModal({
				//   title: '温馨提示',
				//   content: res.data
				// });
				console.log(`url:${url}`, res);
			}

		},
		complete: function(res) {
			uni.hideLoading();
			// uni.showModal({content: 'complete'});
		}
	});
}

module.exports = {
	request_post,
	request_get
};
