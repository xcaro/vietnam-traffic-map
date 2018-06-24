<template>
  <div>
      <div class="form-group">
        <label>Địa chỉ mới</label>
        <input
        type="password"
        :class="['form-control', this.errors.first('new_phonenumber') ? 'is-invalid' : '']"
        placeholder="Địa chỉ mới"
        v-model = 'new_phonenumber'
        data-vv-as="Địa chỉ mới"
        name = 'new_phonenumber'
        v-validate="'required'">
        <div class="text-danger pt-2">{{ this.errors.first('new_phonenumber') }}</div>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Số điện thoại mới</label>
        <input
        type="password"
        :class="['form-control', this.errors.first('new_address') ? 'is-invalid' : '']"
        placeholder="Số điện thoại mới"
        v-model = 'new_address'
        data-vv-as="Số điện thoại mới"
        name = 'new_address'
        v-validate="'required|numeric'">
        <div class="text-danger pt-2">{{ this.errors.first('new_address') }}</div>
      </div>
      <button type="submit" class="btn btn-secondary mr-2" @click = "$router.replace('/user')">
        <span class="icon-sign-in d-inline mr-2"></span>
        Quay lại
      </button>
      <button type="submit" class="btn btn-primary" @click = "changeInfo">
        <span class="icon-clipboard-edit d-inline mr-2"></span>
        Cập nhật thông tin
      </button>
  </div>
</template>

<script>
import request from 'superagent'
import {mapState} from 'vuex'

export default {
  computed: mapState([
    'user'
  ]),

  data () {
    return {
      new_phonenumber: this.user.phonenumber,
      new_address: this.user.addres
    }
  },

  methods: {
    changeInfo () {
      this.$validator.validate().then(result => {
        if (result) {
          request.post('http://deltavn.net/api/user/change-password').set({
            'Authorization': `Bearer ${this.idToken}`
          })
            .send({
              current_password: this.old_pw,
              new_password: this.new_pw,
              renew_password: this.retype_new_new
            }).then((res) => {
              alert('Cập nhật thông tin thành công')
              this.$router.replace('logout')
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
