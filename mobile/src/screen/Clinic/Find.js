import {
  TextInput,
  Picker,
  View
} from 'react-native'

import React, {
  Component
} from 'react'

import FAIcon from 'react-native-vector-icons/FontAwesome'
import SearchLocationTextInput from '../../component/SearchLocationTextInput'

export default class CreateClinic extends Component {
  static navigationOptions = {
    title: 'Tìm phòng khám',
    drawerIcon: ({ tintColor }) => (
      <FAIcon
        name = "search"
        size = {25}
        color = {tintColor}
      />
    ),
  }

  render () {
    return (
      <View>
        <SearchLocationTextInput
          navigation = {this.props.navigation}
          isShowMenuButton = {true}
          editable = {false}
          text = 'Tìm phòng khám'>
        </SearchLocationTextInput>
      </View>
    )
  }
}