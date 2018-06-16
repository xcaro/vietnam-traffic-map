<template>
  <div>
     <div class="form-group">
      <label for="">Tên phòng khám</label>
      <input type="text" class="form-control" id="" aria-describedby="emailHelp" placeholder="Tên">
      <small id="emailHelp" class="form-text text-muted">Không được bỏ trống</small>
    </div>
    <div class="form-group">
      <label for="">Chọn vị trí phòng khám</label>
      <vue-google-autocomplete
        ref="textinput"
        id="textinput"
        classname="form-control"
        placeholder="Bắt đầu gõ để tìm kiếm địa điểm"
        v-on:placechanged="onFulFilling"
      />
      <small id="emailHelp" class="form-text text-muted">Không được bỏ trống</small>
    </div>
    <div class="form-group">
      <label for="exampleFormControlSelect1">Loại phòng khám</label>
      <select class="form-control" id="exampleFormControlSelect1">
        <option>nha sĩ</option>
        <option>y khoa</option>
      </select>
    </div>
    <button type="submit" class="btn btn-primary mt-2">
      <span class="icon-add d-inline mr-2"></span>
      Khởi tạo phòng khám
    </button>
  </div>
</template>

<script>
import VueGoogleAutocomplete from 'vue-google-autocomplete'

export default {
  methods: {
    onFulFilling (place) {
      this.place = place
    }
  },

  data () {
    return {
      place: null
    }
  },

  components: {
    VueGoogleAutocomplete
  }
}
</script>

<style>
</style>
