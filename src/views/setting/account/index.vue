<template>
  <div class="space-y-4">
    <!-- 基本信息 -->
    <CommonCard>
      <template #header>
        <h2 class="text-lg font-semibold text-font-primary">基本信息</h2>
      </template>

      <el-form
        ref="accountFormRef"
        :model="accountData"
        :rules="accountRules"
        label-position="top"
        size="large"
        class="max-w-2xl"
      >
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="phone">
          <div class="flex items-center gap-3 w-full">
            <el-input
              v-model="accountData.phone"
              placeholder="请输入手机号"
              :disabled="!isEditingPhone"
              maxlength="11"
            />
            <el-button
              v-if="!isEditingPhone"
              @click="isEditingPhone = true"
            >
              修改
            </el-button>
            <template v-else>
              <el-button
                type="primary"
                @click="handleSavePhone"
                :loading="isLoadingPhone"
              >
                保存
              </el-button>
              <el-button
                @click="handleCancelPhone"
              >
                取消
              </el-button>
            </template>
          </div>
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <div class="flex items-center gap-3 w-full">
            <el-input
              v-model="accountData.email"
              placeholder="请输入邮箱"
              :disabled="!isEditingEmail"
            />
            <el-button
              v-if="!isEditingEmail"
              @click="isEditingEmail = true"
            >
              修改
            </el-button>
            <template v-else>
              <el-button
                type="primary"
                @click="handleSaveEmail"
                :loading="isLoadingEmail"
              >
                保存
              </el-button>
              <el-button
                @click="handleCancelEmail"
              >
                取消
              </el-button>
            </template>
          </div>
        </el-form-item>

        <!-- GitHub 主页 -->
        <el-form-item label="GitHub 主页" prop="github">
          <div class="flex items-center gap-3 w-full">
            <el-input
              v-model="accountData.github"
              placeholder="请输入 GitHub 主页地址"
              :disabled="!isEditingGithub"
            >
              <template #prefix>
                <span class="icon-[mdi--github] w-4 h-4 text-font-tertiary"></span>
              </template>
            </el-input>
            <el-button
              v-if="!isEditingGithub"
              @click="isEditingGithub = true"
            >
              修改
            </el-button>
            <template v-else>
              <el-button
                type="primary"
                @click="handleSaveGithub"
                :loading="isLoadingGithub"
              >
                保存
              </el-button>
              <el-button
                @click="handleCancelGithub"
              >
                取消
              </el-button>
            </template>
          </div>
        </el-form-item>
      </el-form>
    </CommonCard>

    <!-- 密码修改 -->
    <CommonCard>
      <template #header>
        <h2 class="text-lg font-semibold text-font-primary">修改密码</h2>
      </template>

      <el-form
        ref="passwordFormRef"
        :model="passwordData"
        :rules="passwordRules"
        label-position="top"
        size="large"
        class="max-w-2xl"
      >
        <!-- 当前密码 -->
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="passwordData.oldPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
          >
            <template #prefix>
              <span class="icon-[mdi--lock-outline] w-4 h-4 text-font-tertiary"></span>
            </template>
          </el-input>
        </el-form-item>

        <!-- 新密码 -->
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordData.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          >
            <template #prefix>
              <span class="icon-[mdi--lock-outline] w-4 h-4 text-font-tertiary"></span>
            </template>
          </el-input>
          <template #extra>
            <span class="text-xs text-font-tertiary">密码长度至少8位，包含字母和数字</span>
          </template>
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordData.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          >
            <template #prefix>
              <span class="icon-[mdi--lock-check-outline] w-4 h-4 text-font-tertiary"></span>
            </template>
          </el-input>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <div class="flex gap-3">
            <el-button
              type="primary"
              @click="handleChangePassword"
              :loading="isLoadingPassword"
            >
              修改密码
            </el-button>
            <el-button
              @click="handleResetPassword"
            >
              重置
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </CommonCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import CommonCard from '@/components/CommonCard.vue'
import { useUserStore } from '@/store'

defineOptions({ name: 'SettingAccountPage' })

const userStore = useUserStore()

interface AccountData {
  phone: string
  email: string
  github: string
}

const accountFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

const accountData = reactive<AccountData>({
  phone: '',
  email: '',
  github: ''
})

const originalAccountData = reactive<AccountData>({ ...accountData })

const isEditingPhone = ref(false)
const isEditingEmail = ref(false)
const isEditingGithub = ref(false)

