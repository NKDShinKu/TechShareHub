import { ref, onMounted, onUnmounted } from 'vue'

export interface ScrollCallbacks {
  onScrollUp?: () => void
  onScrollDown?: () => void
}

export interface UseScrollDirectionOptions {
  threshold?: number // 触发回调的滚动距离阈值，默认 100px
  callbacks?: ScrollCallbacks
}

export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
  const { threshold = 100, callbacks } = options
  
  // 响应式状态
  const isScrollingUp = ref(false)
  const isScrollingDown = ref(false)
  const scrollY = ref(0)
  
  // 内部状态
  let lastScrollY = 0
  let ticking = false
  let scrollAccumulator = 0 // 累积滚动距离
  let lastDirection: 'up' | 'down' | null = null
  
  // 更新滚动状态
  const updateScrollDirection = () => {
    const currentScrollY = window.scrollY
    const deltaY = currentScrollY - lastScrollY
    
    // 更新响应式状态
    scrollY.value = currentScrollY
    
    if (Math.abs(deltaY) < 1) {
      ticking = false
      return
    }
    
    const currentDirection = deltaY > 0 ? 'down' : 'up'
    
    // 如果方向改变，重置累积器
    if (lastDirection && lastDirection !== currentDirection) {
      scrollAccumulator = 0
    }
    
    // 累积滚动距离
    scrollAccumulator += Math.abs(deltaY)
    
    // 检查是否达到阈值
    if (scrollAccumulator >= threshold) {
      if (currentDirection === 'up') {
        isScrollingUp.value = true
        isScrollingDown.value = false
        callbacks?.onScrollUp?.()
      } else if (currentDirection === 'down') {
        isScrollingUp.value = false
        isScrollingDown.value = true
        callbacks?.onScrollDown?.()
      }
      
      // 重置累积器
      scrollAccumulator = 0
    }
    
    lastDirection = currentDirection
    lastScrollY = currentScrollY
    ticking = false
  }
  
  // 滚动事件处理器
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollDirection)
      ticking = true
    }
  }
  
  // 手动触发回调
  const triggerScrollUp = () => {
    callbacks?.onScrollUp?.()
  }
  
  const triggerScrollDown = () => {
    callbacks?.onScrollDown?.()
  }
  
  // 重置状态
  const reset = () => {
    isScrollingUp.value = false
    isScrollingDown.value = false
    scrollAccumulator = 0
    lastDirection = null
    lastScrollY = window.scrollY
  }
  
  // 更新回调函数
  const updateCallbacks = (newCallbacks: ScrollCallbacks) => {
    Object.assign(callbacks || {}, newCallbacks)
  }
  
  // 生命周期管理
  onMounted(() => {
    lastScrollY = window.scrollY
    window.addEventListener('scroll', handleScroll, { passive: true })
  })
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
  
  return {
    // 响应式状态
    isScrollingUp,
    isScrollingDown,
    scrollY,
    
    // 方法
    triggerScrollUp,
    triggerScrollDown,
    reset,
    updateCallbacks
  }
}