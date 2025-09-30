<script setup lang="ts">
import { reactive } from 'vue'

defineOptions({ name: 'CreatorHelpPage' })

// 帮助分类
const helpCategories = reactive([
  {
    id: 'guide',
    title: '创作指南',
    icon: 'icon-[material-symbols--edit-document]',
    articles: [
      { title: '如何写出吸引人的标题', views: 1205 },
      { title: '优质内容创作技巧', views: 892 },
      { title: '图片选择和编辑指南', views: 634 },
      { title: '代码规范与最佳实践', views: 1456 }
    ]
  },
  {
    id: 'rules',
    title: '发布规范',
    icon: 'icon-[material-symbols--rule]',
    articles: [
      { title: '内容发布规范', views: 2341 },
      { title: '版权声明要求', views: 876 },
      { title: '标签使用指南', views: 567 },
      { title: '社区公约', views: 1789 }
    ]
  },
  {
    id: 'faq',
    title: '常见问题',
    icon: 'icon-[material-symbols--quiz]',
    articles: [
      { title: '如何提高文章曝光率？', views: 3456 },
      { title: '为什么我的文章被下架？', views: 2134 },
      { title: '如何获得更多粉丝？', views: 1876 },
      { title: '收益相关问题解答', views: 2987 }
    ]
  },
  {
    id: 'tools',
    title: '工具使用',
    icon: 'icon-[material-symbols--build]',
    articles: [
      { title: '编辑器使用教程', views: 1234 },
      { title: 'markdown语法指南', views: 987 },
      { title: '图片上传和管理', views: 654 },
      { title: '数据统计功能', views: 432 }
    ]
  }
])

// 搜索功能
const searchQuery = reactive({ value: '' })

// 热门问题
const hotQuestions = reactive([
  '如何提高文章阅读量？',
  '版权问题怎么处理？',
  '收益如何计算？',
  '如何申请认证？',
  '为什么文章审核失败？'
])

const handleSearch = () => {
  console.log('搜索:', searchQuery.value)
  // 实现搜索逻辑
}

const openArticle = (article: any) => {
  console.log('打开文章:', article.title)
  // 实现打开文章逻辑
}
</script>

<template>
  <div class="creator-help bg-bg-primary min-h-screen">
    <!-- 页面头部 -->
    <div class="bg-gradient-to-r from-theme-primary to-purple-600 text-white py-12">
      <div class="max-w-4xl mx-auto px-6">
        <h1 class="text-3xl font-bold mb-4">帮助中心</h1>
        <p class="text-white/80 mb-8">为创作者提供全方位的帮助和指导</p>
        
        <!-- 搜索框 -->
        <div class="relative max-w-xl">
          <input
            v-model="searchQuery.value"
            type="text"
            placeholder="搜索你想了解的问题..."
            class="w-full px-4 py-3 pl-12 bg-white text-font-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
            @keyup.enter="handleSearch"
          >
          <i class="icon-[material-symbols--search] absolute left-4 top-1/2 transform -translate-y-1/2 text-font-tertiary text-xl"></i>
          <button
            @click="handleSearch"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md transition-colors"
          >
            搜索
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-6 py-8">
      <!-- 热门问题 -->
      <div class="mb-12">
        <h2 class="text-xl font-semibold mb-6 flex items-center text-font-primary">
          <i class="icon-[material-symbols--trending-up] text-orange-500 mr-2 text-2xl"></i>
          热门问题
        </h2>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="question in hotQuestions"
            :key="question"
            class="bg-bg-secondary hover:bg-bg-tertiary text-font-secondary px-4 py-2 rounded-full text-sm transition-colors"
            @click="searchQuery.value = question; handleSearch()"
          >
            {{ question }}
          </button>
        </div>
      </div>

      <!-- 帮助分类 -->
      <div class="grid lg:grid-cols-2 gap-8">
        <div
          v-for="category in helpCategories"
          :key="category.id"
          class="bg-bg-primary border border-border-primary rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <!-- 分类标题 -->
          <div class="flex items-center mb-6">
            <div class="p-3 bg-theme-primary-10 rounded-lg mr-4">
              <i :class="category.icon" class="text-2xl text-theme-primary"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-font-primary">{{ category.title }}</h3>
              <p class="text-font-tertiary text-sm">{{ category.articles.length }} 篇文章</p>
            </div>
          </div>

          <!-- 文章列表 -->
          <div class="space-y-3">
            <div
              v-for="article in category.articles"
              :key="article.title"
              class="flex items-center justify-between p-3 bg-bg-secondary rounded-lg hover:bg-bg-tertiary cursor-pointer transition-colors"
              @click="openArticle(article)"
            >
              <div class="flex-1">
                <h4 class="text-font-primary font-medium">{{ article.title }}</h4>
              </div>
              <div class="flex items-center text-font-tertiary text-sm ml-4">
                <i class="icon-[material-symbols--visibility] mr-1"></i>
                {{ article.views }}
              </div>
            </div>
          </div>

          <!-- 查看更多 -->
          <div class="mt-4 pt-4 border-t border-border-secondary">
            <button class="text-theme-primary hover:text-theme-primary-hover text-sm font-medium flex items-center">
              查看更多
              <i class="icon-[material-symbols--arrow-forward] ml-1"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 联系支持 -->
      <div class="mt-12 bg-gradient-to-r from-success-light to-info-light rounded-xl p-8">
        <div class="text-center">
          <i class="icon-[material-symbols--support-agent] text-4xl text-success mb-4"></i>
          <h3 class="text-xl font-semibold text-font-primary mb-2">还有问题？</h3>
          <p class="text-font-secondary mb-6">我们的客服团队随时为您提供帮助</p>
          <div class="flex justify-center gap-4">
            <button class="bg-success hover:bg-success-hover text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors">
              <i class="icon-[material-symbols--chat] mr-2"></i>
              在线客服
            </button>
            <button class="bg-bg-primary border border-border-primary hover:border-border-secondary text-font-secondary px-6 py-3 rounded-lg font-medium flex items-center transition-colors">
              <i class="icon-[material-symbols--mail] mr-2"></i>
              邮件联系
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>