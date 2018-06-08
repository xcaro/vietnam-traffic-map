<template>
  <div>
    <Map ref = 'map' />
    <search-route
      :onCleared = 'onSearchRouteCleared'
      :onFulfilled = 'onSearchRouteFulfilled'
      :onToggled = 'toggleSearchLocationAndSearchRoute'
      v-if = 'isShowSearchRoute' />
    <search-location
      :onCleared = 'onSearchLocationCleared'
      :onFulfilled = 'onSearchLocationFulfilled'
      :onToggled = 'toggleSearchLocationAndSearchRoute'
      v-if = 'isShowSearchLocation && $refs' />
  </div>
</template>

<script>
import SearchRoute from '../components/SearchRoute'
import SearchLocation from '../components/SearchLocation'
import Map from '../components/Map'

export default {
  methods: {
    toggleSearchLocationAndSearchRoute () {
      this.isShowSearchRoute = !this.isShowSearchRoute
      this.isShowSearchLocation = !this.isShowSearchLocation
    },
    onSearchLocationFulfilled (data) {
      this.$refs.map.onSearchLocationFulfilled(data)
    },
    onSearchLocationCleared () {
      this.$refs.map.onSearchLocationCleared()
    },
    onSearchRouteFulfilled (originLocation, destinationLocation) {
      this.$refs.map.onSearchRouteFulfilled(originLocation, destinationLocation)
    },
    onSearchRouteCleared () {
      this.$refs.map.onSearchRouteCleared()
    }
  },

  data () {
    return {
      /**
       * Search route and search location
       */
      isShowSearchRoute: false,
      isShowSearchLocation: true,
      console: console
    }
  },

  components: {
    SearchRoute,
    SearchLocation,
    Map
  }
}
</script>

<style>
</style>
