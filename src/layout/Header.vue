<script setup lang="ts">
import { ref } from 'vue'
import NavItem from './components/NavItem.vue'
import SearchBox from './components/SearchBox.vue'
import UserMenu from './components/UserMenu.vue'
import { useHeaderVisibility } from '@/composables/useScrollUtils'

// 使用 Header 显隐逻辑
const { isScrollUp } = useHeaderVisibility(900) // 滚动 900px 后触发

// 模拟当前用户状态
const currentUser = ref({
  id: '123',
  name: '张三',
  isLoggedIn: true
})

// 导航菜单配置
const navItems = [
  { to: '/home', icon: 'icon-[material-symbols--home-outline]', label: '首页' },
  { to: '/note', icon: 'icon-[material-symbols--note-outline]', label: '我的笔记' },
  { to: '/creator', icon: 'icon-[material-symbols--edit-outline]', label: '创作中心' },
  { to: '/message', icon: 'icon-[material-symbols--notifications-outline]', label: '消息中心' }
]

// 用户菜单配置
const userMenuItems = [
  {
    label: '个人中心',
    to: `/user/${currentUser.value.id}/articles`,
    icon: 'icon-[material-symbols--person-outline]',
    type: 'normal' as const
  },
  {
    label: '我的文章',
    to: `/user/${currentUser.value.id}/articles`,
    icon: 'icon-[material-symbols--article-outline]',
    type: 'normal' as const
  },
  {
    label: '我的收藏',
    to: `/user/${currentUser.value.id}/favorites`,
    icon: 'icon-[material-symbols--favorite-outline]',
    type: 'normal' as const
  },
  {
    label: '浏览历史',
    to: `/user/${currentUser.value.id}/history`,
    icon: 'icon-[material-symbols--history]',
    type: 'normal' as const
  },
  {
    label: '',
    icon: '',
    type: 'divider' as const
  },
  {
    label: '设置',
    to: '/setting',
    icon: 'icon-[material-symbols--settings-outline]',
    type: 'normal' as const
  },
  {
    label: '退出登录',
    to: '/login',
    icon: 'icon-[material-symbols--logout]',
    type: 'danger' as const
  }
]

// 搜索处理
const handleSearch = (query: string) => {
  console.log('搜索：', query)
  // 这里可以实现搜索逻辑
}
</script>

<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 bg-bg-primary border-b border-border-primary shadow-sm transition-transform duration-300 ease-in-out"
    :class="{ '-translate-y-full': !isScrollUp }"
  >
    <div class="max-w-400 mx-auto">
      <div class="flex items-center justify-between h-16">
        
        <!-- Logo -->
        <router-link 
          to="/home" 
          class="flex items-center space-x-2 hover:opacity-80 transition-opacity mr-4"
        >
          <span class="hidden sm:block text-xl font-bold text-theme-primary">
            TechShareHub
          </span>
        </router-link>

        <!-- 导航菜单 -->
        <nav class="hidden md:flex items-center space-x-8">
          <NavItem
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :icon="item.icon"
            :label="item.label"
          />
        </nav>

        <!-- 搜索框 -->
        <SearchBox @search="handleSearch" />

        <!-- 用户区域 -->
        <div class="flex items-center">
          <!-- 已登录状态 -->
          <UserMenu
            v-if="currentUser.isLoggedIn"
            :user="currentUser"
            :menu-items="userMenuItems"
          />

          <!-- 未登录状态 -->
          <router-link 
            v-else
            to="/login"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-theme-primary hover:bg-theme-primary-hover transition-colors"
          >
            登录
          </router-link>
        </div>

        <!-- 移动端菜单按钮 -->
        <button class="md:hidden p-2 rounded-md text-font-secondary transition-colors hover:opacity-70">
          <i class="icon-[material-symbols--menu] w-6 h-6"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Tailwind CSS样式已经在template中使用，无需额外样式 */
</style>
