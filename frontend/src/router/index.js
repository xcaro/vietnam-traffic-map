import Vue from 'vue'
import Router from 'vue-router'
import home from '../router/home'
import createClinic from '../router/create_clinic.vue'
import editClinic from '../router/edit_clinic.vue'
import login from '../router/login.vue'
import register from '../router/register.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: home
    },
    {
      path: '/clinic/',
      redirect: '/clinic/create'
    },
    {
      path: '/clinic/create',
      component: createClinic
    },
    {
      path: '/clinic/find',
      component: editClinic
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/register',
      component: register
    }
  ]
})
