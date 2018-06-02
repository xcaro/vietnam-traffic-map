import errorHelper from '../helper/error'

export default {
  getCurrentLocation (props, isShowGpsError = true) {
    return new Promise((resolve, reject) => {
      if (!props.curLocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          props.setCurLocation(position) // Đã lấy được vị trí
          resolve(position)
        }, (err) => {
          if (isShowGpsError) { errorHelper.showGpsError() }
          reject(JSON.stringify(err))
        })
      } else resolve(props.curLocation)
    })
  },

  navigateCheckSignIn (navigation, idToken, route) {
    console.log(idToken)
    if (idToken) {
      navigation.navigate(route)
    } else {
      navigation.navigate('Authentication', {
        routeToRedirect: route
      })
    }
  }
}
