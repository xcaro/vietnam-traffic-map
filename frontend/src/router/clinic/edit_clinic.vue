<template>
  <div>
    <clinicInfo
        sumbitText="Chỉnh sửa phòng khám"
        :backCallBack="()=>{$router.replace('/clinic/administrate')}"
        :isShowBack="true"
        :sumbitCallBack="editClinic" />
  </div>
</template>

<script>
import clinicInfo from '../../components/Clinic_Info'
export default {
  methods: {
    editClinic () {

    }
  },
  components: {
    clinicInfo
  }
}
</script>

<style>

</style>
