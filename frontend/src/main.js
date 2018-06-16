// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import { Validator, install as VeeValidate } from 'vee-validate/dist/vee-validate.minimal.esm.js'
import { required } from 'vee-validate/dist/rules.esm.js'
import vi from 'vee-validate/dist/locale/vi'

Vue.config.productionTip = false

Validator.extend('required', required)
Validator.localize('vi', vi)

Vue.use(VeeValidate, {
  locale: 'vi'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
