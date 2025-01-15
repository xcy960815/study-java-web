import { defineStore } from 'pinia'
import { Names } from './store-name'
import { ElMessage } from 'element-plus'
import { eventEmitter } from '@/utils/event-emits'
import { loginModule } from '@apis'
import { setToken } from '@utils/token'

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
          address,
          createTime,
          id,
          introduceSign,
          loginName,
          nickName,
          token
        } = result.data
        this.address = address
        this.createTime = createTime
        this.id = id
        this.introduceSign = introduceSign
        this.loginName = loginName
        this.nickName = nickName
        await setToken(token)
        eventEmitter.emit('login-success')
      }
    }
  },
  persist: true
})
