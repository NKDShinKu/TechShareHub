import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark'
export type ThemeColor = 'green' | 'blue' | 'purple' | 'pink' | 'orange' | 'red' | 'yellow' | 'teal' | 'indigo' | 'cyan'

export interface ThemeState {
  mode: ThemeMode
  color: ThemeColor
}

/**
 * 主题状态管理
 */
export const useThemeStore = defineStore('theme', () => {
  // 状态
  const mode = ref<ThemeMode>('light')
  const color = ref<ThemeColor>('green')

  /**
   * 初始化主题 - 从 localStorage 读取或使用默认值
   */
  const initTheme = () => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode
    const savedColor = localStorage.getItem('theme-color') as ThemeColor

    mode.value = savedMode || 'light'
    color.value = savedColor || 'green'

    applyTheme()
  }

  /**
   * 应用主题到 DOM
   */
  const applyTheme = () => {
    const html = document.documentElement
    const themeAttr = `${mode.value}-${color.value}`
    
    html.setAttribute('data-theme', themeAttr)
  }

  /**
   * 设置主题模式（亮色/暗色）
   */
  const setMode = (newMode: ThemeMode) => {
    mode.value = newMode
    localStorage.setItem('theme-mode', newMode)
    applyTheme()
  }

  /**
   * 设置主题颜色
   */
  const setColor = (newColor: ThemeColor) => {
    color.value = newColor
    localStorage.setItem('theme-color', newColor)
    applyTheme()
  }

  /**
   * 切换主题模式（亮色 ⇄ 暗色）
   */
  const toggleMode = () => {
    setMode(mode.value === 'light' ? 'dark' : 'light')
  }

  /**
   * 保存主题设置
   */
  const saveTheme = () => {
    localStorage.setItem('theme-mode', mode.value)
    localStorage.setItem('theme-color', color.value)
    applyTheme()
  }

  /**
   * 重置主题为默认值
   */
  const resetTheme = () => {
    setMode('light')
    setColor('green')
  }

  // 监听主题变化，自动应用
  watch([mode, color], () => {
    applyTheme()
  })

  return {
    // 状态
    mode,
    color,

    // 方法
    initTheme,
    setMode,
    setColor,
    toggleMode,
    saveTheme,
    resetTheme,
    applyTheme
  }
})
