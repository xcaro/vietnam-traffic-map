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
        <button class="btn btn-primary">
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

        <div class="d-flex flex-row flex-wrap clinic-container p-2">
          <div
            class="m-1 btn btn-grid btn-success"
            :key="i"
            v-for="i in 10">
            <a href="#" class="badge badge-danger">5</a>
            Tên : Ca {{i}} <br>
            Bắt đầu: 8h{{0+i}} sáng <br>
            Kết thúc: 8h{{1+i}} sáng <br>
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
  data () {
    return {
      vi: vi
    }
  },

  components: {
    Datepicker
  }
}
</script>

<style>
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
</style>
