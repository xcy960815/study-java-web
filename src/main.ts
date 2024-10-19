import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
// import locale from 'element-plus/lib/locale/lang/zh-cn'
// @ts-ignore
import locale from "element-plus/dist/locale/zh-cn.mjs";
const app = createApp(App)
app.use(ElementPlus, {
    locale,
    size: 'small',
    zIndex: 3000
})
app.mount('#app')
