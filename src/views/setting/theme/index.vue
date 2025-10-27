<template>
  <div class="space-y-4">
    <!-- 主题模式 -->
    <CommonCard>
      <template #header>
        <h2 class="text-lg font-semibold text-font-primary">主题模式</h2>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-font-secondary">选择你喜欢的主题模式</p>
        
        <div class="grid grid-cols-2 gap-4 max-w-md">
          <!-- 浅色主题 -->
          <div
            @click="handleThemeChange('light')"
            :class="[
              'relative p-4 rounded-lg border-2 cursor-pointer transition-all',
              currentTheme === 'light'
                ? 'border-theme-primary bg-theme-primary-10'
                : 'border-border-primary hover:border-theme-primary bg-bg-secondary'
            ]"
          >
            <div class="flex flex-col items-center gap-3">
              <span class="icon-[mdi--white-balance-sunny] w-12 h-12 text-theme-primary"></span>
              <span class="font-medium text-font-primary">浅色</span>
            </div>
            <div
              v-if="currentTheme === 'light'"
              class="absolute top-2 right-2 w-5 h-5 rounded-full bg-theme-primary flex items-center justify-center"
            >
              <span class="icon-[mdi--check] w-4 h-4 text-white"></span>
            </div>
          </div>

          <!-- 深色主题 -->
          <div
            @click="handleThemeChange('dark')"
            :class="[
              'relative p-4 rounded-lg border-2 cursor-pointer transition-all',
              currentTheme === 'dark'
                ? 'border-theme-primary bg-theme-primary-10'
                : 'border-border-primary hover:border-theme-primary bg-bg-secondary'
            ]"
          >
            <div class="flex flex-col items-center gap-3">
              <span class="icon-[mdi--moon-waning-crescent] w-12 h-12 text-theme-primary"></span>
              <span class="font-medium text-font-primary">深色</span>
            </div>
            <div
              v-if="currentTheme === 'dark'"
              class="absolute top-2 right-2 w-5 h-5 rounded-full bg-theme-primary flex items-center justify-center"
            >
              <span class="icon-[mdi--check] w-4 h-4 text-white"></span>
            </div>
          </div>
        </div>
      </div>
    </CommonCard>

    <!-- 主题色 -->
    <CommonCard>
      <template #header>
        <h2 class="text-lg font-semibold text-font-primary">主题色</h2>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-font-secondary">选择你喜欢的主题颜色</p>
        
        <div class="grid grid-cols-5 gap-4 max-w-xl">
          <div
            v-for="color in themeColors"
            :key="color.name"
            @click="handleColorChange(color.name)"
            :class="[
              'relative p-4 rounded-lg border-2 cursor-pointer transition-all',
              currentColor === color.name
                ? 'border-theme-primary'
                : 'border-border-primary hover:border-border-secondary'
            ]"
          >
            <div class="flex flex-col items-center gap-2">
              <div
                :style="{ backgroundColor: color.value }"
                class="w-10 h-10 rounded-full"
              ></div>
              <span class="text-xs text-font-secondary">{{ color.label }}</span>
            </div>
            <div
              v-if="currentColor === color.name"
              class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-theme-primary flex items-center justify-center"
            >
              <span class="icon-[mdi--check] w-3 h-3 text-white"></span>
            </div>
          </div>
        </div>
      </div>
    </CommonCard>

    <!-- 预览 -->
    <CommonCard>
      <template #header>
        <h2 class="text-lg font-semibold text-font-primary">主题预览</h2>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-font-secondary">当前主题效果预览</p>
        
        <div class="p-6 rounded-lg border border-border-primary bg-bg-secondary">
          <div class="space-y-4">
            <!-- 示例卡片 -->
            <div class="p-4 rounded-lg bg-bg-primary border border-border-secondary">
              <h3 class="text-base font-semibold text-font-primary mb-2">示例标题</h3>
              <p class="text-sm text-font-secondary mb-3">
                这是一段示例文本，用于展示当前主题的文字颜色效果。
              </p>
              <div class="flex gap-2">
                <button class="px-4 py-2 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-lg text-sm transition-colors">
                  主要按钮
                </button>
                <button class="px-4 py-2 bg-bg-secondary hover:bg-bg-tertiary text-font-secondary rounded-lg text-sm transition-colors">
                  次要按钮
                </button>
              </div>
            </div>

            <!-- 示例标签 -->
            <div class="flex gap-2 flex-wrap">
              <span class="px-3 py-1 rounded-full text-xs bg-theme-primary-10 text-theme-primary">标签示例</span>
              <span class="px-3 py-1 rounded-full text-xs bg-success-light text-success-text">成功状态</span>
              <span class="px-3 py-1 rounded-full text-xs bg-warning-light text-warning-text">警告状态</span>
              <span class="px-3 py-1 rounded-full text-xs bg-danger-light text-danger-text">危险状态</span>
            </div>
          </div>
        </div>
      </div>
    </CommonCard>

    <!-- 保存按钮 -->
    <!-- <div class="flex justify-end">
      <button
        @click="handleSave"
        class="px-6 py-2 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-lg font-medium transition-colors"
      >
        保存设置
      </button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import CommonCard from '@/components/CommonCard.vue'
import { useThemeStore, type ThemeColor } from '@/store'

defineOptions({ name: 'SettingThemePage' })

// 使用主题 store
const themeStore = useThemeStore()

// 从 store 获取当前主题状态
const currentTheme = computed(() => themeStore.mode)
const currentColor = computed(() => themeStore.color)

interface ThemeColorOption {
  name: ThemeColor
  label: string
  value: string
}

const themeColors: ThemeColorOption[] = [
  { name: 'green', label: '绿色', value: '#10b981' },
  { name: 'blue', label: '蓝色', value: '#3b82f6' },
  { name: 'purple', label: '紫色', value: '#a855f7' },
  { name: 'pink', label: '粉色', value: '#ec4899' },
  { name: 'orange', label: '橙色', value: '#f97316' },
  { name: 'red', label: '红色', value: '#ef4444' },
  { name: 'yellow', label: '黄色', value: '#eab308' },
  { name: 'teal', label: '青色', value: '#14b8a6' },
  { name: 'indigo', label: '靛蓝', value: '#6366f1' },
  { name: 'cyan', label: '青蓝', value: '#06b6d4' }
]

// 切换主题模式
const handleThemeChange = (theme: 'light' | 'dark') => {
  themeStore.setMode(theme)
}

// 切换主题色
const handleColorChange = (color: ThemeColor) => {
  themeStore.setColor(color)
}

// 保存设置
// const handleSave = () => {
//   themeStore.saveTheme()
//   ElMessage.success('主题设置已保存')
// }
</script>

<style scoped>
/* 主题色预览 */
.theme-preview {
  transition: all 0.3s ease;
}
</style>