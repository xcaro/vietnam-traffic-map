<template>
    <div>
      <div class="title mb-2">Tìm phòng phòng khám :</div>
      <div class="form-row">
          <div class="form-group col-md-6">
            <label for="inputEmail4">Loại</label>
            <input type="email" class="form-control" placeholder="Loại">
          </div>
          <div class="form-group col-md-6">
            <label for="inputPassword4">tên</label>
            <input type="password" class="form-control" placeholder="tên">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="inputEmail4">Quận</label>
            <input type="email" class="form-control" placeholder="Quận">
          </div>
          <div class="form-group col-md-6">
            <label for="inputPassword4">Huyện</label>
            <input type="password" class="form-control" placeholder="Huyện">
          </div>
        </div>
        <div class="form-group d-flex">
          <button class="btn btn-primary ml-auto">
            <span class="icon-search d-inline-block mr-2"></span>
            Tìm phòng khám
          </button>
        </div>
        <hr>
        <div class="title mb-2">Kết quả tìm kiếm :</div>
        
    </div>
</template>

<script>
import request from 'superagent'
export default {
  data () {
    return {
      selectedClinicType: 1,
      clinicTypes: []
    }
  },

  created () {
    let self = this
    request.get('http://deltavn.net/api/clinic-type').then((res) => {
      this.clinicTypes = res.body.data
      self.selectedClinicType = 0
    })
  }
}
</script>

<style>
</style>
