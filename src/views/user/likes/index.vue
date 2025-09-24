<script setup lang="ts">
defineOptions({ name: 'UserLikesPage' })
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.id

console.log('用户点赞页面已加载，用户ID:', userId)
</script>

<template>
  <div class="user-likes">
    <h1>点赞列表</h1>
    <div class="likes-list">
      <p>这里将显示用户点赞的内容列表</p>
    </div>
  </div>
</template>

<style scoped>
.user-likes {
  padding: 1rem;
}

.likes-list {
  margin-top: 1rem;
}
</style>