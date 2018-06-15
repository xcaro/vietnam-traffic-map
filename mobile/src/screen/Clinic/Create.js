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
    drawerLabel: 'Tạo phòng khám',
    drawerIcon: ({ tintColor }) => (
      <FAIcon
        name = "plus-circle"
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
          text = 'Tạo phòng khám'>
        </SearchLocationTextInput>
        <View style = {styles.contentContainer}>
          <TextField
            label='Tên phòng khám'
            title = 'Không được bỏ trống'
            value={this.state.clinicName}
            onChangeText={ (clinicName) => this.setState({ clinicName }) }
          />
          <TouchableWithoutFeedback
            onPress = {() => {
            RNGooglePlaces.openPlacePickerModal()
            .then((place) => {
              this.setState({
                clinicLocation: place
              })
            })
            .catch(error => console.log(error.message))  // error is a Javascript Error object
          }}>
            <View>
            <TextField
              label='Vị trí phòng khám'
              title = 'nhấn để chọn'
              value={this.state.clinicLocation ?
                (this.state.clinicLocation.address.length > 40 ?
                  this.state.clinicLocation.address.substring(0, 40) + '...' :
                  this.state.clinicLocation.address )
                : ''}
              editable = {false}
              onChangeText={ (clinicAddress) => this.setState({ clinicAddress }) }
            />
            </View>
          </TouchableWithoutFeedback>

          <Dropdown
            title = 'nhấn để chọn'
            label='Loại phòng khám'
            data={this.clinicTypes}
          />

          <ShadenTouchableHightLight
            marginTop = {15}
            padding = {15}
            backgroundColor = {PRIMARY_COLOR}
            flexDirection = 'row'>
              <FAIcon
                name = "plus-circle"
                size = {15}
                color = 'white'
                style = {primaryStyles.Icon}
              />
              <Text style = {primaryStyles.textWhite}>Tạo phòng khám</Text>
          </ShadenTouchableHightLight>
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