<template>
  <div class="deepseek-models">
    <Handle-ToolBar
      v-model:showSearch="showSearch"
      @queryTableData="handleGetModels"
    >
      <!-- <el-button size="small" type="primary" @click="handleStartChat()">开始对话</el-button> -->
    </Handle-ToolBar>
    <el-table
      border
      :data="deepseekModelsListInfo.tableData"
      style="width: 100%"
    >
      <el-table-column prop="id" label="模型名称" />
      <el-table-column prop="object" label="类型" />
      <el-table-column prop="owned_by" label="来源" />
      <el-table-column prop="created" label="注册时间" />
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
      >
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="handleStartChat(row)"
            >开始对话</el-button
          >
          <!-- <el-button link type="primary" size="small" @click="handleClickDeleteModel(row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import HandleToolBar from '@/components/handle-toolbar/index.vue'
import { ref, reactive, onMounted } from 'vue'
import { deepseekModule } from '@apis'
import { useRouter } from 'vue-router'
const router = useRouter()
const showSearch = ref(false)

interface DeepseekModelsListInfo {
  tableData: DeepSeekDto.ModelOption[]
}
const deepseekModelsListInfo =
  reactive<DeepseekModelsListInfo>({
    tableData: []
  })
const handleStartChat = (row: DeepSeekDto.ModelOption) => {
  router.push({
    path: '/deepseek/chat',
    query: row ? { model: row.id } : {}
  })
}

/**
 * 获取当前key对相应的模型
 */
const handleGetModels = async () => {
  const result = await deepseekModule.models()
  if (result.code === 200) {
    deepseekModelsListInfo.tableData = result.data.data
  }
}
onMounted(() => {
  handleGetModels()
})
</script>
<style lang="less" scoped></style>
