<template>
  <div>
     <div class="form-group">
      <label for="">Tên phòng khám</label>
      <input
        :class="['form-control', this.errors.first('name') ? 'is-invalid' : '']"
        data-vv-as="Tên phòng khám"
        name = 'name'
        v-validate="'required'"
        type="text"
        class="form-control"
        v-model= "data.name"
        placeholder="Tên">
      <div class="text-danger pt-2">{{ this.errors.first('name') }}</div>
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
      <div class="text-danger pt-2" v-if = "locationError">Vị trí phòng khám không được bỏ trống</div>
    </div>
    <div class="form-group">
      <label>Loại phòng khám</label>
      <select class="form-control" v-model = "data.type">
        <option v-for = "type in types" :key = "type.id" :value="type.value">{type.name}</option>
      </select>
    </div>
    <button @click = "createClinic" type="submit" class="btn btn-primary mt-2">
      <span class="icon-add d-inline mr-2"></span>
      Khởi tạo phòng khám
    </button>
  </div>
</template>

<script>
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import { mapState } from 'vuex'
import request from 'superagent'

export default {
  computed: mapState([
    'idToken'
  ]),

  methods: {
    onFulFilling (result, place) {
      this.latitude = result.latitude
      this.longitue = result.longitue
      this.address = place.formatted_address
    },

    createClinic () {
      this.$validator.validate().then(result => {
        let isError = false

        /** Validate address */
        if (this.address === '') {
          this.isError = true
          this.locationError = true
          return
        } else {
          this.locationError = false
        }

        /** validate name */
        if (!result) {
          return 0
        }

        /** incase validate name successfully but validate address fail */
        if (isError) {
          return 0
        }

        /** all validate Successfully */

        console.log(JSON.stringify(this.data))
        console.log(this.idToken)
        request.post('https://deltavn.net/api/clinic').send(this.data).set({
          Authorization: 'bearer ' + this.idToken
        }).then(() => {
          alert('Tạo phòng khám thành công')
          this.$store.dispatch('toggle', 'isShowModal')
        })
      })
    }
  },

  created () {
    request.get('https://deltavn.net/api/clinic-type').then(res => {
      this.type = res.body.data
    }).catch(() => {
      console.log('Không thể kết nối tới server')
    })
  },

  data () {
    return {
      place: null,
      types: [],
      locationError: false,
      data: {
        name: '',
        latitude: 0,
        longitue: 0,
        address: '',
        type: 0
      }
    }
  },

  components: {
    VueGoogleAutocomplete
  }
}
</script>

<style>
</style>
