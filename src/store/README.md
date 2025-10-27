# Store 状态管理文档

本项目使用 Pinia 进行状态管理，所有 store 模块统一放置在 `src/store/modules` 目录下。

## 📁 目录结构

```
src/store/
├── index.ts           # 统一导出入口
└── modules/
    ├── theme.ts       # 主题管理
    └── user.ts        # 用户管理
```

## 🎨 主题管理 (useThemeStore)

### 功能说明
- 管理应用的主题模式（亮色/暗色）和主题颜色
- 自动持久化到 localStorage
- 页面加载时自动恢复上次设置
- 默认：亮色 + 绿色

### 使用示例

```typescript
import { useThemeStore } from '@/store'

// 在组件中使用
const themeStore = useThemeStore()

// 获取当前主题
console.log(themeStore.mode)   // 'light' | 'dark'
console.log(themeStore.color)  // 'green' | 'blue' | ...

// 切换主题模式
themeStore.setMode('dark')
themeStore.toggleMode()  // 切换亮色/暗色

// 切换主题颜色
themeStore.setColor('blue')

// 保存主题设置
themeStore.saveTheme()

// 重置为默认主题
themeStore.resetTheme()
```

### 可用主题颜色

- `green` - 绿色 (默认)
- `blue` - 蓝色
- `purple` - 紫色
- `pink` - 粉色
- `orange` - 橙色
- `red` - 红色
- `yellow` - 黄色
- `teal` - 青色
- `indigo` - 靛蓝
- `cyan` - 青蓝

## 👤 用户管理 (useUserStore)

### 功能说明
- 用户登录/注册/登出
- Token 管理和刷新
- 用户信息获取和更新
- 权限验证
- 头像上传
- 密码修改

### 使用示例

#### 登录/注册

```typescript
import { useUserStore } from '@/store'

const userStore = useUserStore()

// 登录
const success = await userStore.login({
  username: 'user@example.com',
  password: '123456',
  remember: true  // 记住登录状态
})

// 注册
const success = await userStore.register({
  username: 'newuser',
  email: 'new@example.com',
  password: '123456',
  nickname: '新用户'
})

// 登出
await userStore.logout()
```

#### 用户信息

```typescript
// 获取用户信息
const userInfo = userStore.userInfo
const nickname = userStore.nickname
const avatar = userStore.avatar

// 更新用户信息
await userStore.updateUserInfo({
  nickname: '新昵称',
  description: '个性签名'
})

// 上传头像
const file = new File([...], 'avatar.jpg')
const avatarUrl = await userStore.updateAvatar(file)
```

#### 权限验证

```typescript
// 检查登录状态
if (userStore.isLoggedIn) {
  // 用户已登录
}

// 检查管理员权限
if (userStore.isAdmin) {
  // 用户是管理员
}

// 检查版主权限
if (userStore.isModerator) {
  // 用户是版主或管理员
}

// 检查特定权限
import { UserRole } from '@/store'
if (userStore.hasPermission(UserRole.MODERATOR)) {
  // 有版主权限
}
```

#### 密码修改

```typescript
const success = await userStore.changePassword(
  'oldPassword',
  'newPassword'
)
```

### 用户角色

```typescript
UserRole.ADMIN      // 管理员
UserRole.MODERATOR  // 版主
UserRole.USER       // 普通用户
UserRole.GUEST      // 访客
```

## 🔒 路由守卫

路由守卫已集成 user store，自动处理权限验证：

```typescript
// 在路由配置中设置权限
{
  path: '/admin',
  meta: {
    requiresAuth: true,           // 需要登录
    roles: [UserRole.ADMIN]       // 需要管理员权限
  }
}
```

## 🚀 初始化

在 `main.ts` 中已自动初始化：

```typescript
// 初始化主题（默认亮色+绿色）
const themeStore = useThemeStore()
themeStore.initTheme()

// 初始化用户状态（恢复登录）
const userStore = useUserStore()
userStore.initUser()
```

## 💡 最佳实践

### 1. 在组件中使用

```vue
<script setup lang="ts">
import { useThemeStore, useUserStore } from '@/store'

const themeStore = useThemeStore()
const userStore = useUserStore()

// 使用 computed 获取响应式数据
const currentTheme = computed(() => themeStore.mode)
const isLoggedIn = computed(() => userStore.isLoggedIn)
</script>
```

### 2. 在非组件文件中使用

```typescript
// utils/auth.ts
import { useUserStore } from '@/store'

export function checkAuth() {
  const userStore = useUserStore()
  return userStore.isLoggedIn
}
```

### 3. 监听状态变化

```typescript
import { watch } from 'vue'

// 监听登录状态
watch(() => userStore.isLoggedIn, (newValue) => {
  if (newValue) {
    console.log('用户已登录')
  }
})

// 监听主题变化
watch(() => themeStore.mode, (newValue) => {
  console.log('主题模式已切换为:', newValue)
})
```

## 📝 待办事项 (TODO)

以下功能需要在有后端 API 后实现：

### Theme Store
- ✅ 本地主题切换
- ✅ 持久化存储
- 🔲 同步主题设置到服务器

### User Store
- ✅ 本地状态管理
- 🔲 真实 API 对接
  - `/auth/login` - 登录
  - `/auth/register` - 注册
  - `/auth/logout` - 登出
  - `/auth/validate` - 验证 Token
  - `/auth/refresh` - 刷新 Token
  - `/user/info` - 获取用户信息
  - `/user/info` (PUT) - 更新用户信息
  - `/user/avatar` - 上传头像
  - `/user/change-password` - 修改密码
- 🔲 Token 自动刷新机制
- 🔲 请求拦截器集成
- 🔲 错误处理优化

## 🔗 相关文件

- `src/store/index.ts` - Store 统一导出
- `src/store/modules/theme.ts` - 主题管理实现
- `src/store/modules/user.ts` - 用户管理实现
- `src/main.ts` - Store 初始化
- `src/router/index.ts` - 路由守卫集成
- `src/views/setting/theme/index.vue` - 主题设置页面
- `src/views/setting/profile/index.vue` - 个人资料设置页面
- `src/views/setting/account/index.vue` - 账户设置页面

## 📚 参考资源

- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript 类型系统](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
