<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 搜索相关
const searchQuery = ref('')

// 下拉菜单状态
const isUserMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement>()

// 模拟当前用户状态
const currentUser = ref({
  id: '123',
  name: '张三',
  isLoggedIn: true
})

// 点击外部关闭菜单
const handleClickOutside = (event: Event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="sticky top-0 z-50 bg-bg-primary border-b border-gray-200 shadow-sm">
    <div class="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Logo -->
        <router-link to="/home" class="flex items-center space-x-2 hover:opacity-80 transition-opacity mr-4">
          <img src="/logo.png" alt="Logo" class="w-8 h-8 rounded">
          <span class="hidden sm:block text-xl font-bold text-blue-600">TechShareHub</span>
        </router-link>

        <!-- 导航菜单 -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link 
            to="/home" 
            class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            active-class="text-blue-600 bg-blue-50"
          >
            <i class="icon-[material-symbols--home-outline] w-5 h-5"></i>
            <span>首页</span>
          </router-link>
          
          <router-link 
            to="/note" 
            class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            active-class="text-blue-600 bg-blue-50"
          >
            <i class="icon-[material-symbols--note-outline] w-5 h-5"></i>
            <span>我的笔记</span>
          </router-link>
          
          <router-link 
            to="/creator" 
            class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            active-class="text-blue-600 bg-blue-50"
          >
            <i class="icon-[material-symbols--edit-outline] w-5 h-5"></i>
            <span>创作中心</span>
          </router-link>
          
          <router-link 
            to="/message" 
            class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            active-class="text-blue-600 bg-blue-50"
          >
            <i class="icon-[material-symbols--notifications-outline] w-5 h-5"></i>
            <span>消息中心</span>
          </router-link>
        </nav>

        <!-- 搜索框 -->
        <div class="flex-1 max-w-md mx-8">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章、用户..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
            <i class="icon-[material-symbols--search] absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"></i>
          </div>
        </div>

        <!-- 用户区域 -->
        <div class="flex items-center">
          <div v-if="currentUser.isLoggedIn" class="relative" ref="userMenuRef">
            <!-- 用户头像 -->
            <div 
              class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              @click="isUserMenuOpen = !isUserMenuOpen"
            >
              <img 
                src="https://via.placeholder.com/32x32?text=U" 
                alt="用户头像" 
                class="w-8 h-8 rounded-full border-2 border-gray-200"
              >
              <span class="hidden sm:block text-sm font-medium text-gray-700">{{ currentUser.name }}</span>
              <i class="icon-[material-symbols--keyboard-arrow-down] w-4 h-4 text-gray-500 transition-transform" :class="{ 'rotate-180': isUserMenuOpen }"></i>
            </div>

            <!-- 下拉菜单 -->
            <div 
              v-show="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              <router-link 
                :to="`/user/${currentUser.id}/articles`"
                class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <i class="icon-[material-symbols--person-outline] w-4 h-4"></i>
                <span>个人中心</span>
              </router-link>
              
              <router-link 
                :to="`/user/${currentUser.id}/articles`"
                class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <i class="icon-[material-symbols--article-outline] w-4 h-4"></i>
                <span>我的文章</span>
              </router-link>
              
              <router-link 
                :to="`/user/${currentUser.id}/favorites`"
                class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <i class="icon-[material-symbols--favorite-outline] w-4 h-4"></i>
                <span>我的收藏</span>
              </router-link>
              
              <router-link 
                :to="`/user/${currentUser.id}/history`"
                class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <i class="icon-[material-symbols--history] w-4 h-4"></i>
                <span>浏览历史</span>
              </router-link>
              
              <div class="border-t border-gray-100 my-1"></div>
              
              <router-link 
                to="/setting"
                class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <i class="icon-[material-symbols--settings-outline] w-4 h-4"></i>
                <span>设置</span>
              </router-link>
              
              <router-link 
                to="/login"
                class="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <i class="icon-[material-symbols--logout] w-4 h-4"></i>
                <span>退出登录</span>
              </router-link>
            </div>
          </div>

          <!-- 未登录状态 -->
          <router-link 
            v-else
            to="/login"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            登录
          </router-link>
        </div>

        <!-- 移动端菜单按钮 -->
        <button class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
          <i class="icon-[material-symbols--menu] w-6 h-6"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Tailwind CSS样式已经在template中使用，无需额外样式 */
</style>
