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
      <div class="mb-2 title">Chọn ngày :</div>
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
      <hr>
      <div class="mb-2 title">Cài đặt giao diện :</div>
        <!-- <div class="form-row">
            <label for="validationCustom02" class="col-3">Thời gian trên mỗi nấc (phút) </label>
            <select class="form-control col-5" v-model="numTimePerShiftPickerInMinutesSettings">
              <option v-for="i in [5, 10,20]" :key="i">{{i}}</option>
            </select>
            <button class="btn-primary btn col-3 ml-auto" @click="saveNumTimePerShiftPickerInMinutesSettings">
              <span class="icon-edit d-inline mr-1"></span>
              Chỉnh sửa ca
            </button>
        </div> -->
         <div class="form-row align-items-center">
            <div class="col-auto">
              <label for="inlineFormInput">Thời gian trên mỗi nấc (phút) :</label>
            </div>
            <div class="col">
              <select class="form-control" v-model="numTimePerShiftPickerInMinutesSettings">
                <option v-for="i in [5, 10,20]" :key="i">{{i}}</option>
              </select>
            </div>
            <div class="col-auto">
              <button type="submit" class="btn btn-primary" @click="saveNumTimePerShiftPickerInMinutesSettings">
                <span class="icon-edit d-inline mr-1"></span>
                Chỉnh sửa
              </button>
            </div>
          </div>
        <hr>
        <div class="mb-2 mt-3 title">Ca khám bệnh :</div>
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
                :class="['hour-title position-absolute noselect w-200']">
                {{shiftPicker.title}}
              </span>
              <span
                v-if="shiftPicker.text"
                :class="['text-white font-weight-bold position-absolute noselect w-200 z-9999']">
                  {{shiftPicker.text}}
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

        // Lưu lại ca đã chọn
        // Tìm vị trí, để sắp theo thứ tự
        for (let ii = 0; ii < this.shifts.length; ii++) {
          if (this.shifts[ii].start > end) {
            this.shifts.splice(ii, 0, this.createNewShift(start, end, this.colors[this.colorIndex]))

            // Gán text : thứ tự ca
            for (let jj = ii; jj < this.shifts.length; jj++) {
              this.shifts[jj].startElem.text = `Ca ${jj + 1}`
            }

            return
          }
        }

        // Phải chèn ở phỉa ngoài cùng
        let shiftsNewLength = this.shifts.push(this.createNewShift(start, end, this.colors[this.colorIndex]))
        this.shiftPickers[start].text = `Ca ${shiftsNewLength}`

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

    createNewShift (startIndex, endIndex, backgroundColor) {
      return {
        startElem: this.shiftPickers[startIndex],
        startIndex,
        endIndex,
        backgroundColor,
        startTimeInMinute: startIndex === 0 ? 0 : (startIndex + 1) * this.numTimePerShiftPickerInMinutes,
        endTimeInMinutes: endIndex === 0 ? 0 : (endIndex + 1) * this.numTimePerShiftPickerInMinutes
      }
    }
  },

  watch: {
    numTimePerShiftPickerInMinutes (oldVal, newVal) {
      // Tạo số lượng shift picker cần thiết
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
  },

  data () {
    return {
      numHourPerRow: 4,
      numTimePerDayInMinutes: 1440, // ngày có 12 tiếng 1440 phút
      numTimePerShiftPickerInMinutes: 10,
      numTimePerShiftPickerInMinutesSettings: 10,
      defaultColor: 'white',
      vi: vi,
      begin: null,
      end: null,
      colorIndex: 0,
      colors: ['#EF5350', '#EC407A', '#9C27B0', '#1A237E', '#536DFE', '#2196F3', '#00C853', '#EEFF41', '#F57F17', '#212121'],
      shifts: [],
      shiftPickers: []
    }
  },

  components: {
    Datepicker
  }
}
</script>

<style>
@media (max-width: 640px) {
  #datepicker-desktop {
      display: none
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

.w-200 {
  width: 200%
}

.z-9999 {
  z-index: 9999
}

::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
}

</style>
