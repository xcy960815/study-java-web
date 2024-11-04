import {
  createRouter,
  // createWebHistory,
  createWebHashHistory
} from 'vue-router'
import { defineAsyncComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import loginEventEmits from '@/utils/login-event-emits'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: defineAsyncComponent(
      () => import(`../views/login/index.vue`)
    ),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/user',
    name: 'user',
    component: defineAsyncComponent(
      () => import(`../views/user.vue`)
    ),
    meta: {
      title: '用户'
    }
  },
  {
    path: '/admin-user',
    name: 'admin-user',
    component: defineAsyncComponent(
      () => import(`../views/admin-user.vue`)
    ),
    meta: {
      title: '超级管理员'
    }
  },

  {
    path: '/*',
    redirect: '/'
  }
]

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    permission?: string | Array<string>
    link?: string
  }
}

const router = createRouter({
  history: createWebHashHistory(), // hash 模式
  // history: createWebHistory(),  // history 模式
  routes
})

/**
 * token过期
 */
loginEventEmits.on('login-failed', () => {
  router.push('/login')
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title}`
  }
  next()
})

router.afterEach((to, from) => {
  // console.log(to, from)
  // console.log('afterEach')
})

export default router
