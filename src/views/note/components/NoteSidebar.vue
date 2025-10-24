<template>
  <div class="note-sidebar h-full bg-bg-primary border-r border-border-primary flex flex-col">
    <!-- 顶部操作栏 -->
    <div class="p-4 h-18 border-b border-border-primary">
      <button
        @click="showFolderDialog = true"
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
          <div class="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-secondary transition-colors">
            <div 
              class="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
              @click="toggleFolder(folder.id)"
            >
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
            
            <!-- 文件夹操作菜单 -->
            <div 
              v-if="folder.isDefault"
              class="opacity-0 group-hover:opacity-100 p-1 hover:bg-bg-tertiary rounded transition-all"
              title="默认文件夹不可操作"
            >
              <i class="icon-[material-symbols--lock-outline] text-font-tertiary text-sm"></i>
            </div>
            <el-dropdown 
              v-else
              trigger="click"
              placement="bottom-end"
              @command="(cmd: string) => handleFolderCommand(cmd, folder)"
              class="opacity-0 group-hover:opacity-100"
            >
              <button 
                @click.stop
                class="p-1 hover:bg-bg-tertiary rounded transition-all"
                title="更多操作"
              >
                <i class="icon-[material-symbols--more-vert] text-font-secondary text-base"></i>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">
                    <i class="icon-[material-symbols--edit-outline] mr-2"></i>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" class="el-dropdown-menu__item--danger">
                    <i class="icon-[material-symbols--delete-outline] mr-2"></i>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
                :class="[
                  'group flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
                  selectedNoteId === note.id
                    ? 'bg-theme-primary-10 text-theme-primary'
                    : 'hover:bg-bg-secondary text-font-secondary'
                ]"
              >
                <div 
                  class="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                  @click="selectNote(note)"
                >
                  <i class="icon-[material-symbols--sticky-note-2-outline] text-sm flex-shrink-0"></i>
                  <span class="text-sm truncate">{{ note.title || '无标题笔记' }}</span>
                </div>
                
                <!-- 笔记操作菜单 -->
                <el-dropdown 
                  trigger="click"
                  placement="bottom-end"
                  @command="(cmd: string) => handleNoteCommand(cmd, folder.id, note)"
                  class="opacity-0 group-hover:opacity-100"
                >
                  <button 
                    @click.stop
                    class="p-1 hover:bg-bg-tertiary rounded transition-all"
                    title="更多操作"
                  >
                    <i class="icon-[material-symbols--more-vert] text-font-secondary text-xs"></i>
                  </button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="move">
                        <i class="icon-[material-symbols--drive-file-move-outline] mr-2"></i>
                        移动
                      </el-dropdown-item>
                      <el-dropdown-item command="delete" class="el-dropdown-menu__item--danger">
                        <i class="icon-[material-symbols--delete-outline] mr-2"></i>
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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

    <!-- 新建/编辑文件夹弹窗 -->
    <el-dialog
      v-model="showFolderDialog"
      :title="editingFolder ? '编辑文件夹' : '新建文件夹'"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="folderFormName"
        placeholder="请输入文件夹名称"
        maxlength="50"
        show-word-limit
        @keyup.enter="confirmFolderDialog"
      />
      <template #footer>
        <el-button @click="showFolderDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="confirmFolderDialog"
          :disabled="!folderFormName.trim()"
        >
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 移动笔记弹窗 -->
    <el-dialog
      v-model="showMoveNoteDialog"
      title="移动笔记"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="mb-4">
        <p class="text-sm text-font-secondary mb-3">
          将笔记 <span class="font-medium text-font-primary">{{ movingNote?.title || '无标题笔记' }}</span> 移动到：
        </p>
        <el-select
          v-model="targetFolderId"
          placeholder="请选择目标文件夹"
          class="w-full"
        >
          <el-option
            v-for="folder in availableFolders"
            :key="folder.id"
            :label="folder.name"
            :value="folder.id"
            :disabled="folder.id === movingNote?.folderId"
          >
            <div class="flex items-center gap-2">
              <i :class="[
                folder.isDefault 
                  ? 'icon-[material-symbols--folder-special-outline]' 
                  : 'icon-[material-symbols--folder-outline]'
              ]"></i>
              <span>{{ folder.name }}</span>
              <span v-if="folder.id === movingNote?.folderId" class="text-xs text-font-tertiary ml-auto">(当前)</span>
            </div>
          </el-option>
        </el-select>
      </div>
      <template #footer>
        <el-button @click="showMoveNoteDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="confirmMoveNote"
          :disabled="!targetFolderId || targetFolderId === movingNote?.folderId"
        >
          移动
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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
  (e: 'edit-folder', folderId: string, newName: string): void
  (e: 'add-note', folderId: string): void
  (e: 'delete-note', folderId: string, noteId: string): void
  (e: 'move-note', noteId: string, fromFolderId: string, toFolderId: string): void
  (e: 'select-note', note: Note): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const expandedFolders = ref<string[]>(['default']) // 默认展开默认文件夹

