<template>
  <div>
    <div id = 'directionPanel'>
    </div>
    <div id = 'map'>
    </div>
  </div>
</template>

<script>
let map = null
let locationSearchMarker = null
let directionsService = new window.google.maps.DirectionsService()
let directionsDisplay = new window.google.maps.DirectionsRenderer()

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

    onSearchRouteFulfilled (originLocation, destinationLocation) {
      directionsService.route({
        origin: {
          lat: originLocation.latitude,
          lng: originLocation.longitude
        },
        destination: {
          lat: destinationLocation.latitude,
          lng: destinationLocation.longitude
        },
        travelMode: 'DRIVING'
      }, (res, status) => {
        if (status === 'OK') {
          directionsDisplay.setDirections(res)
        }
      })
    },

    onSearchRouteCleared () {
      directionsDisplay.set('directions', null);
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

    directionsDisplay.setMap(map)
    directionsDisplay.setPanel(document.getElementById('directionPanel'))
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

#directionPanel {
    width: 500px;
    display: inline-block;
    position: absolute;
    left: 17px;
    top: 199px;
    background: white;
    overflow: auto;
    box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.2);
}

#directionPanel > div {
  padding: 30px;
  max-height: 50vh;
  overflow: auto;
}
</style>
