import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
        path: '/:date?/',
        name: 'Home',
        component: () => import('@/views/MainPage.vue'),
      },
      {
        path: '/foodSelection/:date/:section',
        name: 'FoodSelection',
        component: () => import('@/views/FoodSelection.vue'),
      },
      {
        path: '/FoodSection/:date/:section',
        name: 'FoodSection',
        component: () => import('@/views/FoodSection.vue'),
      },
      {
        path: '/foodDirectory',
        name: 'FoodDirectory',
        component: () => import('@/views/FoodDirectory.vue'),
      },
      {
        path: '/statistics',
        name: 'Statistics',
        component: () => import('@/views/StatisticsPage.vue'),
      }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router;
