import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 自定义 route meta 类型
type AppRouteMeta = {
  title?: string
  requiresAuth?: boolean // 是否需要登录
  roles?: string[] // 可访问的角色（可选）
}

// 扩展 RouteRecordRaw，给 meta 更严格的类型提示
type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: AppRouteMeta
}

const routes: Array<AppRouteRecordRaw> = [
  {
    path: '/',
    name: '',
    component: () => import('@/views/index.vue'),
    redirect: '/home',
    meta: { title: 'TechShareHub' },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/detail/:id',
        name: 'NoteDetail',
        component: () => import('@/views/home/NoteDetail.vue'),
        meta: { title: '笔记详情' }
      },
      {
        path: '/note',
        name: 'Note',
        component: () => import('@/views/note/index.vue'),
        meta: { title: '我的笔记', requiresAuth: true }
      },
      {
        path: '/creator',
        name: 'Creator',
        component: () => import('@/views/creator/index.vue'),
        meta: { title: '创作中心', requiresAuth: true }
      },
      {
        path: '/message',
        name: 'Message',
        component: () => import('@/views/message/index.vue'),
        meta: { title: '消息中心', requiresAuth: true }
      },
      {
        path: '/user/:id',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户信息' }
      },
      {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/views/setting/index.vue'),
        meta: { title: '设置', requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 简单的认证检查函数（占位）：
// 推荐替换为 Pinia 中的 user store 或更完善的 auth 服务
function isAuthenticated(): boolean {
  try {
    return !!localStorage.getItem('auth_token')
  } catch (e) {
    return false
  }
}

// 全局前置守卫：设置页面 title，并进行简单权限校验
router.beforeEach((to, _from, next) => {
  const meta = to.meta as AppRouteMeta | undefined
  // 设置 document.title（可根据需要格式化）
  if (meta?.title) {
    document.title = `${meta.title} - TechShareHub`
  }

  // 简单权限校验
  if (meta?.requiresAuth && !isAuthenticated()) {
    // 未登录则重定向到登录页，并保留目标路径
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  return next()
})

// 全局后置守卫：可以用于上报/埋点/结束 loading 等
router.afterEach((_to) => {
  // 示例：当需要的时候可以在这里清理全局 loading 状态
})

export default router