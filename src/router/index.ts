import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
// import Layout from '../components/HelloWorld.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HelloWorld',
    component:()=>import('../components/HelloWorld.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router