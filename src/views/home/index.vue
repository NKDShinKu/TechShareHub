<script setup lang="ts">
// 首页主组件
const categories = [
  { id: '0', name: '全部' },
  { id: '1', name: '技术分享' },
  { id: '2', name: '项目经验' },
  { id: '3', name: '工具推荐' },
  { id: '4', name: '职场心得' },
  { id: '5', name: '学习笔记' }
]
</script>
<template>
  <div class="home-page">
    <div class="home-header">
      <h1>TechShareHub</h1>
      <div class="category-tabs">
        <router-link 
          v-for="category in categories" 
          :key="category.id"
          :to="`/home/category/${category.id}`" 
          class="category-tab"
        >
          {{ category.name }}
        </router-link>
      </div>
    </div>
    <div class="home-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding: 1rem;
}

.home-header {
  margin-bottom: 2rem;
}

.category-tabs {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  border-bottom: 1px solid #e0e0e0;
  flex-wrap: wrap;
}

.category-tab {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #666;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.category-tab:hover,
.category-tab.router-link-active {
  color: #007acc;
  border-bottom-color: #007acc;
}

.home-content {
  margin-top: 1rem;
}
</style>