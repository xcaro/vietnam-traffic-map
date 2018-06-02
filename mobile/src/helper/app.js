import errorHelper from '../helper/error'
import { PermissionsAndroid } from 'react-native'

export default {
  async getCurrentLocation (props, isShowGpsError = true) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!props.curLocation) {
          let granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          )

          if (!granted) {
            granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)

            if (!granted) {
              errorHelper.showGpsError()
              navigator.geolocation.stopObserving()
              reject(Error('gps not enabled'))
            }
          }

          navigator.geolocation.getCurrentPosition((position) => {
            props.setCurLocation(position)
            resolve()

            navigator.geolocation.watchPosition(
              (position) => {
                props.setCurLocation(position)
              },
              () => {
                props.removeCurLocation(null)
              }
            )
          })
        }
      } catch (err) {
        navigator.geolocation.stopObserving()
        reject(Error('gps not enabled'))
      }
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
