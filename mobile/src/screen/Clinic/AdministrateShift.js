import {
  StyleSheet,
  TextInput,
  Picker,
  View,
  Text,
  Button,
  TouchableWithoutFeedback
} from 'react-native'

import React, {
  Component
} from 'react'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import { Dropdown } from 'react-native-material-dropdown'
import { TextField } from 'react-native-material-textfield'
import RNGooglePlaces from 'react-native-google-places'
import ShadenTouchableHightLight from '../../component/ShadenTouchableHightLight'
import primaryStyles from '../../style/index'
import {
  PRIMARY_COLOR
} from '../../style/index'
import { connect } from 'react-redux'
import SearchLocationTextInput from '../../component/SearchLocationTextInput'

class CreateClinic extends Component {
  static navigationOptions = {
    drawerLabel: 'Quản trị phòng khám',
    drawerIcon: ({ tintColor }) => (
      <FAIcon
        name = "briefcase-medical"
        size = {25}
        color = {tintColor}
      />
    ),
  }

  constructor () {
    super ()
    this.state = {
      clinicName: '',
      clinicLocation: null
    }

    this.clinicTypes = [{
      value: 'Y khoa'
    }]
  }

  render () {
    return (
      <View>
       <SearchLocationTextInput
          navigation = {this.props.navigation}
          isShowMenuButton = {true}
          editable = {false}
          text = 'Quản trị phòng khám'>
        </SearchLocationTextInput>
        <View style = {styles.contentContainer}>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    margin: 20,
    marginTop: 0
  },

  mt: {
    marginTop: 10
  },
})

export default connect(
  /** State requirer to read by container component */
  ({
    user
  })=>(
    {user}
  ),

  null
)(CreateClinic)