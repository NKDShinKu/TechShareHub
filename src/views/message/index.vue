<script setup lang="ts">
// 消息中心主组件
</script>
<template>
  <div class="message-page">
    <div class="message-header">
      <h1>消息中心</h1>
      <div class="message-tabs">
        <router-link to="/message/system" class="message-tab">系统通知</router-link>
        <router-link to="/message/comments" class="message-tab">评论</router-link>
        <router-link to="/message/likes" class="message-tab">赞</router-link>
        <router-link to="/message/favorites" class="message-tab">收藏</router-link>
      </div>
    </div>
    <div class="message-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.message-page {
  padding: 1rem;
}

.message-header {
  margin-bottom: 2rem;
}

.message-tabs {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.message-tab {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #666;
  border-bottom: 2px solid transparent;
}

.message-tab:hover,
.message-tab.router-link-active {
  color: #007acc;
  border-bottom-color: #007acc;
}

.message-content {
  margin-top: 1rem;
}
</style>