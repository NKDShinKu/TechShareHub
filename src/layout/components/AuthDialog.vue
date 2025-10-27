<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
    :title="isLogin ? '欢迎回来' : '加入我们'"
    width="500px"
    align-center
    :close-on-click-modal="false"
  >
    <!-- 副标题 -->
    <p class="text-sm text-font-tertiary text-center -mt-4 mb-6">
      {{ isLogin ? '登录您的账户继续使用' : '创建账户开始分享' }}
    </p>

    <!-- 标签页切换 -->
    <el-tabs v-model="activeTab" class="auth-tabs">
      <!-- 登录标签 -->
      <el-tab-pane label="登录" name="login">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="top"
          size="large"
        >
          <el-form-item label="用户名或邮箱" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名或邮箱"
              clearable
            >
              <template #prefix>
                <span class="icon-[mdi--account-outline] w-5 h-5 text-font-tertiary"></span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <span class="icon-[mdi--lock-outline] w-5 h-5 text-font-tertiary"></span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <div class="flex items-center justify-between w-full">
              <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="isLoading"
              @click="handleLogin"
              class="w-full"
              size="large"
            >
              {{ isLoading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 注册标签 -->
      <el-tab-pane label="注册" name="register">
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-position="top"
          size="large"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              clearable
            >
              <template #prefix>
                <span class="icon-[mdi--account-outline] w-5 h-5 text-font-tertiary"></span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="registerForm.email"
              type="email"
              placeholder="请输入邮箱"
              clearable
            >
              <template #prefix>
                <span class="icon-[mdi--email-outline] w-5 h-5 text-font-tertiary"></span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="至少8位，包含字母和数字"
              show-password
            >
              <template #prefix>
                <span class="icon-[mdi--lock-outline] w-5 h-5 text-font-tertiary"></span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              show-password
              @keyup.enter="handleRegister"
            >
              <template #prefix>
                <span class="icon-[mdi--lock-check-outline] w-5 h-5 text-font-tertiary"></span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="isLoading"
              @click="handleRegister"
              class="w-full"
              size="large"
            >
              {{ isLoading ? '注册中...' : '注册' }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!-- 第三方登录 -->
    <div class="mt-6">
      <el-divider>或使用以下方式</el-divider>
      <div class="grid grid-cols-2 gap-3">
        <el-button class="third-party-btn">
          <span class="icon-[mdi--github] w-5 h-5 mr-2"></span>
          GitHub
        </el-button>
        <el-button class="third-party-btn">
          <span class="icon-[mdi--wechat] w-5 h-5 mr-2 text-green-500"></span>
          微信
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/store'

interface Props {
  modelValue: boolean
  defaultMode?: 'login' | 'register'
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  defaultMode: 'login'
})

const emit = defineEmits<Emits>()

const userStore = useUserStore()

// 当前标签页
const activeTab = ref<'login' | 'register'>('login')
const isLoading = ref(false)

// 同步 isLogin 计算属性
const isLogin = computed(() => activeTab.value === 'login')

// 表单引用
const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()

// 登录表单
const loginForm = reactive({
  username: '',
  password: '',
  remember: true
})

// 注册表单
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 登录表单验证规则
const loginRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

// 注册表单验证规则
const registerRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
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
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 监听 defaultMode 变化
watch(
  () => props.defaultMode,
  (newMode) => {
    activeTab.value = newMode
  },
  { immediate: true }
)

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    isLoading.value = true
    try {
      const success = await userStore.login({
        username: loginForm.username,
        password: loginForm.password,
        remember: loginForm.remember
      })

      if (success) {
        ElMessage.success('登录成功！')
        emit('success')
        emit('update:modelValue', false)
        // 重置表单
        loginFormRef.value?.resetFields()
      } else {
        ElMessage.error('登录失败，请检查用户名和密码')
      }
    } catch (error) {
      ElMessage.error('登录失败，请稍后重试')
      console.error('Login error:', error)
    } finally {
      isLoading.value = false
    }
  })
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    isLoading.value = true
    try {
      const success = await userStore.register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        nickname: registerForm.username
      })

      if (success) {
        ElMessage.success('注册成功！')
        emit('success')
        emit('update:modelValue', false)
        // 重置表单
        registerFormRef.value?.resetFields()
      } else {
        ElMessage.error('注册失败，该用户名或邮箱可能已被使用')
      }
    } catch (error) {
      ElMessage.error('注册失败，请稍后重试')
      console.error('Register error:', error)
    } finally {
      isLoading.value = false
    }
  })
}
</script>

<style scoped>
/* Element Plus 对话框样式覆盖 */
:deep(.el-dialog) {
  background-color: var(--bg-color-primary);
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid var(--border-color-secondary);
  padding: 20px 24px;
}

:deep(.el-dialog__title) {
  color: var(--font-color-primary);
  font-size: 20px;
  font-weight: 600;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

/* 标签页样式 */
:deep(.auth-tabs .el-tabs__header) {
  margin-bottom: 24px;
}

:deep(.auth-tabs .el-tabs__nav-wrap::after) {
  background-color: var(--border-color-secondary);
}

:deep(.auth-tabs .el-tabs__item) {
  color: var(--font-color-secondary);
  font-size: 16px;
  font-weight: 500;
}

:deep(.auth-tabs .el-tabs__item.is-active) {
  color: var(--theme-color-primary);
}

:deep(.auth-tabs .el-tabs__active-bar) {
  background-color: var(--theme-color-primary);
}

/* 表单样式 */
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

:deep(.el-input__inner::placeholder) {
  color: var(--font-color-tertiary);
}

:deep(.el-checkbox__label) {
  color: var(--font-color-secondary);
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--theme-color-primary);
  border-color: var(--theme-color-primary);
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

:deep(.el-button.is-link) {
  color: var(--theme-color-primary);
}

:deep(.el-divider__text) {
  background-color: var(--bg-color-primary);
  color: var(--font-color-tertiary);
}

/* 第三方登录按钮 */
.third-party-btn {
  border: 1px solid var(--border-color-primary);
  background-color: transparent;
  color: var(--font-color-secondary);
}

.third-party-btn:hover {
  background-color: var(--bg-color-secondary);
  border-color: var(--theme-color-primary);
}
</style>
