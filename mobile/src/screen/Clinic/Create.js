import {
  TextInput,
  Picker,
  View,
  Text,
  Button
} from 'react-native'

import React, {
  Component
} from 'react'

import FAIcon from 'react-native-vector-icons/FontAwesome'

import { connect } from 'react-redux'
import SearchLocationTextInput from '../../component/SearchLocationTextInput'

class CreateClinic extends Component {
  static navigationOptions = {
    drawerLabel: 'Tạo phòng khám',
    drawerIcon: ({ tintColor }) => (
      <FAIcon
        name = "plus-circle"
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
          text = 'Tạo phòng khám'>
        </SearchLocationTextInput>
      </View>
    )
  }
}

export default connect(
  /** State requirer to read by container component */
  ({
    user
  })=>(
    {user}
  ),

  null
)(CreateClinic)