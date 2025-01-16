<template>
  <el-sub-menu v-if="hasSubMenu(props.menuItem)" index="1">
    <template #title>
      <el-icon>
        <location />
      </el-icon>
      <span>Navigator One</span>
    </template>
  </el-sub-menu>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { type RouteRecordRaw } from 'vue-router'
const props = defineProps({
  menuItem: {
    type: Object as PropType<RouteRecordRaw>,
    default: () => {
      return {}
    }
  }
})
const hasSubMenu = (menuItem: RouteRecordRaw) => {
  return menuItem.children && menuItem.children.length
}

defineOptions({
  name: 'MenuItem'
})
</script>
<style lang="less" scoped></style>
