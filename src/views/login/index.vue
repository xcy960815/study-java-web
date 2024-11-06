<template>
  <div class="login-page">
    <el-form
      ref="loginFormRef"
      style="width: 300px"
      :model="loginFormData"
      :rules="loginFormRules"
      label-width="auto"
      :size="loginFormSize"
      status-icon
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="loginFormData.name" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginFormData.password" />
      </el-form-item>
      <el-form-item>
        <el-button
          @click="handleClickLogin"
          type="success"
          round
          >登入</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { loginModule } from '../../apis'
import { useRouter } from 'vue-router'
import type {
  ComponentSize,
  FormRules,
  FormInstance
} from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { eventEmitter } from '@/utils/event-emits'
interface LoginFormData {
  name: string
  password: string
}
const router = useRouter()
const loginFormData = reactive({
  name: 'admin',
  password: 'password'
})

const loginFormRef = ref<FormInstance>()

const loginFormSize = ref<ComponentSize>('default')

const loginFormRules: FormRules<LoginFormData> = {
  name: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ]
}
/**
 * 登入
 */
const handleClickLogin = async () => {
  const valid = await loginFormRef.value
    ?.validate()
    .catch(() => false)
  if (!valid) return
  const result = await loginModule.login<string>(
    loginFormData
  )
  if (result.code === 200) {
    ElMessage({
      message: '登入成功',
      type: 'success'
    })
    localStorage.setItem('token', result.data)
    eventEmitter.emit('login-success')
  }
}

onMounted(() => {})
</script>
<style lang="less" scoped>
.login-page {
  position: relative;
  height: inherit;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/images/login.jpg');
  background-size: cover;
  background-position: center;
  /* 使图像居中 */
  width: 100%;
  /* 或者设置具体宽度 */
  height: 100%;

  /* 或者设置具体高度 */
  :deep(.el-form-item__label) {
    color: white;
    font-size: 16px;
    font-style: italic;
  }
}
</style>
