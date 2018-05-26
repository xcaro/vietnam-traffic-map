import { Marker, ProviderPropType } from 'react-native-maps'
import React, { Component } from 'react'

export default class MarkerList extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return this.props.markers.map((marker, index) => {
      return (
        <Marker
          key={index}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description} />
      )
    })
  }
}
