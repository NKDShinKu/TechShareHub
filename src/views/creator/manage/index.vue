<template>
  <div class="creator-manage bg-bg-tertiary min-[calc(100vh-4rem)] py-1">
    <div class="max-w-6xl mx-auto px-6">
      <!-- 状态筛选标签 -->
      <div class="mb-3">
        <div class="inline-flex items-center gap-2 bg-bg-primary p-1 rounded-lg border border-border-primary">
          <button 
            v-for="tab in statusTabs" 
            :key="tab.value" 
            @click="switchTab(tab.value)" 
            :class="[
              'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
              currentStatus === tab.value
                ? 'bg-theme-primary text-white shadow-sm'
                : 'text-font-secondary hover:text-font-primary hover:bg-bg-secondary'
            ]"
          >
            {{ tab.label }}
            <span 
              v-if="tab.count > 0" 
              :class="[
                'ml-1 px-1.5 py-0.5 text-xs rounded-full',
                currentStatus === tab.value
                  ? 'bg-white/20 text-white'
                  : 'bg-bg-secondary text-font-tertiary'
              ]"
            >
              {{ tab.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- 工具栏 -->
      <div class="flex items-center justify-between mb-3 bg-bg-primary p-4 rounded-lg border border-border-primary">
        <div class="flex items-center gap-4">
          <!-- 搜索框 -->
          <div class="relative">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索笔记..."
              class="w-64 pl-10 pr-4 py-2 bg-bg-secondary text-font-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
            >
            <i class="icon-[material-symbols--search] absolute left-3 top-1/2 transform -translate-y-1/2 text-font-tertiary text-lg"></i>
          </div>

          <!-- 排序选择 -->
          <el-select 
            v-model="sortBy" 
            placeholder="排序方式" 
            style="width: 7rem"
          >
            <el-option
              v-for="option in sortOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>

        <div class="flex items-center gap-3">
          <!-- 选择模式切换 -->
          <button 
            @click="isSelectionMode = !isSelectionMode"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
              isSelectionMode
                ? 'bg-theme-primary text-white'
                : 'bg-bg-secondary hover:bg-bg-tertiary text-font-secondary'
            ]"
          >
            <i class="icon-[material-symbols--check-box-outline]"></i>
            {{ isSelectionMode ? '取消选择' : '选择' }}
          </button>

          <!-- 批量删除按钮 -->
          <button 
            v-if="selectedItems.length > 0"
            @click="handleBatchDelete"
            class="px-4 py-2 bg-danger hover:bg-danger-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <i class="icon-[material-symbols--delete-outline]"></i>
            删除 ({{ selectedItems.length }})
          </button>

          <!-- 发布笔记按钮 -->
          <button
            @click="showPublishDialog = true"
            class="px-4 py-2 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <i class="icon-[material-symbols--add]"></i>
            发布笔记
          </button>
        </div>
      </div>

      <!-- 笔记列表 -->
      <div class="bg-bg-primary rounded-lg border border-border-primary overflow-hidden h-[calc(70vh-2rem)]">
        <div v-if="paginatedNotes.length === 0" class="text-center py-16">
          <div class="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="icon-[material-symbols--article-outline] text-3xl text-font-tertiary"></i>
          </div>
          <h3 class="text-lg font-medium text-font-primary mb-2">暂无笔记</h3>
          <p class="text-font-secondary mb-6">发布您的第一篇笔记吧</p>
          <router-link 
            to="/note"
            class="inline-flex items-center px-4 py-2 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-lg font-medium transition-colors"
          >
            <i class="icon-[material-symbols--add] mr-2"></i>
            写笔记
          </router-link>
        </div>

        <div v-else class="overflow-y-auto h-[calc(70vh-2rem)]" >
          <NoteItem
            v-for="note in paginatedNotes"
            :key="note.id"
            :note="note"
            :selected="selectedItems.includes(note.id)"
            :show-checkbox="isSelectionMode"
            @select="handleNoteSelect"
            @edit-info="handleEditInfo"
            @edit-note="handleNoteEdit"
            @unpublish="handleNoteUnpublish"
            @click="handleNoteClick"
          />
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="filteredNotes.length > 0" class="mt-6">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          :total="filteredNotes.length"
          layout="total, sizes, prev, pager, next, jumper"
          class="justify-center"
        />
      </div>
    </div>

    <!-- 发布笔记弹窗 -->
    <PublishDialog
      v-model="showPublishDialog"
      :edit-data="editingNote ? {
        id: editingNote.id,
        title: editingNote.title,
        category: editingNote.category || '',
        tags: editingNote.tags || [],
        cover: editingNote.cover,
        summary: editingNote.summary
      } : undefined"
      @confirm="handlePublishNote"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'CreatorManagePage' })

