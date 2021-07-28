import Vue from 'vue'
import App from './App'
import transfer from 'utils/filter.js';

Vue.config.productionTip = false

App.mpType = 'app'

for (let key in transfer) {
    Vue.filter(key, transfer[key]);
}

const app = new Vue({
    ...App
})
app.$mount()
