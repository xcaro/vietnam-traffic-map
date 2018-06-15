<template>
  <div id="app">
    <Sidebar />
    <transition name = 'slide-fade'>
      <router-view class="enable-side-bar" />
    </transition>
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
import store from './store/index.js'

export default {
  name: 'App',
  components: {
    Sidebar
  },
  store
}
</script>

<style>
.enable-side-bar {
  margin-left: 350px;
  margin-right: 40px;
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
</style>
