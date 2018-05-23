import React ,{
  Component
} from 'react';

import {
  AppRegistry,
  TextInput,
  View,
  StyleSheet
} from 'react-native';

import primaryStyle from '../style/index'

const style = StyleSheet.create({
  menuContainer: {
    height:'25%'
  }
})

export default class Menu extends Component {
  render() {
    return (
      <View style={[
        primaryStyle.bgRed,
        style.menuContainer
      ]}>
      </View>
    )
  }
}


