<template>
  <div class="note-editor h-full flex flex-col bg-bg-primary">
    <!-- 编辑器头部 -->
    <div class="editor-header h-18 px-6 py-4 border-b border-border-primary flex items-center justify-between">
      <div class="flex items-center gap-4 flex-1 min-w-0">
        <input
          v-model="noteTitle"
          type="text"
          placeholder="请输入笔记标题..."
          class="text-xl font-semibold bg-transparent border-none outline-none text-font-primary placeholder-font-tertiary flex-1 min-w-0"
          @input="handleTitleChange"
        >
      </div>
      
      <div class="flex items-center gap-3">
        <!-- 保存状态 -->
        <div class="flex items-center gap-2 text-sm">
          <div v-if="isSaving" class="flex items-center gap-2 text-font-tertiary">
            <div class="w-3 h-3 border-2 border-theme-primary border-r-transparent rounded-full animate-spin"></div>
            <span>保存中...</span>
          </div>
          <div v-else-if="lastSavedTime" class="text-font-tertiary">
            <span>{{ lastSavedTime }}</span>
          </div>
        </div>

        <!-- 保存按钮 -->
        <button
          @click="() => handleSave(false)"
          :disabled="isSaving || !hasChanges"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
            hasChanges && !isSaving
              ? 'bg-theme-primary hover:bg-theme-primary-hover text-white'
              : 'bg-bg-tertiary text-font-tertiary cursor-not-allowed'
          ]"
        >
          <i class="icon-[material-symbols--save-outline]"></i>
          <span>保存</span>
        </button>
      </div>
    </div>

    <!-- ByteMD 编辑器 -->
    <div class="editor-body flex-1 overflow-hidden">
      <div class="h-full bytemd-container">
        <Editor
          :value="noteContent"
          :plugins="plugins"
          :locale="zhHans"
          @change="handleContentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
// @ts-ignore
import { Editor } from '@bytemd/vue-next'

// 导入所有 ByteMD 官方插件
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import frontmatter from '@bytemd/plugin-frontmatter'
import breaks from '@bytemd/plugin-breaks'
import gemoji from '@bytemd/plugin-gemoji'
import math from '@bytemd/plugin-math'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import mermaid from '@bytemd/plugin-mermaid'

// @ts-ignore
import zhHans from 'bytemd/locales/zh_Hans.json'

// 导入 ByteMD 和插件样式
import 'bytemd/dist/index.css'
import 'juejin-markdown-themes/dist/github.min.css'//掘金样式
import 'highlight.js/styles/github.min.css'

interface Note {
  id: string
  title: string
  content: string
  folderId: string
  createdAt: Date
  updatedAt: Date
}

interface Props {
  note: Note
}

interface Emits {
  (e: 'save', data: { title: string; content: string }): void
  (e: 'update:note', note: Note): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const noteTitle = ref('')
const noteContent = ref('')
const isSaving = ref(false)
const lastSavedTime = ref('')
const hasChanges = ref(false)

// ByteMD 插件配置 - 包含所有官方插件
const plugins = [
  // GFM 支持（GitHub Flavored Markdown）
  gfm(),
  
  // 代码高亮
  highlight(),
  
  // Front Matter 支持
  frontmatter(),
  
  // 自动换行支持
  breaks(),
  
  // GitHub Emoji 支持 :smile:
  gemoji(),
  
  // 数学公式支持（KaTeX）
  math({
    katexOptions: {
      throwOnError: false,
      strict: false
    }
  }),
  
  // 图片点击放大
  mediumZoom(),
  
  // Mermaid 图表支持
  mermaid()
]

let autoSaveTimer: number | null = null

// 初始化笔记内容
const initNote = () => {
  noteTitle.value = props.note.title
  noteContent.value = props.note.content
  hasChanges.value = false
}

// 标题变化
const handleTitleChange = () => {
  hasChanges.value = true
  scheduleAutoSave()
}

// 内容变化
const handleContentChange = (value: string) => {
  noteContent.value = value
  hasChanges.value = true
  scheduleAutoSave()
}

// 计划自动保存
const scheduleAutoSave = () => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  
  autoSaveTimer = window.setTimeout(() => {
    handleSave(true)
  }, 3000) // 3秒后自动保存
}

// 保存笔记
const handleSave = async (isAutoSave = false) => {
  if (isSaving.value || !hasChanges.value) return
  
  isSaving.value = true
  
  try {
    // 模拟保存延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    emit('save', {
      title: noteTitle.value || '无标题笔记',
      content: noteContent.value
    })
    
    hasChanges.value = false
    
    // 更新保存时间
    const now = new Date()
    lastSavedTime.value = `已保存 ${now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
    
    if (!isAutoSave) {
      // 手动保存提示
      console.log('笔记保存成功')
    }
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败，请重试')
  } finally {
    isSaving.value = false
  }
}

// 键盘快捷键：Ctrl+S / Cmd+S 保存
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    handleSave()
  }
}

// 监听笔记变化
watch(() => props.note, (newNote) => {
  if (newNote) {
    initNote()
  }
}, { immediate: true })

// 页面离开前提醒
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (hasChanges.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style scoped>
.bytemd-container {
  height: 100%;
}

/* ByteMD 编辑器样式覆盖 */
:deep(.bytemd) {
  height: calc(100vh - 10.5rem);
  border: none;
}
</style>