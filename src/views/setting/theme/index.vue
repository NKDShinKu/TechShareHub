<script setup lang="ts">
defineOptions({ name: 'SettingThemePage' })
</script>

<template>
  <div class="message-favorites">
    <h1>主题</h1>
    <div class="message-list">
      <p>这里将显示主题相关的消息</p>
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