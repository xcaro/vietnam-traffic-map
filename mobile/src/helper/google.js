const APIkey = 'AIzaSyA6jVBqVLTXFpNsxmEKx8HTFEIwmiq0usQ'
import axios from 'axios'
import arrayHelper from '../helper/array'

export default {
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

  placeIdToCoordinate (place_id) {
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

  getNearestPlace (type, curLocation) {
    return axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        type,
        rankby: 'distance',
        key: APIkey,
        language: 'vi',
        location: curLocation[0] + ',' + curLocation[1]
      }
    })
  },

  debounceAutoComplete (time, callBack) {
    var debounce = require('debounce')

    return debounce((text) => {
      this.autoCompletePlace(text)
        .then(callBack)
    }, time)
  }
}
