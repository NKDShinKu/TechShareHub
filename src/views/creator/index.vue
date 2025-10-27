<script setup lang="ts">
defineOptions({ name: 'CreatorCenter' })

import { useRouter } from 'vue-router'
import CreatorSidebar from './components/CreatorSidebar.vue'

const router = useRouter()

// 处理菜单选择
const handleMenuSelect = (menuPath: string) => {
  // 如果是外部链接或需要特殊处理的路由
  if (menuPath.startsWith('/note')) {
    router.push(menuPath)
  } else {
    // 内部路由导航
    router.push(menuPath)
  }
}
</script>

<template>
  <div class="p-4 max-w-screen-2xl mx-auto">
    <!-- 创作中心布局容器 -->
    <div class="flex items-start gap-6 min-h-[calc(100vh-6rem)] lg:flex-row flex-col">
      <!-- 左侧创作中心侧边栏 -->
      <CreatorSidebar @menu-select="handleMenuSelect" />
      
      <!-- 右侧内容区 - 这里渲染子路由 -->
      <div class="flex-1 mx-0 lg:mx-6">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 使用 Tailwind CSS 类，无需额外样式 */
</style>