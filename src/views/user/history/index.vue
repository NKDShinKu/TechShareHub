<script setup lang="ts">
defineOptions({ name: 'UserHistoryPage' })
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.id

console.log('浏览历史页面已加载，用户ID:', userId)
</script>

<template>
  <div class="user-history">
    <h1>浏览历史</h1>
    <div class="history-list">
      <p>这里将显示用户的浏览历史记录</p>
    </div>
  </div>
</template>

<style scoped>
.user-history {
  padding: 1rem;
}

.history-list {
  margin-top: 1rem;
}
</style>