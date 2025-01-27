import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import { defineAsyncComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { eventEmitter } from '@/utils/event-emits'
import { getToken } from '@utils/token'
import { changeTabIco } from '@utils/style'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/login',
    meta: {
      hidden: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: defineAsyncComponent(
      () => import(`../views/login/index.vue`)
    ),
    meta: {
      title: '登录',
      hidden: true
    }
  },
  {
    path: '/password',
    name: 'password',
    component: defineAsyncComponent(
      () => import(`../components/layout/index.vue`)
    ),
    meta: {
      title: '密码',
      hidden: true
    },
    props: {
      content: defineAsyncComponent(
        () => import(`../views/password/index.vue`) // 这么做的原因是既想保住layout布局 又想跟 login 页面一样 保持一层路由
      )
    }
  },
  {
    path: '/user',
    name: 'user',
    component: defineAsyncComponent(
      () => import(`../components/layout/index.vue`)
    ),
    meta: {
      title: '用户',
      icon: 'user'
    },
    children: [
      {
        path: '/user/list',
        name: 'user-list',
        component: defineAsyncComponent(
          () => import(`../views/user/list.vue`)
        ),
        meta: {
          icon: 'user-list',
          title: '用户列表'
        }
      },
      {
        path: '/user/info',
        name: 'userInfo',
        component: defineAsyncComponent(
          () => import(`../views/user/info.vue`)
        ),
        meta: {
          hidden: true,
          title: '用户中心'
        }
      }
    ]
  },
  {
    path: '/goods-category',
    name: 'goods-category',
    component: defineAsyncComponent(
      () => import(`../components/layout/index.vue`)
    ),
    meta: {
      title: '商品',
      icon: 'goods-category'
    },
    children: [
      {
        path: '/goods-category/list',
        name: 'goods-category-list',
        component: defineAsyncComponent(
          () => import(`../views/goods-category/list.vue`)
        ),
        meta: {
          title: '商品列表',
          icon: 'goods-category-list'
        }
      },
      {
        path: '/goods-category/info',
        name: 'info',
        component: defineAsyncComponent(
          () => import(`../views/goods-category/info.vue`)
        ),
        meta: {
          hidden: true,
          title: '商品详情'
        }
      }
    ]
  },
  {
    path: '/sse',
    name: 'sse',
    component: defineAsyncComponent(
      () => import(`../components/layout/index.vue`)
    ),
    meta: {
      title: '服务端推送',
      icon: 'server-send'
    },
    children: [
      {
        path: '/sse/stream',
        name: 'sse-stream',
        component: defineAsyncComponent(
          () =>
            import(`../views/server-send-event/index.vue`)
        ),
        meta: {
          icon: 'server-send',
          title: '服务端推送'
        }
      }
    ]
  },
  {
    path: '/admin-user',
    name: 'admin-user',
    component: defineAsyncComponent(
      () => import(`../components/layout/index.vue`)
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
          title: '超级管理员列表',
          icon: 'admin-user'
        }
      }
    ]
  },
  {
    path: '/*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(), // hash 模式
  // history: createWebHistory(),  // history 模式
  routes
})

/*************** 统一管理通用路由跳转 *****************/

/**
 * token过期
 */
eventEmitter.on('token-invalid', () => {
  router.push('/login')
})
/**
 * 登录成功
 */
eventEmitter.on('login', () => {
  router.replace('/user/list')
})

eventEmitter.on('logout', () => {
  router.replace('/login')
})

/*************** 统一管理通用路由跳转 *****************/

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  changeTabIco(to)
  const token = await getToken()
  if (to.path === '/login') {
    if (token) {
      next('/user/list')
    } else {
      next()
    }
  } else {
    if (!token) {
      next('/login')
    }
    next()
  }
})

router.afterEach((to, from) => {
  // console.log(to, from)
  // console.log('afterEach')
})

export default router
