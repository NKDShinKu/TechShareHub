<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEditMode ? '编辑笔记信息' : '发布笔记'"
    width="650px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      class="publish-form"
    >
      <!-- 选择笔记 -->
      <el-form-item label="选择笔记" prop="noteId">
        <el-tree-select
          v-model="formData.noteId"
          :data="folderTree"
          placeholder="请选择要发布的笔记"
          filterable
          check-strictly
          :render-after-expand="false"
          class="w-full"
          @change="handleNoteChange"
        >
          <template #default="{ data }">
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-2">
                <i v-if="data.type === 'folder'" class="icon-[material-symbols--folder] text-theme-primary"></i>
                <i v-else class="icon-[material-symbols--sticky-note-2-outline] text-font-tertiary"></i>
                <span>{{ data.label }}</span>
              </div>
              <span v-if="data.updateTime" class="text-xs text-font-tertiary ml-2">
                {{ formatDate(data.updateTime) }}
              </span>
            </div>
          </template>
        </el-tree-select>
      </el-form-item>

      <!-- 分类 -->
      <el-form-item label="分类" prop="category">
        <el-select
          v-model="formData.category"
          placeholder="请选择分类"
          class="w-full"
        >
          <el-option
            v-for="category in categories"
            :key="category.value"
            :label="category.label"
            :value="category.value"
          />
        </el-select>
      </el-form-item>

      <!-- 标签 -->
      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="formData.tags"
          multiple
          :multiple-limit="2"
          placeholder="请选择标签(最多2个)"
          class="w-full"
        >
          <el-option
            v-for="tag in tags"
            :key="tag.value"
            :label="tag.label"
            :value="tag.value"
          />
        </el-select>
      </el-form-item>

      <!-- 封面图 -->
      <el-form-item label="封面图" prop="cover">
        <div class="w-full">
          <div v-if="formData.cover" class="mb-3">
            <div class="relative w-40 h-40 rounded-lg overflow-hidden border border-border-primary">
              <img :src="formData.cover" alt="封面预览" class="w-full h-full object-cover">
              <button
                @click="removeCover"
                type="button"
                class="absolute top-1 right-1 text-white rounded-full transition-colors"
              >
                <i class="icon-[material-symbols--close] text-lg text-danger cursor-pointer"></i>
              </button>
            </div>
          </div>
          <el-input
            v-model="formData.cover"
            placeholder="请输入封面图片URL"
          >
            <template #append>
              <el-button @click="triggerUpload">
                <i class="icon-[material-symbols--upload] mr-1"></i>
                上传
              </el-button>
            </template>
          </el-input>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileUpload"
          >
        </div>
      </el-form-item>

      <!-- 摘要 -->
      <el-form-item label="摘要" prop="summary">
        <el-input
          v-model="formData.summary"
          type="textarea"
          :rows="3"
          placeholder="请输入笔记摘要..."
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button 
          type="primary" 
          :loading="isLoading"
          @click="handleConfirm"
        >
          确认发布
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { type FormInstance, type FormRules, ElMessage } from 'element-plus'

interface Note {
  id: string
  title: string
  summary?: string
  updateTime: Date
  folderId?: string
}

interface TreeNode {
  value: string
  label: string
  type: 'folder' | 'note'
  updateTime?: Date
  children?: TreeNode[]
}

