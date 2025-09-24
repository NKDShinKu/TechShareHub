<script setup lang="ts">
defineOptions({ name: 'CreatorOverviewPage' })
// 数据总览页面
console.log('数据总览页面已加载')
</script>

<template>
  <div class="creator-overview">
    <h1>数据总览</h1>
    <p>这里将显示创作者的数据统计信息</p>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>文章总数</h3>
        <p>--</p>
      </div>
      <div class="stat-card">
        <h3>阅读量</h3>
        <p>--</p>
      </div>
      <div class="stat-card">
        <h3>点赞数</h3>
        <p>--</p>
      </div>
      <div class="stat-card">
        <h3>收藏数</h3>
        <p>--</p>
      </div>
    </div>
  </div>
</template>



<style scoped>
.creator-overview {
  padding: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-card {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
}
</style>