import { computed, ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import NoteItem from './components/NoteItem.vue'
import PublishDialog from './components/PublishDialog.vue'

const route = useRoute()
const router = useRouter()

// 当前状态，默认为 'all'
const currentStatus = computed(() => {
  return (route.query.status as string) || 'all'
})

// 状态标签配置
const statusTabs = reactive([
  { value: 'all', label: '全部', count: 12 },
  { value: 'published', label: '已发布', count: 8 },
  { value: 'pending', label: '审核中', count: 2 },
  { value: 'rejected', label: '未通过', count: 2 }
])

// 排序选项
const sortOptions = [
  { label: '更新时间', value: 'updateTime' },
  { label: '创建时间', value: 'createTime' }
]

// 搜索和排序
const searchQuery = ref('')
const sortBy = ref('updateTime')

// 选择模式和批量操作
const isSelectionMode = ref(false)
const selectedItems = ref<string[]>([])

// 发布笔记弹窗
const showPublishDialog = ref(false)
const editingNote = ref<Note | null>(null)

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 笔记数据类型
interface Note {
  id: string
  title: string
  summary: string
  status: string
  cover?: string
  category?: string
  tags?: string[]
  createTime: Date
  updateTime: Date
}

// 模拟笔记数据
const noteList = reactive<Note[]>([
  {
    id: '1',
    title: 'Vue 3 Composition API 深度解析',
    summary: '深入了解 Vue 3 Composition API 的使用方法和最佳实践，包括 reactive、ref、computed 等核心 API 的详细介绍...',
    status: 'published',
    cover: '',
    category: 'frontend',
    tags: ['vue', 'typescript'],
    createTime: new Date('2024-01-15'),
    updateTime: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'TypeScript 类型系统最佳实践',
    summary: 'TypeScript 强大的类型系统能够帮助我们在开发阶段发现潜在问题，本文将介绍一些实用的类型定义技巧...',
    status: 'published',
    cover: '',
    category: 'frontend',
    tags: ['typescript'],
    createTime: new Date('2024-01-10'),
    updateTime: new Date('2024-01-15')
  },
  {
    id: '3',
    title: '前端性能优化笔记',
    summary: '记录一些前端性能优化的实用技巧，包括代码分割、懒加载、缓存策略等...',
    status: 'pending',
    cover: '',
    category: 'frontend',
    tags: ['performance'],
    createTime: new Date('2024-01-08'),
    updateTime: new Date('2024-01-12')
  },
  {
    id: '4',
    title: 'React Hooks 使用心得',
    summary: '分享在项目中使用 React Hooks 的一些经验和踩坑记录...',
    status: 'rejected',
    cover: '',
    category: 'frontend',
    tags: ['react'],
    createTime: new Date('2024-01-05'),
    updateTime: new Date('2024-01-08')
  }
])

// 计算属性：过滤后的笔记
const filteredNotes = computed(() => {
  let filtered = noteList

  // 状态筛选
  if (currentStatus.value !== 'all') {
    filtered = filtered.filter(note => note.status === currentStatus.value)
  }

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.summary.toLowerCase().includes(query)
    )
  }

  // 排序
  filtered = [...filtered].sort((a, b) => {
    if (sortBy.value === 'updateTime') {
      return b.updateTime.getTime() - a.updateTime.getTime()
    } else {
      return b.createTime.getTime() - a.createTime.getTime()
    }
  })

  return filtered
})

