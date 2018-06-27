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
      console.log(this.data)
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
        district: ''
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
