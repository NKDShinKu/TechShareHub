<template>
  <div class="space-y-4">
    <!-- 顶部操作栏 -->
    <CommonCard>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button 
            @click="toggleSelectMode"
            class="px-4 py-2 cursor-pointer rounded-lg transition-colors"
            :class="isSelectMode ? 'bg-theme-primary text-white' : 'bg-bg-secondary text-font-secondary hover:bg-bg-tertiary'"
          >
            {{ isSelectMode ? '取消选择' : '选择' }}
          </button>
          
          <div v-if="isSelectMode" class="flex items-center gap-2">
            <button 
              @click="selectAll"
              class="px-3 py-2 cursor-pointer text-sm bg-bg-secondary hover:bg-bg-tertiary rounded-lg transition-colors text-font-secondary"
            >
              全选
            </button>
            <button 
              @click="clearSelection"
              class="px-3 py-2 cursor-pointer text-sm bg-bg-secondary hover:bg-bg-tertiary rounded-lg transition-colors text-font-secondary"
            >
              取消全选
            </button>
          </div>
        </div>
        
        <div v-if="isSelectMode" class="flex items-center gap-3">
          <span v-if="selectedIds.length > 0" class="text-sm text-font-tertiary">已选择 {{ selectedIds.length }} 项</span>
          <button 
            v-if="selectedIds.length > 0"
            @click="deleteSelected"
            class="px-4 py-2 text-red-500 cursor-pointer rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            取消收藏
          </button>
        </div>
      </div>
    </CommonCard>

    <!-- 列表项 -->
    <CommonCard 
      v-for="item in favoriteItems" 
      :key="item.id"
      class="transition-shadow cursor-pointer"
      :class="isSelectMode ? 'hover:shadow-sm' : 'hover:shadow-md'"
    >
      <div class="flex gap-4">
        <!-- 选择框 -->
        <div v-if="isSelectMode" class="flex-shrink-0 pt-1">
          <input 
            type="checkbox"
            :checked="selectedIds.includes(item.id)"
            @change="toggleSelect(item.id)"
            class="w-4 h-4 cursor-pointer accent-theme-primary"
          >
        </div>
        
        <img 
          v-if="item.cover"
          :src="item.cover" 
          :alt="item.title"
          class="w-32 h-24 object-cover rounded flex-shrink-0"
        >
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start gap-2 mb-2">
            <h3 class="text-lg font-semibold text-font-primary line-clamp-1 flex-1">
              {{ item.title }}
            </h3>
            <button 
              v-if="!isSelectMode"
              @click.stop="deleteSingle(item.id)"
              class="flex-shrink-0 text-xs text-color-danger hover:underline"
            >
              取消收藏
            </button>
          </div>
          <p class="text-sm text-font-tertiary mb-3 line-clamp-2">
            {{ item.summary }}
          </p>
          <div class="flex items-center justify-between text-xs text-font-tertiary">
            <div class="flex items-center gap-4">
              <span>{{ item.author }}</span>
              <span>{{ item.category }}</span>
            </div>
            <span>{{ item.collectTime }}</span>
          </div>
        </div>
      </div>
    </CommonCard>

    <!-- 空状态 -->
    <div v-if="favoriteItems.length === 0" class="text-center py-12">
      <span class="icon-[mdi--bookmark-outline] w-16 h-16 text-font-tertiary mb-4 inline-block"></span>
      <p class="text-font-tertiary">暂无收藏</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonCard from '@/components/CommonCard.vue'

interface FavoriteItem {
  id: string
  title: string
  summary: string
  cover?: string
  author: string
  category: string
  collectTime: string
}

defineProps<{
  userId?: string
  isCurrentUser?: boolean
}>()

const favoriteItems = ref<FavoriteItem[]>([
  {
    id: '1',
    title: '微服务架构设计模式详解',
    summary: '深入探讨微服务架构的各种设计模式,包括服务发现、负载均衡、熔断降级等核心概念。',
    cover: '',
    author: '架构师小王',
    category: '系统架构',
    collectTime: '2024-01-18'
  },
  {
    id: '2',
    title: 'Kubernetes 实战指南',
    summary: '从零开始学习 Kubernetes,掌握容器编排的核心技术和最佳实践。',
    author: '运维工程师',
    category: 'DevOps',
    collectTime: '2024-01-15'
  },
  {
    id: '3',
    title: 'CSS Grid 布局完全指南',
    summary: '全面讲解 CSS Grid 布局系统,通过实例学习如何创建复杂的响应式布局。',
    cover: '',
    author: '前端专家',
    category: '前端开发',
    collectTime: '2024-01-12'
  }
])

const isSelectMode = ref(false)
const selectedIds = ref<string[]>([])

const toggleSelectMode = () => {
  isSelectMode.value = !isSelectMode.value
  if (!isSelectMode.value) {
    selectedIds.value = []
  }
}

const toggleSelect = (id: string) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

const selectAll = () => {
  selectedIds.value = favoriteItems.value.map(item => item.id)
}

const clearSelection = () => {
  selectedIds.value = []
}

const deleteSelected = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要取消收藏选中的 ${selectedIds.value.length} 项吗?`,
      '取消收藏确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    favoriteItems.value = favoriteItems.value.filter(item => !selectedIds.value.includes(item.id))
    selectedIds.value = []
    isSelectMode.value = false
    ElMessage.success('取消收藏成功')
  } catch {
    // 用户取消
  }
}

const deleteSingle = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要取消收藏这篇文章吗?',
      '取消收藏确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    favoriteItems.value = favoriteItems.value.filter(item => item.id !== id)
    ElMessage.success('取消收藏成功')
  } catch {
    // 用户取消
  }
}
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
