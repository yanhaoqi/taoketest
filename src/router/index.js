
import Vue from 'vue'
import Router from 'vue-router'

import home from '@/views/home'
import login from '@/views/Login'
import adPlan from '@/views/adPlan'
import adDetails from '@/views/adDetails'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'/',
      redirect: '/home',
      meta: {
        requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/adplan',
      name: 'adplan',
      component: adPlan,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/addetails',
      name: 'addetails',
      component: adDetails,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '*',
      redirect: {name: 'home'}
    }
  ]
})


// 这里写权限相关代码
router.beforeEach((to, from, next) => {
  //如果该路由的访问需要登录权限
  if (to.meta.requireAuth) {
    //如果不存在token
    if (!window.localStorage.getItem('token')) {
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    } else {
      if (window.localStorage.getItem('token') && to.path === '/login') { //判断如果有本地存储token，用户打开应用则跳转到首页
        next({
          path: '/home'
        });
      } else {
        next();
      }
    }
  } else {
    next()
  }
})


window.$router = router

export default router
