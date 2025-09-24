<template>
  <div class="creator-manage">
    <h1>发布管理</h1>
    <div class="manage-tabs">
      <router-link 
        :to="{ path: '/creator/manage', query: { status: 'all' } }" 
        class="tab-link"
        :class="{ active: currentStatus === 'all' }">
        全部
      </router-link>
      <router-link 
        :to="{ path: '/creator/manage', query: { status: 'published' } }" 
        class="tab-link"
        :class="{ active: currentStatus === 'published' }">
        已发布
      </router-link>
      <router-link 
        :to="{ path: '/creator/manage', query: { status: 'pending' } }" 
        class="tab-link"
        :class="{ active: currentStatus === 'pending' }">
        审核中
      </router-link>
      <router-link 
        :to="{ path: '/creator/manage', query: { status: 'rejected' } }" 
        class="tab-link"
        :class="{ active: currentStatus === 'rejected' }">
        未通过
      </router-link>
    </div>
    <div class="manage-content">
      <ManageList :status="currentStatus" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'CreatorManagePage' })

import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ManageList from './ManageList.vue'

const route = useRoute()
const router = useRouter()

// 当前状态，默认为 'all'
const currentStatus = computed(() => {
  return (route.query.status as string) || 'all'
})

// 监听路由变化，如果没有status参数则默认设置为all
watch(() => route.query.status, (newStatus) => {
  if (!newStatus && route.path === '/creator/manage') {
    router.replace({ path: '/creator/manage', query: { status: 'all' } })
  }
}, { immediate: true })

// 发布管理主页面
console.log('发布管理页面已加载，当前状态:', currentStatus.value)
</script>

<style scoped>
.creator-manage {
  padding: 1rem;
}

.manage-tabs {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.tab-link {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #666;
  border-bottom: 2px solid transparent;
}

.tab-link:hover,
.tab-link.active {
  color: #007acc;
  border-bottom-color: #007acc;
}

.manage-content {
  margin-top: 1rem;
}
</style>