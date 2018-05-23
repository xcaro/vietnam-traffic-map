import appHelper from '../helper/app'

export default {
  getCurrentLocation(props, isShowGpsError = true) {
    return new Promise((resolve, reject) => {
      if(!props.curLocation)
        navigator.geolocation.getCurrentPosition((position) => {
          props.setCurLocation(position) // Đã lấy được vị trí
          resolve(position);
        }, () => {
          if(isShowGpsError)
            errorHelper.showGpsError()

          reject()
        })
      else resolve(props.curLocation)
    })
  }
}