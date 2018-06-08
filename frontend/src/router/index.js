import Vue from 'vue'
import Router from 'vue-router'
import home from '../router/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    }
  ]
})
