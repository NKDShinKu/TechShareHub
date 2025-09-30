<template>
  <div class="creator-manage bg-bg-tertiary min-h-screen py-6">
    <div class="max-w-6xl mx-auto px-6">
      <!-- 页面头部 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-font-primary mb-2">内容管理</h1>
        <p class="text-font-secondary">管理您发布的文章和笔记</p>
      </div>

      <!-- 状态筛选标签 -->
      <div class="mb-6">
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
      <div class="flex items-center justify-between mb-6 bg-bg-primary p-4 rounded-lg border border-border-primary">
        <div class="flex items-center gap-4">
          <!-- 搜索框 -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章或笔记..."
              class="w-64 pl-10 pr-4 py-2 bg-bg-secondary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
            >
            <i class="icon-[material-symbols--search] absolute left-3 top-1/2 transform -translate-y-1/2 text-font-tertiary text-lg"></i>
          </div>

          <!-- 排序选择 -->
          <Dropdown
            v-model="sortBy"
            :options="sortOptions"
            placeholder="排序方式"
            button-class="w-32"
            @change="handleSortChange"
          />
        </div>

        <div class="flex items-center gap-3">
          <!-- 批量操作 -->
          <button
            v-if="selectedItems.length > 0"
            @click="showBatchActions = !showBatchActions"
            class="px-4 py-2 bg-bg-secondary hover:bg-bg-tertiary text-font-secondary rounded-lg font-medium transition-colors"
          >
            批量操作 ({{ selectedItems.length }})
          </button>

          <!-- 新建按钮 -->
          <router-link
            to="/note"
            class="px-4 py-2 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-lg font-medium transition-colors flex items-center"
          >
            <i class="icon-[material-symbols--add] mr-2"></i>
            写笔记
          </router-link>
        </div>
      </div>

      <!-- 批量操作面板 -->
      <div 
        v-if="showBatchActions && selectedItems.length > 0"
        class="mb-4 p-4 bg-info-light border border-info rounded-lg"
      >
        <div class="flex items-center gap-3">
          <span class="text-sm text-info-text">已选择 {{ selectedItems.length }} 项</span>
          <div class="flex gap-2">
            <button
              @click="batchDelete"
              class="px-3 py-1 bg-danger hover:bg-danger-hover text-white text-sm rounded transition-colors"
            >
              删除
            </button>
            <button
              @click="batchPublish"
              class="px-3 py-1 bg-success hover:bg-success-hover text-white text-sm rounded transition-colors"
            >
              发布
            </button>
            <button
              @click="clearSelection"
              class="px-3 py-1 bg-font-tertiary hover:bg-font-secondary text-white text-sm rounded transition-colors"
            >
              取消选择
            </button>
          </div>
        </div>
      </div>

      <!-- 内容列表 -->
      <div class="bg-bg-primary rounded-lg border border-border-primary overflow-hidden">
        <div v-if="filteredContent.length === 0" class="text-center py-16">
          <div class="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="icon-[material-symbols--article-outline] text-3xl text-font-tertiary"></i>
          </div>
          <h3 class="text-lg font-medium text-font-primary mb-2">暂无内容</h3>
          <p class="text-font-secondary mb-6">开始创作您的第一篇文章或笔记吧</p>
          <router-link
            to="/note"
            class="inline-flex items-center px-4 py-2 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-lg font-medium transition-colors"
          >
            <i class="icon-[material-symbols--add] mr-2"></i>
            写笔记
          </router-link>
        </div>

        <div v-else>
          <ContentItem
            v-for="item in filteredContent"
            :key="item.id"
            :content="item"
            :selected="selectedItems.includes(item.id)"
            @select="handleContentSelect"
            @edit="handleContentEdit"
            @delete="handleContentDelete"
            @click="handleContentClick"
          />
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="filteredContent.length > 0" class="mt-6 flex items-center justify-between">
        <p class="text-sm text-font-tertiary">
          共 {{ totalCount }} 条记录，当前显示第 {{ currentPage }} 页
        </p>
        <div class="flex items-center gap-2">
          <button
            @click="currentPage > 1 && (currentPage -= 1)"
            :disabled="currentPage <= 1"
            :class="[
              'px-3 py-2 text-sm border rounded-lg transition-colors',
              currentPage <= 1
                ? 'bg-bg-secondary text-font-tertiary border-border-secondary cursor-not-allowed'
                : 'bg-bg-primary text-font-secondary border-border-primary hover:bg-bg-secondary'
            ]"
          >
            上一页
          </button>
          <span class="px-3 py-2 text-sm text-font-tertiary">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button
            @click="currentPage < totalPages && (currentPage += 1)"
            :disabled="currentPage >= totalPages"
            :class="[
              'px-3 py-2 text-sm border rounded-lg transition-colors',
              currentPage >= totalPages
                ? 'bg-bg-secondary text-font-tertiary border-border-secondary cursor-not-allowed'
                : 'bg-bg-primary text-font-secondary border-border-primary hover:bg-bg-secondary'
            ]"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'CreatorManagePage' })

import { computed, ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Dropdown from '../../../components/ui/Dropdown.vue'
import ContentItem from '../../../components/creator/ContentItem.vue'

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
  { label: '创建时间', value: 'createTime' },
  { label: '更新时间', value: 'updateTime' },
  { label: '浏览量', value: 'views' },
  { label: '点赞数', value: 'likes' }
]

// 搜索和排序
const searchQuery = ref('')
const sortBy = ref('createTime')

