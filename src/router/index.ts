import {
  createRouter,
  // createWebHistory,
  createWebHashHistory
} from 'vue-router'
import { defineAsyncComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { eventEmitter } from '@/utils/event-emits'
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
      () => import(`../cpmponents/layout/index.vue`)
    ),
    meta: {
      title: '用户'
    },
    children: [
      {
        path: '/user/list',
        name: 'list',
        component: defineAsyncComponent(
          () => import(`../views/user/list.vue`)
        ),
        meta: {
          title: '用户列表'
        }
      }
    ]
  },
  {
    path: '/admin-user',
    name: 'admin-user',
    component: defineAsyncComponent(
      () => import(`../cpmponents/layout/index.vue`)
    ),
    meta: {
      title: '超级管理员'
    },
    children: [
      {
        path: '/admin-user/list',
        name: 'admin-user-list',
        component: defineAsyncComponent(
          () => import(`../views/admin-user/list.vue`)
        ),
        meta: {
          title: '超级管理员列表'
        }
      }
    ]
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
eventEmitter.on('token-invalid', () => {
  // console.log('router 登录失效')
  router.push('/login')
})
/**
 * 登录成功
 */
eventEmitter.on('login-success', () => {
  // console.log('router 登录成功')
  router.push('/user/list')
})

eventEmitter.on('login-out', () => {
  // console.log('router 登录失效')
  router.push('/login')
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    // document.title = `${to.meta.title}`
  }
  next()
})

router.afterEach((to, from) => {
  // console.log(to, from)
  // console.log('afterEach')
})

export default router
