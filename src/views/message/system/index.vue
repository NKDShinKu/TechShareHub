<script setup lang="ts">
defineOptions({ name: 'MessageSystemPage' })
</script>

<template>
  <div class="message-system">
    <h1>系统通知</h1>
    <div class="message-list">
      <p>这里将显示系统通知列表</p>
    </div>
  </div>
</template>

<style scoped>
.message-system {
  padding: 1rem;
}

.message-list {
  margin-top: 1rem;
}
</style>