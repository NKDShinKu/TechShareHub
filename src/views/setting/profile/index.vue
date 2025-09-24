<script setup lang="ts">
defineOptions({ name: 'SettingProfilePage' })
</script>

<template>
  <div class="message-favorites">
    <h1>个人资料</h1>
    <div class="message-list">
      <p>这里将显示个人资料相关的消息</p>
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