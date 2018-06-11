import React, {
  Component
} from 'react'

import {
  View,
  Image,
  Text,
  StyleSheet,
  Picker
} from 'react-native'

import action from '../redux/action'
import { connect } from 'react-redux'

import ShadenTouchableHightLight from '../component/ShadenTouchableHightLight'
import googleAPI from '../helper/google'
import appHelper from '../helper/app'
import RoundButton from '../component/RoundButton'
import primaryStyle from '../style/index'
import {markerTypeCONST, getMarker} from '../helper/marker'

class ChoseNearbyLocationScreen extends Component {
  constructor () {
    super()
    this.state = {
      bankList: [
        {
          label: 'ACB',
          value: 'ATM ACB'
        },
        {
          label: 'Vietcombank',
          value: 'ATM Vietcombank'
        },
        {
          label: 'Agribank',
          value: 'Agribank'
        },
        {
          label: 'BIDV',
          value: 'BIDV'
        },
        {
          label: 'Vietinbank',
          value: 'Vietinbank'
        },
        {
          label: 'Vietcombank',
          value: 'Vietcombank'
        },
        {
          label: 'Sacombank',
          value: 'Sacombank'
        }
      ],
      selectedBankKeyWord: 'ACB'
    }
  }

  afterGetNearestLocation (response, markerImage) {
    if (response.data.results.length > 0) { // Have data
      googleAPI.placeIdToDetail(response.data.results[0].place_id)
        .then(({data}) => {
          this.props.setSelectedSearchLocationItem({
            place_id: response.data.results[0].place_id,
            data,
            markerImage
          })
          this.props.navigation.navigate('Bản đồ')
        })
    }
  }

  render () {
    return (
      <View style={style.topContainer}>
        <View style={style.container}>
          <ShadenTouchableHightLight
            padding={20}
            backgroundColor = "#29c183"
            flexDirection = "row"
            alignItems = "center"
            onPress={() => {
              appHelper.getCurrentLocation(this.props).then((curLocation) => {
                googleAPI.getNearestPlace('gas_station', [
                  curLocation.coords.latitude,
                  curLocation.coords.longitude
                ]).then((response) => {
                  this.afterGetNearestLocation(response, getMarker(markerTypeCONST.FUEL))
                })
              })
            }}>
            <View style={style.img}>
              <Image source={require('../assets/location_nearby/gas-station.png')} />
            </View>
            <Text style={style.text}>Cây xăng</Text>
          </ShadenTouchableHightLight>

          <ShadenTouchableHightLight
            padding={20}
            backgroundColor = "#5778aa"
            flexDirection = "row"
            alignItems = "center"
            onPress={(() => {
              appHelper.getCurrentLocation(this.props).then((curLocation) => {
                googleAPI.getNearestPlace('atm', [
                  curLocation.coords.latitude,
                  curLocation.coords.longitude
                ], this.state.selectedBankKeyWord).then((response) => {
                  this.afterGetNearestLocation(response, getMarker(markerTypeCONST.ATM))
                })
              })
            }).bind(this)}>
            <View style={style.img}>
              <Image source={require('../assets/location_nearby/atm.png')} />
            </View>
            <Text style={style.text}>Trụ ATM</Text>
          </ShadenTouchableHightLight>
          <Picker
            selectedValue = {this.state.selectedBankKeyWord}
            onValueChange = {(itemValue) => {
              this.setState({
                selectedBankKeyWord: itemValue
              })
            }}>
            {
              this.state.bankList.map((bank, index) => {
                return (
                  <Picker.Item key = {index} label = {bank.label} value = {bank.value} />
                )
              })
            }
          </Picker>
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  img: {
    justifyContent: 'center'
  },

  container: {
    flexWrap: 'wrap',
    backgroundColor: 'white'
  },

  topContainer: {
    flex: 1,
    backgroundColor: 'white'
  },

  text: {
    fontSize: 22,
    marginLeft: 10,
    color: 'white',
    fontWeight: 'bold'
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
