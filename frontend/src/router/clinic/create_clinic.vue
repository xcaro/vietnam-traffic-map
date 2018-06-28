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

      debugger
      // Find ward and district
      let service = new window.google.maps.places.PlacesService(document.getElementById('map'))
      service.getDetails(request, async (placeDetails) => {
        debugger
        // Send data to server
        let data = await request.post('http://deltavn.net/api/clinic').send(this.data).set({
          'Authorization': `Bearer ${this.idToken}`
        })
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
