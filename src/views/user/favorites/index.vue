<script setup lang="ts">
defineOptions({ name: 'UserFavoritesPage' })
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.id

console.log('用户收藏页面已加载，用户ID:', userId)
</script>

<template>
  <div class="user-favorites">
    <h1>收藏列表</h1>
    <div class="favorites-list">
      <p>这里将显示用户的收藏列表</p>
    </div>
  </div>
</template>

<style scoped>
.user-favorites {
  padding: 1rem;
}

.favorites-list {
  margin-top: 1rem;
}
</style>