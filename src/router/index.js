// index.js

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/OrgChart.vue')
    },
    {
      path: '/:filter',
      component: () => import('../views/OrgChart.vue')
    }
  ],
})

export default router