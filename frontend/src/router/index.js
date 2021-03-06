import Vue from 'vue'
import Router from 'vue-router'

import administrateShiftClinic from '../router/clinic/administrate_shift_clinic.vue'
import admistrateClinic from '../router/clinic/administrate_clinic.vue'
import createClinic from '../router/clinic/create_clinic.vue'
import findClinic from '../router/clinic/find_clinic.vue'
import editClinic from '../router/clinic/edit_clinic.vue'
import editDoctors from '../router/clinic/edit_doctors.vue'

import editShift from '../router/clinic/edit_shift.vue'

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
      path: '/clinic/shift/edit',
      component: editShift
    },
    {
      path: '/clinic/:id/edit-clinic',
      component: editClinic
    },
    {
      path: '/clinic/:id/edit-doctors',
      component: editDoctors
    },
    {
      path: '/clinic/administrate',
      component: admistrateClinic
    },
    {
      path: '/clinic/:id/shift',
      component: administrateShiftClinic
    },
    {
      path: '/clinic/create',
      component: createClinic
    },
    {
      path: '/clinic/find',
      component: findClinic
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
