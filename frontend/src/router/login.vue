<template>
  <div class="">
      <div class="alert alert-danger mt-3 col-12" v-if = "loginError">
        <span class="icon-warning d-inline mr-2"></span>
        Sai tên đăng nhập hoặc mật khẩu
      </div>
      <div class="form-group">
        <label>Tên đăng nhập</label>
        <input
        type="text"
        :class="['form-control', this.errors.first('username') ? 'is-invalid' : '']"
        placeholder="Tên đăng nhập"
        v-model = 'userName'
        data-vv-as="Tên đăng nhập"
        name = 'username'
        v-validate="'required'">
        <div class="text-danger pt-2">{{ this.errors.first('username') }}</div>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Mật khẩu</label>
        <input
        type="password"
        :class="['form-control', this.errors.first('password') ? 'is-invalid' : '']"
        placeholder="Mật khẩu"
        v-model = 'passWord'
        data-vv-as="Mật khẩu"
        name = 'password'
        v-validate="'required'">
        <div class="text-danger pt-2">{{ this.errors.first('password') }}</div>
      </div>
      <button type="submit" class="btn btn-primary" @click = "login">
        <span class="icon-sign-in d-inline mr-2"></span>
        Đăng nhập
      </button>
  </div>
</template>

<script>
import request from 'superagent'

export default {
  data () {
    return {
      userName: '',
      passWord: '',
      loginError: false
    }
  },

  methods: {
    login () {
      this.$validator.validate().then(result => {
        if (result) {
          request.post('http://deltavn.net/api/login')
            .send({
              username: this.userName,
              password: this.passWord
            }).then((res) => {
              this.$store.dispatch('set', {
                propertyName: 'idToken',
                payload: res.body.access_token
              })

              localStorage.setItem('idToken', res.body.access_token)
              request.post('http://deltavn.net/api/me').set({
                'Authorization': `Bearer ${res.body.access_token}`
              }).then((res) => {
                this.$store.dispatch('set', {
                  propertyName: 'user',
                  payload: res.body.data
                })
                localStorage.setItem('user', res.body.data)
                this.$store.dispatch('toggle', 'isShowModal')
              }).catch((err) => { throw err })
            }).catch(() => {
              this.loginError = true
            })
        }
      })
    }
  }
}
</script>

<style>
</style>
