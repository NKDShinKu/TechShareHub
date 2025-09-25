<script setup lang="ts">
defineOptions({ name: 'CategorySidebar' })

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CommonCard from '@/components/CommonCard.vue'

interface Category {
  id: string
  name: string
  icon: string
  color: string
  count: number
}

const route = useRoute()

const categories: Category[] = [
  { id: '0', name: '全部', icon: 'i-heroicons-squares-2x2', color: 'text-blue-500', count: 1205 },
  { id: '1', name: '综合', icon: 'i-heroicons-sparkles', color: 'text-purple-500', count: 324 },
  { id: '2', name: '后端', icon: 'i-heroicons-server', color: 'text-green-500', count: 298 },
  { id: '3', name: '前端', icon: 'i-heroicons-code-bracket', color: 'text-orange-500', count: 267 },
  { id: '4', name: 'Android', icon: 'i-heroicons-device-phone-mobile', color: 'text-emerald-500', count: 156 },
  { id: '5', name: 'iOS', icon: 'i-heroicons-device-phone-mobile', color: 'text-gray-500', count: 89 },
  { id: '6', name: '人工智能', icon: 'i-heroicons-cpu-chip', color: 'text-indigo-500', count: 234 },
  { id: '7', name: '开发工具', icon: 'i-heroicons-wrench-screwdriver', color: 'text-yellow-500', count: 145 },
  { id: '8', name: '代码人生', icon: 'i-heroicons-heart', color: 'text-red-500', count: 78 },
  { id: '9', name: '阅读', icon: 'i-heroicons-book-open', color: 'text-teal-500', count: 92 },
  { id: '10', name: '排行榜', icon: 'i-heroicons-trophy', color: 'text-amber-500', count: 0 }
]

const emit = defineEmits<{
  categorySelect: [categoryId: string]
}>()

// 获取当前选中的分类ID
const currentCategoryId = computed(() => {
  return route.params.categoryId as string || '0'
})

const handleCategoryClick = (categoryId: string) => {
  emit('categorySelect', categoryId)
}
</script>

<template>
  <div class="w-60 sticky top-17">
    <CommonCard title="分类" padding="p-1">
      <div class="category-list">
        <div
          v-for="category in categories"
          :key="category.id"
          class="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors border-b border-border-secondary last:border-b-0"
          :class="{
            'bg-theme-primary-10 border-l-4 border-l-theme-primary': currentCategoryId === category.id,
            'hover:bg-bg-secondary': currentCategoryId !== category.id
          }"
          @click="handleCategoryClick(category.id)"
        >
          <div class="flex items-center space-x-3">
            <i :class="[category.icon, category.color]" class="w-5 h-5"></i>
            <span 
              class="font-medium transition-colors"
              :class="currentCategoryId === category.id ? 'text-theme-primary' : 'text-font-secondary hover:text-theme-primary'"
            >
              {{ category.name }}
            </span>
          </div>
          <span v-if="category.count > 0" class="text-sm text-font-tertiary">{{ category.count }}</span>
        </div>
      </div>
    </CommonCard>
  </div>
</template>