import {
  Marker,
  Circle
} from 'react-native-maps'

import {
  View
} from 'react-native'

import React, { Component } from 'react'

import {
  PRIMARY_COLOR
} from '../style/index'

export default class CurrentLocationMarker extends Component {
  render () {
    return (
      <View>
        <Marker
          coordinate={this.props.coordinate}
          pinColor = {PRIMARY_COLOR}
          title='Vị trí hiện tại của bạn'
          image={require('../assets/marker/curLocation.png')}
        />
        {/* <Circle
                    center={this.props.coordinate}
                    radius={this.props.accuracy}
                    strokeColor='#4289f4'
                    fillColor='rgba(52, 152, 219, 0.5)'>
                </Circle> */}
      </View>
    )
  }
}
