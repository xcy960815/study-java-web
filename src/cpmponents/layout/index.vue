<template>
  <el-container class="layout-container">
    <layoout-header></layoout-header>
    <el-container class="layout-view-container">
      <el-aside class="layout-menu" width="200px">
        <layout-menu></layout-menu>
      </el-aside>
      <el-main class="layout-main-container">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import LayooutHeader from './header/index.vue'
import LayoutMenu from './menu/index.vue'
</script>
<style lang="less" scoped>
.layout-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .layout-view-container {
    display: flex;
    .layout-menu {
      height: 100%;
      background-color: #293135;
    }
    .layout-main-container {
      flex: 1;
      padding: 10px;
    }
  }
}
</style>
