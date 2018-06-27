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
          types="address"
          :class="['form-control', locationError ? 'is-invalid' : '']"
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
        <select class="form-control" id="clinic-type" v-model = "data.type">
          <option
            selected
            :key="clinicType.id"
            v-for="clinicType in clinicTypes"
            :value="clinicType.id">
              {{clinicType.name}}
            </option>
        </select>
      </div>
      <div class="form-group">
        <label>Mô tả</label>
        <vue-editor v-model="data.content"></vue-editor>
      </div>
      <div class="form-group d-flex">
        <button class="btn btn-secondary ml-auto mr-2" @click="backCallBack" v-if="isShowBack">
          <span class="icon-undo2 d-inline mr-1"></span>
          Quay lại
        </button>
        <button :class="['btn btn-primary', isShowBack ? '' : 'ml-auto']" @click="onSumbit">
          <span class="icon-edit d-inline mr-1"></span>
          {{this.sumbitText}}
        </button>
      </div>
    </div>
</template>

<script>
import request from 'superagent'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import { VueEditor } from 'vue2-editor'

export default {
  data () {
    return {
      data: Object.assign({}, {
        name: '',
        latitude: 0,
        longitue: 0,
        address: '',
        type: 0,
        content: '',
        ward: '',
        district: ''
      }),
      locationError: false,
      clinicTypes: []
    }
  },
  created () {
    request.get('http://deltavn.net/api/clinic-type').then((res) => {
      this.data.type = 1
      this.clinicTypes = res.body.data
    })
  },
  props: ['sumbitText', 'sumbitCallBack', 'initData', 'isShowBack', 'backCallBack'],
  components: {
    VueGoogleAutocomplete,
    VueEditor
  },
  methods: {
    onFulFilling (result, place) {
      this.data.latitude = result.latitude
      this.data.longitue = result.longitude
      this.data.address = place.formatted_address
      place.address_components.forEach(component => {
        let administrativeAreaLevel1 = component.types.find((type) => type === 'administrative_area_level_1')
        if (administrativeAreaLevel1) {
          this.data.ward = administrativeAreaLevel1
          return
        }

        let administrativeAreaLevel2 = component.types.find((type) => type === 'administrative_area_level_2')
        if (administrativeAreaLevel2) {
          this.data.district = administrativeAreaLevel2
        }
      })
    },

    onSumbit () {
      this.$validator.validate().then(result => {
        let isError = false
        if (this.data.address === '') {
          this.isError = true
          this.locationError = true
          return
        } else {
          this.locationError = false
        }

        /** incase validate name successfully but validate address fail */
        if (isError) {
          return 0
        }

        if (result) {
          this.sumbitCallBack(Object.assign({}, this.data))
        }
      })
    }
  }
}
</script>

<style>

</style>
