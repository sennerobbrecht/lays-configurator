import { createRouter, createWebHistory } from 'vue-router'

import DashboardPage from '../views/DashboardPage.vue'
import CreateBagPage from '../views/CreateBagPage.vue'
import SuccessPage from '../views/SuccessPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import VotesPage from '../views/VotesPage.vue'
import UpdateBagPage from '../views/UpdateBagPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterPage
    },

    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/create',
      name: 'CreateBag',
      component: CreateBagPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/success',
      name: 'Success',
      component: SuccessPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/vote',
      name: 'Votes',
      component: VotesPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/update/:id',
      name: 'UpdateBag',
      component: UpdateBagPage,
      meta: { requiresAuth: true }
    }
  ]
})


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/')
  } else {
    next()
  }
})

export default router
