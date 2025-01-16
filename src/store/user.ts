import { defineStore } from 'pinia'
import { Names } from './store-name'
import { ElMessage } from 'element-plus'
import { eventEmitter } from '@/utils/event-emits'
import { loginModule } from '@apis'
import { setToken } from '@utils/token'
import { userModule } from '@apis'
export const userInfoStore = defineStore(Names.User, {
  state: () => {
    return {
      address: '',
      id: 0,
      createTime: '',
      introduceSign: '',
      loginName: '',
      nickName: ''
    }
  },

  getters: {
    // nickName() {
    //     return this.nickName
    // }
  },

  actions: {
    async login(loginData: loginModule.LoginRequestParams) {
      const result = await loginModule.login(loginData)
      if (result.code === 200) {
        ElMessage({
          message: '登入成功',
          type: 'success'
        })
        const {
          // address,
          // createTime,
          // id,
          // introduceSign,
          // loginName,
          // nickName,
          token
        } = result.data
        // this.address = address
        // this.createTime = createTime
        // this.id = id
        // this.introduceSign = introduceSign
        // this.loginName = loginName
        // this.nickName = nickName
        await setToken(token)
        eventEmitter.emit('login-success')
      }
    },

    async logout() {
      const result = await loginModule.logout()
      if (result.code === 200) {
        ElMessage({
          message: '退出成功',
          type: 'success'
        })
        await setToken('')
        eventEmitter.emit('login-out')
      }
    },
    async getUserInfo() {
      const result = await userModule.getUserInfo()
      // console.log(result);
      if (result.code === 200) {
        this.address = result.data.address
        this.createTime = result.data.createTime
        this.id = result.data.id
        this.introduceSign = result.data.introduceSign
        this.loginName = result.data.loginName
        this.nickName = result.data.nickName
      }
    }
  }
  // persist: true
})
