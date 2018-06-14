// Near location
const atmMarker = require('../assets/marker/atm.png')
const fuelMarker = require('../assets/marker/fuel.png')
const locationMarker = require('../assets/marker/location.png')

export let markerTypeCONST = {
  FUEL: 'FUEL',
  ATM: 'ATM',
  LOCATION: 'LOCATION'
}

export let getMarker = (MarkerType) => {
  switch (MarkerType) {
    case markerTypeCONST.FUEL: return fuelMarker
    case markerTypeCONST.ATM: return atmMarker
    default: return locationMarker
  }
}

// Traffic Icon
const jamMarker = require('../assets/marker/jam.png')
const jamMarker_Confirmed = require('../assets/marker/jam_confirmed.png')

const floodMarker = require('../assets/marker/flood.png')
const floodMarkerr_Confirmed = require('../assets/marker/flood_confirmed.png')

const accidentMarker = require('../assets/marker/accident.png')
const accidentMarker_Confirmed = require('../assets/marker/accident_confirmed.png')

export const trafficMakerIcons = [
  jamMarker,
  jamMarker_Confirmed,
  floodMarker,
  floodMarkerr_Confirmed,
  accidentMarker,
  accidentMarker_Confirmed
]
