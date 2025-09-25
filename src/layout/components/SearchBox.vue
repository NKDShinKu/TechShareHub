<script setup lang="ts">
defineOptions({ name: 'SearchBox' })

import { ref } from 'vue'

interface SearchBoxProps {
  placeholder?: string
}

withDefaults(defineProps<SearchBoxProps>(), {
  placeholder: '搜索文章、用户...'
})

const searchQuery = ref('')

const emit = defineEmits<{
  search: [query: string]
}>()

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
  }
}

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <div class="flex-1 max-w-md mx-8">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="w-full pl-10 pr-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-font-primary outline-none transition-all focus:border-theme-primary focus:shadow-theme-primary-20 focus:shadow-[0_0_0_2px]"
        @keyup="handleKeyup"
      >
      <button
        @click="handleSearch"
        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-font-tertiary transition-colors hover:opacity-70"
      >
        <i class="icon-[material-symbols--search] w-5 h-5"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>