import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  Text,
  View
} from 'react-native'
import primaryStyle from '../style/index'
import ShadenTouchableHightLight from '../component/ShadenTouchableHightLight'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

const style = StyleSheet.create({
  iconContainer: {

  },

  textContainer: {
    width: '100%',
    flexDirection: 'row'
  },

  distance: {
    textAlign: 'center'
  },

  description: {
    fontSize: 18,
    flex: 1
  },

  container: {
    flexDirection: 'row'
  },

  icon: {
    marginRight: 10
  }
})

export default class SearchLOcationListItem extends Component {
  render () {
    return (
      <ShadenTouchableHightLight
        padding={15}
        onPress={this.props.onSelected}>
        <View style={style.container}>
          <View style={style.textContainer}>
            <MaterialIcon name='room' style={style.icon} size={25} color='#42A5F5' />
            <Text style={style.description}>{this.props.description}</Text>
          </View>
        </View>
      </ShadenTouchableHightLight>
    )
  }
}
