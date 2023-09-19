import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import axios from 'axios'
import store from './store';

const app = createApp(App)
app.config.globalProperties.$axios = axios;
// import Vue from 'vue'
// axios.defaults.baseURL = 'http://localhost:3000'
// Vue.prototype.$http = axios;
// Vue.config.productionTip = false;
// new Vue({
//   render: (h) => h(App),
// }).$mount("#app");

app.use(router).use(store).use(ElementPlus).mount('#app')