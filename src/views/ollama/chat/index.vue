<template>
  <div class="chat">
    <div ref="conversationRef"></div>
    <el-button @click="generateStream"
      >generateStream
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { OllamaModel } from '@utils/ollama'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'ollama-chat'
})
const route = useRoute()

const model = ref<string>(
  (route.query.model as string) || 'deepseek-r1:14b'
)

const ollamaModel = new OllamaModel({
  apiKey: '',
  apiBaseUrl: import.meta.env.VITE_API_DOMAIN_PREFIX,
  requestParams: {
    model: model.value
  }
})

const conversationRef = ref<HTMLDivElement>()

/**
 * 流式会话
 */
const generateStream = async () => {
  ollamaModel.getAnswer('天为什么是蓝色的？', {
    onProgress(partialResponse) {
      console.log('partialResponse', partialResponse)
    }
  })
}

</script>
<style lang="less" scoped>
.chat {
  position: relative;
}
</style>
