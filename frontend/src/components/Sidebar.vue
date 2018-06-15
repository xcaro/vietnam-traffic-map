<template>
<div>
<transition name = 'slide-fade' v-if = '$store.state.isShowSideBar'>
  <div id = "sidebar" class="bg-primary-new" >
    <div class="d-flex p-3">
      <button class="btn btn-primary ml-auto" type="button" @click = "$store.dispatch('toggleSideBar')">
        <span class="icon-close"></span>
      </button>
    </div>
    <div class="list-group">
      <router-link to = '/' class="list-group-item list-group-item-action" exact-active-class="active">
        <span class="icon-map d-inline pr-3">
        </span>
        Bản đồ
      </router-link>

        <router-link to = '/clinic/create' class="list-group-item list-group-item-action" exact-active-class="active">
          <span class="icon-add d-inline pr-3"></span>
          Khởi tạo phòng khám
        </router-link>
        <router-link to = '/clinic/find' class="list-group-item list-group-item-action" exact-active-class="active">
          <span class="icon-search d-inline pr-3"></span>
          Tìm kiếm phòng khám
        </router-link>
        <router-link to = '/login' class="list-group-item list-group-item-action" exact-active-class="active">
          <span class="icon-sign-in d-inline pr-3"></span>
          Đăng nhập
        </router-link>
        <router-link to = '/register' class="list-group-item list-group-item-action" exact-active-class="active">
          <span class="icon-sign-up d-inline pr-3"></span>
          Đăng ký
        </router-link>
        <router-link to = '/logoff' class="list-group-item list-group-item-action" exact-active-class="active">
          <span class="icon-sign-out d-inline pr-3"></span>
          Đăng xuất
        </router-link>
    </div>
  </div>
  </transition>
  <transition name = 'slide-fade' v-else>
      <button class="btn btn-primary" id = "sidebar-toggle" @click = "$store.dispatch('toggleSideBar')">
        <span class="icon-right-arrow">
        </span>
      </button>
  </transition>
</div>
</template>

<script>
import DropDown from '../components/DropDown'

export default {
  computed: {
    isShowSideBar () {
      return this.$store.state.isShowSideBar
    }
  },

  components: {
    DropDown
  }
}
</script>

<style>
#sidebar-toggle {
  border-radius: 0;
  position: absolute;
  top: 35px;
}

#sidebar {
  height: 100vh;
  width: 300px;
  z-index: 999;
  color: white;
  position: absolute;
  top: 0;
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

.list-group-item {
  background: #5892f2;
  color: #ffffffd6;
  border-radius: 0;
  padding: 20px;
}

.list-group-item:hover {
  background: #478bfb;
  color: white
}

.list-group-item.active {
    z-index: 2;
    color: #fff;
    background-color: #2b6ee0;
    border-color: #2b6ee0;
}
</style>
