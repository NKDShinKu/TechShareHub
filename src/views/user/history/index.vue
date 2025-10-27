<template>
  <div class="space-y-4">
    <!-- 顶部操作栏 -->
    <CommonCard>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button 
            @click="toggleSelectMode"
            class="px-4 py-2 rounded-lg transition-colors cursor-pointer "
            :class="isSelectMode ? 'bg-theme-primary text-white' : 'bg-bg-secondary text-font-secondary hover:bg-bg-tertiary'"
          >
            {{ isSelectMode ? '取消选择' : '选择' }}
          </button>
          
          <div v-if="isSelectMode" class="flex items-center gap-2">
            <button 
              @click="selectAll"
              class="px-3 py-2 text-sm cursor-pointer bg-bg-secondary hover:bg-bg-tertiary rounded-lg transition-colors text-font-secondary"
            >
              全选
            </button>
            <button 
              @click="clearSelection"
              class="px-3 py-2 text-sm cursor-pointer bg-bg-secondary hover:bg-bg-tertiary rounded-lg transition-colors text-font-secondary"
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
            删除选中
          </button>
        </div>
      </div>
    </CommonCard>

    <!-- 列表项 -->
    <CommonCard 
      v-for="item in historyItems" 
      :key="item.id"
      class="transition-shadow cursor-pointer"
      :class="isSelectMode ? 'hover:shadow-sm' : 'hover:shadow-md'"
    >
      <div class="flex items-start gap-4">
        <!-- 选择框 -->
        <div v-if="isSelectMode" class="flex-shrink-0 pt-1">
          <input 
            type="checkbox"
            :checked="selectedIds.includes(item.id)"
            @change="toggleSelect(item.id)"
            class="w-4 h-4 cursor-pointer accent-theme-primary"
          >
        </div>
        
        <div class="flex-1 min-w-0 flex justify-between items-start gap-4">
          <div class="flex-1 min-w-0">
            <h3 class="text-base font-semibold text-font-primary mb-2 line-clamp-1">
              {{ item.title }}
            </h3>
            <div class="flex items-center gap-4 text-xs text-font-tertiary">
              <span>{{ item.author }}</span>
              <span>{{ item.category }}</span>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <div class="text-xs text-font-tertiary mb-1">{{ item.visitTime }}</div>
            <button 
              v-if="!isSelectMode"
              @click.stop="deleteSingle(item.id)"
              class="text-xs text-color-danger hover:underline"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </CommonCard>

    <!-- 空状态 -->
    <div v-if="historyItems.length === 0" class="text-center py-12">
      <span class="icon-[mdi--history] w-16 h-16 text-font-tertiary mb-4 inline-block"></span>
      <p class="text-font-tertiary">暂无浏览历史</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonCard from '@/components/CommonCard.vue'

interface HistoryItem {
  id: string
  title: string
  author: string
  category: string
  visitTime: string
}

defineProps<{
  userId?: string
  isCurrentUser?: boolean
}>()

const historyItems = ref<HistoryItem[]>([
  {
    id: '1',
    title: 'React vs Vue:哪个更适合你的项目',
    author: '张三',
    category: '前端开发',
    visitTime: '2024-01-20 14:30'
  },
  {
    id: '2',
    title: 'Node.js 性能优化实战',
    author: '李四',
    category: '后端开发',
    visitTime: '2024-01-20 10:15'
  },
  {
    id: '3',
    title: 'Docker 容器化部署完全指南',
    author: '王五',
    category: 'DevOps',
    visitTime: '2024-01-19 16:45'
  },
  {
    id: '4',
    title: 'GraphQL API 设计最佳实践',
    author: '赵六',
    category: 'API设计',
    visitTime: '2024-01-19 09:20'
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
  selectedIds.value = historyItems.value.map(item => item.id)
}

const clearSelection = () => {
  selectedIds.value = []
}

const deleteSelected = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 项浏览记录吗?`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    historyItems.value = historyItems.value.filter(item => !selectedIds.value.includes(item.id))
    selectedIds.value = []
    isSelectMode.value = false
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

const deleteSingle = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条浏览记录吗?',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    historyItems.value = historyItems.value.filter(item => item.id !== id)
    ElMessage.success('删除成功')
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
</style>
