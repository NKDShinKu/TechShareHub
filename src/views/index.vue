<script setup lang="ts">
// 组件导入
import Header from '@/layout/Header.vue';
import Main from '@/layout/Main.vue';

</script>
<template>
  <div class="w-full min-h-screen">
    <Header />
    <!-- 为固定的 Header 预留空间 -->
    <div class="pt-16">
      <Main />
    </div>
  </div>
</template>

<style>

</style>