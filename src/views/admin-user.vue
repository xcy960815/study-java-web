<template>
  <div class="admin-user">admin-user</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { adminUser } from '@apis'

const adminUserList = ref<Array<AdminUserOption>>([])

const getAdminUserList = async () => {
  const requestParams = {
    pageSize: 10,
    pageNum: 1
  }
  const result = await adminUser.getAdminUserList(
    requestParams
  )
  console.log(result.data)
  if (result.code === 200) {
    adminUserList.value = result.data
  }
}
onMounted(() => {
  console.log('mounted')

  getAdminUserList()
})
</script>
<style lang="less" scoped></style>
