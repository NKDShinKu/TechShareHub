<script setup lang="ts">
defineOptions({ name: 'MessageCommentsPage' })

// 模拟评论消息数据
const commentMessages = [
  {
    id: 1,
    user: {
      id: 'user1',
      name: '代码小生',
      avatar: ''
    },
    content: {
      id: 'article1',
      title: 'Vue 3 Composition API 深度解析',
      type: 'article'
    },
    comment: '写得很详细，特别是关于响应式原理的部分，受益匪浅！',
    time: '2024-01-15 15:20',
    read: false
  },
  {
    id: 2,
    user: {
      id: 'user2',
      name: 'React爱好者',
      avatar: ''
    },
    content: {
      id: 'note1',
      title: '前端性能优化技巧总结',
      type: 'note'
    },
    comment: '第3点关于懒加载的实现很实用，已经在项目中应用了。',
    time: '2024-01-15 14:10',
    read: false
  },
  {
    id: 3,
    user: {
      id: 'user3',
      name: '全栈开发者',
      avatar: ''
    },
    content: {
      id: 'comment1',
      title: '关于TypeScript类型推导的讨论',
      type: 'comment'
    },
    comment: '我觉得还可以考虑使用条件类型来处理这种情况。',
    time: '2024-01-14 19:30',
    read: true
  },
  {
    id: 4,
    user: {
      id: 'user4',
      name: 'Node.js开发',
      avatar: ''
    },
    content: {
      id: 'article2',
      title: 'GraphQL vs RESTful API 对比',
      type: 'article'
    },
    comment: '分析得很全面，不过我觉得在某些场景下GraphQL的复杂度可能会成为负担。有没有考虑过这个问题？',
    time: '2024-01-14 11:45',
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

// 回复评论
const replyToComment = (messageId: number) => {
  console.log('回复评论:', messageId)
}

// 标记为已读
const markAsRead = (messageId: number) => {
  const message = commentMessages.find(msg => msg.id === messageId)
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
        <h2 class="text-lg font-semibold text-font-primary">评论消息</h2>
        <p class="text-sm text-font-tertiary mt-1">查看对您内容的评论和回复</p>
      </div>
      <div class="flex items-center space-x-3">
        <span class="text-sm text-font-tertiary">
          {{ commentMessages.filter(msg => !msg.read).length }} 条未读
        </span>
        <button class="text-sm text-theme-primary hover:text-theme-primary-hover transition-colors">
          全部标记为已读
        </button>
      </div>
    </div>

    <!-- 评论消息列表 -->
    <div class="space-y-4">
      <div
        v-for="message in commentMessages"
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
              <!-- 评论图标 -->
              <span class="icon-[material-symbols--chat-bubble-outline] w-4 h-4 text-blue-500"></span>
              
              <!-- 用户名 -->
              <button 
                class="font-medium text-font-primary hover:text-theme-primary transition-colors"
                @click="handleUserClick(message.user.id)"
              >
                {{ message.user.name }}
              </button>
              
              <span class="text-sm text-font-tertiary">评论了您的{{ getContentTypeText(message.content.type) }}</span>
              
              <!-- 时间 -->
              <time class="text-xs text-font-tertiary">
                {{ message.time }}
              </time>
            </div>

            <!-- 评论内容 -->
            <div class="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <p class="text-sm text-font-primary leading-relaxed">{{ message.comment }}</p>
            </div>

            <!-- 被评论的内容 -->
            <div 
              class="flex items-center space-x-2 p-3 bg-bg-secondary rounded-lg cursor-pointer hover:bg-theme-primary-10 transition-colors mb-3"
              @click="handleContentClick(message.content.id, message.content.type)"
            >
              <span :class="[getContentTypeIcon(message.content.type), 'w-4 h-4 text-font-tertiary']"></span>
              <span class="text-sm text-font-secondary truncate">{{ message.content.title }}</span>
              <span class="icon-[material-symbols--chevron-right] w-4 h-4 text-font-tertiary"></span>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center space-x-4">
              <button 
                class="flex items-center space-x-1 text-xs text-theme-primary hover:text-theme-primary-hover transition-colors"
                @click="replyToComment(message.id)"
              >
                <span class="icon-[material-symbols--reply] w-3 h-3"></span>
                <span>回复</span>
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
      v-if="commentMessages.length === 0"
      class="text-center py-12"
    >
      <span class="icon-[material-symbols--chat-bubble-outline] w-16 h-16 text-font-tertiary mx-auto mb-4"></span>
      <p class="text-font-tertiary">暂无评论消息</p>
    </div>
  </div>
</template>