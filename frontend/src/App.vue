<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
/** Bootstrap */
import './assets/css/bootstrap.min.css'

/** Icon */
import './assets/css/icon.css'

export default {
  name: 'App'
}
</script>

<style>
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
