import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

import Users from '../views/Users/Users.vue'

import Rights from '../views/Roles/Rights.vue'
import Roles from '../views/Roles/Roles.vue'

import Categories from '../views/Goods/Categories.vue'
import Params from '../views/Goods/Params.vue'
import Goods from '../views/Goods/Goods.vue'
import Add from '../views/Goods/Add.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/users',
        name: 'Users',
        component: Users,
      },
      {
        path: '/rights',
        name: 'Rights',
        component: Rights,
      },
      {
        path: '/roles',
        name: 'Roles',
        component: Roles,
      },
      {
        path: '/categories',
        name: 'Categories',
        component: Categories,
      },
      {
        path: '/params',
        name: 'Params',
        component: Params,
      },
      {
        path: '/goods',
        name: 'Goods',
        component: Goods,
      },
      {
        path: '/add',
        name: 'Add',
        component: Add,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
