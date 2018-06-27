<template>
    <div>
      <div class="form-group">
        <label>Loại phòng khám</label>
        <select class="form-control" id="clinic-type" v-model = "selectedClinicType">
          <option
            selected
            :key="clinicType.id"
            v-for="clinicType in clinicTypes"
            :value="clinicType.id">
              {{clinicType.name}}
            </option>
        </select>
      </div>
      <div class="form-group">
        <label>Khu vực</label>
        <input class="form-control"/>
      </div>
      <div class="form-group">
        <label>Tên phòng khám</label>
        <input class="form-control"/>
      </div>
    </div>
</template>

<script>
import request from 'superagent'
export default {
  data () {
    return {
      selectedClinicType: 0,
      clinicTypes: []
    }
  },

  created () {
    request.get('http://deltavn.net/api/clinic-type').then((res) => {
      this.clinicTypes = res.body.data
      this.selectedClinicType = res.body.data[0]
    })
  }
}
</script>

<style>
</style>
