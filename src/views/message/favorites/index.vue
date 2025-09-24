<script setup lang="ts">
defineOptions({ name: 'MessageFavoritesPage' })
</script>

<template>
  <div class="message-favorites">
    <h1>收藏消息</h1>
    <div class="message-list">
      <p>这里将显示收藏相关的消息</p>
    </div>
  </div>
</template>

<style scoped>
.message-favorites {
  padding: 1rem;
}

.message-list {
  margin-top: 1rem;
}
</style>