<template>
  <div>
    <h1 class="display-5 mb-4">Thông tin phòng khám :</h1>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Tên</th>
          <th scope="col">Địa chỉ</th>
          <th scope="col">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="clinic in clinics" :key="clinic.id">
          <td>{{clinic.name}}</td>
          <td>{{clinic.address}}</td>
          <td>
            <button class="btn btn-link mr-2" @click="$router.replace(`/clinic/${clinic.id}/edit-doctors`)">
              <span class="icon-edit d-inline mr-1"></span>
              Chỉnh sửa người đại diện
            </button>
            <button class="btn btn-link mr-2" @click="$router.replace(`/clinic/${clinic.id}/edit-clinic`)">
              <span class="icon-edit d-inline mr-1"></span>
              Chỉnh sửa thông tin
            </button>
            <button class="btn btn-link mr-2" @click="$router.replace(`/clinic/${clinic.id}/shift`)">
              <span class="icon-edit d-inline mr-1"></span>
              Quản trị ca
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import request from 'superagent'
export default {
  computed: mapState(['idToken']),
  data () {
    return {
      clinics: []
    }
  },

  created () {
    this.$store.dispatch('set', {
      propertyName: 'isLoading',
      payload: true
    })
    request.get('http://deltavn.net/api/clinic').set({
      'Authorization': `Bearer ${this.idToken}`
    }).then(res => {
      this.clinics = res.body.data
      this.$store.dispatch('set', {
        propertyName: 'isLoading',
        payload: false
      })
    })
  }
}
</script>

<style>

</style>
