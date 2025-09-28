// 使用示例：通用滚动逻辑的各种应用场景

import { useScrollDirection } from '@/composables/useScroll'

// 示例 1: 简单的滚动方向检测
export function useBasicScrollDetection() {
  return useScrollDirection({
    threshold: 50,
    callbacks: {
      onScrollUp: () => {
        console.log('用户向上滚动了 50px')
      },
      onScrollDown: () => {
        console.log('用户向下滚动了 50px')
      }
    }
  })
}

// 示例 2: 回到顶部按钮控制
export function useBackToTopButton() {
  const { scrollY } = useScrollDirection({
    threshold: 200,
    callbacks: {
      onScrollUp: () => {
        // 向上滚动时显示回到顶部按钮
        showBackToTopButton()
      },
      onScrollDown: () => {
        // 向下滚动时隐藏回到顶部按钮（如果接近顶部）
        if (window.scrollY < 100) {
          hideBackToTopButton()
        }
      }
    }
  })

  const showBackToTopButton = () => {
    // 显示回到顶部按钮的逻辑
    console.log('显示回到顶部按钮')
  }

  const hideBackToTopButton = () => {
    // 隐藏回到顶部按钮的逻辑
    console.log('隐藏回到顶部按钮')
  }

  return { scrollY }
}

// 示例 3: 侧边栏控制
export function useSidebarAutoHide() {
  return useScrollDirection({
    threshold: 100,
    callbacks: {
      onScrollUp: () => {
        // 向上滚动时收起侧边栏
        console.log('收起侧边栏')
      },
      onScrollDown: () => {
        // 向下滚动时展开侧边栏
        console.log('展开侧边栏')
      }
    }
  })
}

// 示例 4: 阅读进度条
export function useReadingProgress() {
  const { scrollY } = useScrollDirection({
    threshold: 10, // 更小的阈值，更频繁的更新
    callbacks: {
      onScrollUp: () => {
        updateReadingProgress()
      },
      onScrollDown: () => {
        updateReadingProgress()
      }
    }
  })

  const updateReadingProgress = () => {
    const winHeight = window.innerHeight
    const docHeight = document.documentElement.scrollHeight
    const scrollTop = window.scrollY
    const progress = (scrollTop / (docHeight - winHeight)) * 100
    
    console.log(`阅读进度: ${progress.toFixed(1)}%`)
  }

  return { scrollY }
}

// 示例 5: 懒加载触发
export function useLazyLoadTrigger() {
  return useScrollDirection({
    threshold: 300,
    callbacks: {
      onScrollDown: () => {
        // 向下滚动时触发懒加载
        console.log('触发懒加载更多内容')
        loadMoreContent()
      }
    }
  })
}

const loadMoreContent = () => {
  // 加载更多内容的逻辑
  console.log('正在加载更多内容...')
}

// 示例 6: 多重回调组合
export function useComplexScrollBehavior() {
  return useScrollDirection({
    threshold: 80,
    callbacks: {
      onScrollUp: () => {
        // 组合多个行为
        hideHeader()
        showScrollIndicator()
        pauseAutoPlay()
      },
      onScrollDown: () => {
        // 组合多个行为
        showHeader()
        hideScrollIndicator()
        resumeAutoPlay()
      }
    }
  })
}

const hideHeader = () => console.log('隐藏头部')
const showHeader = () => console.log('显示头部')
const showScrollIndicator = () => console.log('显示滚动指示器')
const hideScrollIndicator = () => console.log('隐藏滚动指示器')
const pauseAutoPlay = () => console.log('暂停自动播放')
const resumeAutoPlay = () => console.log('恢复自动播放')