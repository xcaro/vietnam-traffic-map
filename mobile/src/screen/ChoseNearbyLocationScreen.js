import React, {
  Component
} from 'react'

import {
  View,
  Image,
  Text,
  StyleSheet
} from 'react-native'

import action from '../redux/action'
import { connect } from 'react-redux'

import ShadenTouchableHightLight from '../component/ShadenTouchableHightLight'
import googleAPI from '../helper/google'
import appHelper from '../helper/app'
import RoundButton from '../component/RoundButton'
import primaryStyle from '../style/index'

class ChoseNearbyLocationScreen extends Component {
  afterGetNearestLocation (response) {
    if (response.data.results.length > 0) { // Have data
      googleAPI.placeIdToDetail(response.data.results[0].place_id)
        .then(({data}) => {
          this.props.setSelectedSearchLocationItem({
            place_id: response.data.results[0].place_id,
            data
          })
          this.props.navigation.goBack()
        })
    }
  }

  render () {
    return (
      <View style={style.topContainer}>
        <View style={style.container}>
          <ShadenTouchableHightLight
            margin={20}
            flex={1}
            isContentCenter
            onPress={() => {
              appHelper.getCurrentLocation(this.props).then((curLocation) => {
                googleAPI.getNearestPlace('gas_station', [
                  curLocation.coords.latitude,
                  curLocation.coords.longitude
                ]).then((response) => {
                  this.afterGetNearestLocation(response)
                })
              })
            }}>
            <View style={style.img}>
              <Image source={require('../assets/location_nearby/gas-station.png')} />
            </View>
            <Text style={style.text}>Cây xăng</Text>
          </ShadenTouchableHightLight>

          <ShadenTouchableHightLight
            margin={20}
            flex={1}
            isContentCenter
            onPress={() => {
              appHelper.getCurrentLocation(this.props).then((curLocation) => {
                googleAPI.getNearestPlace('atm', [
                  curLocation.coords.latitude,
                  curLocation.coords.longitude
                ]).then((response) => {
                  this.afterGetNearestLocation(response)
                })
              })
            }}>
            <View style={style.img}>
              <Image source={require('../assets/location_nearby/atm.png')} />
            </View>
            <Text style={style.text}>&nbsp;Trụ ATM</Text>
          </ShadenTouchableHightLight>
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  img: {
    marginTop: 30,
    marginBottom: 15,
    justifyContent: 'center'
  },

  container: {
    flexDirection: 'row',
    backgroundColor: 'white'
  },

  topContainer: {
    flex: 1,
    backgroundColor: 'white'
  },

  text: {
    paddingBottom: 30,
    fontSize: 22,

    marginLeft: 10
  }
})

export default connect(
  /** State requirer to read by container component */
  ({
    curLocation, selectedSearchLocationItem
  }) => (
    {curLocation, selectedSearchLocationItem}
  ),

  action
)(ChoseNearbyLocationScreen)
