import axios from 'axios'
import arrayHelper from '../helper/array'
const APIkey = 'AIzaSyA6jVBqVLTXFpNsxmEKx8HTFEIwmiq0usQ'

Math.radians = function (degrees) {
  return degrees * Math.PI / 180
}

Math.degrees = function (radians) {
  return radians * 180 / Math.PI
}

export default {
  radians (n) {
    return n * (Math.PI / 180)
  },

  degrees (n) {
    return n * (180 / Math.PI)
  },

  getBearing (startLat, startLong, endLat, endLong) {
    startLat = this.radians(startLat)
    startLong = this.radians(startLong)
    endLat = this.radians(endLat)
    endLong = this.radians(endLong)

    var dLong = endLong - startLong

    var dPhi = Math.log(
      Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0)
    )

    if (Math.abs(dLong) > Math.PI) {
      if (dLong > 0.0) {
        dLong = -(2.0 * Math.PI - dLong)
      } else {
        dLong = (2.0 * Math.PI + dLong)
      }
    }

    return (this.degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0
  },

  getDirection (origin, destination) {
    return axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin: origin.latitude + ',' + origin.longitude,
        destination: destination.latitude + ',' + destination.longitude,
        key: APIkey,
        language: 'vi'
      }
    })
  },

  autoCompletePlace (text) {
    return axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        input: text,
        key: APIkey,
        language: 'vi'
      }
    })
  },

  formatAutoCompletePlaceResult (response, currentCoordinate) {
    var formatedResponse = response.predictions.map(prediction => ({
      description: prediction.description,
      key: prediction.place_id
    }))

    return formatedResponse || []
  },

  placeIdToDetail (place_id) {
    return axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        placeid: place_id,
        key: APIkey,
        language: 'vi'
      }
    })
  },

  placeIdToCoordinate(place_id) {
    return new Promise((resolve) => {
      this.placeIdToDetail(place_id).then(response => {
        let location = response.data.result.geometry.location
        let coordinate = {
          latitude: location.lat,
          longitude: location.lng
        }

        // Resolve
        resolve(coordinate)
      })
    })
  },

  getNearestPlace(type, curLocation, keyword ) {
    return axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        type,
        rankby: 'distance',
        key: APIkey,
        language: 'vi',
        location: curLocation[0] + ',' + curLocation[1],
        keyword : keyword  || ''
      }
    })
  },

  debounceAutoComplete(time, callBack) {
    var debounce = require('debounce')

    return debounce((text) => {
      this.autoCompletePlace(text)
        .then(callBack)
    }, time)
  }
}