// 批量操作
const selectedItems = ref<string[]>([])
const showBatchActions = ref(false)

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 内容数据类型
interface ContentItem {
  id: string
  title: string
  summary: string
  type: 'article' | 'note'
  status: string
  cover: string
  views: number
  likes: number
  comments: number
  createTime: Date
  updateTime: Date
}

// 模拟内容数据
const contentList = reactive<ContentItem[]>([
  {
    id: '1',
    title: 'Vue 3 Composition API 深度解析',
    summary: '深入了解 Vue 3 Composition API 的使用方法和最佳实践，包括 reactive、ref、computed 等核心 API 的详细介绍...',
    type: 'article',
    status: 'published',
    cover: '',
    views: 15678,
    likes: 892,
    comments: 156,
    createTime: new Date('2024-01-15'),
    updateTime: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'TypeScript 类型系统最佳实践',
    summary: 'TypeScript 强大的类型系统能够帮助我们在开发阶段发现潜在问题，本文将介绍一些实用的类型定义技巧...',
    type: 'article',
    status: 'published',
    cover: '',
    views: 12345,
    likes: 678,
    comments: 89,
    createTime: new Date('2024-01-10'),
    updateTime: new Date('2024-01-15')
  },
  {
    id: '3',
    title: '前端性能优化笔记',
    summary: '记录一些前端性能优化的实用技巧，包括代码分割、懒加载、缓存策略等...',
    type: 'note',
    status: 'pending',
    cover: '',
    views: 8901,
    likes: 456,
    comments: 67,
    createTime: new Date('2024-01-08'),
    updateTime: new Date('2024-01-12')
  },
  {
    id: '4',
    title: 'React Hooks 使用心得',
    summary: '分享在项目中使用 React Hooks 的一些经验和踩坑记录...',
    type: 'note',
    status: 'rejected',
    cover: '',
    views: 5432,
    likes: 234,
    comments: 45,
    createTime: new Date('2024-01-05'),
    updateTime: new Date('2024-01-08')
  }
])

// 计算属性
const filteredContent = computed(() => {
  let filtered = contentList

  // 状态筛选
  if (currentStatus.value !== 'all') {
    filtered = filtered.filter(item => item.status === currentStatus.value)
  }

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query)
    )
  }

  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'createTime':
        return b.createTime.getTime() - a.createTime.getTime()
      case 'updateTime':
        return b.updateTime.getTime() - a.updateTime.getTime()
      case 'views':
        return b.views - a.views
      case 'likes':
        return b.likes - a.likes
      default:
        return 0
    }
  })

  return filtered
})

const totalCount = computed(() => filteredContent.value.length)
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

// 方法
const switchTab = (status: string) => {
  router.push({ path: '/creator/manage', query: { status } })
}

const handleSortChange = () => {
  // 排序改变时的处理逻辑
  console.log('排序方式改变:', sortBy.value)
}

// 内容操作方法
const handleContentSelect = (id: string, selected: boolean) => {
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

const handleContentEdit = (content: any) => {
  console.log('编辑内容:', content.title)
  // 根据类型跳转到不同的编辑页面
  if (content.type === 'note') {
    router.push(`/note/edit?id=${content.id}`)
  } else {
    router.push(`/note?edit=${content.id}`)
  }
}

const handleContentDelete = (content: any) => {
  if (confirm(`确认删除「${content.title}」吗？`)) {
    const index = contentList.findIndex(c => c.id === content.id)
    if (index > -1) {
      contentList.splice(index, 1)
    }
    console.log('删除内容:', content.title)
  }
}

const handleContentClick = (content: any) => {
  console.log('点击内容:', content.title)
  // 根据类型跳转到不同的详情页面
  if (content.type === 'note') {
    router.push(`/note/detail/${content.id}`)
  } else {
    router.push(`/detail/${content.id}`)
  }
}

const getStatusLabel = (status: string) => {
  const statusMap = {
    published: '已发布',
    pending: '审核中',
    rejected: '未通过',
    draft: '草稿'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getStatusStyle = (status: string) => {
  const styleMap = {
    published: 'bg-success-light text-success-text',
    pending: 'bg-warning-light text-warning-text',
    rejected: 'bg-danger-light text-danger-text',
    draft: 'bg-bg-secondary text-font-tertiary'
  }
  return styleMap[status as keyof typeof styleMap] || 'bg-bg-secondary text-font-tertiary'
}

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



// 批量操作
const batchDelete = () => {
  if (confirm(`确认删除选中的 ${selectedItems.value.length} 项内容吗？`)) {
    selectedItems.value.forEach(id => {
      const index = contentList.findIndex(c => c.id === id)
      if (index > -1) {
        contentList.splice(index, 1)
      }
    })
    selectedItems.value = []
    showBatchActions.value = false
  }
}

const batchPublish = () => {
  selectedItems.value.forEach(id => {
    const item = contentList.find(c => c.id === id)
    if (item) {
      item.status = 'published'
    }
  })
  selectedItems.value = []
  showBatchActions.value = false
  console.log('批量发布完成')
}

const clearSelection = () => {
  selectedItems.value = []
  showBatchActions.value = false
}

// 监听路由变化，如果没有status参数则默认设置为all
watch(() => route.query.status, (newStatus) => {
  if (!newStatus && route.path === '/creator/manage') {
    router.replace({ path: '/creator/manage', query: { status: 'all' } })
  }
}, { immediate: true })

// 监听选择变化，自动显示/隐藏批量操作
watch(() => selectedItems.value.length, (newLength) => {
  if (newLength === 0) {
    showBatchActions.value = false
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>