import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/demo',
    },
    {
      path: '/demo',
      component: () => import('@/views/home/demo.vue')
    }
  ]
})

export default router
