import Vue from 'vue'
import Router from 'vue-router'

import admistrateClinic from '../router/clinic/administrate_clinic.vue'
import createClinic from '../router/clinic/create_clinic.vue'
import bookClinic from '../router/clinic/book_clinic.vue'
import editClinic from '../router/clinic/edit_clinic.vue'
import editDoctors from '../router/clinic/edit_doctors.vue'

import login from '../router/login.vue'
import register from '../router/register.vue'
import logOut from '../router/log_out.vue'
import changePassword from '../router/change_password.vue'
import changeInfo from '../router/change_info.vue'
import user from '../router/user.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/clinic/',
      redirect: '/clinic/create'
    },
    {
      path: '/clinic/edit-clinic',
      component: editClinic
    },
    {
      path: '/clinic/edit-doctors',
      component: editDoctors
    },
    {
      path: '/clinic/administrate',
      component: admistrateClinic
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
    },
    {
      path: '/change_info',
      component: changeInfo
    }
  ]
})
