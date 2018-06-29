<template>
  <div id="app">
    <transition name = 'fade'>
      <div id = "modalTopContainer" class="d-flex align-items-center justify-content-center" v-if="isShowModal">
          <div id = "modalContainer" :class="isShowSideBar ? 'enable-side-bar' : 'disable-side-bar'">
            <button class="btn" @click="$store.dispatch('toggle', 'isShowModal')">
              <span class="icon-close"></span>
            </button>

            <router-view v-show="!isLoading"
              id = "content" />
            <div v-show="isLoading" id="content">
              <b>Đang tải dữ liệu</b>
            </div>
          </div>
      </div>
    </transition>
    <Sidebar />
    <home></home>
  </div>
</template>

<script>
/** Bootstrap */
import './assets/css/bootstrap.min.css'

/** Icon */
import './assets/css/icon.css'

/** Sidebar */
import Sidebar from './components/Sidebar'

/** Store */
import { mapState } from 'vuex'
import store from './store/index.js'
import Home from './components/Home'
import request from 'superagent'

export default {
  name: 'App',
  computed: mapState([
    'isShowSideBar',
    'isShowModal',
    'isLoading'
  ]),
  components: {
    Sidebar,
    Home
  },
  destroyed () {
    this.websocket.close()
  },
  created () {
    let idToken = localStorage.getItem('idToken')
    if (idToken) {
      // Lấy thông tin cá nhân
      request.post('http://deltavn.net/api/me').set({
        'Authorization': `Bearer ${idToken}`
      }).then((res) => {
        this.$store.dispatch('set', {
          propertyName: 'user',
          payload: res.body.data
        })
      })
      store.dispatch('set', {
        propertyName: 'idToken',
        payload: idToken
      })
    }

    /**
     * Init web socket
     * Start fetch data from realtime
     */
    this.websocket = new WebSocket('ws://192.168.1.4:8000')
    this.websocket.onopen = () => {
      this.websocket.onmessage = ({data}) => {
        let parseData = JSON.parse(data)
        switch (parseData.type) {
          case 'add':
          case 'initial':
            store.dispatch('addReport', parseData.new_val)
            break
          case 'remove':
            store.dispatch('deleteReport', parseData.old_val)
            break
          case 'change':
            store.dispatch('editReport', parseData.new_val)
            break
        }
      }
    }
  },
  store
}
</script>

<style>
.enable-side-bar {
  margin-left: 300px
}

.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .15s;
}

.fade-enter-active {
  transition-delay: .15s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}

#modalTopContainer {
  background-color: #00000042;
  position: absolute;
  width: 100%;
  height: 100%;
}

#modalContainer {
  position: relative;
  transition: all 0.3s ease-in-out;
  min-width: 30%;
  max-width: 100%;
}

#modalContainer > button {
  position: absolute;
  top: 15px;
  right: 15px;
}

#content {
  padding: 50px;
  background: white;
  box-shadow: 1px 1px 10px 2px #00000042;
  overflow: auto;
  max-height: 90vh;
}

body {
  font-family: sans-serif;
  font-size: 1em;
  line-height: 1.5;
  color: #333;
}

[class^="icon-"], [class*=" icon-"] {

  font-size: 1.2em;
  display: block;
}

.alert-danger {
  color: #c50517
}

body {
  font-family: 'Muli', sans-serif !important;
}

@media (max-width: 600px) {
  .enable-side-bar {
    margin-left: 700px
  }
}
</style>
