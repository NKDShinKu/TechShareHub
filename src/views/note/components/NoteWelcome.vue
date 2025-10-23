<template>
  <div class="note-welcome h-full flex items-center justify-center bg-bg-secondary">
    <div class="text-center max-w-2xl px-8">
      <!-- Logo 区域 -->
      <div class="mb-8">
        <div class="w-32 h-32 bg-theme-primary-10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <i class="icon-[material-symbols--edit-note-outline] text-6xl text-theme-primary"></i>
        </div>
        <h1 class="text-3xl font-bold text-font-primary mb-3">欢迎使用 TechShareHub 笔记</h1>
        <p class="text-lg text-font-secondary">记录你的技术心得，分享你的学习笔记</p>
      </div>

      <!-- 功能介绍 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-bg-primary rounded-xl p-6 border border-border-primary">
          <div class="w-12 h-12 bg-success-light rounded-lg flex items-center justify-center mx-auto mb-4">
            <i class="icon-[material-symbols--folder-outline] text-2xl text-success"></i>
          </div>
          <h3 class="font-semibold text-font-primary mb-2">文件夹管理</h3>
          <p class="text-sm text-font-secondary">创建文件夹，分类整理你的笔记</p>
        </div>

        <div class="bg-bg-primary rounded-xl p-6 border border-border-primary">
          <div class="w-12 h-12 bg-theme-primary-10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i class="icon-[material-symbols--edit-outline] text-2xl text-theme-primary"></i>
          </div>
          <h3 class="font-semibold text-font-primary mb-2">Markdown 编辑</h3>
          <p class="text-sm text-font-secondary">支持 Markdown 语法，实时预览</p>
        </div>

        <div class="bg-bg-primary rounded-xl p-6 border border-border-primary">
          <div class="w-12 h-12 bg-warning-light rounded-lg flex items-center justify-center mx-auto mb-4">
            <i class="icon-[material-symbols--cloud-upload] text-2xl text-warning"></i>
          </div>
          <h3 class="font-semibold text-font-primary mb-2">一键发布</h3>
          <p class="text-sm text-font-secondary">完成后可发布到社区分享</p>
        </div>
      </div>

      <!-- 快速开始 -->
      <div class="bg-bg-primary rounded-xl p-8 border border-border-primary">
        <h2 class="text-xl font-semibold text-font-primary mb-4">快速开始</h2>
        <div class="text-left space-y-3">
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-theme-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">1</div>
            <div>
              <p class="text-font-primary font-medium">创建或选择文件夹</p>
              <p class="text-sm text-font-secondary">在左侧点击"新建文件夹"或选择现有文件夹</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-theme-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">2</div>
            <div>
              <p class="text-font-primary font-medium">新建笔记</p>
              <p class="text-sm text-font-secondary">展开文件夹后，点击"新建笔记"开始创作</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-theme-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">3</div>
            <div>
              <p class="text-font-primary font-medium">编辑和保存</p>
              <p class="text-sm text-font-secondary">使用 Markdown 编写内容，点击保存按钮保存笔记</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 提示 -->
      <div class="mt-8 flex items-center justify-center gap-2 text-sm text-font-tertiary">
        <i class="icon-[material-symbols--info-outline]"></i>
        <span>提示：选择左侧的笔记开始编辑</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'NoteWelcome' })
</script>

<style scoped>
</style>