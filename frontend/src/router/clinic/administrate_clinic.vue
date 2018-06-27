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
      <div class="mb-2 title">Ca khám bệnh</div>
      <div class="form-group">
        <datepicker
        :inline="true"
        :full-month-name="true"
        wrapper-class="w-100 mb-2"
        calendar-class="w-100"
        :monday-first="false"
        format="dd/MM/yyyy"
        :language="vi"
        :bootstrap-styling="true">
        </datepicker>
      </div>

        <!-- <div class="d-flex flex-row flex-wrap clinic-container p-2">
          <div
            class="m-1 btn btn-grid btn-success"
            :key="i"
            v-for="i in 10">
            <a href="#" class="badge badge-danger">5</a>
            Tên : Ca {{i}} <br>
            Bắt đầu: 8h{{0+i}} sáng <br>
            Kết thúc: 8h{{1+i}} sáng <br>
          </div>
        </div> -->
        <div class="form-group">
          <label for="">Chọn khoảng thời gian: </label>
          <input type="radio" title="5" > 5 phút
          <input type="radio" title="10" /> 10 phút
          <input type="radio" title="15" /> 15 phút
        </div>
        
        <div class="d-flex p-0">
          <div class="flex-grow-1" v-for="i in 5" :key="i">{{i-1}}h</div>
          <div class="d-flex flex-grow-1">
            <div class="text-left flex-grow-1">5h</div>
            <div class="text-right flex-grow-1">6h</div>
          </div>
        </div>
        <div class="d-flex bg-primary p-0 a">
          <div
            :style="{backgroundColor: e.backgroundColor}"
            :class="['flex-grow-1 chon', e.backgroundColor ? 'chons' : 'chon']"
            v-for="(e, index) in data" :key="index" 
            @mouseover="mouseover(index)"
            @mouseout="mouseup(index)"
            @click="click(e, index)">&nbsp;</div>
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
      // Kiểm ngược về xem có isBegin
      // for (let i = index; i > -1; i++) {
      //   if (this.arr[i].isBegin === true) {
      //     // Hover
      //     for (let j = i + 1; j >= index; j++) {
      //       this.arr[i].backgroundColor = true
      //     }
      //     return
      //   }
      // }
    },

    mouseup (i) {
      
    },

    click (e, index) {
      // Kiểm tra xem đã chọn chưa
      if (e.isLocked) {
        return
      }

      // Kiểm tra là bắt đầu unbegin
      if (this.begin === index) {
        this.begin = null
        e.backgroundColor = this.defaultColor
        return
      }

      //Kiểm tra về sau xem có begin nào đằng sau không. Có -> đây là end
      if (this.begin !== null) {
        // Kiểm tra x
        let end = this.begin > index ? this.begin-1: index
        let start = (this.begin + index - end)      
        
        for (let i = start; i <= end; i++) {
          if (this.data[i].backgroundColor === this.colors[this.colorIndex] && i !== this.begin) {
            for (let j = start; j < i; j++) {
              this.data[j].isLocked =  false
              this.data[j].backgroundColor = this.defaultColor
            }
            this.begin = null
            alert('Lỗi')
            return
          }
          this.data[i].isLocked = true
          this.data[i].backgroundColor = this.colors[this.colorIndex]
        }

        this.colorIndex ++
        if (this.colorIndex === this.colors.length) {
          this.colorIndex = 0

        //Hợp lệ
        let mid = parse.Int((start+end) / 2)
        debugger
      }

        this.begin = null
        return
      }

      // đây là begin
      this.begin = index
      e.backgroundColor = this.colors[this.colorIndex]
    }
  },

  created () {
    for (let i = 0; i < 36; i++) {
      this.data.push({
        isLocked: false,
        backgroundColor: this.defaultColor,
      })
    }
  },

  data () {
    return {
      defaultColor: '#007bff',
      vi: vi,
      begin: null,
      end: null,
      arr: [],
      colorIndex: 0,
      colors: ['red', 'green', 'blue', 'yellow'],
      data: []
    }
  },

  components: {
    Datepicker
  }
}
</script>

<style>
.chons {
  background: yellow
}

.title {
  font-weight: bold;
  font-size: 1.2em
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
  border: 1px solid #cccccc;
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

.a > div {
  border-right: 1px solid white;
  border-left: 1px solid white
}
</style>
