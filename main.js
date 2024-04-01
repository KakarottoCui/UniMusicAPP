import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

Vue.prototype.$api = {msg};

import uView from "uview-ui";
Vue.use(uView);

const app = new Vue({
    ...App
})
app.$mount()
