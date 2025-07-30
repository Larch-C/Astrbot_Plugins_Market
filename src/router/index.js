import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SubmitPlugin from '../views/SubmitPlugin.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/submit',
    name: 'SubmitPlugin',
    component: SubmitPlugin
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
