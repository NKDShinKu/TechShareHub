<template>
  <div 
    class="note-item p-4 hover:bg-bg-secondary transition-colors cursor-pointer border-b border-border-primary last:border-b-0"
    @click="handleItemClick"
  >
    <div class="flex items-start gap-4">
      <!-- 选择框（可选显示） -->
      <input
        v-if="showCheckbox"
        type="checkbox"
        :checked="isSelected"
        @click.stop
        @change="handleSelect"
        class="mt-1 h-4 w-4 text-theme-primary border-border-primary rounded focus:ring-theme-primary"
      >

      <!-- 封面图 -->
      <div class="w-32 h-20 bg-bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
        <img
          v-if="note.cover"
          :src="note.cover"
          :alt="note.title"
          class="w-full h-full object-cover"
        >
        <div v-else class="w-full h-full flex items-center justify-center">
          <i class="icon-[material-symbols--sticky-note-2-outline] text-font-tertiary text-2xl"></i>
        </div>
      </div>

      <!-- 内容信息 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 min-w-0 pr-4">
            <h3 class="text-base font-medium text-font-primary truncate mb-1">{{ note.title }}</h3>
            <p class="text-font-tertiary text-sm line-clamp-2">{{ note.summary }}</p>
          </div>
          
          <div class="flex items-center gap-3 flex-shrink-0">
            <!-- 状态标签 -->
            <span :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              getStatusStyle(note.status)
            ]">
              {{ getStatusLabel(note.status) }}
            </span>

            <!-- 更多操作 -->
            <el-dropdown trigger="click" @command="handleCommand">
              <button
                @click.stop
                class="p-1 hover:bg-bg-tertiary rounded transition-colors text-font-secondary hover:text-font-primary"
              >
                <i class="icon-[material-symbols--more-vert] text-lg"></i>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="editInfo">
                    <i class="icon-[material-symbols--info-outline] mr-2"></i>
                    编辑信息
                  </el-dropdown-item>
                  <el-dropdown-item command="editNote">
                    <i class="icon-[material-symbols--edit-outline] mr-2"></i>
                    编辑笔记
                  </el-dropdown-item>
                  <el-dropdown-item command="unpublish" class="text-danger">
                    <i class="icon-[material-symbols--delete-outline] mr-2"></i>
                    删除发布
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <!-- 时间信息 -->
        <div class="flex items-center text-xs text-font-tertiary">
          <i class="icon-[material-symbols--schedule] mr-1"></i>
          {{ formatDate(note.updateTime) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Note {
  id: string
  title: string
  summary: string
  status: string
  cover?: string
  createTime: Date
  updateTime: Date
}

interface Props {
  note: Note
  selected?: boolean
  showCheckbox?: boolean
}

interface Emits {
  (e: 'select', id: string, selected: boolean): void
  (e: 'editInfo', note: Note): void
  (e: 'editNote', note: Note): void
  (e: 'unpublish', note: Note): void
  (e: 'click', note: Note): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isSelected = computed(() => props.selected)

const handleSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('select', props.note.id, target.checked)
}

const handleCommand = (command: string) => {
  if (command === 'editInfo') {
    emit('editInfo', props.note)
  } else if (command === 'editNote') {
    emit('editNote', props.note)
  } else if (command === 'unpublish') {
    emit('unpublish', props.note)
  }
}

const handleItemClick = () => {
  emit('click', props.note)
}

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    published: '已发布',
    pending: '审核中',
    rejected: '未通过',
    draft: '草稿'
  }
  return statusMap[status] || status
}

const getStatusStyle = (status: string) => {
  const styleMap: Record<string, string> = {
    published: 'bg-success-light text-success-text',
    pending: 'bg-warning-light text-warning-text',
    rejected: 'bg-danger-light text-danger-text',
    draft: 'bg-bg-secondary text-font-tertiary'
  }
  return styleMap[status] || 'bg-bg-secondary text-font-tertiary'
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
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
