<template>
  <div>
    <div id = 'directionPanel'>
    </div>
    <div id = 'map'>
    </div>
  </div>
</template>

<script>
import {
  trafficMakerIcons
} from '../helper/marker.js'

let map = null
let locationSearchMarker = null
let trafficReports = []
const directionsService = new window.google.maps.DirectionsService()
const directionsDisplay = new window.google.maps.DirectionsRenderer()

export default {
  data () {
    return {

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
      directionsDisplay.set('directions', null)
    },

    clearMarkers (markers) {
      for (let marker of markers) {
        marker.setMap(null)
      }
    },

    parseBoundsIntoLocation (bounds) {
      const southWest = bounds.getSouthWest().toJSON()
      const northEast = bounds.getNorthEast().toJSON()
      return {
        fromLat: southWest.lat,
        toLat: northEast.lat,
        fromLng: southWest.lng,
        toLng: northEast.lng
      }
    },

    addTrafficReport (trafficReport) {
      let iconIndex = 2 * trafficReport.type
      if (trafficReport.confirmed) {
        iconIndex += 1
      }
      const iconPath = trafficMakerIcons[iconIndex]
      trafficReport.marker = new window.google.maps.Marker({
        position: {
          lat: trafficReport.location.lat,
          lng: trafficReport.location.lng
        },
        map: map,
        icon: iconPath
      })

      trafficReport.infoWindow = new window.google.maps.InfoWindow({
        content:
`<div class = "infowindow">
  <div>Mô tả: ` + (trafficReport.comment || 'Không có') + `</div>
  <div>Thời gian: ` + trafficReport.time + `</div>
  <div>Trạng thái :` + (trafficReport.confirm ? 'Đã duyệt' : 'Chưa duyệt') + `</div>` +
    (trafficReport.image ? '<image class = "m-2 mt-3 mr-0" src = "' + trafficReport.image + '">' : '') +
    `<div class = "m-1 mt-2 d-flex justify-content-center">
      ` +
      (
        trafficReport.confirmed
          ? `<button class = "btn btn-primary mr-2">
          <span class="icon-thumb-down">
          </span>
          Hủy xác nhận
        </button>`
          : `<button class = "btn btn-primary">
          <span class="icon-thumbs-up">
          </span>
          Xác nhận
      </button>`
      ) +
      `<button class = "btn btn-danger ml-1">
        <span class="icon-trash">
        </span>
        Đã kết thúc
      </button>
    </div>` +
`</div>`
      })

      trafficReport.marker.addListener('click', () => {
        trafficReport.infoWindow.open(map, trafficReport.marker)
      })

      trafficReports.push(trafficReport)
    },

    deleteTrafficReport (trafficReport) {
      /**
       * Find traffic report from arr
       * Remove from map
       * remove from arr
       */
      let index = this.findIndexTrafficReport(trafficReport)
      if (index === -1) {
        /**
         * Never happend
         */
        return
      }

      trafficReports[index].marker.setMap(null)
      trafficReports.splice(index, 1)
    },

    findIndexTrafficReport (trafficReport) {
      return trafficReports.findIndex((e) => e.id === trafficReport.id)
    },

    editTrafficReport (trafficReport) {
      let index = this.findIndexTrafficReport(trafficReport)
      if (index === -1) {
        /**
         * Never happend
         */
        return
      }

      /**
       * Assign everything from new marker to old marker using object assign
       */
      trafficReports[index] = Object.assign(trafficReports[index], trafficReport)
    }
  },

  mounted () {
    map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 10.762622, lng: 106.806692},
      zoom: 12,
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: window.google.maps.ControlPosition.TOP_RIGHT
      }
    })

    directionsDisplay.setMap(map)
    directionsDisplay.setPanel(document.getElementById('directionPanel'))

    /**
     * Init web socket
     * Start fetch data from realtime
     */
    this.websocket = new WebSocket('ws://localhost:8000')
    this.websocket.onopen = () => {
      map.addListener('idle', () => {
        const bounds = map.getBounds()
        const data = this.parseBoundsIntoLocation(bounds)
        this.websocket.send(JSON.stringify(data))

        /**
         * Reset all traffic report
         * Load new traffic marker
         * Doesn't need anymore : just load all traffic marker
         * Improve later
         */
      })

      this.websocket.onmessage = ({data}) => {
        let parseData = JSON.parse(data)
        switch (parseData.type) {
          case 'add':
          case 'initial':
            this.addTrafficReport(parseData.new_val)
            break
          case 'remove':
            this.deleteTrafficReport(parseData.old_val)
            break
          case 'change':
            this.editTrafficReport(parseData.new_val)
            break
        }
      }
    }
  },

  destroyed () {
    this.websocket.close()
  }
}
</script>

<style>
.infowindow {
  font-size: 18px;
  letter-spacing: 1px
}

.infowindow img {
  width: 300px;
  border-radius: 2px
}

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
