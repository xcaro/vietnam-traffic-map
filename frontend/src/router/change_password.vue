<template>
  <div>
      <div class="form-group">
        <label>Mật khẩu cũ</label>
        <input
        type="text"
        :class="['form-control', this.errors.first('old_pw') ? 'is-invalid' : '']"
        placeholder="Mật khẩu cũ"
        v-model = 'old_pw'
        data-vv-as="Mật khẩu cũ"
        name = 'old_pw'
        v-validate="'required'">
        <div class="text-danger pt-2">{{ this.errors.first('old_pw') }}</div>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Mật khẩu mới</label>
        <input
        type="password"
        :class="['form-control', this.errors.first('new_pw') ? 'is-invalid' : '']"
        placeholder="Mật khẩu mới"
        v-model = 'new_pw'
        data-vv-as="Mật khẩu mới"
        name = 'new_pw'
        v-validate="'required'">
        <div class="text-danger pt-2">{{ this.errors.first('new_pw') }}</div>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Nhập lại mật khẩu mới</label>
        <input
        type="password"
        :class="['form-control', this.errors.first('retype_new_new') ? 'is-invalid' : '']"
        placeholder="Nhập lại mật khẩu mới"
        v-model = 'retype_new_new'
        data-vv-as="Nhập lại mật khẩu mới"
        name = 'retype_new_new'
        v-validate="'required'">
        <div class="text-danger pt-2">{{ this.errors.first('retype_new_new') }}</div>
      </div>
      <button type="submit" class="btn btn-secondary mr-2" @click = "$router.replace('/user')">
        <span class="icon-sign-in d-inline mr-2"></span>
        Quay lại
      </button>
      <button type="submit" class="btn btn-primary" @click = "changePassword">
        <span class="icon-sign-in d-inline mr-2"></span>
        Đổi mật khẩu
      </button>
  </div>
</template>

<script>
import request from 'superagent'

export default {
  data () {
    return {
      old_pw: '',
      new_pw: '',
      retype_new_new: ''
    }
  },

  methods: {
    changePassword () {
      this.$validator.validate().then(result => {
        if (result) {
          request.put('http://deltavn.net/api/user/password')
            .send({
              username: this.userName,
              password: this.passWord
            }).then((res) => {
              alert('Đổi mật khẩu thành công')
              this.$store.dispatch('toggle', 'isShowModal')
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
