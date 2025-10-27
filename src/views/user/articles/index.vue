<template>
  <div class="space-y-4">
    <CommonCard 
      v-for="article in articles" 
      :key="article.id"
      class="hover:shadow-md transition-shadow cursor-pointer"
    >
      <div class="flex gap-4">
        <img 
          v-if="article.cover"
          :src="article.cover" 
          :alt="article.title"
          class="w-32 h-24 object-cover rounded flex-shrink-0"
        >
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-font-primary mb-2 line-clamp-1">
            {{ article.title }}
          </h3>
          <p class="text-sm text-font-tertiary mb-3 line-clamp-2">
            {{ article.summary }}
          </p>
          <div class="flex items-center justify-between text-xs text-font-tertiary">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1">
                <span class="icon-[tabler--eye] w-4 h-4"></span>
                {{ article.views }}
              </span>
              <span class="flex items-center gap-1">
                <span class="icon-[mingcute--thumb-up-line] w-4 h-4"></span>
                {{ article.likes }}
              </span>
              <span class="flex items-center gap-1">
                <span class="icon-[mdi--comment-text-outline] w-4 h-4"></span>
                {{ article.comments }}
              </span>
            </div>
            <span>{{ article.date }}</span>
          </div>
        </div>
      </div>
    </CommonCard>

    <!-- 空状态 -->
    <div v-if="articles.length === 0" class="text-center py-12">
      <span class="icon-[material-symbols--article-outline] w-16 h-16 text-font-tertiary mb-4 inline-block"></span>
      <p class="text-font-tertiary">暂无文章</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonCard from '@/components/CommonCard.vue'

interface Article {
  id: string
  title: string
  summary: string
  cover?: string
  views: number
  likes: number
  comments: number
  date: string
}

defineProps<{
  userId?: string
  isCurrentUser?: boolean
}>()

// 模拟文章数据
const articles = ref<Article[]>([
  {
    id: '1',
    title: 'Vue 3 Composition API 最佳实践',
    summary: '深入探讨 Vue 3 Composition API 的使用技巧和最佳实践,包括响应式系统、生命周期函数、依赖注入等核心概念。',
    cover: '',
    views: 1234,
    likes: 89,
    comments: 23,
    date: '2024-01-15'
  },
  {
    id: '2',
    title: 'TypeScript 类型编程进阶',
    summary: '通过实际案例学习 TypeScript 的高级类型特性,包括泛型、条件类型、映射类型等。',
    views: 2341,
    likes: 156,
    comments: 45,
    date: '2024-01-10'
  },
  {
    id: '3',
    title: 'Tailwind CSS 实用技巧',
    summary: '分享 Tailwind CSS 在实际项目中的应用经验,如何高效使用原子化 CSS 提升开发效率。',
    cover: '',
    views: 987,
    likes: 67,
    comments: 12,
    date: '2024-01-05'
  }
])
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
