<script setup lang="ts">
defineOptions({ name: 'UserMenu' })

import { ref, onMounted, onUnmounted } from 'vue'

interface MenuItem {
  label: string
  to?: string
  icon: string
  type?: 'normal' | 'danger' | 'divider'
  action?: () => void
}

interface User {
  id: string
  name: string
  avatar?: string
}

interface UserMenuProps {
  user: User
  menuItems: MenuItem[]
}

defineProps<UserMenuProps>()

const isOpen = ref(false)
const menuRef = ref<HTMLElement>()

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const handleClickOutside = (event: Event) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

const handleMenuItemClick = (item: MenuItem) => {
  if (item.action) {
    item.action()
  }
  closeMenu()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative" ref="menuRef">
    <!-- 用户头像触发器 -->
    <button 
      class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors hover:opacity-80"
      :class="{ 'bg-theme-primary-10': isOpen }"
      @click="toggleMenu"
    >
      <img 
        :src="user.avatar || 'https://via.placeholder.com/32x32?text=U'" 
        :alt="`${user.name}的头像`" 
        class="w-8 h-8 rounded-full border-2 border-border-secondary"
      >
      <span class="hidden sm:block text-sm font-medium text-font-primary">
        {{ user.name }}
      </span>
      <i 
        class="icon-[material-symbols--keyboard-arrow-down] w-4 h-4 text-font-tertiary transition-transform" 
        :class="{ 'rotate-180': isOpen }"
      ></i>
    </button>

    <!-- 下拉菜单 -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-show="isOpen"
        class="absolute right-0 mt-2 w-48 rounded-lg border border-border-primary bg-bg-primary shadow-lg py-1 z-50"
        style="box-shadow: 0 10px 25px var(--shadow-color)"
      >
        <template v-for="(item, index) in menuItems" :key="index">
          <!-- 分割线 -->
          <div 
            v-if="item.type === 'divider'"
            class="my-1 h-px bg-border-secondary"
          ></div>
          
          <!-- 菜单项 -->
          <component
            v-else
            :is="item.to ? 'router-link' : 'button'"
            :to="item.to"
            class="flex items-center space-x-3 w-full px-4 py-2 text-sm text-left transition-colors hover:bg-theme-primary-10"
            :class="{
              'text-danger hover:bg-danger-10': item.type === 'danger',
              'text-font-primary': item.type !== 'danger'
            }"
            @click="handleMenuItemClick(item)"
          >
            <i :class="item.icon" class="w-4 h-4"></i>
            <span>{{ item.label }}</span>
          </component>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 样式通过内联方式使用CSS变量 */
</style>