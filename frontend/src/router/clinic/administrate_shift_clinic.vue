<template>
  <div class="w-500">
    <!-- <div class="mt-3">
      <div class="mb-2 title">Thông tin phòng khám :</div>
      <div>
        <div class="display">Tên: LoremIspum</div>
        <div class="display">Loại: Nha khoa</div>
        <div class="display">Vị trí: 123/456 Đường lorem phường x quận y thành phố Hồ Chí Minh</div>
      </div>
      <div class="d-flex mt-2">
        <button class="btn btn-primary mr-2" @click="$router.replace('/clinic/edit-doctors')">
          <span class="icon-edit d-inline mr-1"></span>
          Chỉnh sửa người đại diện
        </button>
        <button class="btn btn-primary mr-2" @click="$router.replace('/clinic/edit-clinic')">
          <span class="icon-edit d-inline mr-1"></span>
          Chỉnh sửa thông tin
        </button>
        <button class="btn btn-primary" @click="$router.replace('/clinic/shift/create')">
          <span class="icon-add d-inline mr-1"></span>
          Tạo ca khám bệnh
        </button>
      </div>
    </div>
    <div class="mt-3 mb-1">
      <hr>
    </div> -->
    <div class="mt-2">
      <div class="mb-2 title">Chọn ngày :</div>
      <div class="form-group">
        <datepicker
        @selected="getShift"
        v-model="timeFilter"
        :inline="true"
        :full-month-name="true"
        wrapper-class="w-100 mb-2"
        calendar-class="w-100"
        :monday-first="false"
        format="dd/MM/yyyy"
        :bootstrap-styling="true">
        </datepicker>
      </div>
        <hr>
        <div class="mb-2 mt-3 title">Ca khám bệnh :</div>
        <div class="d-flex p-0 time flex-wrap">
          <div
            :style="{backgroundColor: shiftPicker.backgroundColor, flexBasis}"
            :class="['position-relative mt-5', shiftPicker.backgroundColor !== defaultColor ? 'no-border' : '']"
            v-for="(shiftPicker, index) in shiftPickers" :key="index"
            @mouseover="mouseover(index)"
            @mouseout="mouseup(index)"
            @click="click(shiftPicker, index)">
              <span
                v-if="shiftPicker.title"
                :class="['hour-title position-absolute noselect w-200']">
                {{shiftPicker.title}}
              </span>
              <span
                v-if="shiftPicker.text"
                class='text-white font-weight-bold position-absolute noselect w-200 z-9999 text-title'>
                  <popper trigger="click" :options="{placement: 'top'}" v-if="shiftPicker.parrent">
                    <div class="popper">
                      Bắt&nbsp;đầu:&nbsp;{{shiftPicker.parrent.popperStartStr}} <br>
                      Kết&nbsp;thúc:&nbsp;{{shiftPicker.parrent.popperEndStr}} <br>
                      <button class="btn btn-primary btn-sm col my-2">
                        <span class="icon-info d-inline mr-1"></span>
                        Chi tiết</button>
                      <button class="btn btn-danger btn-sm col" @click="deleteShift(shiftPicker.parrent)">
                        <span class="icon-trash d-inline mr-1"></span>
                        Xóa</button>
                    </div>

                    <div slot="reference">
                      {{shiftPicker.text}}
                    </div>
                  </popper>
                  <span v-else>{{shiftPicker.text}}</span>
              </span>

              <popper trigger="click" :options="{placement: 'top'}" v-if="shiftPicker.parrent">
                <div class="popper">
                  Bắt&nbsp;đầu:&nbsp;{{shiftPicker.parrent.popperStartStr}} <br>
                  Kết&nbsp;thúc:&nbsp;{{shiftPicker.parrent.popperEndStr}} <br>
                  <button class="btn btn-primary btn-sm col my-2">
                    <span class="icon-info d-inline mr-1"></span>
                    Chi tiết</button>
                  <button class="btn btn-danger btn-sm col" @click="deleteShift(shiftPicker.parrent)">
                    <span class="icon-trash d-inline mr-1"></span>
                    Xóa</button>
                </div>

                <div slot="reference">
                  &nbsp;
                </div>
              </popper>
              <span class="noselect" v-else>&nbsp;</span>

            </div>
        </div>
    </div>
    <!-- <div class="mt-2">
      <button class="btn-danger btn mr-1">
        <span class="icon-trash d-inline mr-1"></span>
        Hủy ca
      </button>
      <button class="btn-primary btn">
        <span class="icon-edit d-inline mr-1"></span>
        Chỉnh sửa ca
      </button>
    </div> -->
  </div>
</template>

<script>
import Vue from 'vue'
import Datepicker from 'vuejs-datepicker'
import request from 'superagent'
import {mapState} from 'vuex'
import {vi} from 'vuejs-datepicker/dist/locale'
import Popper from 'vue-popperjs'
import 'vue-popperjs/dist/css/vue-popper.css'
import leftPad from 'left-pad'

