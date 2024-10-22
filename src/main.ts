import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
// @ts-ignore
import locale from 'element-plus/dist/locale/zh-cn.mjs'
import router from '@/router'
const app = createApp(App)
app.use(ElementPlus, {
  locale,
  size: 'small',
  zIndex: 3000
})
app.use(router)
app.mount('#app')