// 计算属性：分页后的笔记
const paginatedNotes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredNotes.value.slice(start, end)
})

// 方法：切换状态标签
const switchTab = (status: string) => {
  router.push({ path: '/creator/manage', query: { status } })
  currentPage.value = 1 // 切换状态时重置到第一页
}

// 方法：笔记选择
const handleNoteSelect = (id: string, selected: boolean) => {
  if (selected) {
    if (!selectedItems.value.includes(id)) {
      selectedItems.value.push(id)
    }
  } else {
    const index = selectedItems.value.indexOf(id)
    if (index > -1) {
      selectedItems.value.splice(index, 1)
    }
  }
}

// 方法：编辑笔记信息
const handleEditInfo = (note: Note) => {
  console.log('编辑笔记信息:', note.title)
  // 打开发布对话框并回显信息
  editingNote.value = note
  showPublishDialog.value = true
}

// 方法：编辑笔记内容
const handleNoteEdit = (note: Note) => {
  console.log('编辑笔记:', note.title)
  router.push(`/note/edit?id=${note.id}`)
}

// 方法:删除发布
const handleNoteUnpublish = (note: Note) => {
  ElMessageBox.confirm(
    `确认删除「${note.title}」的发布吗？`,
    '删除发布确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = noteList.findIndex(n => n.id === note.id)
    if (index > -1) {
      noteList.splice(index, 1)
      ElMessage.success('删除发布成功')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 方法：点击笔记
const handleNoteClick = (note: Note) => {
  console.log('点击笔记:', note.title)
  router.push(`/home/note/${note.id}`)
}

// 方法：批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(
    `确认删除选中的 ${selectedItems.value.length} 篇笔记吗？`,
    '批量删除',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    selectedItems.value.forEach(id => {
      const index = noteList.findIndex(n => n.id === id)
      if (index > -1) {
        noteList.splice(index, 1)
      }
    })
    selectedItems.value = []
    isSelectionMode.value = false
    ElMessage.success('删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}

// 处理发布笔记
const handlePublishNote = (publishData: any) => {
  if (editingNote.value) {
    // 编辑模式：更新现有笔记
    const note = noteList.find(n => n.id === editingNote.value!.id)
    if (note) {
      note.category = publishData.category
      note.tags = publishData.tags
      note.cover = publishData.cover || ''
      note.summary = publishData.summary
      note.updateTime = new Date()
      ElMessage.success('笔记信息更新成功')
    }
    editingNote.value = null
  } else {
    // 新建模式：创建新笔记
    const newNote: Note = {
      id: Date.now().toString(),
      title: publishData.title,
      summary: publishData.summary || '暂无摘要',
      status: 'pending',
      cover: publishData.cover || '',
      category: publishData.category,
      tags: publishData.tags,
      createTime: new Date(),
      updateTime: new Date()
    }
    
    noteList.unshift(newNote)
    ElMessage.success(`笔记「${publishData.title}」已提交发布，等待审核`)
  }
  
  showPublishDialog.value = false
}

// 监听路由变化
watch(() => route.query.status, (newStatus) => {
  if (!newStatus && route.path === '/creator/manage') {
    router.replace({ path: '/creator/manage', query: { status: 'all' } })
  }
}, { immediate: true })

// 监听选择模式变化,退出选择模式时清空选择
watch(() => isSelectionMode.value, (newValue) => {
  if (!newValue) {
    selectedItems.value = []
  }
})

// 监听对话框关闭,清空编辑笔记
watch(() => showPublishDialog.value, (newValue) => {
  if (!newValue) {
    editingNote.value = null
  }
})
</script>

<style scoped>
/* Element Plus Pagination 样式调整 */
:deep(.el-pagination) {
  --el-pagination-bg-color: var(--bg-primary);
  --el-pagination-text-color: var(--font-secondary);
  --el-pagination-hover-color: var(--theme-primary);
}
</style>