import { ref } from 'vue'
import { useScrollDirection } from './useScroll'

export function useHeaderVisibility(threshold: number = 100) {
  const isScrollUp = ref(true)
  
  // 使用通用滚动逻辑
  const { isScrollingUp, isScrollingDown, scrollY, reset } = useScrollDirection({
    threshold,
    callbacks: {
      onScrollUp: () => {
        // 向上滚动时隐藏 Header
        isScrollUp.value = true
      },
      onScrollDown: () => {
        // 向下滚动时显示 Header
        isScrollUp.value = false
      }
    }
  })
  
  // 手动控制 Header 显隐
  const showHeader = () => {
    isScrollUp.value = true
  }
  
  const hideHeader = () => {
    isScrollUp.value = false
  }
  
  // 切换 Header 显隐
  const toggleHeader = () => {
    isScrollUp.value = !isScrollUp.value
  }
  
  return {
    // 状态
    isScrollUp,
    isScrollingUp,
    isScrollingDown,
    scrollY,
    
    // 方法
    showHeader,
    hideHeader,
    toggleHeader,
    reset
  }
}