<script setup lang="ts">
defineOptions({ name: 'CommonCard' })

interface CardProps {
  title?: string
  subtitle?: string
  padding?: string
  shadow?: string
  bordered?: boolean
}

const props = withDefaults(defineProps<CardProps>(), {
  padding: 'p-4',
  shadow: 'shadow-sm',
  bordered: true
})
</script>

<template>
  <div 
    class="bg-bg-primary rounded-lg transition-shadow hover:shadow-md"
    :class="[
      props.padding,
      props.shadow,
      props.bordered ? 'border border-border-primary' : ''
    ]"
  >
    <!-- �片头部 -->
    <div v-if="title || $slots.header" class="mb-3">
      <slot name="header">
        <div v-if="title || subtitle" class="flex items-center justify-between">
          <div>
            <h3 v-if="title" class="text-lg font-semibold text-font-primary">{{ title }}</h3>
            <p v-if="subtitle" class="text-sm text-font-tertiary mt-1">{{ subtitle }}</p>
          </div>
          <slot name="extra"></slot>
        </div>
      </slot>
    </div>

    <!-- 卡片内容 -->
    <div class="text-font-primary">
      <slot></slot>
    </div>

    <!-- 卡片底部 -->
    <div v-if="$slots.footer" class="mt-3 pt-3 border-t border-border-secondary">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

