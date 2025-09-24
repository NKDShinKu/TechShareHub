<script setup lang="ts">
// Main 布局：负责承载页面的主要内容和路由出口
</script>
<template>
    <div class="w-full px-[10%]">
        <!-- 如果需要在调用方传入 slot，可以在 router-view 前渲染 -->
        <slot />
        <!-- 路由出口放在 Main 内，所有子页面会在这里渲染 -->
        <router-view />
    </div>
</template>

<style scoped>
</style>