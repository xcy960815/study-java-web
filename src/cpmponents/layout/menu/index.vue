<template>
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
    <!-- <el-menu-item index="4">
            <el-icon>
                <setting />
            </el-icon>
            <span>Navigator Four</span>
        </el-menu-item> -->
  </el-menu>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const defaultActive = computed(() => route.path)
</script>
<style lang="less" scoped>
.el-menu {
  border: 0 !important;
}
</style>
