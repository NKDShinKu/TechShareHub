/**
 * Store 统一导出
 * 
 * 使用方式:
 * import { useThemeStore, useUserStore } from '@/store'
 */

// 主题管理
export { useThemeStore } from './modules/theme'
export type { ThemeState, ThemeMode, ThemeColor } from './modules/theme'

// 用户管理
export { useUserStore, UserRole } from './modules/user'
export type { 
  UserInfo, 
  LoginParams, 
  RegisterParams,
  UserRole as UserRoleType
} from './modules/user'

// 如果有其他 store 模块，在这里导出
// export { useOtherStore } from './modules/other'
