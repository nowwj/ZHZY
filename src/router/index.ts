import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import axios from 'axios'
const routerHistory = createWebHistory();
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      name: "home",
      component: ()=>import('@/pages/Home/index.vue'),
    },
    {
      path: "/login",
      name: "login",
      component: ()=>import('@/pages/Login/index.vue'),
      meta: { redirectAlreadyLogin: true },
    },
    {
      path: "/column/:id",
      name: "column",
      component: ()=>import('@/components/ColumnDetail.vue'),
    },
    {
      path: "/create",
      name: "create",
      component: ()=>import('@/pages/CteatePost/index.vue'),
      meta: { requiredLogin: true },
    },
    {
      path:"/signup",
      name:"signup",
      component:()=>import('@/pages/SignUp/index.vue')
    },
    {
      path:"/posts/:id",
      name:"posts",
      component:()=>import('@/pages/PostDetail/index.vue')
    },
  ],
});
router.beforeEach((to, from, next) => {
  const { user, token } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(e => {
        console.error(e)
        store.commit('logout')
        next('login')
      })
    } else {
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})


export default router;
