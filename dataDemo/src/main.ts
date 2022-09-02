import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { createPinia } from 'pinia'
import * as ECharts from 'echarts'
import './icon/iconfont.css'
import './icon/iconfont.js'

const pinia = createPinia();
const app = createApp(App);
app.config.globalProperties.$ECharts = ECharts
app.use(pinia)
    .mount('#app')