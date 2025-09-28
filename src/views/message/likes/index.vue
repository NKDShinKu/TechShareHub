<script setup lang="ts">
defineOptions({ name: 'MessageLikesPage' })

// 模拟点赞消息数据
const likeMessages = [
  {
    id: 1,
    user: {
      id: 'user1',
      name: '前端小王',
      avatar: ''
    },
    content: {
      id: 'article1',
      title: 'Vue 3.5 新特性详解',
      type: 'article'
    },
    time: '2024-01-15 14:30',
    read: false
  },
  {
    id: 2,
    user: {
      id: 'user2',
      name: 'React开发者',
      avatar: ''
    },
    content: {
      id: 'comment1',
      title: '关于性能优化的看法很有道理',
      type: 'comment'
    },
    time: '2024-01-15 12:15',
    read: false
  },
  {
    id: 3,
    user: {
      id: 'user3',
      name: '全栈工程师',
      avatar: ''
    },
    content: {
      id: 'article2',
      title: 'TypeScript 进阶技巧分享',
      type: 'article'
    },
    time: '2024-01-14 16:22',
    read: true
  },
  {
    id: 4,
    user: {
      id: 'user4',
      name: 'UI设计师',
      avatar: ''
    },
    content: {
      id: 'note1',
      title: '设计系统搭建笔记',
      type: 'note'
    },
    time: '2024-01-14 09:30',
    read: true
  }
]

// 获取内容类型图标
const getContentTypeIcon = (type: string) => {
  const icons = {
    article: 'icon-[material-symbols--article-outline]',
    comment: 'icon-[material-symbols--chat-bubble-outline]',
    note: 'icon-[material-symbols--edit-note-outline]'
  }
  return icons[type as keyof typeof icons] || icons.article
}

// 获取内容类型文本
const getContentTypeText = (type: string) => {
  const texts = {
    article: '文章',
    comment: '评论',
    note: '笔记'
  }
  return texts[type as keyof typeof texts] || '内容'
}

// 处理用户点击
const handleUserClick = (userId: string) => {
  console.log('查看用户:', userId)
}

// 处理内容点击
const handleContentClick = (contentId: string, type: string) => {
  console.log('查看内容:', contentId, type)
}

// 标记为已读
const markAsRead = (messageId: number) => {
  const message = likeMessages.find(msg => msg.id === messageId)
  if (message) {
    message.read = true
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-font-primary">点赞消息</h2>
        <p class="text-sm text-font-tertiary mt-1">查看谁给您的内容点了赞</p>
      </div>
      <div class="flex items-center space-x-3">
        <span class="text-sm text-font-tertiary">
          {{ likeMessages.filter(msg => !msg.read).length }} 条未读
        </span>
        <button class="text-sm text-theme-primary hover:text-theme-primary-hover transition-colors">
          全部标记为已读
        </button>
      </div>
    </div>

    <!-- 点赞消息列表 -->
    <div class="space-y-3">
      <div
        v-for="message in likeMessages"
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
            <div class="flex items-center space-x-2 mb-2">
              <!-- 点赞图标 -->
              <span class="icon-[material-symbols--favorite] w-4 h-4 text-red-500"></span>
              
              <!-- 用户名 -->
              <button 
                class="font-medium text-font-primary hover:text-theme-primary transition-colors"
                @click="handleUserClick(message.user.id)"
              >
                {{ message.user.name }}
              </button>
              
              <span class="text-sm text-font-tertiary">赞了您的{{ getContentTypeText(message.content.type) }}</span>
              
              <!-- 时间 -->
              <time class="text-xs text-font-tertiary">
                {{ message.time }}
              </time>
            </div>

            <!-- 被点赞的内容 -->
            <div 
              class="flex items-center space-x-2 p-3 bg-bg-secondary rounded-lg cursor-pointer hover:bg-theme-primary-10 transition-colors"
              @click="handleContentClick(message.content.id, message.content.type)"
            >
              <span :class="[getContentTypeIcon(message.content.type), 'w-4 h-4 text-font-tertiary']"></span>
              <span class="text-sm text-font-secondary truncate">{{ message.content.title }}</span>
              <span class="icon-[material-symbols--chevron-right] w-4 h-4 text-font-tertiary"></span>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center space-x-4 mt-3">
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
      v-if="likeMessages.length === 0"
      class="text-center py-12"
    >
      <span class="icon-[material-symbols--favorite] w-16 h-16 text-font-tertiary mx-auto mb-4"></span>
      <p class="text-font-tertiary">暂无点赞消息</p>
    </div>
  </div>
</template>