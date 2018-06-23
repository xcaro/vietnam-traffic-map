<template>
  <div class="w-500">
    <div v-if="step===0">
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
        <button class="btn btn-primary ml-auto mt-3" @click="step++">
          Bước tiếp theo
        </button>
      </div>
    </div>
    <div v-else>
      <div class="form-row">
        <div class="form-group col-6">
          <label>Ngày làm việc</label>
          <select v-model="dayOfWeeksRange.start" class="form-control">
            <option
            :value="dayOfWeek"
            :key="dayOfWeek.toString()"
            v-for="dayOfWeek in dayOfWeeks">
              {{dayOfWeek.toString()}}
            </option>
          </select>
        </div>
        <div class="form-group col-6 ml-auto">
          <label>đến</label>
          <select v-model="dayOfWeeksRange.end" class="form-control">
            <option
            :value="dayOfWeek"
            :key="dayOfWeek.toString()"
            v-for="dayOfWeek in dayOfWeeks">
              {{dayOfWeek.toString()}}
            </option>
          </select>
        </div>
      </div>
      <div class="d-flex mb-4">
        <button class="btn btn-primary ml-auto" @click="addWorkDay">
          <span class="icon-add d-inline mr-2"></span>
          Thêm ngày làm việc
        </button>
      </div>

      <div
        :key="workTime.dayOfWeeksRange.start+workTime.dayOfWeeksRange.end"
        v-for="workTime in data.workTimes">
        {{workTime.dayOfWeeksRange.start.toString()}} tới {{workTime.dayOfWeeksRange.end.toString()}}
        <button class="btn btn-primary ml-auto mt-3" @click="addWorkDay">
          <span class="icon-add d-inline mr-2"></span>
          Thêm thời gian làm việc
        </button>
      </div>

      <hr>
      <div class="form-group d-flex">
        <button class="btn btn-secondary ml-auto mr-3" @click="step--">
          Quay lại
        </button>
        <button class="btn btn-primary" @click="step++">
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

export class DayOfWeek {
  toString () {
    switch (this.index) {
      case 1: return 'chủ nhật'
      default: return 'thứ ' + this.index
    }
  }

  constructor (index) {
    this.index = index
  }
}

export default {
  computed: mapState([
    'idToken'
  ]),

  methods: {
    addWorkDay () {
      this.data.workTimes.push({
        dayOfWeeksRange: Object.assign({}, this.dayOfWeeksRange),
        timeRanges: []
      })
    },

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
        request.post('http://deltavn.net/api/clinic').send(this.data).set({
          Authorization: 'bearer ' + this.idToken
        }).then(() => {
          alert('Tạo phòng khám thành công')
          this.$store.dispatch('toggle', 'isShowModal')
        })
      })
    }
  },

  created () {
    request.get('http://deltavn.net/api/clinic-type').then((res) => {
      this.clinicTypes = res.body.data
    })

    for (let i = 1; i < 8; i++) {
      this.dayOfWeeks.push(new DayOfWeek(i))
    }

    this.dayOfWeeksRange.start = this.dayOfWeeks[1]
    this.dayOfWeeksRange.end = this.dayOfWeeks[5]
  },

  data () {
    return {
      step: 0,
      place: null,
      dayOfWeeks: [],
      clinicTypes: [],
      locationError: false,
      dayOfWeeksRange: {
        start: null,
        end: null
      },
      data: {
        name: '',
        latitude: 0,
        longitue: 0,
        address: '',
        type: 0,
        content: '',
        workTimes: []
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
