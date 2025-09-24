<script setup lang="ts">
defineOptions({ name: 'UserArticlesPage' })
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.id

console.log('用户文章页面已加载，用户ID:', userId)
</script>

<template>
  <div class="user-articles">
    <h1>用户文章</h1>
    <div class="articles-list">
      <p>这里将显示用户发布的文章列表</p>
    </div>
  </div>
</template>

<style scoped>
.user-articles {
  padding: 1rem;
}

.articles-list {
  margin-top: 1rem;
}
</style>