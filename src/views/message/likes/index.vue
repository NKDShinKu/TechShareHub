<script setup lang="ts">
defineOptions({ name: 'MessageLikesPage' })
</script>

<template>
  <div class="message-likes">
    <h1>赞消息</h1>
    <div class="message-list">
      <p>这里将显示点赞相关的消息</p>
    </div>
  </div>
</template>

<style scoped>
.message-likes {
  padding: 1rem;
}

.message-list {
  margin-top: 1rem;
}
</style>