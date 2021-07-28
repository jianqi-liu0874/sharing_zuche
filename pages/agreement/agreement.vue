<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad: function() {
			app.getBaseData(() => {
				this.globalData = app.globalData;
				this.url = `${app.globalData.serviceUrl}/${app.globalData.brandId}/index.html?v=${new Date().getTime()}`
			})
		},
		methods: {

		}
	}
</script>

<style>

</style>
