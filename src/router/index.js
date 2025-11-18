import { createRouter, createWebHistory } from 'vue-router'

import CreateBagPage from '../views/CreateBagPage.vue'
import SuccessPage from '../views/SuccessPage.vue'
import DashboardPage from '../views/DashboardPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'CreateBag',
      component: CreateBagPage
    },
    {
      path: '/success',
      name: 'Success',
      component: SuccessPage
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardPage
    }
  ],
})

export default router
