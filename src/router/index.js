import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../views/DashboardPage.vue'
import CreateBagPage from '../views/CreateBagPage.vue'
import SuccessPage from '../views/SuccessPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {
      path: '/',
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
  path: '/login',
  name: 'Login',
  component: LoginPage
},
{
  path: '/register',
  name: 'Register',
  component: RegisterPage
}


  ],
})

export default router
