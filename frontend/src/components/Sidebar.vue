<template>
<transition name = 'slide-fade'>
  <div id = "sidebar" class="bg-primary-new" v-show = '$store.state.isShowSideBar'>
    <div class="d-flex p-3">
      <button class="btn btn-primary ml-auto" type="button" @click = "$store.dispatch('toggleSideBar')">
        <span class="icon-close"></span>
      </button>
    </div>
    <div class="list-group">
      <router-link to = '/' class="list-group-item list-group-item-action" exact-active-class="active">
        <span class="icon-map d-inline pl-2">
        </span>
        Bản đồ
      </router-link>
      <drop-down>
        <div slot="header" class="p-3 py-4">
          <span class="icon-clinic d-inline pl-2">
          </span>
          Phòng khám
        </div>
        <div slot="body">
          <router-link to = '/clinic/create' class="list-group-item list-group-item-action" exact-active-class="active">
            Khởi tạo
          </router-link>
          <router-link to = '/clinic/find' class="list-group-item list-group-item-action" exact-active-class="active">
            Tìm kiếm
          </router-link>
        </div>
      </drop-down>
    </div>
  </div>
</transition>
</template>

<script>
import DropDown from '../components/DropDown'

export default {
  computed: {
    isShowSideBar() {
      return this.$store.state.isShowSideBar
    }
  },

  components: {
    DropDown
  }
}
</script>

<style>
#sidebar {
  height: 100vh;
  width: 300px;
  z-index: 999;
  color: white;
  position: absolute;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
}

.bg-primary-new {
  background: rgba(66, 133, 244, 0.87);
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