const isLoadingPhone = ref(false)
const isLoadingEmail = ref(false)
const isLoadingGithub = ref(false)
const isLoadingPassword = ref(false)

const passwordData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 账户信息验证规则
const accountRules = reactive<FormRules>({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  github: [
    { 
      validator: (_rule: any, value: any, callback: any) => {
        if (value && !value.startsWith('https://github.com/')) {
          callback(new Error('请输入正确的 GitHub 主页地址'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 密码验证规则
const passwordRules = reactive<FormRules>({
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '密码长度至少 8 位', trigger: 'blur' },
    {
      pattern: /(?=.*[a-zA-Z])(?=.*\d)/,
      message: '密码必须包含字母和数字',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (value !== passwordData.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 初始化账户数据
onMounted(() => {
  if (userStore.userInfo) {
    accountData.phone = userStore.userInfo.phone || '138****8888'
    accountData.email = userStore.userInfo.email || ''
    accountData.github = userStore.userInfo.github || ''
    Object.assign(originalAccountData, accountData)
  }
})

// 手机号相关
const handleSavePhone = async () => {
  if (!accountFormRef.value) return

  await accountFormRef.value.validateField('phone', async (valid: boolean) => {
    if (!valid) return

    try {
      await ElMessageBox.confirm('确认修改手机号？', '确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })

      isLoadingPhone.value = true
      const success = await userStore.updateUserInfo({ phone: accountData.phone })
      
      if (success) {
        originalAccountData.phone = accountData.phone
        isEditingPhone.value = false
        ElMessage.success('手机号修改成功')
      } else {
        ElMessage.error('手机号修改失败')
      }
    } catch {
      // 用户取消
    } finally {
      isLoadingPhone.value = false
    }
  })
}

const handleCancelPhone = () => {
  accountData.phone = originalAccountData.phone
  isEditingPhone.value = false
  accountFormRef.value?.clearValidate('phone')
}

// 邮箱相关
const handleSaveEmail = async () => {
  if (!accountFormRef.value) return

  await accountFormRef.value.validateField('email', async (valid: boolean) => {
    if (!valid) return

    try {
      await ElMessageBox.confirm('确认修改邮箱？', '确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })

      isLoadingEmail.value = true
      const success = await userStore.updateUserInfo({ email: accountData.email })
      
      if (success) {
        originalAccountData.email = accountData.email
        isEditingEmail.value = false
        ElMessage.success('邮箱修改成功')
      } else {
        ElMessage.error('邮箱修改失败')
      }
    } catch {
      // 用户取消
    } finally {
      isLoadingEmail.value = false
    }
  })
}

const handleCancelEmail = () => {
  accountData.email = originalAccountData.email
  isEditingEmail.value = false
  accountFormRef.value?.clearValidate('email')
}

// GitHub 相关
const handleSaveGithub = async () => {
  if (!accountFormRef.value) return

  await accountFormRef.value.validateField('github', async (valid: boolean) => {
    if (!valid) return

    isLoadingGithub.value = true
    try {
      const success = await userStore.updateUserInfo({ github: accountData.github })
      
      if (success) {
        originalAccountData.github = accountData.github
        isEditingGithub.value = false
        ElMessage.success('GitHub 主页修改成功')
      } else {
        ElMessage.error('GitHub 主页修改失败')
      }
    } finally {
      isLoadingGithub.value = false
    }
  })
}

const handleCancelGithub = () => {
  accountData.github = originalAccountData.github
  isEditingGithub.value = false
  accountFormRef.value?.clearValidate('github')
}

// 密码相关
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    try {
      await ElMessageBox.confirm('确认修改密码？修改后需要重新登录。', '确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })

      isLoadingPassword.value = true
      const success = await userStore.changePassword(passwordData.oldPassword, passwordData.newPassword)
      
      if (success) {
        ElMessage.success('密码修改成功')
        handleResetPassword()
      } else {
        ElMessage.error('密码修改失败，请检查当前密码是否正确')
      }
    } catch {
      // 用户取消
    } finally {
      isLoadingPassword.value = false
    }
  })
}

const handleResetPassword = () => {
  passwordData.oldPassword = ''
  passwordData.newPassword = ''
  passwordData.confirmPassword = ''
  passwordFormRef.value?.clearValidate()
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

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: var(--bg-color-tertiary);
  cursor: not-allowed;
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

:deep(.el-form-item__extra) {
  color: var(--font-color-tertiary);
}
</style>