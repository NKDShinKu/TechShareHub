<script setup lang="ts">
defineOptions({ name: 'MessageCommentsPage' })
</script>

<template>
  <div class="message-comments">
    <h1>评论消息</h1>
    <div class="message-list">
      <p>这里将显示评论相关的消息</p>
    </div>
  </div>
</template>

<style scoped>
.message-comments {
  padding: 1rem;
}

.message-list {
  margin-top: 1rem;
}
</style>