interface Props {
  modelValue: boolean
  editData?: {
    id: string
    title: string
    category: string
    tags: string[]
    cover?: string
    summary: string
  }
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 编辑模式
const isEditMode = computed(() => !!props.editData)

// 表单引用
const formRef = ref<FormInstance>()
const fileInputRef = ref<HTMLInputElement>()

// 加载状态
const isLoading = ref(false)

// 对话框可见性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 表单数据
const formData = reactive({
  noteId: '',
  category: '',
  tags: [] as string[],
  cover: '',
  summary: ''
})

// 表单验证规则
const rules: FormRules = {
  noteId: [
    { required: true, message: '请选择笔记', trigger: 'change' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  tags: [
    { required: true, type: 'array', min: 1, message: '请至少选择一个标签', trigger: 'change' }
  ]
}

// 模拟笔记数据（带文件夹结构）
const noteList = ref<Note[]>([
  {
    id: 'n1',
    title: 'Vue 3 Composition API 深度解析',
    summary: '深入了解 Vue 3 Composition API 的使用方法和最佳实践',
    updateTime: new Date('2024-01-20'),
    folderId: 'f1'
  },
  {
    id: 'n2',
    title: 'TypeScript 类型系统最佳实践',
    summary: 'TypeScript 强大的类型系统能够帮助我们在开发阶段发现潜在问题',
    updateTime: new Date('2024-01-15'),
    folderId: 'f1'
  },
  {
    id: 'n3',
    title: '前端性能优化笔记',
    summary: '记录一些前端性能优化的实用技巧',
    updateTime: new Date('2024-01-12'),
    folderId: 'f2'
  },
  {
    id: 'n4',
    title: 'React Hooks 使用心得',
    summary: '分享在项目中使用 React Hooks 的一些经验',
    updateTime: new Date('2024-01-10'),
    folderId: 'f2'
  },
  {
    id: 'n5',
    title: 'Vite 构建工具入门',
    summary: '快速了解 Vite 的核心特性和使用方法',
    updateTime: new Date('2024-01-08'),
    folderId: 'f3'
  },
  {
    id: 'n6',
    title: 'CSS Grid 布局完全指南',
    summary: 'CSS Grid 提供了强大的二维布局能力',
    updateTime: new Date('2024-01-05'),
    folderId: undefined // 未分类
  }
])

// 文件夹树形结构
const folderTree = computed<TreeNode[]>(() => {
  const folders = [
    { id: 'f1', name: '前端框架' },
    { id: 'f2', name: '性能优化' },
    { id: 'f3', name: '构建工具' }
  ]

  const tree: TreeNode[] = []

  // 添加文件夹及其下的笔记
  folders.forEach(folder => {
    const folderNotes = noteList.value
      .filter(note => note.folderId === folder.id)
      .map(note => ({
        value: note.id,
        label: note.title,
        type: 'note' as const,
        updateTime: note.updateTime
      }))

    if (folderNotes.length > 0) {
      tree.push({
        value: folder.id,
        label: folder.name,
        type: 'folder',
        children: folderNotes,
        disabled: true // 文件夹不可选
      } as any)
    }
  })

  // 添加未分类的笔记
  const uncategorizedNotes = noteList.value
    .filter(note => !note.folderId)
    .map(note => ({
      value: note.id,
      label: note.title,
      type: 'note' as const,
      updateTime: note.updateTime
    }))

  if (uncategorizedNotes.length > 0) {
    tree.push({
      value: 'uncategorized',
      label: '未分类',
      type: 'folder',
      children: uncategorizedNotes,
      disabled: true
    } as any)
  }

  return tree
})

// 分类列表
const categories = [
  { label: '前端开发', value: 'frontend' },
  { label: '后端开发', value: 'backend' },
  { label: '移动开发', value: 'mobile' },
  { label: '数据库', value: 'database' },
  { label: '运维部署', value: 'devops' },
  { label: '算法与数据结构', value: 'algorithm' },
  { label: '人工智能', value: 'ai' },
  { label: '其他', value: 'other' }
]

// 标签列表
const tags = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'CSS', value: 'css' },
  { label: 'Node.js', value: 'nodejs' },
  { label: '性能优化', value: 'performance' },
  { label: '工程化', value: 'engineering' },
  { label: '设计模式', value: 'design-pattern' },
  { label: '测试', value: 'testing' }
]

// 方法：笔记选择改变
const handleNoteChange = (noteId: string) => {
  const note = noteList.value.find(n => n.id === noteId)
  if (note && note.summary) {
    formData.summary = note.summary
  }
}

// 方法：格式化日期
const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 方法：触发文件上传
const triggerUpload = () => {
  fileInputRef.value?.click()
}

// 方法：处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }
  
  // 验证文件大小（限制5MB）
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过5MB')
    return
  }
  
  // 创建预览URL
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.cover = e.target?.result as string
    ElMessage.success('封面上传成功')
  }
  reader.readAsDataURL(file)
  
  // 清空input值，以便可以重复选择同一文件
  target.value = ''
}

// 方法：移除封面
const removeCover = () => {
  formData.cover = ''
}

// 方法:关闭对话框
const handleClose = () => {
  formRef.value?.resetFields()
  dialogVisible.value = false
}

// 方法:确认发布
const handleConfirm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      isLoading.value = true
      
      // 模拟 API 调用
      setTimeout(() => {
        const selectedNote = noteList.value.find(n => n.id === formData.noteId)
        
        emit('confirm', {
          id: formData.noteId,
          title: selectedNote?.title || '',
          summary: formData.summary,
          category: formData.category,
          tags: formData.tags,
          cover: formData.cover,
          updateTime: selectedNote?.updateTime
        })
        
        isLoading.value = false
        handleClose()
      }, 500)
    }
  })
}

// 监听对话框打开
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    if (props.editData) {
      // 编辑模式：填充数据
      formData.noteId = props.editData.id
      formData.category = props.editData.category
      formData.tags = props.editData.tags
      formData.cover = props.editData.cover || ''
      formData.summary = props.editData.summary
    } else {
      // 新建模式：重置表单
      formRef.value?.resetFields()
    }
  }
})
</script>

<style scoped>
.publish-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.publish-form :deep(.el-select) {
  width: 100%;
}

.hidden {
  display: none;
}
</style>
