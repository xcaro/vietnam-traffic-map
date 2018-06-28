<template>
  <div class="w-500">
    <div class="mt-3">
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
    </div>
    <div class="mt-2">
      <div class="mb-2 title">Ca khám bệnh :</div>
      <div class="form-group">
        <datepicker
        :inline="true"
        :full-month-name="true"
        wrapper-class="w-100 mb-2"
        calendar-class="w-100"
        :monday-first="false"
        format="dd/MM/yyyy"
        :bootstrap-styling="true">
        </datepicker>
      </div>

      <div class="mb-2 title">Cài đặt giao diện :</div>
        <div class="form-row">
          <div class="col-md-6 mb-3">
            <label for="validationCustom01">Thời gian trên dòng (giờ) :</label>
            <select class="form-control" v-model="numHourPerRow">
              <option v-for="i in 4" :key="i">{{i}}</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label for="validationCustom02">Thời gian trên mỗi nấc (phút) </label>
            <select class="form-control" v-model="numTimePerShiftPickerInMinutes">
              <option v-for="i in [10,15,20,30]" :key="i">{{i}}</option>
            </select>
          </div>
        </div>

        <div class="d-flex p-0 time flex-wrap">
          <div
            :style="{backgroundColor: shiftPicker.backgroundColor, flexBasis}"
            :class="['position-relative mt-5', shiftPicker.isLocked ? 'no-border' : '']"
            v-for="(shiftPicker, index) in shiftPickers" :key="index"
            @mouseover="mouseover(index)"
            @mouseout="mouseup(index)"
            @click="click(shiftPicker, index)">
              <span
                v-if="shiftPicker.title"
                :class="['hour-title position-absolute noselect w-100', index===0 ? '': 'text-right']">
                {{shiftPicker.title}}
              </span>
              <span
                v-if="shiftPicker.text"
                :class="['text-white font-weight-bold position-absolute noselect w-100', index===0 ? '': 'text-right']">
                &nbsp;{{shiftPicker.text}}
              </span>
              <span class="noselect">&nbsp;</span>
            </div>
        </div>
      <hr>
    </div>
    <div class="mt-2">
      <button class="btn-danger btn mr-1">
        <span class="icon-trash d-inline mr-1"></span>
        Hủy ca
      </button>
      <button class="btn-primary btn">
        <span class="icon-edit d-inline mr-1"></span>
        Chỉnh sửa ca
      </button>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import {vi} from 'vuejs-datepicker/dist/locale'

export default {
  methods: {
    mouseover (index) {
      if (this.begin !== null && this.begin !== index) {
        let start = Math.min(this.begin, index)
        let end = start === this.begin ? index : this.begin

        for (let i = start; i <= end; i++) {
          // Không đụng vào phần tử bị locked và begin
          if (!this.shiftPickers[i].isLocked && i !== this.begin) {
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
          if (!this.shiftPickers[i].isLocked && i !== this.begin) {
            this.shiftPickers[i].backgroundColor = this.defaultColor
          }
        }
      }
    },

    click (e, index) {
      // Kiểm tra xem đã chọn chưa
      if (e.isLocked) {
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

        for (let i = start; i <= end; i++) {
          if (this.shiftPickers[i].isLocked) {
            // Set vị trí hiện tại trong trường hợp di chuyển lên
            this.shiftPickers[end].isLocked = false
            this.shiftPickers[end].backgroundColor = this.defaultColor

            // Set từ start lên i
            for (let j = start; j < i; j++) { // đảo ngược từ đâu
              this.shiftPickers[j].isLocked = false
              this.shiftPickers[j].backgroundColor = this.defaultColor
            }

            // Tắt sự kiện mouse up:
            this.mouseup(index)
            this.begin = null
            alert('Lỗi')
            return
          }

          this.shiftPickers[i].isLocked = true
          this.shiftPickers[i].backgroundColor = this.colors[this.colorIndex]
        }

        this.colorIndex++
        if (this.colorIndex === this.colors.length) {
          this.colorIndex = 0
        }

        this.begin = null

        // Lưu lại ca đã chọn
        // Tìm vị trí, để sắp theo thứ tự
        for (let ii = 0; ii < this.shifts.length; ii++) {
          if (this.shifts[ii].start > end) {
            this.shifts.splice(ii, 0, {
              startElem: this.shiftPickers[start],
              start,
              end
            })

            // Gán text : thứ tự ca
            for (let jj = ii; jj < this.shifts.length; jj++) {
              this.shifts[jj].startElem.text = `Ca ${jj + 1}`
            }

            return
          }
        }

        // Phải chèn ở phỉa ngoài cùng
        let shiftsNewLength = this.shifts.push({
          startElem: this.shiftPickers[start],
          start,
          end
        })

        this.shiftPickers[start].text = `Ca ${shiftsNewLength}`
        return
      }

      // đây là begin
      this.begin = index
      e.backgroundColor = this.colors[this.colorIndex]
    }
  },

  computed: {
    flexBasis () {
      // Calculate flex basis :
      let numShiftPickersPerRowInHour = (this.numHourPerRow * 60) / this.numTimePerShiftPickerInMinutes
      return 100 / numShiftPickersPerRowInHour + '%'
    }
  },

  created () {
    this.shiftPickers = []
    let numShiftPickers = this.numTimePerDayInMinutes / this.numTimePerShiftPickerInMinutes
    for (let i = 0; i < numShiftPickers; i++) {
      this.shiftPickers.push({
        isLocked: false,
        backgroundColor: this.defaultColor
      })

      let thisShiftPickerTimeInHour = ((i + 1) * this.numTimePerShiftPickerInMinutes) / 60
      if (Number.isInteger(thisShiftPickerTimeInHour)) {
        this.shiftPickers[i].title = `${thisShiftPickerTimeInHour} h`
      }
    }
    this.shiftPickers[0].title = '0 h'
  },

  data () {
    return {
      numHourPerRow: 4,
      numTimePerDayInMinutes: 1440, // ngày có 6 tiếng 360 phút
      numTimePerShiftPickerInMinutes: 15,
      defaultColor: 'white',
      vi: vi,
      begin: null,
      end: null,
      colorIndex: 0,
      colors: ['#EF5350', '#EC407A', '#9C27B0', '#1A237E', '#536DFE', '#2196F3', '#00C853', '#EEFF41', '#F57F17', '#212121'],
      shiftPickers: [],
      shifts: []
    }
  },

  components: {
    Datepicker
  }
}
</script>

<style>
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

.title {
  font-weight: bold;
  font-size: 1.2em
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

.time > div:not([class*="no-border"]) {
  cursor: pointer;
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
</style>
