<template>
  <div>
      <div class="alert alert-danger font-weight-bold mt-5" v-if = "loginError">
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
        type="text"
        :class="['form-control', this.errors.first('username') ? 'is-invalid' : '']"
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
      if (this.errors) {
        request.post('http://deltavn.net/api/login')
          .send({
            username: this.userName,
            password: this.passWord
          }).then((res) => {
            this.$store.dispatch('set', {
              propertyName: 'idToken',
              payload: res.body.access_token
            })

            this.$store.dispatch('toggle', 'isShowModal')
          }).catch(() => {
            this.loginError = true
          })
      }
    }
  }
}
</script>

<style>
</style>
