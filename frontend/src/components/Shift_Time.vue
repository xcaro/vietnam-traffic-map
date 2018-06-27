<template>
<div class="createshift">
  <div id="createshift">
    <div class="mt-4">
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="inputEmail4">Bắt đầu</label>
          <vue-clock-picker
              mode="24"
              :onTimeChange="startTimeChange"/>
        </div>
        <div class="form-group col-md-6">
          <label for="inputPassword4">Kết thúc</label>
          <vue-clock-picker
              mode="24"
              :onTimeChange="startTimeChange"/>
        </div>
      </div>
      <div class="form-group">
        <label for="">Tên ca</label>
        <input
          :class="['form-control', this.errors.first('name') ? 'is-invalid' : '']"
          data-vv-as="Tên phòng khám"
          name = 'name'
          v-validate="'required'"
          type="text"
          class="form-control"
          v-model= "data.name"
          placeholder="Tên phòng khám">
        <div class="text-danger pt-2">{{ this.errors.first('name') }}</div>
      </div>
    </div>
    <hr>
    <div class="d-flex">
      <button class="btn btn-secondary ml-auto mr-2 ml-auto" @click="$route.replace('clinic/shift/create')">
        <span class="icon-undo2 d-inline mr-1"></span>
        Quay lại
      </button>
      <button class="btn btn-primary">
        <span class="icon-edit d-inline mr-1"></span>
        Tạo ca
      </button>
    </div>
  </div>
</div>
</template>

<script>
import VueClockPicker from 'vue-clock-picker'

export default {
  data () {
    return {
      data: {
        name: '',
        start: '',
        end: ''
      }
    }
  },

  methods: {
    startTimeChange () {

    },

    endTimeChange () {

    }
  },

  components: {
    VueClockPicker
  }

}
</script>

<style>
#create_shift {
  height: 1000px;
}

.time-picker-preview,
.time-picker-modal-container {
  width: 100% !important
}

.time-picker-interval {
    font-weight: bold;
    color: #9c9c9c;
}

.picker-point {
  font-weight: bold
}

.picker-container {
    border: 2px solid #5892f2;
    background: white
}

.w-150 {
  padding: 0px 500px
}

.createshift {
  min-width: 500px;
  overflow: unset !important;
}
</style>
 