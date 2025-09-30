<script setup lang="ts">
import { useHeaderVisibility } from '@/composables/useScrollUtils'

defineOptions({ name: 'CreatorSidebar' })
// 使用 Header 显隐逻辑
const { isScrollUp } = useHeaderVisibility(900) // 滚动 900px 后触发
// 定义事件
const emit = defineEmits<{
  'menu-select': [menuPath: string]
}>()

// 创作中心菜单配置
const creatorMenuItems = [
  {
    id: 'overview',
    to: '/creator/overview',
    icon: 'icon-[material-symbols--dashboard-outline]',
    label: '数据总览',
    description: '查看创作数据和统计信息'
  },
  {
    id: 'manage',
    to: '/creator/manage',
    icon: 'icon-[material-symbols--article-outline]',
    label: '笔记管理',
    description: '管理已发布的笔记'
  },
  {
    id: 'help',
    to: '/creator/help',
    icon: 'icon-[material-symbols--help-outline]',
    label: '帮助中心',
    description: '创作指南和常见问题'
  }
]

// 处理菜单选择
const handleMenuSelect = (menuPath: string) => {
  emit('menu-select', menuPath)
}
</script>

<template>
  <aside class="w-64 sticky bg-bg-primary border-r border-border-primary rounded-lg overflow-hidden" :class="{ 'top-18': isScrollUp, 'top-3': !isScrollUp }">
    <!-- 侧边栏头部 -->
    <div class="p-4 border-b border-border-primary bg-bg-secondary">
      <h2 class="text-lg font-semibold text-font-primary flex items-center">
        <span class="icon-[material-symbols--add] w-5 h-5 mr-2 text-theme-primary"></span>
        创作中心
      </h2>
      <p class="text-xs text-font-tertiary mt-1">管理您的创作内容</p>
    </div>

    <!-- 写笔记按钮 -->
    <div class="p-4 border-b border-border-primary flex flex-col space-y-2">
      <router-link
        to="/note"
        class="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-theme-primary text-white rounded-lg font-medium transition-all duration-200 hover:bg-theme-primary-hover"
        @click="handleMenuSelect('/note')"
      >
        <span class="icon-[material-symbols--sticky-note-2-outline] w-5 h-5"></span>
        <span>写笔记</span>
      </router-link>
      <router-link
        to="/note"
        class="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-info text-white rounded-lg font-medium transition-all duration-200 hover:bg-info-hover"
        @click="handleMenuSelect('/note')"
      >
        <span class="icon-[material-symbols-light--upload-sharp]"></span>
        <span>上传笔记</span>
      </router-link>
    </div>

    <!-- 主菜单导航 -->
    <nav class="p-4">
      <ul class="space-y-1">
        <li v-for="item in creatorMenuItems" :key="item.id">
          <router-link
            :to="item.to"
            class="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group"
            :class="[
              'text-font-secondary hover:text-theme-primary hover:bg-theme-primary-10',
              'border border-transparent hover:border-theme-primary-20'
            ]"
            active-class="!text-theme-primary !bg-theme-primary-10 !border-theme-primary-20"
            @click="handleMenuSelect(item.to)"
          >
            <!-- 图标 -->
            <span :class="[item.icon, 'w-5 h-5 flex-shrink-0']"></span>
            
            <!-- 菜单内容 -->
            <div class="flex-1 min-w-0">
              <div class="font-medium">{{ item.label }}</div>
              <div class="text-xs text-font-tertiary group-hover:text-theme-primary opacity-80">
                {{ item.description }}
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- 侧边栏底部信息 -->
    <div class="mt-auto p-4 border-t border-border-primary bg-bg-secondary">
      <div class="text-center">
        <div class="text-xs text-font-tertiary mb-2">创作者身份</div>
        <div class="inline-flex items-center px-3 py-1 bg-theme-primary-10 text-theme-primary text-xs font-medium rounded-full">
          <span class="icon-[material-symbols--verified] w-3 h-3 mr-1"></span>
          认证作者
        </div>
        
        <!-- 统计信息 -->
        <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div class="text-center">
            <div class="font-medium text-font-primary">0</div>
            <div class="text-font-tertiary">文章</div>
          </div>
          <div class="text-center">
            <div class="font-medium text-font-primary">0</div>
            <div class="text-font-tertiary">阅读</div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* 使用 Tailwind CSS 类，无需额外样式 */
</style>