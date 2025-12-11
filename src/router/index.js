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
      component: DashboardPage
    },
    {
      path: '/create',
      name: 'CreateBag',
      component: CreateBagPage
    },
    {
      path: '/success',
      name: 'Success',
      component: SuccessPage
    },
    {
      path: '/votes',
      name: 'Votes',
      component: VotesPage
    },
    {
  path: "/update/:id",
  name: "UpdateBag",
  component: UpdateBagPage
}

  ],
})

export default router
