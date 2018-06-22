<template>
  <div>
    <div id = 'directionPanel'>
    </div>
    <gmap-map
      :center="center"
      :zoom="12"
      ref="map"
      id = "map"
      :options = "{
        mapTypeControl: false
      }">
        <gmap-marker
          :position="searchLocationMarker"
          v-if = "searchLocationMarker"
          title="địa điểm tìm kiếm">
        </gmap-marker>
        <gmap-marker
          
          @click="trafficReport.isOpenInfoWindow = true"
          :clickable="true"
          :position="{
            lat: Number(trafficReport.latitude),
            lng: Number(trafficReport.longitude)
          }"
          :key = "trafficReport.id"
          v-for = "trafficReport in trafficReports"
          title="địa điểm tìm kiếm">
        </gmap-marker>
        <gmap-info-window
          :key = "trafficReport.id"
          :position = "{
            lat: Number(trafficReport.latitude),
            lng: Number(trafficReport.longitude)
          }"
          :opened="trafficReport.isOpenInfoWindow"
          @closeclick="trafficReport.isOpenInfoWindow = false"
          :options = "{
            pixelOffset: {
              width: 0,
              height: -50
            }
          }"
          v-for = "trafficReport in trafficReports">
            <div class = "infowindow">
              <p>
                Mô tả: {{trafficReport.comment || 'Không có'}}  <br/>
                Thời gian: {{trafficReport.created_at}}  <br/>
                Trạng thái :  {{trafficReport.confirm ? 'Đã duyệt' : 'Chưa duyệt'}}
              </p>
                <image
                  v-if="trafficReport.image"
                  class="m-2 mt-3 mr-0"
                  :src = "trafficReport.image"/>
                <div class = "m-1 mt-2 d-flex justify-content-center" v-if = "idToken">
                  <button
                    v-if="trafficReport.confirm"
                    class="btn btn-primary mr-2"
                    @click="unconfirmReport(trafficReport.id)">
                    <span class="icon-thumb-down d-inline">
                    </span>
                    Hủy xác nhận
                  </button>
                  <button
                    v-else
                    class="btn btn-primary mr-2"
                    @click="confirmReport(trafficReport.id)">
                    <span class="icon-thumbs-up d-inline">
                    </span>
                    Xác nhận
                  </button>
                  <button class = "btn btn-danger ml-1" @click="deleteReport(trafficReport.id)">
                    <span class="icon-trash d-inline">
                    </span>
                    Đã kết thúc
                  </button>
                </div>
            </div>
        </gmap-info-window>
    </gmap-map>
  </div>
</template>

<script>
import request from 'superagent'
import {
  loaded
} from 'vue2-google-maps'
import {
  mapState
} from 'vuex'

export default {
  data () {
    return {
      center: {lat: 10.762622, lng: 106.806692},
      searchLocationMarker: null,
      trafficReports: [],
      trafficReportTypes: [],
      isMapLoaded: false
    }
  },

  computed: mapState([
    'idToken'
  ]),

  methods: {
    confirmReport (id) {
      request.put(`http://deltavn.net/api/report/${id}/confirm`).set({
        Authorization: 'bearer ' + this.idToken
      }).then(() => {
      })
    },

    unconfirmReport (id) {
      request.put(`http://deltavn.net/api/report/${id}/unconfirm`).set({
        Authorization: 'bearer ' + this.idToken
      }).then((res) => {
      })
    },

    deleteReport (id) {
      if (confirm('Bạn có muốn kết thúc báo cáo này không')) {
        request.delete(`http://deltavn.net/api/report/${id}`).set({
          Authorization: 'bearer ' + this.idToken
        })
      }
    },

    onSearchLocationFulfilled (data) {
      this.searchLocationMarker = {
        lat: data.geometry.location.lat(),
        lng: data.geometry.location.lng()
      }

      this.center = {
        lat: data.geometry.location.lat(),
        lng: data.geometry.location.lng()
      }
    },

    onSearchLocationCleared () {
      this.searchLocationMarker = null
    },

    onSearchRouteFulfilled (originLocation, destinationLocation) {
      this.directionsService.route({
        origin: {
          lat: originLocation.geometry.location.lat(),
          lng: originLocation.geometry.location.lng()
        },
        destination: {
          lat: destinationLocation.geometry.location.lat(),
          lng: destinationLocation.geometry.location.lng()
        },
        travelMode: 'DRIVING'
      }, (res, status) => {
        if (status === 'OK') {
          this.directionsDisplay.setDirections(res)
        }
      })
    },

    onSearchRouteCleared () {
      this.directionsDisplay.set('directions', null)
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
      trafficReport.isOpenInfoWindow = false
      this.trafficReports.push(trafficReport)
    },

    deleteTrafficReport (trafficReport) {
      /**
       * Find traffic report from arr
       * Remove from map
       * remove from arr
       */
      let index = this.findIndexTrafficReport(trafficReport.id)
      if (index === -1) {
        /**
         * Never happend
         */
        return
      }

      this.trafficReports[index].marker.setMap(null)
      this.trafficReports.splice(index, 1)
    },

    findIndexTrafficReport (id) {
      return this.trafficReports.findIndex((e) => e.id === id)
    },

    editTrafficReport (trafficReport) {
      let index = this.findIndexTrafficReport(trafficReport.id)
      if (index === -1) {
        /**
         * Never happend
         */
        return
      }

      /**
       * Assign everything from new marker to old marker using object assign
       */
      this.trafficReports[index] = Object.assign(this.trafficReports[index], trafficReport)
    }
  },

  mounted () {
    loaded.then(() => {
      this.isMapLoaded = true
      this.directionsService = new window.google.maps.DirectionsService()
      this.directionsDisplay = new window.google.maps.DirectionsRenderer()
      this.directionsDisplay.setMap(this.$refs.map.$mapObject)
      this.directionsDisplay.setPanel(document.getElementById('directionPanel'))
    })

    request.get('http://deltavn.net/api/report-type').then((res) => {
      this.trafficReportTypes = res.body.data
    })
    /**
     * Init web socket
     * Start fetch data from realtime
     */
    this.websocket = new WebSocket('ws://vietnam-traffic-map-ws.herokuapp.com')
    this.websocket.onopen = () => {
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
  letter-spacing: 1px;
  max-width: 400px
}

.infowindow p {
  line-height: 1.5em
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
    left: 77px;
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
