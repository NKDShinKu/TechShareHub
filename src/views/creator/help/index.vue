<script setup lang="ts">
defineOptions({ name: 'CreatorHelpPage' })
</script>

<template>
  <div class="creator-help">
    <h1>帮助中心</h1>
    <div class="help-sections">
      <div class="help-section">
        <h2>创作指南</h2>
        <p>了解如何创作优质内容</p>
      </div>
      <div class="help-section">
        <h2>发布规范</h2>
        <p>查看发布内容的规范要求</p>
      </div>
      <div class="help-section">
        <h2>常见问题</h2>
        <p>查找常见问题的解答</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.creator-help {
  padding: 1rem;
}

.help-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.help-section {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>