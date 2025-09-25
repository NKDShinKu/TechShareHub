<script setup lang="ts">
defineOptions({ name: 'HomePage' })

import { useRouter } from 'vue-router'
import CategorySidebar from './components/CategorySidebar.vue'
import RightSidebar from './components/RightSidebar.vue'

const router = useRouter()

const handleCategorySelect = (categoryId: string) => {
  // 导航到对应的分类路由
  router.push(`/home/category/${categoryId}`)
}
</script>

<template>
  <div class="p-4 max-w-screen-2xl mx-auto">
    <!-- 三栏布局容器 -->
    <div class="flex items-start gap-6 min-h-[calc(100vh-2rem)] lg:flex-row flex-col">
      <!-- 左侧分类栏 -->
      <CategorySidebar @category-select="handleCategorySelect" />
      
      <!-- 中间内容区 - 这里渲染子路由 -->
      <div class="flex-1 mx-0 lg:mx-6">
        <router-view />
      </div>
      
      <!-- 右侧边栏 -->
      <RightSidebar />
    </div>
  </div>
</template>

