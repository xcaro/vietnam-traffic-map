<template>
  <div id = 'map'>
  </div>
</template>

<script>
let map = null
let locationSearchMarker = null

export default {
  data () {
    return {
      locationSearchMarker: null
    }
  },

  methods: {
    onSearchLocationFulfilled (data) {
      locationSearchMarker = new window.google.maps.Marker({
        position: {
          lat: data.latitude,
          lng: data.longitude
        },
        map: map,
        title: 'Địa điểm tìm kiếm'
      })

      map.setCenter({
        lat: data.latitude,
        lng: data.longitude
      })
    },

    onSearchLocationCleared () {
      this.clearMarkers([locationSearchMarker])
      locationSearchMarker = null
    },

    clearMarkers (markers) {
      for (let marker of markers) {
        marker.setMap(null)
      }
    }
  },

  mounted () {
    map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 12,
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: window.google.maps.ControlPosition.TOP_RIGHT
      }
    })
  }
}
</script>

<style>
#map {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
}
</style>
