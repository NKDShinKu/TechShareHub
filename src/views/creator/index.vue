<script setup lang="ts">
// 创作中心主组件
</script>
<template>
  <div class="creator-page">
    <div class="creator-header">
      <h1>创作中心</h1>
      <div class="creator-tabs">
        <router-link to="/creator/overview" class="creator-tab">数据总览</router-link>
        <router-link to="/creator/manage" class="creator-tab">发布管理</router-link>
        <router-link to="/creator/help" class="creator-tab">帮助中心</router-link>
      </div>
    </div>
    <div class="creator-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.creator-page {
  padding: 1rem;
}

.creator-header {
  margin-bottom: 2rem;
}

.creator-tabs {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.creator-tab {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #666;
  border-bottom: 2px solid transparent;
}

.creator-tab:hover,
.creator-tab.router-link-active {
  color: #007acc;
  border-bottom-color: #007acc;
}

.creator-content {
  margin-top: 1rem;
}
</style>