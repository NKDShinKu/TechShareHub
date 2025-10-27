<template>
  <div class="space-y-4">
    <CommonCard 
      v-for="item in likeItems" 
      :key="item.id"
      class="hover:shadow-md transition-shadow cursor-pointer"
    >
      <div class="flex justify-between items-start gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 bg-theme-primary-10 text-theme-primary text-xs rounded">
              {{ item.type }}
            </span>
            <h3 class="text-base font-semibold text-font-primary line-clamp-1">
              {{ item.title }}
            </h3>
          </div>
          <p class="text-sm text-font-tertiary mb-2 line-clamp-2">
            {{ item.summary }}
          </p>
          <div class="flex items-center gap-4 text-xs text-font-tertiary">
            <span>{{ item.author }}</span>
            <span class="flex items-center gap-1">
              <span class="icon-[mingcute--thumb-up-line] w-4 h-4"></span>
              {{ item.likes }}
            </span>
          </div>
        </div>
        <div class="text-right flex-shrink-0">
          <div class="text-xs text-font-tertiary">{{ item.likeTime }}</div>
        </div>
      </div>
    </CommonCard>

    <!-- 空状态 -->
    <div v-if="likeItems.length === 0" class="text-center py-12">
      <span class="icon-[mdi--heart-outline] w-16 h-16 text-font-tertiary mb-4 inline-block"></span>
      <p class="text-font-tertiary">暂无点赞</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonCard from '@/components/CommonCard.vue'

interface LikeItem {
  id: string
  type: string
  title: string
  summary: string
  author: string
  likes: number
  likeTime: string
}

defineProps<{
  userId?: string
  isCurrentUser?: boolean
}>()

const likeItems = ref<LikeItem[]>([
  {
    id: '1',
    type: '文章',
    title: 'JavaScript 设计模式实战',
    summary: '通过实际案例学习常用的 JavaScript 设计模式,提升代码的可维护性和扩展性。',
    author: '前端大牛',
    likes: 234,
    likeTime: '2024-01-19'
  },
  {
    id: '2',
    type: '问答',
    title: '如何优化 React 应用的性能?',
    summary: '分享一些 React 性能优化的技巧,包括 memo、useMemo、useCallback 等 Hook 的使用。',
    author: 'React专家',
    likes: 189,
    likeTime: '2024-01-18'
  },
  {
    id: '3',
    type: '文章',
    title: 'MongoDB 索引优化策略',
    summary: '深入讲解 MongoDB 索引的工作原理和优化技巧,提升数据库查询性能。',
    author: '数据库工程师',
    likes: 156,
    likeTime: '2024-01-17'
  },
  {
    id: '4',
    type: '教程',
    title: 'Git 分支管理最佳实践',
    summary: '学习如何有效管理 Git 分支,掌握 Git Flow、GitHub Flow 等工作流程。',
    author: '版本控制专家',
    likes: 312,
    likeTime: '2024-01-16'
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
