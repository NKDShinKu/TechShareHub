<script setup lang="ts">
defineOptions({ name: 'RightSidebar' })

import { ref } from 'vue'
import CommonCard from '@/components/CommonCard.vue'

// 名言/搞梗话语数据
const quotes = [
  { text: '代码是写给人看的，偶尔在机器上跑一下。', author: '哈尔·阿贝尔森' },
  { text: '程序员的三大美德：懒惰、急躁和傲慢。', author: '拉里·沃尔' },
  { text: '任何能够被写成JavaScript的程序，最终都会被写成JavaScript。', author: 'Atwood定律' },
  { text: '编程就是把复杂的问题分解成简单的问题。', author: '匿名大佬' },
  { text: '能跑就行，不要重构。', author: '某甲方' },
  { text: '这个bug不是我写的，是之前那个人留下的。', author: '每个程序员' },
  { text: '代码审查就像照镜子，总能发现意想不到的东西。', author: '资深工程师' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { text: '先让它工作，再让它正确，最后让它快速。', author: 'Kent Beck' },
  { text: '99 little bugs in the code, 99 little bugs. Take one down, patch it around, 127 little bugs in the code.', author: '程序员民谣' }
]

const currentQuoteIndex = ref(0)
const currentQuote = ref(quotes[0])

// 热门文章数据
const hotArticles = [
  {
    id: 1,
    title: 'Vue 3.5 新特性详解：性能优化与开发体验提升',
    author: 'Vue官方团队',
    views: 15420,
    comments: 89,
    likes: 312,
    trend: 'up',
    category: 'Vue.js'
  },
  {
    id: 2,
    title: 'TypeScript 5.2 发布：装饰器、模式匹配等新功能',
    author: 'Microsoft',
    views: 12850,
    comments: 65,
    likes: 287,
    trend: 'up',
    category: 'TypeScript'
  },
  {
    id: 3,
    title: '深入理解React Hooks：从useState到自定义Hook',
    author: 'React技术栈',
    views: 9680,
    comments: 47,
    likes: 203,
    trend: 'hot',
    category: 'React'
  },
  {
    id: 4,
    title: '前端性能优化实战：从100ms到10ms的优化之路',
    author: '性能优化专家',
    views: 8340,
    comments: 52,
    likes: 178,
    trend: 'up',
    category: '性能优化'
  },
  {
    id: 5,
    title: 'AI编程助手对比：GitHub Copilot vs Claude vs ChatGPT',
    author: 'AI技术观察',
    views: 7920,
    comments: 38,
    likes: 156,
    trend: 'new',
    category: 'AI开发'
  }
]

// 切换名言
const switchQuote = () => {
  currentQuoteIndex.value = (currentQuoteIndex.value + 1) % quotes.length
  currentQuote.value = quotes[currentQuoteIndex.value]
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 处理文章点击
const handleArticleClick = (articleId: number) => {
  console.log('查看文章:', articleId)
  // 这里可以添加路由跳转逻辑
}
</script>

<template>
  <div class="w-75 space-y-6">
    <!-- 今日名言卡片 -->
    <CommonCard title="今日名言" padding="p-4">
      <div class="space-y-4">
        <!-- 名言内容 -->
        <div class="text-center">
          <div class="mb-3">
            <i class="i-heroicons-chat-bubble-oval-left w-8 h-8 text-theme-primary mx-auto mb-3"></i>
            <blockquote class="text-sm text-font-primary leading-relaxed italic">
              "{{ currentQuote.text }}"
            </blockquote>
          </div>
          <div class="text-xs text-font-tertiary">
            —— {{ currentQuote.author }}
          </div>
        </div>

        <!-- 切换按钮 -->
        <div class="flex justify-center">
          <button
            class="flex items-center space-x-2 px-3 py-2 text-sm bg-theme-primary-10 text-theme-primary rounded-lg hover:bg-theme-primary-20 transition-colors"
            @click="switchQuote"
          >
            <span class="icon-[lets-icons--horizontal-switch-light]"></span>
            <span>换一句</span>
          </button>
        </div>
      </div>
    </CommonCard>

    <!-- 文章热度榜卡片 -->
    <CommonCard title="文章热度榜" subtitle="本周热门" padding="p-4">
      <div class="space-y-3">
        <div
          v-for="(article, index) in hotArticles"
          :key="article.id"
          class="flex items-start space-x-3 p-3 rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer border border-border-secondary"
          @click="handleArticleClick(article.id)"
        >
          <!-- 排名 -->
          <div class="flex-shrink-0 w-6 text-center">
            <span
              class="text-sm font-bold"
              :class="{
                'text-red-500': index === 0,
                'text-orange-500': index === 1,
                'text-yellow-600': index === 2,
                'text-font-tertiary': index > 2
              }"
            >
              {{ index + 1 }}
            </span>
          </div>

          <!-- 文章信息 -->
          <div class="flex-1 min-w-0 space-y-2">
            <!-- 标题和趋势 -->
            <div class="flex items-start justify-between">
              <h4 class="text-sm font-medium text-font-primary line-clamp-2 flex-1 pr-2">
                {{ article.title }}
              </h4>
            </div>

            <!-- 作者和分类 -->
            <div class="flex items-center space-x-2 text-xs text-font-tertiary">
              <span>{{ article.author }}</span>
              <span>·</span>
              <span class="px-2 py-1 bg-theme-primary-10 text-theme-primary rounded">{{ article.category }}</span>
            </div>

            <!-- 统计数据 -->
            <div class="flex items-center space-x-4 text-xs text-font-tertiary">
              <div class="flex items-center space-x-1">
                <span class="icon-[tabler--eye] w-4 h-4"></span>
                <span>{{ formatNumber(article.views) }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <span class="icon-[mingcute--thumb-up-line] w-4 h-4"></span>
                <span>{{ formatNumber(article.likes) }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <span class="icon-[mdi--comment-text-outline] w-4 h-4"></span>
                <span>{{ formatNumber(article.comments) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 查看更多 -->
        <div class="text-center pt-2 border-t border-border-primary">
          <button class="text-sm text-theme-primary hover:text-theme-primary-hover transition-colors">
            查看完整榜单 →
          </button>
        </div>
      </div>
    </CommonCard>
  </div>
</template>

