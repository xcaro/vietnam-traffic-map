import Vue from 'vue'
import Router from 'vue-router'
import createClinic from '../router/create_clinic.vue'
import bookClinic from '../router/book_clinic.vue'
import login from '../router/login.vue'
import register from '../router/register.vue'
import logOut from '../router/log_out.vue'
import changePassword from '../router/change_password.vue'
import user from '../router/user.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/clinic/',
      redirect: '/clinic/create'
    },
    {
      path: '/clinic/create',
      component: createClinic
    },
    {
      path: '/clinic/book',
      component: bookClinic
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/register',
      component: register
    },
    {
      path: '/logout',
      component: logOut
    },
    {
      path: '/user',
      component: user
    },
    {
      path: '/change_password',
      component: changePassword
    }
  ]
})
