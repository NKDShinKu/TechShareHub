<script setup lang="ts">
defineOptions({ name: 'NoteList' })

import NoteItem from './NoteItem.vue'

interface Note {
  id: string
  title: string
  summary: string
  author: string
  cover?: string
  category: string
  likes: number
  comments: number
  views: number
  publishTime: string
  tags: string[]
}

interface NoteListProps {
  notes: Note[]
  loading?: boolean
  emptyText?: string
  emptyIcon?: string
}

defineProps<NoteListProps>()

const emit = defineEmits<{
  noteClick: [noteId: string]
}>()

const handleNoteClick = (noteId: string) => {
  emit('noteClick', noteId)
}
</script>

<template>
  <div class="note-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12 text-font-tertiary">
      <i class="i-heroicons-arrow-path w-8 h-8 mx-auto mb-4 animate-spin"></i>
      <p>加载中...</p>
    </div>
    
    <!-- 空状态 -->
    <div
      v-else-if="notes.length === 0"
      class="text-center py-12 text-font-tertiary"
    >
      <i :class="[emptyIcon || 'i-heroicons-document-text', 'w-12 h-12 mx-auto mb-4 text-border-secondary']"></i>
      <p>{{ emptyText || '暂无相关文章' }}</p>
    </div>
    
    <!-- 笔记列表 -->
    <template v-else>
      <NoteItem
        v-for="note in notes"
        :key="note.id"
        v-bind="note"
        @click="handleNoteClick"
      />
    </template>
  </div>
</template>