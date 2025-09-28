<script setup lang="ts">
import { useHeaderVisibility } from '@/composables/useScrollUtils'

// 使用 Header 显隐逻辑
const { isScrollUp } = useHeaderVisibility(900) // 滚动 900px 后触发
defineOptions({ name: 'MessageCenter' })

// 消息菜单配置
const messageMenuItems = [
  { to: '/message/system', label: '系统通知', count: 3 },
  { to: '/message/comments', label: '评论', count: 12 },
  { to: '/message/likes', label: '点赞', count: 8 },
  { to: '/message/favorites', label: '收藏', count: 5 }
]
</script>

<template>
  <div class="message-center">
    <!-- 消息中心导航栏 -->
    <nav class="fixed w-full h-15 top-15 z-1 left-0 bg-bg-primary border-b border-border-primary shadow-sm  transition-transform duration-300 ease-in-out"
    :class="{ '-translate-y-full': !isScrollUp }">
      <div class="max-w-400 mx-auto">
        <div class="px-4 py-3">
          <!-- 消息菜单 -->
          <div class="flex items-center space-x-6 overflow-x-auto">
            <router-link
              v-for="item in messageMenuItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
              :class="[
                'text-font-secondary hover:text-theme-primary hover:bg-theme-primary-10',
                'border border-transparent hover:border-theme-primary-20'
              ]"
              active-class="!text-theme-primary !bg-theme-primary-10 !border-theme-primary-20"
            >
              
              <!-- 标签 -->
              <span>{{ item.label }}</span>
              
              <!-- 消息数量徽章 -->
              <span 
                v-if="item.count > 0"
                class="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full min-w-[18px] h-4"
              >
                {{ item.count > 99 ? '99+' : item.count }}
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- 消息内容区域 -->
    <main class="max-w-400 mx-auto p-4 mt-15">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/* 使用 Tailwind CSS 类，无需额外样式 */
</style>