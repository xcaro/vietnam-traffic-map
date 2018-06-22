<template>
  <div class="">
      <div class="form-group">
        <label>Họ tên</label>
        <input
        type="text"
        :class="['form-control', this.errors.first('name') ? 'is-invalid' : '']"
        placeholder="Họ tên"
        v-model = 'name'
        data-vv-as="Họ tên"
        name = 'name'
        v-validate="'required'">
        <div class="text-danger pt-2">{{ this.errors.first('name') }}</div>
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
      <div class="form-group">
        <label for="exampleInputPassword1">Email</label>
        <input
        type="text"
        :class="['form-control', this.errors.first('email') ? 'is-invalid' : '']"
        placeholder="Email"
        v-model = 'email'
        data-vv-as="Email"
        name = 'email'
        v-validate="'required|email'">
        <div class="text-danger pt-2">{{ this.errors.first('email') }}</div>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Địa chỉ</label>
        <input
        type="text"
        :class="['form-control', this.errors.first('address') ? 'is-invalid' : '']"
        placeholder="Địa chỉ"
        v-model = 'address'
        data-vv-as="Địa chỉ"
        name = 'address'
        v-validate="'required'">
        <div class="text-danger pt-2">{{ this.errors.first('address') }}</div>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Số điện thoại</label>
        <input
        type="text"
        :class="['form-control', this.errors.first('phone') ? 'is-invalid' : '']"
        placeholder="Số điện thoại"
        v-model = 'phone'
        data-vv-as="Số điện thoại"
        name = 'phone'
        v-validate="'required|numeric'">
        <div class="text-danger pt-2">{{ this.errors.first('phone') }}</div>
      </div>
      <vue-recaptcha
        class="mb-3"
        @verify="verifyRecaptcha"
        sitekey="6LfPrV8UAAAAAJHltKfmtnjDJNnDl0qABNwJ9Jim">
      </vue-recaptcha>
      <button type="submit" class="btn btn-primary" @click = "register">
        <span class="icon-sign-up d-inline mr-2"></span>
        Đăng ký
      </button>
  </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha'
import request from 'superagent'

export default {
  data () {
    return {
      name: '',
      userName: '',
      passWord: '',
      email: '',
      address: '',
      phone: '',
      registerError: false
    }
  },

  methods: {
    verifyRecaptcha (response) {
      this.verify = response
    },

    register () {
      this.$validator.validate().then(result => {
        if (result) {
          let obj = {
            name: this.name,
            username: this.userName,
            password: this.passWord,
            email: this.email,
            address: this.address,
            phone: this.phone
          }

          request.post('http://deltavn.net/api/user')
            .send(obj).then((res) => {
              alert('Tạo tài khoản thành công')
              this.$store.dispatch('toggle', 'isShowModal')
            }).catch(() => {
              this.loginError = true
            })
        }
      })
    }
  },

  components: { VueRecaptcha }
}
</script>

<style>

</style>
