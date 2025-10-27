<script setup lang="ts">
defineOptions({ name: 'SettingPage' })

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonCard from '@/components/CommonCard.vue'

const route = useRoute()
const router = useRouter()

// 菜单项配置
const menuItems = [
  {
    key: 'profile',
    label: '个人资料',
    path: '/setting/profile',
    icon: 'icon-[mdi--account-circle-outline]'
  },
  {
    key: 'account',
    label: '账户设置',
    path: '/setting/account',
    icon: 'icon-[mdi--cog-outline]'
  },
  {
    key: 'theme',
    label: '主题设置',
    path: '/setting/theme',
    icon: 'icon-[mdi--palette-outline]'
  }
]

// 当前激活的菜单项
const activeMenu = computed(() => {
  const currentPath = route.path
  return menuItems.find(item => currentPath.startsWith(item.path))?.key || 'profile'
})

// 切换菜单
const switchMenu = (item: typeof menuItems[0]) => {
  router.push(item.path)
}
</script>

<template>
  <div class="p-4 max-w-screen-2xl mx-auto">
    <div class="flex items-start gap-6 min-h-[calc(100vh-2rem)]">
      <!-- 左侧菜单 -->
      <div class="w-60 shrink-0 sticky top-18">
        <CommonCard padding="p-1">
          <div class="setting-menu">
            <div
              v-for="item in menuItems"
              :key="item.key"
              class="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-border-secondary last:border-b-0"
              :class="activeMenu === item.key ? 'bg-theme-primary-10 border-l-4 border-l-theme-primary text-theme-primary' : 'text-font-secondary hover:bg-bg-secondary'"
              @click="switchMenu(item)"
            >
              <span :class="item.icon" class="w-5 h-5"></span>
              <span class="font-medium">{{ item.label }}</span>
            </div>
          </div>
        </CommonCard>
      </div>

      <!-- 右侧内容区 -->
      <div class="flex-1 min-w-0">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.setting-menu > div {
  position: relative;
}

.setting-menu > div.bg-theme-primary-10 {
  border-left: 4px solid var(--theme-color-primary);
}
</style>