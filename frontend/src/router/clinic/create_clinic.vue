<template>
  <div class="w-500">
    <div v-show="step===0">
      <clinicInfo
        sumbitText="Tiếp theo"
        :sumbitCallBack="nextStep" />
    </div>
    <div v-if="step!==0">
      <doctors
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
      this.data.doctors = data
      // Reserve coding into place id into ward district
      // let placeDetails = await request.get('https://maps.googleapis.com/maps/api/place/details/json')
      //   .query({key: 'AIzaSyAViN9qPZApiSiTzZT4J3vZ030hGjn00X0'})
      //   .query({placeid: this.data.place_id})

      
      request.get(
        'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyA6jVBqVLTXFpNsxmEKx8HTFEIwmiq0usQ&latlng=10.788828, 106.67484'
      ).then((res) => {
        let geocode = res.body.results.filter(result => {
          return result.types.indexOf('street_address') !== -1
        })[0]

        // Find ward and district
        this.ward = geocode.address_components.filter(address_component => {
          return address_component.types.indexOf('administrative_area_level_3') !== -1
        })[0].long_name

        this.district = geocode.address_components.filter(address_component => {
          return address_component.types.indexOf('administrative_area_level_2') !== -1
        })[0].long_name

        this.$store.dispatch('toggle', 'isShowModal')
      })
    }
  },

  data () {
    return {
      step: 0,
      data: {
        name: '',
        latitude: 0,
        longitue: 0,
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
