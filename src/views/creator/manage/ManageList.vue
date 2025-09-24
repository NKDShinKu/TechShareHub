<script setup lang="ts">
defineOptions({ name: 'ManageList' })

import { ref, computed, watch } from 'vue'

const props = defineProps<{
  status: string
}>()

// 模拟文章数据
const articles = ref([
  {
    id: 1,
    title: 'Vue 3 组合式 API 深度解析',
    status: 'published',
    createTime: '2024-01-15 10:30',
    publishTime: '2024-01-15 14:20',
    views: 1234,
    likes: 89,
    comments: 23
  },
  {
    id: 2,
    title: 'TypeScript 在 Vue 项目中的最佳实践',
    status: 'pending',
    createTime: '2024-01-14 16:45',
    publishTime: '',
    views: 0,
    likes: 0,
    comments: 0
  },
  {
    id: 3,
    title: 'Vite 构建优化技巧分享',
    status: 'rejected',
    createTime: '2024-01-13 09:15',
    publishTime: '',
    views: 0,
    likes: 0,
    comments: 0,
    rejectReason: '内容质量不达标，请补充更多技术细节'
  },
  {
    id: 4,
    title: 'React vs Vue 性能对比分析',
    status: 'published',
    createTime: '2024-01-12 11:20',
    publishTime: '2024-01-12 15:30',
    views: 2156,
    likes: 167,
    comments: 45
  },
  {
    id: 5,
    title: '前端工程化实战经验总结',
    status: 'pending',
    createTime: '2024-01-11 14:30',
    publishTime: '',
    views: 0,
    likes: 0,
    comments: 0
  }
])

// 根据状态筛选文章
const filteredArticles = computed(() => {
  if (props.status === 'all') {
    return articles.value
  }
  return articles.value.filter(article => article.status === props.status)
})

// 状态标签映射
const statusLabels = {
  published: '已发布',
  pending: '审核中',
  rejected: '未通过'
}

// 状态样式类映射
const statusClasses = {
  published: 'status-published',
  pending: 'status-pending',
  rejected: 'status-rejected'
}

// 监听状态变化
watch(() => props.status, (newStatus) => {
  console.log('切换到状态:', newStatus)
})

// 编辑文章
const editArticle = (id: number) => {
  console.log('编辑文章:', id)
  // 这里可以跳转到编辑页面
}

// 删除文章
const deleteArticle = (id: number) => {
  if (confirm('确定要删除这篇文章吗？')) {
    articles.value = articles.value.filter(article => article.id !== id)
    console.log('删除文章:', id)
  }
}

// 重新提交文章（针对被拒绝的文章）
const resubmitArticle = (id: number) => {
  const article = articles.value.find(item => item.id === id)
  if (article) {
    article.status = 'pending'
    console.log('重新提交文章:', id)
  }
}

// 格式化时间
const formatTime = (timeStr: string) => {
  return timeStr || '-'
}
</script>

<template>
  <div class="manage-list">
    <!-- 统计信息 -->
    <div class="stats-bar">
      <span class="stats-item">
        共 {{ filteredArticles.length }} 篇文章
      </span>
    </div>

    <!-- 文章列表 -->
    <div class="article-list">
      <div v-if="filteredArticles.length === 0" class="empty-state">
        <p>暂无{{ statusLabels[status as keyof typeof statusLabels] || '相关' }}文章</p>
      </div>

      <div v-for="article in filteredArticles" 
           :key="article.id" 
           class="article-item">
        <div class="article-header">
          <h3 class="article-title">{{ article.title }}</h3>
          <span class="article-status" 
                :class="statusClasses[article.status as keyof typeof statusClasses]">
            {{ statusLabels[article.status as keyof typeof statusLabels] }}
          </span>
        </div>

        <div class="article-meta">
          <div class="meta-row">
            <span>创建时间：{{ formatTime(article.createTime) }}</span>
            <span v-if="article.status === 'published'">
              发布时间：{{ formatTime(article.publishTime) }}
            </span>
          </div>
          
          <div v-if="article.status === 'published'" class="meta-row">
            <span>阅读：{{ article.views }}</span>
            <span>点赞：{{ article.likes }}</span>
            <span>评论：{{ article.comments }}</span>
          </div>

          <div v-if="article.status === 'rejected' && article.rejectReason" 
               class="reject-reason">
            <strong>拒绝原因：</strong>{{ article.rejectReason }}
          </div>
        </div>

        <div class="article-actions">
          <button @click="editArticle(article.id)" class="btn-edit">
            编辑
          </button>
          <button v-if="article.status === 'rejected'" 
                  @click="resubmitArticle(article.id)" 
                  class="btn-resubmit">
            重新提交
          </button>
          <button @click="deleteArticle(article.id)" class="btn-delete">
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.manage-list {
  padding: 0;
}

.stats-bar {
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1rem;
}

.stats-item {
  color: #666;
  font-size: 0.9rem;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.article-item {
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  transition: box-shadow 0.2s;
}

.article-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.article-title {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  flex: 1;
  margin-right: 1rem;
}

.article-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-published {
  background: #d4edda;
  color: #155724;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-rejected {
  background: #f8d7da;
  color: #721c24;
}

.article-meta {
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.meta-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 0.5rem;
  color: #666;
}

.reject-reason {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #f8d7da;
  border-left: 4px solid #dc3545;
  color: #721c24;
  border-radius: 4px;
}

.reject-reason strong {
  color: #dc3545;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
}

.article-actions button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-edit {
  color: #007bff;
  border-color: #007bff;
}

.btn-edit:hover {
  background: #007bff;
  color: white;
}

.btn-resubmit {
  color: #28a745;
  border-color: #28a745;
}

.btn-resubmit:hover {
  background: #28a745;
  color: white;
}

.btn-delete {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-delete:hover {
  background: #dc3545;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .article-title {
    margin-right: 0;
  }

  .meta-row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .article-actions {
    flex-wrap: wrap;
  }
}
</style>