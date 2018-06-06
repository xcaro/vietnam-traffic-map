const atmMarker = require('../assets/marker/atm.png')
const fuelMarker = require('../assets/marker/fuel.png')
const locationMarker = require('../assets/marker/location.png')

export let markerTypeConst = {
  FUEL: 'FUEL',
  ATM: 'ATM',
  LOCATION: 'LOCATION'
}

export let getMarker = (MarkerType) => {
  switch (MarkerType) {
    case markerTypeConst.FUEL: return fuelMarker
    case markerTypeConst.ATM: return atmMarker
    default: return locationMarker
  }
}

export default {

}