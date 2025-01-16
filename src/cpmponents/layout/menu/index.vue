<template>
  <h4 class="layout-header-title">{{ viteAppTitle }}</h4>
  <el-menu
    active-text-color="#fff"
    background-color="#293135"
    router
    :default-active="defaultActive"
    text-color="#fff"
  >
    <template v-for="menuItem in menuData">
      <menu-item :menu-item="menuItem"></menu-item>
    </template>
    <!-- <el-menu-item index="/user/list">
      <el-icon>
        <menu />
      </el-icon>
      <span>用户</span>
    </el-menu-item>
    <el-menu-item index="/admin-user/list">
      <el-icon>
        <document />
      </el-icon>
      <span>超级用户</span>
    </el-menu-item> -->
  </el-menu>
</template>

<script lang="ts" setup>
import MenuItem from './menu-item.vue'
import { computed, onMounted } from 'vue'
import {
  useRoute,
  useRouter,
  type RouteRecordRaw
} from 'vue-router'
const viteAppTitle = import.meta.env.VITE_APP_TITLE
const route = useRoute()
const router = useRouter()
const defaultActive = computed(() => route.path)

const menuData = computed(() => {
  const allRoutes = router.getRoutes()
  const filterRoutes = (routes: RouteRecordRaw[]) => {
    return routes.filter((menuItem) => {
      if (menuItem.children?.length) {
        menuItem.children = filterRoutes(menuItem.children)
      }
      return menuItem?.meta?.hidden !== true
    })
  }
  return filterRoutes(allRoutes)
})
onMounted(() => {
  console.log(menuData.value)
})
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
