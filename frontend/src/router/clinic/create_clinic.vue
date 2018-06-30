<template>
  <div class="w-500">
    <div v-show="step===0">
      <clinicInfo
        :initData="data"
        sumbitText="Tiếp theo"
        :sumbitCallBack="nextStep" />
    </div>
    <div v-if="step!==0">
      <doctors
        :initData="data"
        sumbitText="Tạo phòng khám"
        :isShowBack="true"
        :backCallBack="()=>{step--}"
        :submitCallBack="createClinic" />
    </div>
  </div>
</template>

<script>
import clinicInfo from '../../components/Clinic_Info'
import doctors from '../../components/Doctors'
import { mapState } from 'vuex'
import request from 'superagent'

export default {
  computed: mapState([
    'idToken'
  ]),

  methods: {
    nextStep (data) {
      this.data = data
      this.step++
    },

    createClinic (data) {
      this.data = data
      // Reserve coding into place id into ward district
      // let placeDetails = await request.get('https://maps.googleapis.com/maps/api/place/details/json')
      //   .query({key: 'AIzaSyAViN9qPZApiSiTzZT4J3vZ030hGjn00X0'})
      //   .query({placeid: this.data.place_id})
      let self = this
      request.get('https://maps.googleapis.com/maps/api/geocode/json')
        .query({key: 'AIzaSyA6jVBqVLTXFpNsxmEKx8HTFEIwmiq0usQ'})
        .query({latlng: `${this.data.latitude}, ${this.data.longitude}`})
        .then((res) => {
          let geocode = res.body.results.filter(result => {
            return result.types.indexOf('street_address') !== -1
          })[0]

          // Find ward and district
          this.data.ward = geocode.address_components.filter(addresscomponent => {
            return addresscomponent.types.indexOf('administrative_area_level_3') !== -1
          })[0].long_name

          this.data.district = geocode.address_components.filter(addresscomponent => {
            return addresscomponent.types.indexOf('administrative_area_level_2') !== -1
          })[0].long_name

          delete this.data.placeId
          request.post('http://deltavn.net/api/clinic').send(this.data).set({
            'Authorization': `Bearer ${self.idToken}`
          }).then(() => {
            alert('Tạo phòng khám thánh công, Nhân viên của chúng tôi sẽ liên hệ xác nhận phòng khám của bạn trong 24h')
            this.$store.dispatch('toggle', 'isShowModal')
          })
        })
    }
  },

  data () {
    return {
      step: 0,
      data: {
        name: '',
        latitude: 0,
        longitude: 0,
        address: '',
        type: 0,
        description: '',
        doctors: [],
        ward: '',
        district: '',
        place_id: ''
      }
    }
  },

  components: {
    clinicInfo,
    doctors
  }
}
</script>

<style>
w-500 {
  width: 500px
}
</style>
