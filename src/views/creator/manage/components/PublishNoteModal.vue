<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-font-primary/50 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            class="bg-bg-primary rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
          >
            <!-- 弹窗头部 -->
            <div class="px-6 py-4 border-b border-border-primary flex items-center justify-between">
              <h2 class="text-xl font-semibold text-font-primary">选择要发布的笔记</h2>
              <button
                @click="handleClose"
                class="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
              >
                <i class="icon-[material-symbols--close] text-xl text-font-secondary"></i>
              </button>
            </div>

            <!-- 搜索栏 -->
            <div class="px-6 py-4 border-b border-border-primary">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索笔记..."
                  class="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                >
                <i class="icon-[material-symbols--search] absolute left-3 top-1/2 transform -translate-y-1/2 text-font-tertiary text-lg"></i>
              </div>
            </div>

            <!-- 笔记列表 -->
            <div class="flex-1 overflow-y-auto px-6 py-4">
              <div v-if="filteredFolders.length === 0" class="text-center py-12">
                <div class="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="icon-[material-symbols--folder-open-outline] text-2xl text-font-tertiary"></i>
                </div>
                <p class="text-font-secondary">{{ searchQuery ? '未找到匹配的笔记' : '暂无笔记' }}</p>
              </div>

              <div v-else class="space-y-2">
                <!-- 文件夹列表 -->
                <div
                  v-for="folder in filteredFolders"
                  :key="folder.id"
                  class="border border-border-primary rounded-lg overflow-hidden"
                >
                  <!-- 文件夹标题 -->
                  <div
                    @click="toggleFolder(folder.id)"
                    class="flex items-center justify-between px-4 py-3 bg-bg-secondary hover:bg-bg-tertiary cursor-pointer transition-colors"
                  >
                    <div class="flex items-center gap-3">
                      <i :class="[
                        'text-lg transition-transform',
                        expandedFolders.includes(folder.id)
                          ? 'icon-[material-symbols--folder-open] text-theme-primary'
                          : 'icon-[material-symbols--folder] text-font-tertiary'
                      ]"></i>
                      <span class="font-medium text-font-primary">{{ folder.name }}</span>
                      <span class="text-xs text-font-tertiary">({{ folder.notes.length }})</span>
                    </div>
                    <i :class="[
                      'icon-[material-symbols--keyboard-arrow-down] text-font-tertiary transition-transform',
                      expandedFolders.includes(folder.id) ? 'rotate-180' : ''
                    ]"></i>
                  </div>

                  <!-- 笔记列表 -->
                  <transition
                    enter-active-class="transition ease-out duration-200"
                    enter-from-class="transform opacity-0 -translate-y-2"
                    enter-to-class="transform opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="transform opacity-100 translate-y-0"
                    leave-to-class="transform opacity-0 -translate-y-2"
                  >
                    <div v-if="expandedFolders.includes(folder.id)" class="bg-bg-primary">
                      <div
                        v-for="note in folder.notes"
                        :key="note.id"
                        @click="selectNote(note)"
                        :class="[
                          'px-4 py-3 flex items-center justify-between cursor-pointer transition-colors border-t border-border-secondary',
                          selectedNote?.id === note.id
                            ? 'bg-theme-primary-10'
                            : 'hover:bg-bg-secondary'
                        ]"
                      >
                        <div class="flex items-center gap-3 flex-1 min-w-0">
                          <i class="icon-[material-symbols--sticky-note-2-outline] text-font-tertiary flex-shrink-0"></i>
                          <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-medium text-font-primary truncate">{{ note.title }}</h4>
                            <p class="text-xs text-font-tertiary mt-1">{{ formatDate(note.updateTime) }}</p>
                          </div>
                        </div>
                        <div v-if="selectedNote?.id === note.id" class="flex-shrink-0">
                          <i class="icon-[material-symbols--check-circle] text-theme-primary text-xl"></i>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>

            <!-- 弹窗底部 -->
            <div class="px-6 py-4 border-t border-border-primary flex items-center justify-between">
              <div class="text-sm text-font-secondary">
                {{ selectedNote ? `已选择: ${selectedNote.title}` : '请选择一个笔记' }}
              </div>
              <div class="flex items-center gap-3">
                <button
                  @click="handleClose"
                  class="px-4 py-2 bg-bg-secondary hover:bg-bg-tertiary text-font-secondary rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  @click="handleConfirm"
                  :disabled="!selectedNote"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    selectedNote
                      ? 'bg-theme-primary hover:bg-theme-primary-hover text-white'
                      : 'bg-bg-tertiary text-font-tertiary cursor-not-allowed'
                  ]"
                >
                  确认发布
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Note {
  id: string
  title: string
  updateTime: Date
  status?: string
}

