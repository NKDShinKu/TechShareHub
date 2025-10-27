<template>
  <CommonCard>
    <template #header>
      <h2 class="text-lg font-semibold text-font-primary">个人资料</h2>
    </template>

    <el-form
      ref="formRef"
      :model="profileData"
      :rules="rules"
      label-position="top"
      size="large"
      class="max-w-2xl"
    >
      <!-- 头像 -->
      <el-form-item label="头像">
        <div class="flex items-center gap-6">
          <div class="flex-shrink-0">
            <div class="relative group">
              <img 
                :src="profileData.avatar || '/default-avatar.png'" 
                alt="头像"
                class="w-24 h-24 rounded-full object-cover border-2 border-border-primary"
              >
              <div class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                   @click="handleAvatarClick">
                <span class="icon-[mdi--camera] w-8 h-8 text-white"></span>
              </div>
              <input 
                ref="avatarInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarChange"
              >
            </div>
          </div>
          <div class="flex-1">
            <p class="text-sm text-font-tertiary mb-2">点击头像可以更换</p>
            <p class="text-xs text-font-tertiary">支持 JPG、PNG 格式，文件大小不超过 2MB</p>
          </div>
        </div>
      </el-form-item>

      <!-- 昵称 -->
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="profileData.nickname"
          placeholder="请输入昵称"
          maxlength="20"
          show-word-limit
          clearable
        />
      </el-form-item>

      <!-- 个性签名 -->
      <el-form-item label="个性签名" prop="signature">
        <el-input
          v-model="profileData.signature"
          type="textarea"
          placeholder="请输入个性签名"
          :rows="4"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <!-- 操作按钮 -->
      <el-form-item>
        <div class="flex gap-3">
          <el-button
            type="primary"
            @click="handleSave"
            :loading="isLoading"
          >
            保存修改
          </el-button>
          <el-button
            @click="handleCancel"
          >
            取消
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </CommonCard>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import CommonCard from '@/components/CommonCard.vue'
import { useUserStore } from '@/store'

defineOptions({ name: 'SettingProfilePage' })

const userStore = useUserStore()

interface ProfileData {
  avatar: string
  nickname: string
  signature: string
}

const formRef = ref<FormInstance>()
const avatarInput = ref<HTMLInputElement>()
const isLoading = ref(false)

const profileData = reactive<ProfileData>({
  avatar: '',
  nickname: '',
  signature: ''
})

const originalProfileData = reactive<ProfileData>({ ...profileData })

// 表单验证规则
const rules = reactive<FormRules>({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  signature: [
    { max: 100, message: '个性签名不能超过 100 个字符', trigger: 'blur' }
  ]
})

// 初始化个人资料
onMounted(() => {
  if (userStore.userInfo) {
    profileData.avatar = userStore.userInfo.avatar || ''
    profileData.nickname = userStore.userInfo.nickname || ''
    profileData.signature = userStore.userInfo.description || ''
    Object.assign(originalProfileData, profileData)
  }
})

const handleAvatarClick = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // 检查文件大小
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 2MB')
    return
  }
  
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('只能上传图片文件')
    return
  }

  // 上传头像
  const avatarUrl = await userStore.updateAvatar(file)
  if (avatarUrl) {
    profileData.avatar = avatarUrl
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error('头像上传失败')
  }
  
  // 清空 input，允许重复选择同一文件
  target.value = ''
}

const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    isLoading.value = true
    try {
      const success = await userStore.updateUserInfo({
        nickname: profileData.nickname,
        description: profileData.signature
      })

      if (success) {
        Object.assign(originalProfileData, profileData)
        ElMessage.success('保存成功')
      } else {
        ElMessage.error('保存失败')
      }
    } finally {
      isLoading.value = false
    }
  })
}

const handleCancel = () => {
  Object.assign(profileData, originalProfileData)
  formRef.value?.clearValidate()
  ElMessage.info('已取消修改')
}
</script>

<style scoped>
/* Element Plus 样式覆盖 */
:deep(.el-form-item__label) {
  color: var(--font-color-secondary);
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  background-color: var(--bg-color-secondary);
  border: 1px solid var(--border-color-primary);
  box-shadow: none;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover) {
  border-color: var(--theme-color-primary);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: var(--theme-color-primary);
  box-shadow: 0 0 0 2px var(--theme-color-primary-10);
}

:deep(.el-input__inner) {
  color: var(--font-color-primary);
}

:deep(.el-textarea__inner) {
  background-color: var(--bg-color-secondary);
  border: 1px solid var(--border-color-primary);
  box-shadow: none;
  color: var(--font-color-primary);
  transition: all 0.3s;
}

:deep(.el-textarea__inner:hover) {
  border-color: var(--theme-color-primary);
}

:deep(.el-textarea__inner:focus) {
  border-color: var(--theme-color-primary);
  box-shadow: 0 0 0 2px var(--theme-color-primary-10);
}

:deep(.el-button--primary) {
  background-color: var(--theme-color-primary);
  border-color: var(--theme-color-primary);
}

:deep(.el-button--primary:hover) {
  background-color: var(--theme-color-primary-hover);
  border-color: var(--theme-color-primary-hover);
}

:deep(.el-button--primary:focus) {
  background-color: var(--theme-color-primary);
  border-color: var(--theme-color-primary);
}

:deep(.el-button--default) {
  background-color: var(--bg-color-secondary);
  border-color: var(--border-color-primary);
  color: var(--font-color-secondary);
}

:deep(.el-button--default:hover) {
  background-color: var(--bg-color-tertiary);
  border-color: var(--border-color-primary);
}
</style>