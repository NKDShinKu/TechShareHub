<script setup lang="ts">
defineOptions({ name: 'CreatorOverviewPage' })

// 模拟用户数据
const userData = {
  name: '二陷鲤真红',
  avatar: '',
  joinDays: 0,
  followers: 0,
  following: 4,
  totalViews: 0
}

// 数据统计
const statsData = [
  { label: '总粉丝数', value: 721, change: '--', icon: 'icon-[material-symbols--group-outline]' },
  { label: '文章展现数', value: 721, change: '--', icon: 'icon-[material-symbols--visibility-outline]' },
  { label: '文章阅读数', value: 721, change: '--', icon: 'icon-[material-symbols--article-outline]' },
  { label: '文章点赞数', value: 721, change: '--', icon: 'icon-[material-symbols--favorite-outline]' },
  { label: '文章评论数', value: 721, change: '--', icon: 'icon-[material-symbols--chat-bubble-outline]' },
  { label: '文章收藏数', value: 721, change: '--', icon: 'icon-[material-symbols--bookmark-outline]' }
]



// 格式化数字显示
const formatNumber = (num: number) => {
  if (num === 0) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<template>
  <div class="space-y-6">
    <!-- 用户信息卡片 -->
    <div class="bg-bg-primary rounded-lg p-6 border border-border-primary">
      <div class="flex items-center space-x-4 mb-6">
        <!-- 用户头像 -->
        <div class="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center">
          <span class="text-white text-xl font-bold">{{ userData.name.charAt(0) }}</span>
        </div>
        
        <!-- 用户信息 -->
        <div>
          <h2 class="text-xl font-bold text-font-primary mb-1">{{ userData.name }}</h2>
          <div class="flex items-center space-x-4 text-sm text-font-tertiary">
            <span>{{ userData.followers }} 粉丝</span>
            <span>{{ userData.following }} 关注</span>
            <span>{{ userData.totalViews }} 获赞</span>
            <span>在社区创作的第 {{ userData.joinDays }} 天</span>
          </div>
        </div>
      </div>
      

    </div>

    <!-- 数据概览 -->
    <div class="bg-bg-primary rounded-lg p-6 border border-border-primary">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-font-primary flex items-center">
          <span class="icon-[material-symbols--analytics-outline] w-5 h-5 mr-2"></span>
          数据概览
        </h3>
        <button class="text-sm text-theme-primary hover:text-theme-primary-hover transition-colors">
          查看更多 →
        </button>
      </div>
      
      <!-- 数据统计网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="stat in statsData"
          :key="stat.label"
          class="p-4 bg-bg-secondary rounded-lg border border-border-secondary hover:shadow-sm transition-shadow"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-font-tertiary">{{ stat.label }}</span>
            <span :class="[stat.icon, 'w-4 h-4 text-font-tertiary']"></span>
          </div>
          <div class="text-2xl font-bold text-font-primary mb-1">{{ formatNumber(stat.value) }}</div>
          <div class="text-xs text-font-tertiary">较昨日 {{ stat.change }}</div>
        </div>
      </div>
    </div>



    <!-- 近期发布 -->
    <div class="bg-bg-primary rounded-lg p-6 border border-border-primary">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-font-primary flex items-center">
          <span class="icon-[material-symbols--history] w-5 h-5 mr-2"></span>
          近期发布
        </h3>
        <div class="flex items-center space-x-4">
          <button class="px-3 py-1 text-sm text-theme-primary bg-theme-primary-10 rounded">文章</button>
          <button class="px-3 py-1 text-sm text-font-tertiary hover:text-theme-primary transition-colors">沸点</button>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div class="text-center py-12">
        <div class="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="icon-[material-symbols--article-outline] w-8 h-8 text-font-tertiary"></span>
        </div>
        <p class="text-font-tertiary text-sm">暂无发布内容</p>
        <router-link 
          to="/note"
          class="inline-block mt-4 px-6 py-2 bg-theme-primary text-white text-sm rounded-lg hover:bg-theme-primary-hover transition-colors"
        >
          发布第一篇文章
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 使用 Tailwind CSS 类，无需额外样式 */
</style>