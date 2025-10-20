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
        redirect: '/home/category/0',
        meta: { title: '首页' },
        children: [
          {
            path: 'category/:categoryId',
            name: 'HomeCategory',
            component: () => import('@/views/home/category/index.vue'),
            meta: { title: '文章' },
            props: true // 将路由参数作为 props 传递给组件
          }
        ]
      },
      {
        path: '/detail/:id',
        name: 'NoteDetail',
        component: () => import('@/views/note-detail/index.vue'),
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
        redirect: '/creator/overview',
        meta: { title: '创作中心', requiresAuth: true },
        children: [
          {
            path: 'overview',
            name: 'CreatorOverview',
            component: () => import('@/views/creator/overview/index.vue'),
            meta: { title: '数据总览', requiresAuth: true }
          },
          {
            path: 'manage',
            name: 'CreatorManage',
            component: () => import('@/views/creator/manage/index.vue'),
            meta: { title: '发布管理', requiresAuth: true },
          },
          {
            path: 'help',
            name: 'CreatorHelp',
            component: () => import('@/views/creator/help/index.vue'),
            meta: { title: '帮助中心', requiresAuth: true }
          }
        ]
      },
      {
        path: '/message',
        name: 'Message',
        component: () => import('@/views/message/index.vue'),
        redirect: '/message/system',
        meta: { title: '消息中心', requiresAuth: true },
        children: [
          {
            path: 'system',
            name: 'MessageSystem',
            component: () => import('@/views/message/system/index.vue'),
            meta: { title: '系统通知', requiresAuth: true }
          },
          {
            path: 'comments',
            name: 'MessageComments',
            component: () => import('@/views/message/comments/index.vue'),
            meta: { title: '评论', requiresAuth: true }
          },
          {
            path: 'likes',
            name: 'MessageLikes',
            component: () => import('@/views/message/likes/index.vue'),
            meta: { title: '赞', requiresAuth: true }
          },
          {
            path: 'favorites',
            name: 'MessageFavorites',
            component: () => import('@/views/message/favorites/index.vue'),
            meta: { title: '收藏', requiresAuth: true }
          }
        ]
      },
      {
        path: '/user/:id',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        redirect: (to) => `/user/${to.params.id}/articles`,
        meta: { title: '个人中心' },
        children: [
          {
            path: 'articles',
            name: 'UserArticles',
            component: () => import('@/views/user/articles/index.vue'),
            meta: { title: '文章' }
          },
          {
            path: 'history',
            name: 'UserHistory',
            component: () => import('@/views/user/history/index.vue'),
            meta: { title: '浏览历史', requiresAuth: true }
          },
          {
            path: 'favorites',
            name: 'UserFavorites',
            component: () => import('@/views/user/favorites/index.vue'),
            meta: { title: '收藏', requiresAuth: true }
          },
          {
            path: 'likes',
            name: 'UserLikes',
            component: () => import('@/views/user/likes/index.vue'),
            meta: { title: '点赞', requiresAuth: true }
          }
        ]
      },
      {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/views/setting/index.vue'),
        redirect: '/setting/profile',
        meta: { title: '设置', requiresAuth: true },
        children: [
          {
            path: 'profile',
            name: 'SettingProfile',
            component: () => import('@/views/setting/profile/index.vue'),
            meta: { title: '个人资料', requiresAuth: true }
          },
          {
            path: 'account',
            name: 'SettingAccount',
            component: () => import('@/views/setting/account/index.vue'),
            meta: { title: '账户设置', requiresAuth: true }
          },
          {
            path: 'theme',
            name: 'SettingTheme',
            component: () => import('@/views/setting/theme/index.vue'),
            meta: { title: '主题设置', requiresAuth: true }
          }
        ]
      }
    ]
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/not-found/index.vue'),
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