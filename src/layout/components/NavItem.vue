<script setup lang="ts">
defineOptions({ name: 'NavItem' })

import { ref } from 'vue'
import { useRoute } from 'vue-router'

interface NavItemProps {
  to: string
  icon: string
  label: string
  exactMatch?: boolean
}

defineProps<NavItemProps>()

const route = useRoute()
const isHovered = ref(false)

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
}

// 检查是否为当前激活路由
const isActive = (to: string) => {
  if (to === '/home') {
    return route.path === '/' || route.path.startsWith('/home')
  }
  return route.path.startsWith(to)
}
</script>

<template>
  <router-link 
    :to="to" 
    class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors text-font-secondary"
    :class="{
      'nav-active': isActive(to),
      'nav-hover': isHovered && !isActive(to)
    }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <i :class="icon" class="w-5 h-5"></i>
    <span>{{ label }}</span>
  </router-link>
</template>

<style scoped>
.nav-hover {
  color: var(--color-theme-primary);
  background-color: var(--color-theme-primary-10);
}

.nav-active {
  color: var(--color-theme-primary);
  background-color: var(--color-theme-primary-20);
}

.nav-active:hover {
  color: var(--color-theme-primary);
  background-color: var(--color-theme-primary-20);
}
</style>