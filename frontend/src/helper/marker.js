const trafficTypeCONST = {
  'JAM': 0,
  'FLOOD': 1,
  'ACCIDENT': 2
}

export let getTrafficMarkerIconPath = (trafficType) => {
  switch (trafficType) {
    case trafficTypeCONST.JAM:
      return '/static/marker/jam.png'
    case trafficTypeCONST.FLOOD:
      return '/static/marker/flood.png'
    case trafficTypeCONST.ACCIDENT:
      return '/static/marker/accident.png'
  }
}
