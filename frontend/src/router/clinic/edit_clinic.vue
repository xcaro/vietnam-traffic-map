<template>
  <div>
    <clinicInfo
        :initData = "clinic"
        sumbitText="Chỉnh sửa phòng khám"
        :backCallBack="()=>{$router.replace('/clinic/administrate')}"
        :isShowBack="true"
        :sumbitCallBack="editClinic" />
  </div>
</template>

<script>
import clinicInfo from '../../components/Clinic_Info'
import {mapState} from 'vuex'
import request from 'superagent'
export default {
  computed: mapState(['idToken']),
  created () {
    this.$store.dispatch('set', {
      propertyName: 'isLoading',
      payload: true
    })
    let self = this
    request.get('http://deltavn.net/api/clinic/' + this.$route.params.id).set({
      'Authorization': `Bearer ${this.idToken}`
    }).then(res => {
      self.clinic = res.body.data
      this.$store.dispatch('set', {
        propertyName: 'isLoading',
        payload: false
      })
    })
  },

  data () {
    return {
      clinic: null
    }
  },

  methods: {
    editClinic (data) {
      debugger
      let doctors = data.doctors.data.map(doctor => {
        if (!doctor.image) {
          doctor.image = null
        }

        return doctor
      })

      data.doctors = doctors
      request.put('http://deltavn.net/api/clinic/' + this.$route.params.id).send(data).set({
        'Authorization': `Bearer ${this.idToken}`
      }).then(() => {
        alert('Thay đổi thông tin phòng khám thành công')
        this.$router.replace('/clinic/administrate')
      })
    }
  },

  components: {
    clinicInfo
  }
}
</script>

<style>

</style>