interface Folder {
  id: string
  name: string
  notes: Note[]
}

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', note: Note): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const selectedNote = ref<Note | null>(null)
const expandedFolders = ref<string[]>(['default']) // 默认展开第一个文件夹

// 模拟笔记数据
const folders = ref<Folder[]>([
  {
    id: 'default',
    name: '默认文件夹',
    notes: [
      {
        id: 'n1',
        title: 'Vue 3 响应式原理学习笔记',
        updateTime: new Date('2024-01-20'),
        status: 'draft'
      },
      {
        id: 'n2',
        title: 'JavaScript 闭包深度理解',
        updateTime: new Date('2024-01-18'),
        status: 'draft'
      },
      {
        id: 'n3',
        title: 'TypeScript 高级类型笔记',
        updateTime: new Date('2024-01-15'),
        status: 'draft'
      }
    ]
  },
  {
    id: 'frontend',
    name: '前端开发',
    notes: [
      {
        id: 'n4',
        title: 'CSS Grid 布局实战笔记',
        updateTime: new Date('2024-01-12'),
        status: 'draft'
      },
      {
        id: 'n5',
        title: 'React Hooks 使用心得',
        updateTime: new Date('2024-01-10'),
        status: 'draft'
      },
      {
        id: 'n6',
        title: 'Webpack 配置优化笔记',
        updateTime: new Date('2024-01-08'),
        status: 'draft'
      }
    ]
  },
  {
    id: 'algorithm',
    name: '算法与数据结构',
    notes: [
      {
        id: 'n7',
        title: '二叉树遍历算法总结',
        updateTime: new Date('2024-01-05'),
        status: 'draft'
      },
      {
        id: 'n8',
        title: '动态规划经典问题',
        updateTime: new Date('2024-01-03'),
        status: 'draft'
      }
    ]
  }
])

// 过滤文件夹和笔记
const filteredFolders = computed(() => {
  if (!searchQuery.value.trim()) {
    return folders.value
  }

  const query = searchQuery.value.toLowerCase()
  return folders.value
    .map(folder => ({
      ...folder,
      notes: folder.notes.filter(note =>
        note.title.toLowerCase().includes(query)
      )
    }))
    .filter(folder => folder.notes.length > 0)
})

// 切换文件夹展开/折叠
const toggleFolder = (folderId: string) => {
  const index = expandedFolders.value.indexOf(folderId)
  if (index > -1) {
    expandedFolders.value.splice(index, 1)
  } else {
    expandedFolders.value.push(folderId)
  }
}

// 选择笔记
const selectNote = (note: Note) => {
  selectedNote.value = note
}

// 关闭弹窗
const handleClose = () => {
  emit('update:modelValue', false)
  // 延迟重置状态，等待动画完成
  setTimeout(() => {
    selectedNote.value = null
    searchQuery.value = ''
  }, 200)
}

// 确认发布
const handleConfirm = () => {
  if (selectedNote.value) {
    emit('confirm', selectedNote.value)
    handleClose()
  }
}

// 格式化日期
const formatDate = (date: Date) => {
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)}周前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

// 监听弹窗打开，自动展开有结果的文件夹
watch(() => props.modelValue, (isOpen) => {
  if (isOpen && searchQuery.value) {
    expandedFolders.value = filteredFolders.value.map(f => f.id)
  }
})

// 监听搜索，自动展开有结果的文件夹
watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    expandedFolders.value = filteredFolders.value.map(f => f.id)
  }
})
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: var(--border-secondary);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: var(--border-primary);
}
</style>