<script setup lang="ts">
defineOptions({ name: 'NoteItem' })

interface NoteItemProps {
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
}

defineProps<NoteItemProps>()

const formatNumber = (num: number) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
}

const emit = defineEmits<{
    click: [noteId: string]
}>()

const handleClick = (noteId: string) => {
    emit('click', noteId)
}
</script>

<template>
    <div class="p-4 h-40 border-b border-border-secondary last:border-b-0 hover:bg-bg-secondary cursor-pointer transition-colors"
        @click="handleClick(id)">
        <div class="flex space-x-4">
            <!-- 内容区域 -->
            <div class="flex-1 min-w-0">
                <!-- 标题 -->
                <h3
                    class="text-lg font-medium text-theme-primary mb-2 line-clamp-2 hover:text-theme-primary transition-colors">
                    {{ title }}
                </h3>

                <!-- 摘要 -->
                <p class="text-font-tertiary text-sm mb-3 line-clamp-2">
                    {{ summary }}
                </p>


                <div v-if="tags.length > 0" class="flex items-center space-x-2 mb-2">
                    <span v-for="tag in tags" :key="tag"
                        class="inline-flex items-center px-2 py-1 text-xs bg-theme-primary-10 text-theme-primary rounded-full">
                        {{ tag }}
                    </span>
                </div>
                <!-- 作者和分类信息 -->
                <div class="flex items-center justify-between text-sm text-font-tertiary mb-2">
                    <div class="flex items-center space-x-4">
                        <span class="flex items-center space-x-1">
                            <span class="icon-[clarity--employee-solid] w-4 h-4"></span>
                            <span>{{ author }}</span>
                        </span>
                        <span class="flex items-center space-x-1">
                            <span class="icon-[bxs--category-alt] w-4 h-4"></span>
                            <span>{{ category }}</span>
                        </span>
                        <span>{{ publishTime }}</span>
                    </div>

                    <!-- 统计信息 -->
                    <div class="flex items-center space-x-4">
                        <span class="flex items-center space-x-1">
                            <span class="icon-[mingcute--thumb-up-line] w-4 h-4 text-info"></span>
                            <span>{{ formatNumber(likes) }}</span>
                        </span>
                        <span class="flex items-center space-x-1">
                            <span class="icon-[mdi--comment-text-outline] w-4 h-4 text-info"></span>
                            <span>{{ formatNumber(comments) }}</span>
                        </span>
                        <span class="flex items-center space-x-1">
                            <span class="icon-[tabler--eye] w-4 h-4 text-info"></span>
                            <span>{{ formatNumber(views) }}</span>
                        </span>
                    </div>
                </div>

                <!-- 标签 -->

            </div>

            <!-- 封面图 - 移到右边 -->
            <div v-if="cover" class="flex-shrink-0 flex items-center justify-center">
                <div class="w-35 h-25 bg-bg-secondary rounded-lg overflow-hidden border border-border-secondary">
                    <img :src="cover" :alt="title"
                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        @error="(e) => (e.target as HTMLElement).style.display = 'none'" />
                </div>
            </div>
        </div>
    </div>
</template>