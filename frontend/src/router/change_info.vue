<template>
  <div>
      <div class="form-group">
        <label for="exampleInputPassword1">Họ tên mới</label>
        <input
        type="text"
        :class="['form-control', this.errors.first('name') ? 'is-invalid' : '']"
        placeholder="Họ tên mới"
        v-model = 'name'
        data-vv-as="Họ tên mới"
        name = 'name'
        v-validate="'required'">
        <div class="text-danger pt-2">{{ this.errors.first('name') }}</div>
      </div>
      <div class="form-group">
        <label>Địa chỉ mới</label>
        <input
        type="text"
        :class="['form-control', this.errors.first('address') ? 'is-invalid' : '']"
        placeholder="Địa chỉ mới"
        v-model = 'address'
        data-vv-as="Địa chỉ mới"
        name = 'address'
        v-validate="'required'">
        <div class="text-danger pt-2">{{ this.errors.first('address') }}</div>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Số điện thoại mới</label>
        <input
        type="text"
        :class="['form-control', this.errors.first('phone') ? 'is-invalid' : '']"
        placeholder="Số điện thoại mới"
        v-model = 'phone'
        data-vv-as="Số điện thoại mới"
        name = 'phone'
        v-validate="'required|numeric|min:9'">
        <div class="text-danger pt-2">{{ this.errors.first('phone') }}</div>
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
    'user',
    'idToken'
  ]),

  data () {
    return {
      phone: '',
      address: '',
      name: ''
    }
  },

  created () {
    this.phone = this.user.phone
    this.address = this.user.address
    this.name = this.user.name
  },

  methods: {
    changeInfo () {
      let self = this
      debugger
      this.$validator.validate().then(result => {
        if (result) {
          request.post('http://deltavn.net/api/user/change-info').set({
            'Authorization': `Bearer ${self.idToken}`
          })
            .send({
              phone: this.phone,
              address: this.address,
              name: this.name,
              email: this.email
            }).then((res) => {
              alert('Cập nhật thông tin thành công')
              request.post('http://deltavn.net/api/me').set({
                'Authorization': `Bearer ${this.idToken}`
              }).then((res) => {
                this.$store.dispatch('set', {
                  propertyName: 'user',
                  payload: res.body.data
                })
              })
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
