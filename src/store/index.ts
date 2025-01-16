import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' //引入持久化插件

export { userInfoStore as useUserInfoStore } from './user'

const store = createPinia()
// 数据持久化
store.use(piniaPluginPersistedstate)

export default store
