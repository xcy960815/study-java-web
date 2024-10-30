<template>
  <el-pagination
    v-model:current-page="pageNum"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 30, 40]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handlePageSizeChange"
    @current-change="handlePageNumChange"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const pageNum = ref(1)
const pageSize = ref(10)
const total = ref<number | undefined>(100)
const handlePageNumChange = () => {
  console.log('handlePageNumChange')
}
const handlePageSizeChange = () => {
  console.log('handlePageSizeChange')
}
onMounted(() => {
  setTimeout(() => {
    total.value = undefined
  }, 1000)
})
</script>
<style lang="less" scoped></style>
