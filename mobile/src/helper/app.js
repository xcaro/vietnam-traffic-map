import errorHelper from '../helper/error'
import { PermissionsAndroid } from 'react-native'

export default {
  trafficTypeFromTypeID (trafficTypes, type_id) {
    return trafficTypes.find(trafficType => trafficType.id == type_id)
  },

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
              navigator.geolocation.stopObserving()
              throw(Error('gps not enabled'))
            }
          }

          navigator.geolocation.getCurrentPosition((position) => {
            props.setCurLocation(position)
            resolve(position)

            navigator.geolocation.watchPosition(
              (position) => {
                props.setCurLocation(position)
              },
              () => {
                props.removeCurLocation(null)
              }
            )
          })
        } else resolve (props.curLocation)
      } catch (err) {
        navigator.geolocation.stopObserving()
        reject(Error('gps not enabled'))
        errorHelper.showGpsError()

      }
    })
  },

  navigateCheckSignIn (navigation, idToken, route) {
    if (idToken) {
      navigation.navigate(route)
    } else {
      navigation.navigate('SignInStackNavigation', {
        routeToRedirect: route,
        isHideTileBar: true
      })
    }
  }

  // computeError (assert, errorText, _this, errorProperty) {
  //   let obj = {}
  //   if (!assert) {
  //     obj[errorProperty] = errorText
  //     _this.setState({
  //       obj
  //     })
  //     return false
  //   } else if (_this.state[errorProperty] !== '') {
  //     obj[errorProperty] = errorText
  //     _this.setState({
  //       obj
  //     })
  //     return true
  //   }
  // }
}