// 文件夹弹窗相关
const showFolderDialog = ref(false)
const folderFormName = ref('')
const editingFolder = ref<Folder | null>(null)

// 移动笔记相关
const showMoveNoteDialog = ref(false)
const movingNote = ref<Note | null>(null)
const movingFromFolderId = ref('')
const targetFolderId = ref('')

// 可用的文件夹列表（用于移动笔记）
const availableFolders = computed(() => props.folders)

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

// 文件夹操作命令处理
const handleFolderCommand = (command: string, folder: Folder) => {
  if (command === 'edit') {
    editingFolder.value = folder
    folderFormName.value = folder.name
    showFolderDialog.value = true
  } else if (command === 'delete') {
    deleteFolder(folder)
  }
}

// 删除文件夹
const deleteFolder = (folder: Folder) => {
  if (folder.notes.length > 0) {
    ElMessageBox.confirm(
      `文件夹"${folder.name}"中还有 ${folder.notes.length} 个笔记，删除后笔记将一并删除，是否继续？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      emit('delete-folder', folder.id)
      ElMessage.success('删除成功')
    }).catch(() => {
      // 取消删除
    })
  } else {
    ElMessageBox.confirm(
      `确定要删除文件夹"${folder.name}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      emit('delete-folder', folder.id)
      ElMessage.success('删除成功')
    }).catch(() => {
      // 取消删除
    })
  }
}

// 笔记操作命令处理
const handleNoteCommand = (command: string, folderId: string, note: Note) => {
  if (command === 'move') {
    movingNote.value = note
    movingFromFolderId.value = folderId
    targetFolderId.value = ''
    showMoveNoteDialog.value = true
  } else if (command === 'delete') {
    deleteNote(folderId, note)
  }
}

// 删除笔记
const deleteNote = (folderId: string, note: Note) => {
  ElMessageBox.confirm(
    `确定要删除笔记"${note.title || '无标题笔记'}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    emit('delete-note', folderId, note.id)
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 确认文件夹弹窗
const confirmFolderDialog = () => {
  if (!folderFormName.value.trim()) {
    ElMessage.warning('请输入文件夹名称')
    return
  }

  if (editingFolder.value) {
    // 编辑模式
    emit('edit-folder', editingFolder.value.id, folderFormName.value.trim())
    ElMessage.success('编辑成功')
  } else {
    // 新建模式
    emit('add-folder', folderFormName.value.trim())
    ElMessage.success('创建成功')
  }

  showFolderDialog.value = false
  folderFormName.value = ''
  editingFolder.value = null
}

// 确认移动笔记
const confirmMoveNote = () => {
  if (!movingNote.value || !targetFolderId.value) return

  emit('move-note', movingNote.value.id, movingNote.value.folderId, targetFolderId.value)
  
  ElMessage.success('移动成功')
  showMoveNoteDialog.value = false
  movingNote.value = null
  targetFolderId.value = ''
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