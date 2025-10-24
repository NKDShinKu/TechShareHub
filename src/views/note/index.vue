<template>
  <div class="note-page mt-2 h-[calc(100vh-6rem)] flex overflow-hidden bg-bg-tertiary">
    <!-- 左侧边栏 -->
    <div class="w-64 flex-shrink-0">
      <NoteSidebar
        :folders="folders"
        :selected-note-id="selectedNote?.id"
        @add-folder="handleAddFolder"
        @edit-folder="handleEditFolder"
        @delete-folder="handleDeleteFolder"
        @add-note="handleAddNote"
        @delete-note="handleDeleteNote"
        @move-note="handleMoveNote"
        @select-note="handleSelectNote"
      />
    </div>

    <!-- 右侧内容区域 -->
    <div class="flex-1 min-w-0">
      <!-- 欢迎页 -->
      <NoteWelcome v-if="!selectedNote" />
      
      <!-- 编辑器 -->
      <NoteEditor
        v-else
        :note="selectedNote"
        @save="handleSaveNote"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'NotePage' })

import { ref, reactive } from 'vue'
import NoteSidebar from './components/NoteSidebar.vue'
import NoteWelcome from './components/NoteWelcome.vue'
import NoteEditor from './components/NoteEditor.vue'

interface Note {
  id: string
  title: string
  content: string
  folderId: string
  createdAt: Date
  updatedAt: Date
}

interface Folder {
  id: string
  name: string
  isDefault: boolean
  notes: Note[]
}

// 文件夹数据
const folders = reactive<Folder[]>([
  {
    id: 'default',
    name: '默认文件夹',
    isDefault: true,
    notes: [
      {
        id: 'note1',
        title: 'Vue 3 学习笔记',
        content: '# Vue 3 学习笔记\n\n## 响应式系统\n\nVue 3 使用 Proxy 实现响应式...',
        folderId: 'default',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 'note2',
        title: 'TypeScript 基础',
        content: '# TypeScript 基础\n\n## 类型系统\n\nTypeScript 是 JavaScript 的超集...',
        folderId: 'default',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18')
      }
    ]
  }
])

const selectedNote = ref<Note | null>(null)

// 生成唯一 ID
const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 添加文件夹
const handleAddFolder = (name: string) => {
  const newFolder: Folder = {
    id: generateId(),
    name,
    isDefault: false,
    notes: []
  }
  folders.push(newFolder)
}

// 编辑文件夹
const handleEditFolder = (folderId: string, newName: string) => {
  const folder = folders.find(f => f.id === folderId)
  if (folder) {
    folder.name = newName
  }
}

// 删除文件夹
const handleDeleteFolder = (folderId: string) => {
  const index = folders.findIndex(f => f.id === folderId)
  if (index > -1) {
    // 如果删除的文件夹包含当前选中的笔记，清空选中状态
    if (selectedNote.value && selectedNote.value.folderId === folderId) {
      selectedNote.value = null
    }
    folders.splice(index, 1)
  }
}

// 添加笔记
const handleAddNote = (folderId: string) => {
  const folder = folders.find(f => f.id === folderId)
  if (!folder) return
  
  const newNote: Note = {
    id: generateId(),
    title: '无标题笔记',
    content: '# 无标题笔记\n\n开始编写你的内容...',
    folderId,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  folder.notes.unshift(newNote)
  selectedNote.value = newNote
}

// 删除笔记
const handleDeleteNote = (folderId: string, noteId: string) => {
  const folder = folders.find(f => f.id === folderId)
  if (!folder) return
  
  const index = folder.notes.findIndex(n => n.id === noteId)
  if (index > -1) {
    // 如果删除的是当前选中的笔记，清空选中状态
    if (selectedNote.value && selectedNote.value.id === noteId) {
      selectedNote.value = null
    }
    folder.notes.splice(index, 1)
  }
}

// 移动笔记
const handleMoveNote = (noteId: string, fromFolderId: string, toFolderId: string) => {
  const fromFolder = folders.find(f => f.id === fromFolderId)
  const toFolder = folders.find(f => f.id === toFolderId)
  
  if (!fromFolder || !toFolder) return
  
  const noteIndex = fromFolder.notes.findIndex(n => n.id === noteId)
  if (noteIndex === -1) return
  
  const note = fromFolder.notes[noteIndex]
  
  // 从原文件夹删除
  fromFolder.notes.splice(noteIndex, 1)
  
  // 添加到目标文件夹
  note.folderId = toFolderId
  toFolder.notes.push(note)
  
  // 如果是当前选中的笔记，更新 folderId
  if (selectedNote.value && selectedNote.value.id === noteId) {
    selectedNote.value.folderId = toFolderId
  }
}

// 选择笔记
const handleSelectNote = (note: Note) => {
  selectedNote.value = note
}

// 保存笔记
const handleSaveNote = (data: { title: string; content: string }) => {
  if (!selectedNote.value) return
  
  const folder = folders.find(f => f.id === selectedNote.value!.folderId)
  if (!folder) return
  
  const note = folder.notes.find(n => n.id === selectedNote.value!.id)
  if (!note) return
  
  note.title = data.title
  note.content = data.content
  note.updatedAt = new Date()
  
  // 更新选中的笔记对象
  selectedNote.value = { ...note }
}
</script>

<style scoped>
/* .note-page {
  height: 90vh;
} */
</style>