export default {
  methods: {
    deleteShift (shift) {
      let confirm = window.confirm(`Bạn có muốn xóa ca từ ${shift.popperStartStr} đến ${shift.popperEndStr}`)
      if (!confirm) {
        return
      }
      request.delete(`http://deltavn.net/api/clinic/${this.$route.params.id}/shift/${shift.id}`)
        .set({
          'Authorization': `Bearer ${this.idToken}`
        }).then(res => {
          // Rerender shift picker
          for (let i = shift.startIndex; i < shift.endIndex + 1; i++) {
            this.shiftPickers[i].parrent = null
            this.shiftPickers[i].backgroundColor = this.defaultColor
            this.shiftPickers[i].text = ''
          }

          // Sếp lại thứ tự text

          // Bỏ đối tượng shift
          let index = this.shifts.findIndex(_shift => _shift.id === shift.id)
          this.shifts.splice(index, 1)

          alert('Xóa ca thành công')
        })
    },

    saveNumTimePerShiftPickerInMinutesSettings () {
      if (this.shifts.length !== 0) {
        alert('Đã có ca được tạo trong ngày hôm nay, không thê lưu được cài đặt')
      } else {
        this.numTimePerShiftPickerInMinutes = this.saveNumTimePerShiftPickerInMinutesSettings
      }
    },

    mouseover (index) {
      if (this.begin !== null && this.begin !== index) {
        let start = Math.min(this.begin, index)
        let end = start === this.begin ? index : this.begin

        for (let i = start; i <= end; i++) {
          // Không đụng vào phần tử bị locked và begin
          if (!this.shiftPickers[i].parrent && i !== this.begin) {
            this.shiftPickers[i].backgroundColor = this.colors[this.colorIndex]
          }
        }
      }
    },

    mouseup (index) {
      if (this.begin !== null && this.begin !== index) {
        let start = Math.min(this.begin, index)
        let end = start === this.begin ? index : this.begin

        for (let i = start; i <= end; i++) {
          if (!this.shiftPickers[i].parrent && i !== this.begin) {
            this.shiftPickers[i].backgroundColor = this.defaultColor
          }
        }
      }
    },

    click (e, index) {
      // Kiểm tra xem đã chọn chưa
      if (e.parrent) {
        // Hiện popper

        return
      }

      // Kiểm tra về sau xem có begin nào đằng sau không. Có -> đây là end
      if (this.begin !== null) {
        // Kiểm tra là bắt đầu unbegin
        if (this.begin === index) {
          this.begin = null
          e.backgroundColor = this.defaultColor
          return
        }

        // Kiểm tra x
        let start = Math.min(this.begin, index)
        let end = start === this.begin ? index : this.begin

        // Check for error here

        // Hỏi xem người dùng có click nhầm hay không :
        let startTimeInMinutes = start === 0 ? 0 : start * this.numTimePerShiftPickerInMinutes
        let endTimeInMinutes = end === 0 ? 0 : (end + 1) * this.numTimePerShiftPickerInMinutes

        let startAt = this.convertMinsToHrsMins(startTimeInMinutes)
        let endAt = this.convertMinsToHrsMins(endTimeInMinutes)
        let date = `ngày ${this.timeFilter.getDate()} tháng ${this.timeFilter.getMonth()} năm ${this.timeFilter.getFullYear()}`
        let confirm = window.confirm(`Bạn có muốn tạo ca vào ${date} từ ${startAt} đến ${endAt}`)
        if (!confirm) return

        for (let i = start; i <= end; i++) {
          if (this.shiftPickers[i].parrent) {
            // Set vị trí hiện tại trong trường hợp di chuyển lên
            this.shiftPickers[end].backgroundColor = this.defaultColor

            // Set từ start lên i
            for (let j = start; j < i; j++) { // đảo ngược từ đâu
              this.shiftPickers[j].backgroundColor = this.defaultColor
            }

            // Tắt sự kiện mouse up:
            this.mouseup(index)
            this.begin = null
            alert('Lỗi: Đã có ca được tạo trong khoảng thời gian mà bạn chọn rồi')
            return
          }

          this.shiftPickers[i].backgroundColor = this.colors[this.colorIndex]
        }

        // Lưu lại ca đã chọn
        // Tìm vị trí, để sắp theo thứ tự
        let newShift = {
          startElem: this.shiftPickers[start],
          startIndex: start,
          endIndex: end,
          popperStartStr: startAt,
          popperEndStr: endAt
        }
        for (let iii = start; iii <= end; iii++) {
          Vue.set(this.shiftPickers, iii, Object.assign(this.shiftPickers[iii], {
            parrent: newShift
          }))
        }

        let isInsertInside = false
        for (let ii = 0; ii < this.shifts.length; ii++) {
          if (this.shifts[ii].startIndex > end) {
            this.shifts.splice(ii, 0, newShift)

            // Gán text : thứ tự ca
            for (let jj = ii; jj < this.shifts.length; jj++) {
              Vue.set(this.shifts[jj].startElem, 'text', `Ca ${jj + 1}`)
            }

            isInsertInside = true
          }

          if (isInsertInside) break
        }

        // Phải chèn ở phỉa ngoài cùng
        if (!isInsertInside) {
          let shiftsNewLength = this.shifts.push(newShift)
          this.shiftPickers[start].text = `Ca ${shiftsNewLength}`
        }

        // format start at and end at
        let startAtTimeObject = new Date(this.timeFilter.toDateString() + ' ' + startAt)
        let endAtTimeObject = new Date(this.timeFilter.toDateString() + ' ' + endAt)
        let startAtStr = this.yyyy_mm_dd_hh_mm_ss(startAtTimeObject)
        let endAtStr = this.yyyy_mm_dd_hh_mm_ss(endAtTimeObject)

        // Đẩy dữ liệu lên server thông qua api
        request.post(`http://deltavn.net/api/clinic/${this.$route.params.id}/shift`)
          .set({
            'Authorization': `Bearer ${this.idToken}`
          })
          .send({
            start_shift: startAtStr,
            end_shift: endAtStr
          }).then(res => {
            alert('Tạo ca thành công')
          })

        // Đổi màu
        this.colorIndex++
        if (this.colorIndex === this.colors.length) {
          this.colorIndex = 0
        }

        this.begin = null
        return
      }

      // đây là begin
      this.begin = index
      e.backgroundColor = this.colors[this.colorIndex]
    },

    renderShiftPopper () {

    },

    renderShifts (shifts) {
      // Chỉnh màu, vue event chỉnh riêng, tốn thếm parrent reference
    },

    getShift (dateTime) {
      // Format lại thời gian
      let startAt = this.yyyy_mm_dd_00_00_00(dateTime)

      // Gửi dữ liệu lấy ca dựa trên thời gian
      let self = this
      this.$store.dispatch('set', {
        propertyName: 'isLoading',
        payload: true
      })
      request.get(`http://deltavn.net/api/clinic/${this.$route.params.id}/shift`)
        .set({
          'Authorization': `Bearer ${this.idToken}`
        })
        .query({start_at: startAt})
        .then((res) => {
          // Gán shift
          /* eslint-disable camelcase */
          self.shifts = res.body.data
          self.shifts.forEach((shift, index) => {
            let start_shift = new Date(shift.start_shift)
            let end_shift = new Date(shift.end_shift)
            let startTimeInMinutes = start_shift.getHours() * 60 + start_shift.getMinutes()
            let startIndex = (startTimeInMinutes / this.numTimePerShiftPickerInMinutes)
            let endTimeInMinutes = end_shift.getHours() * 60 + end_shift.getMinutes()
            let endIndex = (endTimeInMinutes / this.numTimePerShiftPickerInMinutes)


            // Gán shift index
            shift.startIndex = startIndex
            shift.endIndex = endIndex

            for (let i = startIndex; i < endIndex; i++) {
              self.shiftPickers[i].backgroundColor = self.colors[self.colorIndex]
              self.shiftPickers[i].parrent = shift
            }
            self.colorIndex++
            if (self.colorIndex >= self.colors.length) {
              self.colorIndex = 0
            }

            // Format lại thời gian hiện thi trên popper
            shift.popperStartStr = `${leftPad(start_shift.getHours(), 2, 0)}:${leftPad(start_shift.getMinutes(), 2, 0)}`
            shift.popperEndStr = `${leftPad(end_shift.getHours(), 2, 0)}:${leftPad(end_shift.getMinutes(), 2, 0)}`
            shift.startElem = this.shiftPickers[startIndex]
            shift.startElem.text = `Ca ${index+1}`
          })
          this.$store.dispatch('set', {
            propertyName: 'isLoading',
            payload: false
          })
        })
    },

    yyyy_mm_dd_00_00_00 (now) {
      let year = '' + now.getFullYear()
      let month = '' + (now.getMonth() + 1)
      if (month.length === 1) { month = '0' + month }
      let day = '' + now.getDate()
      if (day.length === 1) { day = '0' + day }
      return year + '-' + month + '-' + day + ' 00:00:00'
    },

    yyyy_mm_dd_hh_mm_ss (now) {
      let year = '' + now.getFullYear()
      let month = '' + (now.getMonth() + 1)
      if (month.length === 1) { month = '0' + month }
      let day = '' + now.getDate()
      if (day.length === 1) { day = '0' + day }
      let hour = '' + now.getHours()
      if (hour.length === 1) { hour = '0' + hour }
      let minute = '' + now.getMinutes()
      if (minute.length === 1) { minute = '0' + minute }
      let second = '' + now.getSeconds()
      if (second.length === 1) { second = '0' + second }
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    },

    convertMinsToHrsMins: function (minutes) {
      var h = Math.floor(minutes / 60)
      var m = minutes % 60
      h = h < 10 ? '0' + h : h
      m = m < 10 ? '0' + m : m
      return h + ':' + m
    }
  },

  watch: {
    numTimePerShiftPickerInMinutes (newVal) {
      // Tạo số lượng shift picker cần thiết
      this.shiftPickers = []
      let numShiftPickers = this.numTimePerDayInMinutes / this.numTimePerShiftPickerInMinutes
      for (let i = 0; i < numShiftPickers; i++) {
        this.shiftPickers.push({
          backgroundColor: this.defaultColor
        })

        let thisShiftPickerTimeInHour = ((i + 1) * this.numTimePerShiftPickerInMinutes) / 60
        if (Number.isInteger(thisShiftPickerTimeInHour)) {
          this.shiftPickers[i].title = `${thisShiftPickerTimeInHour} h`
        }
      }
      this.shiftPickers[0].title = '0 h'
    }
  },

  computed: {
    flexBasis () {
      // Calculate flex basis :
      let numShiftPickersPerRowInHour = (this.numHourPerRow * 60) / this.numTimePerShiftPickerInMinutes
      return 100 / numShiftPickersPerRowInHour + '%'
    },
    ...mapState(['idToken'])
  },

  created () {
    // Render shifttime picker
    this.shiftPickers = []
    let numShiftPickers = this.numTimePerDayInMinutes / this.numTimePerShiftPickerInMinutes
    for (let i = 0; i < numShiftPickers; i++) {
      this.shiftPickers.push({
        backgroundColor: this.defaultColor
      })

      let thisShiftPickerTimeInHour = ((i + 1) * this.numTimePerShiftPickerInMinutes) / 60
      if (Number.isInteger(thisShiftPickerTimeInHour)) {
        this.shiftPickers[i].title = `${thisShiftPickerTimeInHour} h`
      }
    }
    this.shiftPickers[0].title = '0 h'

    // Tạo event resize responsive
    window.onresize = () => {
      let fullWidth = window.innerWidth
      if (fullWidth > 1024) {
        this.numHourPerRow = 4
      } else if (fullWidth < 1024 && fullWidth > 768) {
        this.numHourPerRow = 3
      } else if (fullWidth < 768 && fullWidth > 480) {
        this.numHourPerRow = 2
      } else {
        this.numHourPerRow = 1
      }
    }
    window.onresize()

    // Lấy thông tin ca của ngày hôm nay
    this.getShift(new Date())
  },

  data () {
    return {
      numHourPerRow: 4,
      numTimePerDayInMinutes: 1440, // ngày có 12 tiếng 1440 phút
      numTimePerShiftPickerInMinutes: 5,
      defaultColor: 'white',
      vi: vi,
      begin: null,
      end: null,
      colorIndex: 0,
      colors: ['#EF5350', '#EC407A', '#9C27B0', '#1A237E', '#536DFE', '#2196F3', '#00C853', '#f1c40f', '#F57F17'],
      shifts: [],
      shiftPickers: [],
      timeFilter: new Date()
    }
  },

  components: {
    Datepicker,
    Popper
  }
}
</script>

