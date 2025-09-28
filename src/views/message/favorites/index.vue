<script setup lang="ts">
defineOptions({ name: 'MessageFavoritesPage' })

// 模拟收藏消息数据
const favoriteMessages = [
  {
    id: 1,
    user: {
      id: 'user1',
      name: '技术探索者',
      avatar: ''
    },
    content: {
      id: 'article1',
      title: '深入理解JavaScript闭包机制',
      type: 'article',
      summary: '从作用域链的角度详细解析JavaScript闭包的工作原理和实际应用场景...'
    },
    time: '2024-01-15 16:45',
    read: false
  },
  {
    id: 2,
    user: {
      id: 'user2',
      name: 'UI设计师小李',
      avatar: ''
    },
    content: {
      id: 'note1',
      title: '响应式设计最佳实践',
      type: 'note',
      summary: '总结了移动端适配的核心要点和常见问题的解决方案...'
    },
    time: '2024-01-15 13:22',
    read: false
  },
  {
    id: 3,
    user: {
      id: 'user3',
      name: '后端架构师',
      avatar: ''
    },
    content: {
      id: 'article2',
      title: '微服务架构设计模式',
      type: 'article',
      summary: '介绍了常用的微服务设计模式，包括API网关、服务发现等核心概念...'
    },
    time: '2024-01-14 20:15',
    read: true
  },
  {
    id: 4,
    user: {
      id: 'user4',
      name: '数据分析师',
      avatar: ''
    },
    content: {
      id: 'note2',
      title: 'Python数据可视化技巧',
      type: 'note',
      summary: '使用matplotlib和seaborn创建专业图表的实用技巧分享...'
    },
    time: '2024-01-14 14:30',
    read: true
  }
]

// 获取内容类型图标
const getContentTypeIcon = (type: string) => {
  const icons = {
    article: 'icon-[material-symbols--article-outline]',
    note: 'icon-[material-symbols--edit-note-outline]',
    tutorial: 'icon-[material-symbols--school-outline]'
  }
  return icons[type as keyof typeof icons] || icons.article
}

// 获取内容类型文本
const getContentTypeText = (type: string) => {
  const texts = {
    article: '文章',
    note: '笔记',
    tutorial: '教程'
  }
  return texts[type as keyof typeof texts] || '内容'
}

// 获取内容类型样式
const getContentTypeStyle = (type: string) => {
  const styles = {
    article: 'bg-blue-50 text-blue-600 border-blue-200',
    note: 'bg-green-50 text-green-600 border-green-200',
    tutorial: 'bg-purple-50 text-purple-600 border-purple-200'
  }
  return styles[type as keyof typeof styles] || styles.article
}

// 处理用户点击
const handleUserClick = (userId: string) => {
  console.log('查看用户:', userId)
}

// 处理内容点击
const handleContentClick = (contentId: string, type: string) => {
  console.log('查看收藏内容:', contentId, type)
}

// 标记为已读
const markAsRead = (messageId: number) => {
  const message = favoriteMessages.find(msg => msg.id === messageId)
  if (message) {
    message.read = true
  }
}

// 查看收藏夹
const viewFavorites = () => {
  console.log('查看我的收藏夹')
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-font-primary">收藏消息</h2>
        <p class="text-sm text-font-tertiary mt-1">查看谁收藏了您的内容</p>
      </div>
      <div class="flex items-center space-x-3">
        <span class="text-sm text-font-tertiary">
          {{ favoriteMessages.filter(msg => !msg.read).length }} 条未读
        </span>
        <button 
          class="text-sm text-theme-primary hover:text-theme-primary-hover transition-colors"
          @click="viewFavorites"
        >
          查看收藏夹
        </button>
        <button class="text-sm text-theme-primary hover:text-theme-primary-hover transition-colors">
          全部标记为已读
        </button>
      </div>
    </div>

    <!-- 收藏消息列表 -->
    <div class="space-y-4">
      <div
        v-for="message in favoriteMessages"
        :key="message.id"
        class="relative p-4 rounded-lg border border-border-primary bg-bg-primary hover:shadow-md transition-all duration-200"
        :class="{ 'bg-bg-secondary': !message.read }"
      >
        <!-- 未读标识 -->
        <div
          v-if="!message.read"
          class="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"
        ></div>

        <div class="flex items-start space-x-3">
          <!-- 用户头像 -->
          <div 
            class="flex-shrink-0 w-10 h-10 bg-theme-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-theme-primary-hover transition-colors"
            @click="handleUserClick(message.user.id)"
          >
            <span class="text-white font-medium text-sm">
              {{ message.user.name.charAt(0) }}
            </span>
          </div>

          <!-- 消息内容 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2 mb-3">
              <!-- 收藏图标 -->
              <span class="icon-[material-symbols--bookmark] w-4 h-4 text-yellow-500"></span>
              
              <!-- 用户名 -->
              <button 
                class="font-medium text-font-primary hover:text-theme-primary transition-colors"
                @click="handleUserClick(message.user.id)"
              >
                {{ message.user.name }}
              </button>
              
              <span class="text-sm text-font-tertiary">收藏了您的{{ getContentTypeText(message.content.type) }}</span>
              
              <!-- 时间 -->
              <time class="text-xs text-font-tertiary">
                {{ message.time }}
              </time>
            </div>

            <!-- 被收藏的内容卡片 -->
            <div 
              class="p-4 border rounded-lg cursor-pointer hover:shadow-sm transition-all duration-200"
              :class="getContentTypeStyle(message.content.type)"
              @click="handleContentClick(message.content.id, message.content.type)"
            >
              <div class="flex items-start space-x-3">
                <!-- 内容类型图标 -->
                <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center">
                  <span :class="[getContentTypeIcon(message.content.type), 'w-4 h-4']"></span>
                </div>
                
                <div class="flex-1 min-w-0">
                  <!-- 内容标题 -->
                  <h3 class="font-medium text-sm mb-2 line-clamp-1">
                    {{ message.content.title }}
                  </h3>
                  
                  <!-- 内容摘要 -->
                  <p class="text-xs opacity-80 line-clamp-2 leading-relaxed">
                    {{ message.content.summary }}
                  </p>
                  
                  <!-- 查看提示 -->
                  <div class="flex items-center justify-end mt-2">
                    <span class="text-xs opacity-70">点击查看详情</span>
                    <span class="icon-[material-symbols--chevron-right] w-3 h-3 ml-1 opacity-70"></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center space-x-4 mt-3">
              <button 
                class="flex items-center space-x-1 text-xs text-theme-primary hover:text-theme-primary-hover transition-colors"
                @click="handleContentClick(message.content.id, message.content.type)"
              >
                <span class="icon-[material-symbols--visibility] w-3 h-3"></span>
                <span>查看内容</span>
              </button>
              <button 
                v-if="!message.read"
                class="text-xs text-theme-primary hover:text-theme-primary-hover transition-colors"
                @click="markAsRead(message.id)"
              >
                标记为已读
              </button>
              <button class="text-xs text-font-tertiary hover:text-font-secondary transition-colors">
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div 
      v-if="favoriteMessages.length === 0"
      class="text-center py-12"
    >
      <span class="icon-[material-symbols--bookmark] w-16 h-16 text-font-tertiary mx-auto mb-4"></span>
      <p class="text-font-tertiary mb-2">暂无收藏消息</p>
      <p class="text-sm text-font-tertiary">当有人收藏您的内容时，会在这里显示</p>
    </div>
  </div>
</template>