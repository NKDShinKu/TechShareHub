<script setup lang="ts">
import { ref, computed } from 'vue'
import NavItem from './components/NavItem.vue'
import SearchBox from './components/SearchBox.vue'
import UserMenu from './components/UserMenu.vue'
import AuthDialog from './components/AuthDialog.vue'
import { useHeaderVisibility } from '@/composables/useScrollUtils'
import { useUserStore } from '@/store'
import { useRouter } from 'vue-router'

// 使用 Header 显隐逻辑
const { isScrollUp } = useHeaderVisibility(900)

// 使用用户 store
const userStore = useUserStore()
const router = useRouter()

// 显示登录对话框
const showAuthDialog = ref(false)
const authDialogMode = ref<'login' | 'register'>('login')

// 打开登录/注册对话框
const openAuthDialog = () => {
  showAuthDialog.value = true
}

// 登录成功回调
const handleAuthSuccess = () => {
  // 可以在这里做一些额外的处理，比如跳转到特定页面
  console.log('登录成功，当前用户:', userStore.userInfo)
}

// 导航菜单配置
const navItems = [
  { to: '/home', icon: 'icon-[material-symbols--home-outline]', label: '首页' },
  { to: '/note', icon: 'icon-[material-symbols--note-outline]', label: '我的笔记' },
  { to: '/creator', icon: 'icon-[material-symbols--edit-outline]', label: '创作中心' },
  { to: '/message', icon: 'icon-[material-symbols--notifications-outline]', label: '消息中心' }
]

// 用户菜单配置
const userMenuItems = computed(() => [
  {
    label: '我的文章',
    to: `/user/${userStore.userId}/articles`,
    icon: 'icon-[material-symbols--person-outline]',
    type: 'normal' as const
  },
  {
    label: '浏览历史',
    to: `/user/${userStore.userId}/history`,
    icon: 'icon-[material-symbols--history]',
    type: 'normal' as const
  },
  {
    label: '我的收藏',
    to: `/user/${userStore.userId}/favorites`,
    icon: 'icon-[mdi--bookmark-outline]',
    type: 'normal' as const
  },
  {
    label: '我的点赞',
    to: `/user/${userStore.userId}/likes`,
    icon: 'icon-[mingcute--thumb-up-line]',
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
    icon: 'icon-[material-symbols--logout]',
    type: 'danger' as const,
    action: handleLogout
  }
])

// 处理退出登录
async function handleLogout() {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const success = await userStore.logout()
    if (success) {
      ElMessage.success('已退出登录')
      router.push('/home')
    }
  } catch {
    // 用户取消
  }
}

// 搜索处理
const handleSearch = (query: string) => {
  console.log('搜索：', query)
  // 这里可以实现搜索逻辑
}

// 当前用户数据（用于 UserMenu）
const currentUser = computed(() => ({
  id: userStore.userId,
  name: userStore.nickname || '用户',
  isLoggedIn: userStore.isLoggedIn,
  avatar: userStore.avatar
}))
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-bg-primary border-b border-border-primary shadow-sm transition-transform duration-300 ease-in-out"
    :class="{ '-translate-y-full': !isScrollUp }">
    <div class="max-w-400 mx-auto">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <router-link to="/home" class="flex items-center space-x-2 hover:opacity-80 transition-opacity mr-4">
          <span class="hidden sm:block text-xl font-bold text-theme-primary">
            TechShareHub
          </span>
        </router-link>

        <!-- 导航菜单 -->
        <nav class="hidden md:flex items-center space-x-8">
          <NavItem v-for="item in navItems" :key="item.to" :to="item.to" :icon="item.icon" :label="item.label" />
        </nav>

        <!-- 搜索框 -->
        <SearchBox @search="handleSearch" />

        <!-- 用户区域 -->
        <div class="flex items-center gap-3">
          <!-- 已登录状态 -->
          <UserMenu v-if="currentUser.isLoggedIn" :user="currentUser" :menu-items="userMenuItems" />

          <!-- 未登录状态 -->
          <template v-else>
            <button
              @click="openAuthDialog"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-theme-primary hover:bg-theme-primary-hover transition-colors"
            >
              登录 / 注册
            </button>
          </template>
        </div>

        <!-- 移动端菜单按钮 -->
        <button class="md:hidden p-2 rounded-md text-font-secondary transition-colors hover:opacity-70">
          <i class="icon-[material-symbols--menu] w-6 h-6"></i>
        </button>
      </div>
    </div>

    <!-- 登录/注册对话框 -->
    <AuthDialog
      v-model="showAuthDialog"
      :default-mode="authDialogMode"
      @success="handleAuthSuccess"
    />
  </header>
</template>

<style scoped>
/* Tailwind CSS样式已经在template中使用，无需额外样式 */
</style>