<style>
@media (max-width: 640px) {
  #datepicker-desktop {
      display: none
  }
}

@media (max-width: 320px) {
  .text-title {
    letter-spacing: -2px;
    font-size: 15px
  }
}

@media (min-width: 640px) {
  #datepicker-mobile {
      background-color: lightblue;
  }
}

.vdp-datepicker__calendar .cell.selected:hover {
  background: #478bfb;
}

.vdp-datepicker__calendar .cell.selected {
  background: #2b6ee0;
  color: white;
}

.vdp-datepicker__calendar .cell.day-header {
    font-size: 1em;
}

.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover {
  border: 1px solid #2b6ee0;
}

.display {
  letter-spacing: 1px;
  padding-bottom: 5px;
}

.clinic-container {
  border: 1px solid #a5a5a5;
  border-radius: 1px;
}

.btn-grid {
  position: relative;
}

.btn-grid > .badge {
  position: absolute;
  top: -5px;
  right: -5px;
  padding: 5px
}

.time > div {
  cursor: pointer;
}

.time > div:not([class*="no-border"]) {
  border: 1px solid #999;
}

.rightMost {
  right: 0;
}

.hour-title {
  top: -30px;
  letter-spacing: -2px;
  font-weight: bold
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}

.w-200 {
  width: 200%
}

.z-9999 {
  z-index: 9999
}

.popper {
  padding: 5px !important
}
</style>
