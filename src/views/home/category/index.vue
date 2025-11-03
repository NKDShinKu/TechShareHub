<script setup lang="ts">
defineOptions({ name: 'HomeCategoryPage' })

import { ref, computed, watchEffect } from 'vue'
import CommonCard from '@/components/CommonCard.vue'
import NoteList from './components/NoteList.vue'
import router from '@/router'

// 接收路由参数
const props = defineProps<{
  categoryId: string
}>()

interface NoteData {
  id: string
  title: string
  summary: string
  author: string
  cover?: string
  category: string
  likes: number
  comments: number
  views: number
  publishTime: string
  tags: string[]
  categoryId: string
}

const activeTab = ref('recommended')

const allNotes: NoteData[] = [
  {
    id: '1',
    title: '我做了个小程序一键爆希系统……',
    summary: '最近在做一个小程序，需要实现一键爆希功能，踩了不少坑，分享一下经验...',
    author: '刘大华',
    cover: 'https://picsum.photos/300/200?random=1',
    category: 'Java',
    likes: 1205,
    comments: 89,
    views: 3421,
    publishTime: '2天前',
    tags: ['Java', '后端开发'],
    categoryId: '2'
  },
  {
    id: '2',
    title: '定时任务究竟怎样取消呢执行?',
    summary: '在项目开发中，经常需要用到定时任务，但是如何优雅地取消定时任务的执行呢...',
    author: 'ExpanOmer',
    cover: 'https://picsum.photos/300/200?random=2',
    category: 'Web前端工程师',
    likes: 856,
    comments: 67,
    views: 2134,
    publishTime: '3天前',
    tags: ['定时任务', '后端'],
    categoryId: '3'
  },
  {
    id: '3',
    title: '好好好，元旦假，无事是负担...',
    summary: '元旦假期总结，学习新技术栈的一些心得体会，以及对新年的规划...',
    author: '芝麻de小郭',
    cover: 'https://picsum.photos/300/200?random=3',
    category: 'Flutter & Dart GOE',
    likes: 642,
    comments: 45,
    views: 1567,
    publishTime: '4天前',
    tags: ['生活', '总结'],
    categoryId: '4'
  },
  {
    id: '4',
    title: '跟着全栈日月',
    summary: '分享一下跟着全栈开发学习的心路历程，从零基础到入门的经验总结...',
    author: '跟着全栈日月',
    category: '公众号【跟着小月】',
    likes: 398,
    comments: 23,
    views: 987,
    publishTime: '5天前',
    tags: ['全栈', '学习经验'],
    categoryId: '1'
  },
  {
    id: '5',
    title: '代码人生',
    summary: '作为程序员的这些年，记录一下工作和生活的感悟，以及技术成长的点点滴滴...',
    author: '雁过无痕',
    cover: 'https://picsum.photos/300/200?random=5',
    category: '代码人生',
    likes: 234,
    comments: 12,
    views: 654,
    publishTime: '1周前',
    tags: ['代码人生', '感悟'],
    categoryId: '8'
  },
  {
    id: '6',
    title: 'Vue 3 Composition API 深度解析',
    summary: 'Vue 3 的 Composition API 为我们带来了更灵活的组件开发方式...',
    author: '前端小王',
    cover: 'https://picsum.photos/300/200?random=6',
    category: '前端开发',
    likes: 567,
    comments: 34,
    views: 1234,
    publishTime: '6天前',
    tags: ['Vue', '前端'],
    categoryId: '3'
  }
]

const tabs = [
  { key: 'recommended', label: '推荐' },
  { key: 'latest', label: '最新' }
]

// 根据分类ID筛选笔记
const filteredNotes = computed(() => {
  if (props.categoryId === '0') {
    // 全部分类
    return allNotes
  }
  return allNotes.filter(note => note.categoryId === props.categoryId)
})

// 分类名称映射
const categoryNames: Record<string, string> = {
  '0': '全部',
  '1': '综合',
  '2': '后端',
  '3': '前端',
  '4': 'Android',
  '5': 'iOS',
  '6': '人工智能',
  '7': '开发工具',
  '8': '代码人生',
  '9': '阅读',
  '10': '排行榜'
}

const currentCategoryName = computed(() => {
  return categoryNames[props.categoryId] || '未知分类'
})

const handleTabChange = (tabKey: string) => {
  activeTab.value = tabKey
}

const handleNoteClick = (noteId: string) => {
  console.log('点击笔记:', noteId)
  // 这里可以导航到笔记详情页
  router.push(`/detail/${noteId}`)
}

// 监听分类变化
watchEffect(() => {
  console.log('当前分类:', currentCategoryName.value, '文章数:', filteredNotes.value.length)
})
</script>

<template>
  <CommonCard padding="p-0">
    <!-- 标签页头部 -->
    <template #header>
      <div class="flex items-center justify-between border-b border-border-primary -mb-3">
        <div class="flex items-center">
          <div
            v-for="tab in tabs"
            :key="tab.key"
            class="px-4 py-3 cursor-pointer relative transition-colors"
            :class="{
              'text-theme-primary font-medium': activeTab === tab.key,
              'text-font-secondary hover:text-font-primary': activeTab !== tab.key
            }"
            @click="handleTabChange(tab.key)"
          >
            {{ tab.label }}
            <div
              v-if="activeTab === tab.key"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-theme-primary"
            ></div>
          </div>
        </div>
        <div class="text-sm text-font-tertiary px-4">
          {{ currentCategoryName }} · {{ filteredNotes.length }} 篇文章
        </div>
      </div>
    </template>

    <!-- 笔记列表 -->
    <NoteList
      :notes="filteredNotes"
      :empty-text="`暂无${currentCategoryName}相关文章`"
      @note-click="handleNoteClick"
    />
  </CommonCard>
</template>

