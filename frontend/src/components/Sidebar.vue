<template>
<transition name = 'slide-fade'>
  <div id = "sidebar" class="bg-primary-new" v-show = 'isShowSideBar'>
    <div class="d-flex p-3">
      <button class="btn btn-primary ml-auto" type="button" @click = "$store.dispatch('toggleSideBar')">
        <span class="icon-close"></span>
      </button>
    </div>
    <div class="list-group">
      <a href="#" class="list-group-item list-group-item-action active">
        <span class="icon-map">
          Bản đồ
        </span>

      </a>
      <a href="#" class="list-group-item list-group-item-action">
        <span class="icon-clinic">
          Phòng khám
        </span>
      </a>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  computed: {
    isShowSideBar() {
      return this.$store.state.isShowSideBar
    }
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
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
