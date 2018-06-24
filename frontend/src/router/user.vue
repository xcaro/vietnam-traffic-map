<template>
  <div>
    <!-- <p>
      <label for="exampleInputEmail1"><b>id</b> {{user.id}} : </label> <br>
      <small>Sử dụng id này để mời bạn bè vào nhóm trong ứng dụng điện thoại</small>
    </p> -->
    <p>
      <b>Tài khoản</b>: {{user.username}} <br>
      <b>Họ tên</b>: {{user.name}} <br>
      <b>Địa chỉ</b>: {{user.address}} <br>
      <b>Số điện thoại</b>: {{user.phone}} <br>
      <b>Quyền</b>: {{user.role}}
    </p><hr>
    <div class="form-group">
      <button @click="$router.replace('/change_password')" class="btn btn-primary mr-2">
        <span class="icon-key d-inline mr-2"></span>
        Đổi mật khẩu</button>
      <button @click="$router.replace('/change_info')" class="btn btn-primary">
        <span class="icon-clipboard-edit d-inline mr-2"></span>
        Chỉnh sửa thông tin</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  methods: {
  },
  computed: mapState([
    'user'
  ])
}
</script>

<style>

</style>
