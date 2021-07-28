const app = getApp();

/**
 * 过滤空字符串, null, undefined
 */
function filterEmpty(data) {
	data = data || {};
	let obj = {};
	Object.keys(data).forEach(key => {
		let item = data[key];
		if (item !== '' && item !== undefined && item !== null) {
			obj[key] = item;
		}
	});
	return obj;
}

// 变量url化
function params2Query(params) {
	params = params || {};
	return Object.keys(filterEmpty(params))
		.map(key => {
			let v = params[key];
			return key + '=' + (typeof v !== 'object' ? v : JSON.stringify(v));
		})
		.join('&');
}

function goPage(url, params = {}, options = {}) {
	// 如果传了params 就做参数的拼接
	let query = params2Query(params);
	if (query) {
		url = url + (url.indexOf('?') > -1 ? '' : '?') + query;
	}

	if (options.type === 'redirect' || getCurrentPages().length >= 10) {
		console.log("redirectTo: ", url);
		uni.redirectTo({
			url
		});
	} else {
		uni.navigateTo({
			url
		});
	}
}

function getDistance(lng1, lat1, lng2, lat2) {
	let alpha = lat1 * Math.PI / 180.0;
	return Math.sqrt(Math.pow((lat1 - lat2) * 111.12, 2) + Math.pow((lng1 - lng2) * Math.cos(alpha) * 111.12, 2));
}

function getQueryValue(url, queryName) {
	var query = decodeURI(url.split('?')[1]);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == queryName) {
			return pair[1];
		}
	}
	return null;
}

module.exports = {
	filterEmpty,
	params2Query,
	goPage,
	getDistance,
	getQueryValue
}
