import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string
  username: string
  nickname: string
  email: string
  phone?: string
  avatar?: string
  github?: string
  description?: string
  stats: {
    articles: number
    followers: number
    following: number
    likes: number
  }
  createdAt: string
  updatedAt: string
}

/**
 * 用户权限类型
 */
export const UserRole = {
  ADMIN: 'admin',       // 管理员
  USER: 'user'          // 普通用户
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]

/**
 * 登录请求参数
 */
export interface LoginParams {
  username: string
  password: string
  remember?: boolean
}

/**
 * 注册请求参数
 */
export interface RegisterParams {
  username: string
  password: string
  email: string
  nickname?: string
}

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>('')
  const refreshToken = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  const role = ref<UserRole>(UserRole.USER)
  const isLoading = ref(false)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)
  const isAdmin = computed(() => role.value === UserRole.ADMIN)
  const userId = computed(() => userInfo.value?.id || '')
  const username = computed(() => userInfo.value?.username || '')
  const nickname = computed(() => userInfo.value?.nickname || '')
  const avatar = computed(() => userInfo.value?.avatar || '')

  /**
   * 初始化用户状态 - 从 localStorage 恢复登录状态
   */
  const initUser = () => {
    const savedToken = localStorage.getItem('token')
    const savedRefreshToken = localStorage.getItem('refreshToken')
    const savedUserInfo = localStorage.getItem('userInfo')
    const savedRole = localStorage.getItem('userRole')

    if (savedToken) {
      token.value = savedToken
    }
    if (savedRefreshToken) {
      refreshToken.value = savedRefreshToken
    }
    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo)
      } catch (e) {
        console.error('Failed to parse user info:', e)
      }
    }
    if (savedRole) {
      role.value = savedRole as UserRole
    }

    // 如果有 token，验证并刷新用户信息
    if (token.value) {
      validateToken()
    }
  }

  /**
   * 登录
   */
  const login = async (params: LoginParams): Promise<boolean> => {
    isLoading.value = true
    try {
      // TODO: 替换为真实 API 调用
      // const response = await api.post('/auth/login', params)
      
      // 模拟 API 响应
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        userInfo: {
          id: 'user-' + Date.now(),
          username: params.username,
          nickname: params.username,
          email: 'user@techshare.com',
          phone: '138****8888',
          avatar: '',
          github: 'https://github.com/username',
          description: '热爱技术分享的开发者',
          stats: {
            articles: 42,
            followers: 1284,
            following: 256,
            likes: 3920
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        role: UserRole.USER
      }

      // 保存登录信息
      token.value = mockResponse.token
      refreshToken.value = mockResponse.refreshToken
      userInfo.value = mockResponse.userInfo
      role.value = mockResponse.role

      // 持久化到 localStorage
      if (params.remember) {
        localStorage.setItem('token', token.value)
        localStorage.setItem('refreshToken', refreshToken.value)
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        localStorage.setItem('userRole', role.value)
      } else {
        // 不记住登录，使用 sessionStorage
        sessionStorage.setItem('token', token.value)
      }

      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 注册
   */
  const register = async (params: RegisterParams): Promise<boolean> => {
    isLoading.value = true
    try {
      // TODO: 替换为真实 API 调用
      // const response = await api.post('/auth/register', params)
      
      // 模拟 API 响应
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 注册成功后自动登录
      return await login({
        username: params.username,
        password: params.password,
        remember: true
      })
    } catch (error) {
      console.error('Register failed:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 登出
   */
  const logout = async () => {
    try {
      // TODO: 调用登出 API
      // await api.post('/auth/logout')

      // 清空状态
      token.value = ''
      refreshToken.value = ''
      userInfo.value = null
      role.value = UserRole.USER

      // 清空持久化数据
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('userRole')
      sessionStorage.removeItem('token')

      return true
    } catch (error) {
      console.error('Logout failed:', error)
      return false
    }
  }

  /**
   * 验证 Token 有效性
   */
  const validateToken = async (): Promise<boolean> => {
    if (!token.value) return false

    try {
      // TODO: 调用验证 API
      // const response = await api.get('/auth/validate')
      
      // 模拟验证
      await new Promise(resolve => setTimeout(resolve, 500))
      return true
    } catch (error) {
      console.error('Token validation failed:', error)
      // Token 无效，清空登录状态
      await logout()
      return false
    }
  }

  /**
   * 刷新 Token
   */
  const refreshAuthToken = async (): Promise<boolean> => {
    if (!refreshToken.value) return false

    try {
      // TODO: 调用刷新 Token API
      // const response = await api.post('/auth/refresh', { refreshToken: refreshToken.value })
      
      // 模拟刷新
      await new Promise(resolve => setTimeout(resolve, 500))
      token.value = 'refreshed-token-' + Date.now()
      localStorage.setItem('token', token.value)
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      await logout()
      return false
    }
  }

  /**
   * 获取用户信息
   */
  const fetchUserInfo = async (): Promise<boolean> => {
    if (!token.value) return false

    isLoading.value = true
    try {
      // TODO: 调用获取用户信息 API
      // const response = await api.get('/user/info')
      
      // 模拟 API 响应
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (userInfo.value) {
        // 更新用户信息
        userInfo.value.updatedAt = new Date().toISOString()
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      }
      
      return true
    } catch (error) {
      console.error('Fetch user info failed:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 更新用户信息
   */
  const updateUserInfo = async (data: Partial<UserInfo>): Promise<boolean> => {
    if (!token.value || !userInfo.value) return false

    isLoading.value = true
    try {
      // TODO: 调用更新用户信息 API
      // const response = await api.put('/user/info', data)
      
      // 模拟 API 响应
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 更新本地用户信息
      userInfo.value = {
        ...userInfo.value,
        ...data,
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      return true
    } catch (error) {
      console.error('Update user info failed:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 修改密码
   */
  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!token.value) return false

    isLoading.value = true
    try {
      // TODO: 调用修改密码 API
      // const response = await api.post('/user/change-password', { oldPassword, newPassword })
      
      // 模拟 API 响应
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('Password changed:', { oldPassword, newPassword })
      return true
    } catch (error) {
      console.error('Change password failed:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 更新头像
   */
  const updateAvatar = async (file: File): Promise<string | null> => {
    if (!token.value) return null

    isLoading.value = true
    try {
      // TODO: 调用上传头像 API
      // const formData = new FormData()
      // formData.append('avatar', file)
      // const response = await api.post('/user/avatar', formData)
      
      // 模拟上传
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 生成模拟头像 URL
      const avatarUrl = URL.createObjectURL(file)
      
      if (userInfo.value) {
        userInfo.value.avatar = avatarUrl
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      }
      
      return avatarUrl
    } catch (error) {
      console.error('Update avatar failed:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 检查权限
   */
  const hasPermission = (requiredRole: UserRole): boolean => {
    const roleLevel = {
      [UserRole.USER]: 1,
      [UserRole.ADMIN]: 2
    }
    return roleLevel[role.value] >= roleLevel[requiredRole]
  }

  /**
   * 获取其他用户信息（用于查看他人主页）
   */
  const fetchOtherUserInfo = async (userId: string): Promise<UserInfo | null> => {
    try {
      // TODO: 调用获取其他用户信息 API
      // const response = await api.get(`/user/${userId}`)
      
      // 模拟 API 响应
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return {
        id: userId,
        username: 'otheruser',
        nickname: 'Other User',
        email: 'other@techshare.com',
        avatar: '',
        github: 'https://github.com/otheruser',
        description: '这是另一个用户的简介',
        stats: {
          articles: 20,
          followers: 500,
          following: 100,
          likes: 1500
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Fetch other user info failed:', error)
      return null
    }
  }

  return {
    // 状态
    token,
    refreshToken,
    userInfo,
    role,
    isLoading,

    // 计算属性
    isLoggedIn,
    isAdmin,
    userId,
    username,
    nickname,
    avatar,

    // 方法
    initUser,
    login,
    register,
    logout,
    validateToken,
    refreshAuthToken,
    fetchUserInfo,
    updateUserInfo,
    changePassword,
    updateAvatar,
    hasPermission,
    fetchOtherUserInfo
  }
})
