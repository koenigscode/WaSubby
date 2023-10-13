import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import SignUp from './views/SignUp.vue'
import Login from './views/Login.vue'
import MyPage from './views/MyPage.vue'
import MediaPlayer from './views/MediaPlayer.vue'
import AdminPage from './views/AdminPage.vue'
import Error404 from './views/Error404.vue'
Vue.use(Router)

function loginGuard(to, from, next) {
  if (localStorage.getItem('Authorization') === null) {
    console.log('not logged in; redirecting to login')
    return next('/login')
  }
  next()
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/media',
      name: 'Media',
      beforeEnter: loginGuard,
      component: MediaPlayer
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/my-page',
      name: 'MyPage',
      component: MyPage
    },
    {
      path: '/logout',
      name: 'Logout',
      beforeEnter: function (to, from, next) {
        localStorage.removeItem('Authorization')
        next('/login')
      }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminPage
    },
    {
      path: '*',
      name: '404',
      component: Error404
    }
  ]
})
