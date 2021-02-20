import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home" */ '../views/Login.vue')

const Home = () => import(/* webpackChunkName: "login_home" */ '../views/Home.vue')

const Users = () => import(/* webpackChunkName: "user_right" */ '../views/Users/Users.vue')
const Rights = () => import(/* webpackChunkName: "user_right" */ '../views/Roles/Rights.vue')
const Roles = () => import(/* webpackChunkName: "user_right" */ '../views/Roles/Roles.vue')

const Categories = () => import(/* webpackChunkName: "cate_params" */ '../views/Goods/Categories.vue')
const Params = () => import(/* webpackChunkName: "cate_params" */ '../views/Goods/Params.vue')

const Goods = () => import(/* webpackChunkName: "list_add" */ '../views/Goods/Goods.vue')
const Add = () => import(/* webpackChunkName: "list_add" */ '../views/Goods/Add.vue')

const Orders = () => import(/* webpackChunkName: "order" */ '../views/Orders/Orders.vue')

const Reports = () => import(/* webpackChunkName: "report" */ '../views/Reports/Reports.vue')

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
      {
        path: '/orders',
        name: 'Orders',
        component: Orders,
      },
      {
        path: '/reports',
        name: 'Reports',
        component: Reports,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
