<template>
  <div class="note-sidebar h-full bg-bg-primary border-r border-border-primary flex flex-col">
    <!-- 顶部操作栏 -->
    <div class="p-4 h-18 border-b border-border-primary">
      <button
        @click="showAddFolderModal = true"
        class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-lg transition-colors"
      >
        <i class="icon-[material-symbols--create-new-folder-outline]"></i>
        <span>新建文件夹</span>
      </button>
    </div>

    <!-- 文件夹和笔记列表 -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-2">
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="mb-2"
        >
          <!-- 文件夹标题 -->
          <div
            class="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-secondary cursor-pointer transition-colors"
            @click="toggleFolder(folder.id)"
          >
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <i :class="[
                'text-lg flex-shrink-0 transition-transform',
                expandedFolders.includes(folder.id) ? 'rotate-90' : '',
                'icon-[material-symbols--keyboard-arrow-right]'
              ]"></i>
              <i :class="[
                'text-lg flex-shrink-0',
                folder.isDefault ? 'icon-[material-symbols--folder-special-outline]' : 'icon-[material-symbols--folder-outline]',
                'text-theme-primary'
              ]"></i>
              <span class="text-sm font-medium text-font-primary truncate">{{ folder.name }}</span>
              <span class="text-xs text-font-tertiary">({{ folder.notes.length }})</span>
            </div>
            
            <button
              v-if="folder.isDefault"
              class="opacity-0 group-hover:opacity-100 p-1 hover:bg-bg-tertiary rounded transition-all"
              @click.stop
              title="默认文件夹不可删除"
            >
              <i class="icon-[material-symbols--lock-outline] text-font-tertiary text-sm"></i>
            </button>
            <button
              v-else
              @click.stop="deleteFolder(folder.id)"
              class="opacity-0 group-hover:opacity-100 p-1 hover:bg-danger-light rounded transition-all"
              title="删除文件夹"
            >
              <i class="icon-[material-symbols--delete-outline] text-danger text-sm"></i>
            </button>
          </div>

          <!-- 笔记列表 -->
          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 -translate-y-1"
            enter-to-class="transform opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="transform opacity-100 translate-y-0"
            leave-to-class="transform opacity-0 -translate-y-1"
          >
            <div
              v-if="expandedFolders.includes(folder.id)"
              class="ml-6 mt-1 space-y-1"
            >
              <div
                v-for="note in folder.notes"
                :key="note.id"
                @click="selectNote(note)"
                :class="[
                  'group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors',
                  selectedNoteId === note.id
                    ? 'bg-theme-primary-10 text-theme-primary'
                    : 'hover:bg-bg-secondary text-font-secondary'
                ]"
              >
                <div class="flex items-center gap-2 flex-1 min-w-0">
                  <i class="icon-[material-symbols--sticky-note-2-outline] text-sm flex-shrink-0"></i>
                  <span class="text-sm truncate">{{ note.title || '无标题笔记' }}</span>
                </div>
                
                <button
                  @click.stop="deleteNote(folder.id, note.id)"
                  class="opacity-0 group-hover:opacity-100 p-1 hover:bg-danger-light rounded transition-all"
                  title="删除笔记"
                >
                  <i class="icon-[material-symbols--close] text-danger text-xs"></i>
                </button>
              </div>

              <!-- 添加笔记按钮 -->
              <button
                @click="addNote(folder.id)"
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-font-tertiary hover:text-theme-primary hover:bg-bg-secondary rounded-lg transition-colors"
              >
                <i class="icon-[material-symbols--add] text-sm"></i>
                <span>新建笔记</span>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 新建文件夹弹窗 -->
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
          v-if="showAddFolderModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-font-primary/50 backdrop-blur-sm"
          @click.self="showAddFolderModal = false"
        >
          <div class="bg-bg-primary rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 class="text-lg font-semibold text-font-primary mb-4">新建文件夹</h3>
            <input
              v-model="newFolderName"
              type="text"
              placeholder="请输入文件夹名称"
              class="w-full px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary mb-4"
              @keyup.enter="confirmAddFolder"
            >
            <div class="flex items-center justify-end gap-3">
              <button
                @click="showAddFolderModal = false"
                class="px-4 py-2 bg-bg-secondary hover:bg-bg-tertiary text-font-secondary rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                @click="confirmAddFolder"
                :disabled="!newFolderName.trim()"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  newFolderName.trim()
                    ? 'bg-theme-primary hover:bg-theme-primary-hover text-white'
                    : 'bg-bg-tertiary text-font-tertiary cursor-not-allowed'
                ]"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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

interface Props {
  folders: Folder[]
  selectedNoteId?: string
}

interface Emits {
  (e: 'add-folder', name: string): void
  (e: 'delete-folder', folderId: string): void
  (e: 'add-note', folderId: string): void
  (e: 'delete-note', folderId: string, noteId: string): void
  (e: 'select-note', note: Note): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const expandedFolders = ref<string[]>(['default']) // 默认展开默认文件夹
const showAddFolderModal = ref(false)
const newFolderName = ref('')

const toggleFolder = (folderId: string) => {
  const index = expandedFolders.value.indexOf(folderId)
  if (index > -1) {
    expandedFolders.value.splice(index, 1)
  } else {
    expandedFolders.value.push(folderId)
  }
}

const selectNote = (note: Note) => {
  emit('select-note', note)
}

const addNote = (folderId: string) => {
  emit('add-note', folderId)
}

const deleteNote = (folderId: string, noteId: string) => {
  if (confirm('确定要删除这个笔记吗？')) {
    emit('delete-note', folderId, noteId)
  }
}

const deleteFolder = (folderId: string) => {
  const folder = props.folders.find(f => f.id === folderId)
  if (!folder) return
  
  if (folder.notes.length > 0) {
    if (!confirm(`文件夹"${folder.name}"中还有 ${folder.notes.length} 个笔记，确定要删除吗？笔记将一并删除。`)) {
      return
    }
  }
  
  emit('delete-folder', folderId)
}

const confirmAddFolder = () => {
  if (newFolderName.value.trim()) {
    emit('add-folder', newFolderName.value.trim())
    newFolderName.value = ''
    showAddFolderModal.value = false
  }
}
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