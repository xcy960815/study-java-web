<template>
  <h4 class="layout-header-title">{{ viteAppTitle }}</h4>
  <el-menu
    active-text-color="#fff"
    background-color="#293135"
    router
    :default-active="defaultActive"
    text-color="#fff"
  >
    <el-menu-item index="/user/list">
      <el-icon>
        <icon-menu />
      </el-icon>
      <span>用户</span>
    </el-menu-item>
    <el-menu-item index="/admin-user/list">
      <el-icon>
        <document />
      </el-icon>
      <span>超级用户</span>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const viteAppTitle = import.meta.env.VITE_APP_TITLE
const route = useRoute()
const defaultActive = computed(() => route.path)
</script>
<style lang="less" scoped>
.layout-header-title {
  height: 50px;
  font-weight: 600;
  font-size: 14px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica,
    sans-serif;
  text-align: center;
  line-height: 50px;
  color: #ffffff;
}

.el-menu {
  border: 0 !important;
}
</style>
