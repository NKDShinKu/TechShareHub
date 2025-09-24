<script setup lang="ts">
import { useRoute } from 'vue-router'

// 个人中心主组件
const route = useRoute()
const userId = route.params.id
</script>
<template>
  <div class="user-page">
    <div class="user-header">
      <h1>个人中心</h1>
      <p>用户ID: {{ userId }}</p>
      <div class="user-tabs">
        <router-link :to="`/user/${userId}/articles`" class="user-tab">文章</router-link>
        <router-link :to="`/user/${userId}/history`" class="user-tab">浏览历史</router-link>
        <router-link :to="`/user/${userId}/favorites`" class="user-tab">收藏</router-link>
        <router-link :to="`/user/${userId}/likes`" class="user-tab">点赞</router-link>
      </div>
    </div>
    <div class="user-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.user-page {
  padding: 1rem;
}

.user-header {
  margin-bottom: 2rem;
}

.user-tabs {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.user-tab {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #666;
  border-bottom: 2px solid transparent;
}

.user-tab:hover,
.user-tab.router-link-active {
  color: #007acc;
  border-bottom-color: #007acc;
}

.user-content {
  margin-top: 1rem;
}
</style>