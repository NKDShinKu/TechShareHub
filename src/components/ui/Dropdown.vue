<template>
  <div class="relative" v-click-outside="handleClickOutside">
    <button
      @click="toggle"
      :class="[
        'flex items-center justify-between px-3 py-2 text-sm border rounded-lg transition-colors',
        'bg-bg-secondary border-border-primary text-font-secondary',
        'hover:bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-theme-primary',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        buttonClass
      ]"
      :disabled="disabled"
    >
      <span>{{ selectedLabel || placeholder }}</span>
      <i 
        :class="[
          'icon-[material-symbols--keyboard-arrow-down] ml-2 transition-transform',
          isOpen ? 'rotate-180' : ''
        ]"
      ></i>
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        :class="[
          'absolute z-50 mt-1 bg-bg-primary border border-border-primary rounded-lg shadow-lg',
          'min-w-full max-h-60 overflow-auto',
          dropdownClass
        ]"
        :style="{ minWidth: minWidth }"
      >
        <div
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          :class="[
            'px-3 py-2 text-sm cursor-pointer transition-colors',
            'hover:bg-bg-secondary',
            selectedValue === option.value
              ? 'bg-theme-primary-10 text-theme-primary'
              : 'text-font-secondary'
          ]"
        >
          {{ option.label }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface DropdownOption {
  label: string
  value: string | number
}

interface Props {
  modelValue?: string | number
  options: DropdownOption[]
  placeholder?: string
  disabled?: boolean
  buttonClass?: string
  dropdownClass?: string
  minWidth?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', option: DropdownOption): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  disabled: false,
  buttonClass: '',
  dropdownClass: '',
  minWidth: '120px'
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)

const selectedValue = computed(() => props.modelValue)

const selectedLabel = computed(() => {
  const selected = props.options.find(option => option.value === selectedValue.value)
  return selected?.label
})

const toggle = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectOption = (option: DropdownOption) => {
  emit('update:modelValue', option.value)
  emit('change', option)
  isOpen.value = false
}

const handleClickOutside = () => {
  isOpen.value = false
}

// 扩展 HTMLElement 类型
declare global {
  interface HTMLElement {
    _clickOutside?: (event: Event) => void
  }
}

// 自定义指令：点击外部关闭
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el._clickOutside = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: HTMLElement) {
    if (el._clickOutside) {
      document.removeEventListener('click', el._clickOutside)
      delete el._clickOutside
    }
  }
}
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: var(--border-secondary);
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: var(--border-primary);
}
</style>