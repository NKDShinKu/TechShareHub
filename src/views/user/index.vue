<template>
  <div class="p-4 max-w-screen-2xl mx-auto">
    <div class="flex items-start gap-6 min-h-[calc(100vh-2rem)]">
      <!-- 左侧主内容区 -->
      <div class="flex-1 min-w-0 space-y-4">
        <!-- 导航菜单 -->
        <CommonCard padding="p-1">
          <div class="nav-menu flex">
            <router-link 
              v-for="tab in tabs" 
              :key="tab.path"
              :to="`/user/${userId}${tab.path}`" 
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 cursor-pointer transition-colors border-r border-border-secondary last:border-r-0"
              active-class="bg-theme-primary-10 text-theme-primary"
            >
              <span :class="tab.icon" class="w-5 h-5"></span>
              <span class="font-medium">{{ tab.name }}</span>
            </router-link>
          </div>
        </CommonCard>

        <!-- 内容区域 -->
        <router-view 
          :user-id="userId"
          :is-current-user="isCurrentUser"
        />
      </div>

      <!-- 右侧用户信息卡片 -->
      <div class="w-60 shrink-0 sticky top-18">
        <CommonCard>
          <div class="text-center">
            <!-- 头像 -->
            <div class="relative inline-block mb-3">
              <img 
                :src="userData.avatar || '/default-avatar.png'" 
                :alt="userData.nickname"
                class="w-20 h-20 rounded-full object-cover border-2 border-border-primary"
              >
            </div>
            
            <!-- 昵称 -->
            <h2 class="text-lg font-bold text-font-primary mb-2">{{ userData.nickname }}</h2>
            
            <!-- 个性签名 -->
            <p class="text-sm text-font-tertiary mb-4 px-2 line-clamp-3">
              {{ userData.description || '这个人很懒,什么都没有留下...' }}
            </p>
            
            <!-- 联系方式 -->
            <div class="space-y-2 text-sm">
              <a 
                v-if="userData.github"
                :href="userData.github"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-2 px-3 py-2 bg-bg-secondary hover:bg-bg-tertiary rounded-lg transition-colors text-font-secondary hover:text-theme-primary"
              >
                <span class="icon-[mdi--github] w-5 h-5"></span>
                <span class="text-xs">GitHub</span>
              </a>
              
              <a 
                v-if="userData.email"
                :href="`mailto:${userData.email}`"
                class="flex items-center justify-center gap-2 px-3 py-2 bg-bg-secondary hover:bg-bg-tertiary rounded-lg transition-colors text-font-secondary hover:text-theme-primary"
              >
                <span class="icon-[mdi--email-outline] w-5 h-5"></span>
                <span class="text-xs truncate">{{ userData.email }}</span>
              </a>
            </div>
          </div>
        </CommonCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CommonCard from '@/components/CommonCard.vue'

interface UserData {
  id: string
  nickname: string
  description?: string
  email?: string
  github?: string
  avatar?: string
  stats: {
    articles: number
    followers: number
    following: number
    likes: number
  }
}

interface Tab {
  name: string
  path: string
  icon: string
}

const route = useRoute()
const userId = computed(() => route.params.id as string)

const currentUserId = ref('current-user-id')
const isCurrentUser = computed(() => userId.value === currentUserId.value)

const userData = ref<UserData>({
  id: userId.value,
  nickname: 'TechShare用户',
  description: '热爱技术分享的开发者,专注于前端开发和用户体验设计',
  email: 'user@techshare.com',
  github: 'https://github.com/username',
  avatar: '',
  stats: {
    articles: 42,
    followers: 1284,
    following: 256,
    likes: 3920
  }
})

const tabs = computed((): Tab[] => [
  { name: '文章', path: '/articles', icon: 'icon-[material-symbols--article-outline]' },
  { name: '浏览历史', path: '/history', icon: 'icon-[mdi--history]' },
  { name: '收藏', path: '/favorites', icon: 'icon-[mdi--bookmark-outline]' },
  { name: '点赞', path: '/likes', icon: 'icon-[mingcute--thumb-up-line]' }
])

onMounted(() => {
  console.log('Loading user data for:', userId.value)
})
</script>

<style scoped>
.nav-menu a {
  text-decoration: none;
  color: var(--font-color-secondary);
}

.nav-menu a:hover:not(.router-link-active) {
  background-color: var(--bg-color-secondary);
}

.nav-menu a.router-link-active {
  background-color: var(--theme-color-primary-10);
  color: var(--theme-color-primary);
}

.nav-menu a.router-link-active span {
  color: var(--theme-color-primary);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
