<template>
<div>
<transition name = 'slide-fade' v-if = '$store.state.isShowSideBar'>
  <div id = "sidebar" class="bg-primary-new" >
    <div class="d-flex p-3">
      <button class="btn btn-primary ml-auto" type="button" @click = "$store.dispatch('toggle', 'isShowSideBar')">
        <span class="icon-close"></span>
      </button>
    </div>
    <div class="list-group">
        <router-link
          class="list-group-item list-group-item-action font-weight-bold"
          :exact-active-class="isShowModal? 'active' : ''"
          v-for="route in filterRoutesReact"
          @click.native="openModalIfNot"
          :to = 'route.url'
          :key = "route.url"
          replace>
          <span :class="[route.icon, 'd-inline pr-3']"></span>
          {{route.name}}
        </router-link>
    </div>
  </div>
  </transition>
  <transition name = 'slide-fade' v-else>
      <button class="btn btn-primary" id = "sidebar-toggle" @click = "$store.dispatch('toggle', 'isShowSideBar')">
        <span class="icon-right-arrow font-weight-bold">
        </span>
      </button>
  </transition>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  methods: {
    setFilterRoutesReact (filterRoutes) {
      let clonedFilterRoutes = JSON.parse(JSON.stringify(filterRoutes))
      this.filterRoutesReact = clonedFilterRoutes
    },

    openModalIfNot () {
      if (!this.isShowModal) {
        this.$store.dispatch('toggle', 'isShowModal')
      }
    }
  },

  mounted () {
    this.routes = [
      {
        name: 'Quản trị phòng khám',
        icon: 'icon-user-tie',
        url: '/clinic/administrate'
      },
      {
        name: 'Thông tin tài khoản',
        icon: 'icon-user',
        url: '/user'
      },
      {
        name: 'Khởi tạo phòng khám',
        icon: 'icon-add',
        url: '/clinic/create'
      }, {
        name: 'Tìm phòng khám',
        icon: 'icon-search',
        url: '/clinic/find'
      }, {
        name: 'Đăng nhập',
        icon: 'icon-sign-in',
        url: '/login'
      }, {
        name: 'Đăng ký',
        icon: 'icon-sign-up',
        url: '/register'
      }, {
        name: 'Đăng xuất',
        icon: 'icon-sign-out',
        url: '/logout'
      }
    ]

    // this.hiddenGuestRoute = [
    //   '/logout',
    //   '/clinic/create',
    //   '/clinic/find',
    //   '/user'
    // ]

    this.hiddenLoggedInRoute = [
      '/login',
      '/register'
    ]
    // Init
    if (!localStorage.getItem('idToken')) {
      this.setFilterRoutesReact(this.routes.filter(route => this.hiddenLoggedInRoute.includes(route.url)))
    } else {
      this.setFilterRoutesReact(this.routes.filter(route => !this.hiddenLoggedInRoute.includes(route.url)))
    }

    // Subscribe store
    let self = this
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'SET' && mutation.payload.propertyName === 'idToken') {
        if (mutation.payload.payload) { // logged in
          self.setFilterRoutesReact(self.routes.filter(route => !self.hiddenLoggedInRoute.includes(route.url)))
        } else { // logged out
          self.setFilterRoutesReact(self.routes.filter(route => self.hiddenLoggedInRoute.includes(route.url)))
        }
      }
    })
  },

  data: () => {
    return {
      filterRoutesReact: []
    }
  },

  computed: mapState([
    'isShowSideBar',
    'isShowModal',
    'idToken',
    'user'
  ])
}
</script>

<style>
#sidebar-toggle {
  border-radius: 0;
  position: absolute;
  top: 24px;
  font-size: 1.4em
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
