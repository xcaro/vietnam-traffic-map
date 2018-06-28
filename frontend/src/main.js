// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import * as VueGoogleMaps from 'vue2-google-maps'

import { Validator, install as VeeValidate } from 'vee-validate/dist/vee-validate.minimal.esm.js'
import { required, numeric, email, min, max } from 'vee-validate/dist/rules.esm.js'
import vi from 'vee-validate/dist/locale/vi'

Vue.config.productionTip = false

Validator.extend('email', email)
Validator.extend('numeric', numeric)
Validator.extend('required', required)
Validator.extend('min', min)
Validator.extend('max', max)
Validator.localize('vi', vi)

Vue.use(VueGoogleMaps, {load: false})

Vue.use(VeeValidate, {
  locale: 'vi',
  events: ''
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// Load google map
var ex = () => {
  var s,
    r,
    t
  r = false
  s = document.createElement('script')
  s.type = 'text/javascript'
  s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAViN9qPZApiSiTzZT4J3vZ030hGjn00X0&libraries=places&language=vi&region=vn'
  s.onload = s.onreadystatechange = function () {
    // console.log( this.readyState ); //uncomment this line to see which ready states are called.
    if (!r && (!this.readyState || this.readyState === 'complete')) {
      r = true
      window.vueGoogleMapsInit(window.google)
    }
  }
  t = document.getElementsByTagName('script')[0]
  t.parentNode.insertBefore(s, t)
}

ex()
