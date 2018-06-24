<template>
  <div class="w-500">
    <div v-show="step===0">
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
        <button class="btn btn-primary ml-auto mt-3" @click="nextStep">
          Bước tiếp theo
        </button>
      </div>
    </div>
    <div  v-if="step!==0">
      <div class="d-flex my-4">
        <button class="btn btn-primary ml-auto" @click="addAvatar">
          <span class="icon-add d-inline mr-2"></span>
          Thêm người đại diện
        </button>
      </div>

      <div
        :key="avatar.name"
        v-for="(avatar, index) in data.avatars">
        <hr>
        <div class="form-group">
          <label for="exampleInputPassword1">Học vị :</label>
          <select v-model="avatar.role" class="form-control">
            <option
              :value="role"
              :key="role"
              v-for="role in roles">
              {{role}}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Họ tên :</label>
          <input
            :class="['form-control', getError('name' + index) ? 'is-invalid' : '']"
            :name = "'name' + index"
            v-validate="'required'"
            data-vv-as="Họ tên"
            type="text"
            class="form-control"
            placeholder="Họ tên">
          <div class="text-danger pt-2">{{ getError('name' + index) }}</div>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Mô tả :</label>
          <textarea class="form-control">
          </textarea>
        </div>
        <div class="d-flex">
          <button class="btn btn-danger ml-auto" @click="deleteAvatar(index)">
            <span class="icon-add d-inline mr-2"></span>
            Xóa người đại diện
          </button>
        </div>
      </div>

      <hr>
      <div class="form-group d-flex">
        <button class="btn btn-secondary ml-auto mr-3" @click="step--">
          Quay lại
        </button>
        <button class="btn btn-primary" @click="createClinic">
          Hoàn tất
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import { VueEditor } from 'vue2-editor'
import { mapState } from 'vuex'
import request from 'superagent'

export default {
  computed: mapState([
    'idToken'
  ]),

  methods: {
    getError (name) {
      return this.errors.first(name)
    },

    addAvatar () {
      this.data.avatars.push({
        name: '',
        description: '',
        role: 'Thạc sĩ',
        image: null
      })
    },

    deleteAvatar (index) {
      this.data.avatars.splice(index, 1)
    },

    onFulFilling (result, place) {
      this.data.latitude = result.latitude
      this.data.longitue = result.longitue
      this.data.address = place.formatted_address
    },

    nextStep () {
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
          this.step++
        }
      })
    },

    createClinic () {
      this.$validator.validate().then(result => {
        if (result) {
          console.log(this.data)
        }
      })
    }
  },

  created () {
    request.get('http://deltavn.net/api/clinic-type').then((res) => {
      this.data.type = 1
      this.clinicTypes = res.body.data
    })
  },

  data () {
    return {
      roles: [
        'Tiến sĩ',
        'Thạc sĩ',
        'Phó giáo sư',
        'Giáo sư'
      ],
      step: 0,
      place: null,
      dayOfWeeks: [],
      clinicTypes: [],
      locationError: false,
      data: {
        name: '',
        latitude: 0,
        longitue: 0,
        address: '',
        type: 0,
        content: '',
        avatars: []
      }
    }
  },

  components: {
    VueGoogleAutocomplete,
    VueEditor
  }
}
</script>

<style>
w-500 {
  width: 500px
}
</style>
