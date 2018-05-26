const key = 'AIzaSyA6jVBqVLTXFpNsxmEKx8HTFEIwmiq0usQ'
const language = 'vi'
const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
import axios from 'axios'

export default {
  getAutoCompleteLocation (input) {
    return axios.get(url, {
      params: {
        key,
        language,
        input
      }
    })
  }
}
