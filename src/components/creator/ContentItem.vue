<template>
  <div 
    class="content-item p-6 hover:bg-bg-secondary transition-colors cursor-pointer border-b border-border-primary last:border-b-0"
    @click="handleItemClick"
  >
    <div class="flex items-start gap-4">
      <!-- 选择框 -->
      <input
        type="checkbox"
        :checked="isSelected"
        @click.stop
        @change="handleSelect"
        class="mt-1 h-4 w-4 text-theme-primary border-border-primary rounded focus:ring-theme-primary"
      >

      <!-- 封面图 -->
      <div class="w-20 h-14 bg-bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
        <img
          v-if="content.cover"
          :src="content.cover"
          :alt="content.title"
          class="w-full h-full object-cover"
        >
        <div v-else class="w-full h-full flex items-center justify-center">
          <i :class="[
            content.type === 'article' 
              ? 'icon-[material-symbols--article-outline]' 
              : 'icon-[material-symbols--sticky-note-2-outline]',
            'text-font-tertiary text-xl'
          ]"></i>
        </div>
      </div>

      <!-- 内容信息 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-2">
          <h3 class="text-lg font-medium text-font-primary truncate pr-4">{{ content.title }}</h3>
          <div class="flex items-center gap-2 flex-shrink-0">
            <!-- 状态标签 -->
            <span :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              getStatusStyle(content.status)
            ]">
              {{ getStatusLabel(content.status) }}
            </span>
            <!-- 类型标签 -->
            <span :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              content.type === 'article' 
                ? 'bg-info-light text-info-text' 
                : 'bg-success-light text-success-text'
            ]">
              {{ content.type === 'article' ? '文章' : '笔记' }}
            </span>
          </div>
        </div>

        <p class="text-font-secondary text-sm mb-3 line-clamp-2">{{ content.summary }}</p>

        <!-- 统计信息 -->
        <div class="flex items-center gap-6 text-sm text-font-tertiary mb-3">
          <span class="flex items-center">
            <i class="icon-[material-symbols--visibility] mr-1"></i>
            {{ content.views.toLocaleString() }}
          </span>
          <span class="flex items-center">
            <i class="icon-[material-symbols--favorite] mr-1"></i>
            {{ content.likes.toLocaleString() }}
          </span>
          <span class="flex items-center">
            <i class="icon-[material-symbols--comment] mr-1"></i>
            {{ content.comments.toLocaleString() }}
          </span>
          <span class="flex items-center">
            <i class="icon-[material-symbols--schedule] mr-1"></i>
            {{ formatDate(content.updateTime) }}
          </span>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center gap-2">
          <button
            @click.stop="handleEdit"
            class="px-3 py-1 text-theme-primary hover:bg-theme-primary-10 hover:text-theme-primary text-sm rounded transition-colors"
          >
            编辑
          </button>
          <button
            @click.stop="handleDelete"
            class="px-3 py-1 text-danger hover:bg-danger-light hover:text-danger-text text-sm rounded transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Content {
  id: string
  title: string
  summary: string
  type: 'article' | 'note'
  status: string
  cover?: string
  views: number
  likes: number
  comments: number
  createTime: Date
  updateTime: Date
}

interface Props {
  content: Content
  selected?: boolean
}

interface Emits {
  (e: 'select', id: string, selected: boolean): void
  (e: 'edit', content: Content): void
  (e: 'delete', content: Content): void
  (e: 'click', content: Content): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isSelected = computed(() => props.selected)

const handleSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('select', props.content.id, target.checked)
}

const handleEdit = () => {
  emit('edit', props.content)
}

const handleDelete = () => {
  emit('delete', props.content)
}

const handleItemClick = () => {
  emit('click', props.content)
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