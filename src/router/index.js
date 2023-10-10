import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
        path: '/healthy_lifestyle/:date?/',
        name: 'Home',
        component: () => import('@/views/MainPage.vue'),
      },
      {
        path: '/healthy_lifestyle/foodSelection/:date/:section',
        name: 'FoodSelection',
        component: () => import('@/views/FoodSelection.vue'),
      },
      {
        path: '/healthy_lifestyle/FoodSection/:date/:section',
        name: 'FoodSection',
        component: () => import('@/views/FoodSection.vue'),
      },
      {
        path: '/healthy_lifestyle/foodDirectory',
        name: 'FoodDirectory',
        component: () => import('@/views/FoodDirectory.vue'),
      },
      {
        path: '/healthy_lifestyle/statistics',
        name: 'Statistics',
        component: () => import('@/views/StatisticsPage.vue'),
      }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router;
