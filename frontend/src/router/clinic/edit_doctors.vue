<template>
  <div>
    <doctors
        sumbitText="Chỉnh sửa bác sĩ"
        :backCallBack="()=>{$router.replace('/clinic/administrate')}"
        :isShowBack="true"
        :sumbitCallBack="editDoctors" />
  </div>
</template>

<script>
import Doctors from '../../components/Doctors'
export default {
  methods: {
    editDoctors () {

    }
  },
  components: {
    Doctors
  }
}
</script>

<style>

</style>
