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
      <div class="form-group">
        <label>Kết quả : </label> <br>
        <b>Tên:</b> abc <br>
        <b>Địa chỉ:</b> 123 <a href="lol">Dẫn đường</a><br>
        <b>Mô tả:</b>:
        <div></div>
      </div>
      <div class="form-group">
        <label>Giờ:</label>
      </div>
      <div class="form-group">
        <label>Ngày</label>

      </div>
      <div class="form-group">
        <label>
          Vui lòng điền đầy đủ thông tin vào form trên, chuyên viên đặt hẹn của chúng tôi sẽ liên hệ lại với Quý khách sớm nhất trong vòng 24h làm việc.
          Việc đặt hẹn trực tuyến không áp dụng cho các khách hàng có nhu cầu cấp cứu hoặc đặt lịch hẹn trong vòng 48h kể từ thời điểm đặt hẹn.
        </label>
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
