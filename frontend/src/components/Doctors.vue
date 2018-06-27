<template>
<div>
  <div class="d-flex my-4">
    <button class="btn btn-primary ml-auto" @click="addAvatar">
      <span class="icon-add d-inline mr-2"></span>
      Thêm người đại diện
    </button>
  </div>

  <div
      :key="avatar.name"
      v-for="(avatar, index) in data.doctors">
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
    <button class="btn btn-secondary ml-auto mr-3" @click="backCallBack" v-if="isShowBack">
      <span class="icon-undo2 d-inline mr-1"></span>
      Quay lại
    </button>
    <button class="btn btn-primary" @click="onSumbit">
      <span class="icon-edit d-inline mr-1"></span>
      Hoàn tất
    </button>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      roles: [
        'Tiến sĩ',
        'Thạc sĩ',
        'Phó giáo sư',
        'Giáo sư'
      ],
      data: Object.assign({
        doctors: []
      }, this.initData)
    }
  },
  methods: {
    onSumbit () {
      this.$validator.validate().then(result => {
        if (result) {
          this.submitCallBack()
        }
      })
    },

    addAvatar () {
      this.data.doctors.push({
        name: '',
        description: '',
        role: 'Thạc sĩ',
        image: null
      })
    },

    getError (name) {
      return this.errors.first(name)
    },

    deleteAvatar (index) {
      this.data.doctors.splice(index, 1)
    }
  },
  props: ['sumbitText', 'submitCallBack', 'initData', 'isShowBack', 'backCallBack']
}
</script>

<style>

</style>
