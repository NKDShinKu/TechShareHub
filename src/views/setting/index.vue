<script setup lang="ts">
defineOptions({ name: 'SettingPage' })

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 菜单项配置
const menuItems = [
  {
    key: 'profile',
    label: '个人资料',
    path: '/setting/profile',
    icon: '👤'
  },
  {
    key: 'account',
    label: '账户设置',
    path: '/setting/account',
    icon: '🔧'
  },
  {
    key: 'theme',
    label: '主题设置',
    path: '/setting/theme',
    icon: '🎨'
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
  <div class="setting-container">
    <!-- 侧边菜单 -->
    <div class="setting-sidebar">
      <div class="sidebar-header">
        <h2>设置</h2>
      </div>
      
      <nav class="sidebar-menu">
        <div v-for="item in menuItems" 
             :key="item.key"
             class="menu-item"
             :class="{ active: activeMenu === item.key }"
             @click="switchMenu(item)">
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-label">{{ item.label }}</span>
        </div>
      </nav>
    </div>
    
    <!-- 主内容区 -->
    <div class="setting-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.setting-container {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

.setting-sidebar {
  width: 250px;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 2rem 1.5rem 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.sidebar-menu {
  padding: 1rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-item.active {
  background: #e3f2fd;
  border-left-color: #007bff;
  color: #007bff;
}

.menu-icon {
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
}

.menu-label {
  font-weight: 500;
}

.setting-content {
  flex: 1;
  overflow: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .setting-container {
    flex-direction: column;
  }
  
  .setting-sidebar {
    width: 100%;
  }
  
  .sidebar-menu {
    display: flex;
    overflow-x: auto;
    padding: 0.5rem;
  }
  
  .menu-item {
    flex-direction: column;
    min-width: 80px;
    text-align: center;
    padding: 0.5rem;
    border-left: none;
    border-bottom: 3px solid transparent;
  }
  
  .menu-item.active {
    border-left: none;
    border-bottom-color: #007bff;
  }
}
</style>