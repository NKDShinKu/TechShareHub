import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/css/main.css'
import App from './App.vue'
import router from './router'
import { useThemeStore, useUserStore } from './store'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化主题（默认亮色+绿色）
const themeStore = useThemeStore()
themeStore.initTheme()

// 初始化用户状态（恢复登录）
const userStore = useUserStore()
userStore.initUser()

app.mount('#app')
