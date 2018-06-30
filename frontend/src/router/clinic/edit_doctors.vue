<template>
  <div>
    <doctors
        :initData = "doctors"
        sumbitText="Chỉnh sửa bác sĩ"
        :backCallBack="()=>{$router.replace('/clinic/administrate')}"
        :isShowBack="true"
        :submitCallBack="editDoctors" />
  </div>
</template>

<script>
import {mapState} from 'vuex'
import request from 'superagent'
import Doctors from '../../components/Doctors'
export default {
  computed: mapState(['idToken']),
  methods: {
    editDoctors (data) {
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
        this.$store.dispatch('toggle', 'isShowModal')
      })
    }
  },

  components: {
    Doctors
  },

  data () {
    return {
      doctors: {}
    }
  },

  created () {
    this.$store.dispatch('set', {
      propertyName: 'isLoading',
      payload: true
    })
    let self = this
    request.get('http://deltavn.net/api/clinic/' + this.$route.params.id).set({
      'Authorization': `Bearer ${this.idToken}`
    }).then(res => {
      self.doctors = res.body.data
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
