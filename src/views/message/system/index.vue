<script setup lang="ts">
defineOptions({ name: 'MessageSystemPage' })

// 模拟系统通知数据
const systemNotifications = [
  {
    id: 1,
    title: '系统维护通知',
    content: '系统将于今晚 23:00-01:00 进行维护升级，期间可能影响部分功能使用',
    type: 'warning',
    time: '2024-01-15 14:30',
    read: false
  },
  {
    id: 2,
    title: '新功能上线',
    content: '笔记分享功能已正式上线，快去体验吧！',
    type: 'info',
    time: '2024-01-14 10:00',
    read: true
  },
  {
    id: 3,
    title: '安全提醒',
    content: '检测到您的账户在新设备登录，如非本人操作请及时修改密码',
    type: 'danger',
    time: '2024-01-13 16:45',
    read: false
  },
  {
    id: 4,
    title: '活动通知',
    content: '春节特别活动即将开始，参与活动赢取丰厚奖品！',
    type: 'success',
    time: '2024-01-12 09:20',
    read: true
  },
  {
    id: 5,
    title: '活动通知',
    content: '春节特别活动即将开始，参与活动赢取丰厚奖品！',
    type: 'success',
    time: '2024-01-12 09:20',
    read: true
  },
  {
    id: 6,
    title: '活动通知',
    content: '春节特别活动即将开始，参与活动赢取丰厚奖品！',
    type: 'success',
    time: '2024-01-12 09:20',
    read: true
  },
  {
    id: 7,
    title: '活动通知',
    content: '春节特别活动即将开始，参与活动赢取丰厚奖品！',
    type: 'success',
    time: '2024-01-12 09:20',
    read: true
  },
  {
    id: 8,
    title: '活动通知',
    content: '春节特别活动即将开始，参与活动赢取丰厚奖品！',
    type: 'success',
    time: '2024-01-12 09:20',
    read: true
  },
  {
    id: 9,
    title: '活动通知',
    content: '春节特别活动即将开始，参与活动赢取丰厚奖品！',
    type: 'success',
    time: '2024-01-12 09:20',
    read: true
  },
  {
    id: 10,
    title: '活动通知',
    content: '春节特别活动即将开始，参与活动赢取丰厚奖品！',
    type: 'success',
    time: '2024-01-12 09:20',
    read: true
  },
  {
    id: 11,
    title: '活动通知',
    content: '春节特别活动即将开始，参与活动赢取丰厚奖品！',
    type: 'success',
    time: '2024-01-12 09:20',
    read: true
  },
  {
    id: 12,
    title: '活动通知',
    content: '春节特别活动即将开始，参与活动赢取丰厚奖品！',
    type: 'success',
    time: '2024-01-12 09:20',
    read: true
  },
  {
    id: 13,
    title: '活动通知',
    content: '春节特别活动即将开始，参与活动赢取丰厚奖品！',
    type: 'success',
    time: '2024-01-12 09:20',
    read: true
  },
  {
    id: 14,
    title: '活动通知',
    content: '春节特别活动即将开始，参与活动赢取丰厚奖品！',
    type: 'success',
    time: '2024-01-12 09:20',
    read: true
  },
  {
    id: 15,
    title: '活动通知',
    content: '春节特别活动即将开始，参与活动赢取丰厚奖品！',
    type: 'success',
    time: '2024-01-12 09:20',
    read: true
  },
  {
    id: 16,
    title: '活动通知',
    content: '春节特别活动即将开始，参与活动赢取丰厚奖品！',
    type: 'success',
    time: '2024-01-12 09:20',
    read: true
  },
]

// 获取通知类型样式
const getNotificationTypeStyle = (type: string) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  }
  return styles[type as keyof typeof styles] || styles.info
}

// 获取通知图标
const getNotificationIcon = (type: string) => {
  const icons = {
    info: 'icon-[material-symbols--info]',
    warning: 'icon-[material-symbols--warning]',
    danger: 'icon-[material-symbols--error]',
    success: 'icon-[material-symbols--check-circle]'
  }
  return icons[type as keyof typeof icons] || icons.info
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-font-primary">系统通知</h2>
        <p class="text-sm text-font-tertiary mt-1">查看系统重要通知和公告</p>
      </div>
      <button class="text-sm text-theme-primary hover:text-theme-primary-hover transition-colors">
        全部标记为已读
      </button>
    </div>

    <!-- 通知列表 -->
    <div class="space-y-4">
      <div
        v-for="notification in systemNotifications"
        :key="notification.id"
        class="relative p-4 rounded-lg border border-border-primary bg-bg-primary hover:shadow-md transition-all duration-200"
        :class="{ 'bg-bg-secondary': !notification.read }"
      >
        <!-- 未读标识 -->
        <div
          v-if="!notification.read"
          class="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"
        ></div>

        <!-- 通知头部 -->
        <div class="flex items-start space-x-3">
          <!-- 类型图标 -->
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border"
            :class="getNotificationTypeStyle(notification.type)"
          >
            <span :class="[getNotificationIcon(notification.type), 'w-4 h-4']"></span>
          </div>

          <!-- 通知内容 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium text-font-primary truncate">
                {{ notification.title }}
              </h3>
              <time class="text-xs text-font-tertiary whitespace-nowrap ml-2">
                {{ notification.time }}
              </time>
            </div>
            
            <p class="text-sm text-font-secondary leading-relaxed">
              {{ notification.content }}
            </p>

            <!-- 操作按钮 -->
            <div class="flex items-center space-x-4 mt-3">
              <button 
                v-if="!notification.read"
                class="text-xs text-theme-primary hover:text-theme-primary-hover transition-colors"
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
      v-if="systemNotifications.length === 0"
      class="text-center py-12"
    >
      <span class="icon-[material-symbols--notifications-off] w-16 h-16 text-font-tertiary mx-auto mb-4"></span>
      <p class="text-font-tertiary">暂无系统通知</p>
    </div>
  </div>
</template>