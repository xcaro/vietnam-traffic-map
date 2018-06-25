import {
  TextInput,
  StyleSheet,
  View,
  Text,
  ScrollView,
  WebView,
  Alert
} from 'react-native'

import React, {
  Component
} from 'react'

import {
  PRIMARY_COLOR
} from '../../style/index'
import primaryStyles from '../../style/index'
import {
  validateObject
} from '../../helper/validate'
import { connect } from 'react-redux'
import { TextField } from 'react-native-material-textfield'
import request from 'superagent'
import SearchLocationTextInput from '../../component/SearchLocationTextInput'
import ShadenTouchableHightLight from '../../component/ShadenTouchableHightLight'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import action from '../../redux/action'


class ChangeInfo extends Component {
  static navigationOptions = {
    title: 'Cập nhật thông tin',
  }

  constructor (props) {
    super(props)

    this.state = {
      name: new validateObject('Tên', this.props.user.name),
      address: new validateObject('địa chỉ', 'abc'),//this.props.user.address),
      phone: new validateObject('Số điện thoại', '0404034234'),//this.props.user.phone),
      email: new validateObject('Email', 'asdf@aa.cc') //this.props.user.email),
    }
  }

  updateInfo = () => {
    /**
     * Validate tất cả input
     */
    this.setState({
      name: this.state.name.startValidate().required(),
      email: this.state.email.startValidate().required().email(),
      address: this.state.address.startValidate().required(),
      phone: this.state.phone.startValidate().required().numeric().lengthMin(9),
    })

    if (
      this.state.name.isValid() &&
      this.state.email.isValid() &&
      this.state.address.isValid() &&
      this.state.phone.isValid()
    ) {
      request.post('http://deltavn.net/api/user/change-info').set({
        'Authorization': `Bearer ${this.props.idToken}`
      }).send({
        name: this.state.name.val,
        email: this.state.email.val,
        address: this.state.address.val,
        phone: this.state.phone.val,
        username: this.props.user.username
      }).then(() => {
        Alert.alert('Thông báo', 'Cập nhật thông tin tài khoản thành công', [
          {
            text: "OK",
            onPress: () => {
              this.props.navigation.goBack()
            }
          }
        ])
      }).catch(res => {
        Alert.alert('Đã xảy ra lỗi khi cập nhập thông tin', JSON.stringify(res))
      })
    }
  }

  render () {
    return (
      <View>
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle = {styles.contentContainer}>
        <TextField
            error = {this.state.name.error}
            label='Tên mới'
            title = 'Không được bỏ trống'
            value={this.state.name.val}
            onChangeText={ (name) => this.state.name.val = name }
          />

        <TextField
            error = {this.state.email.error}
            label='Email mới'
            title = 'Không được bỏ trống'
            value={this.state.email.val}
            onChangeText={ (email) => this.state.email.val = email }
          />

        <TextField
          error = {this.state.address.error}
          label='Địa chỉ mới'
          title = 'Không được bỏ trống'
          value={this.state.address.val}
          onChangeText={ (address) => this.state.address.val = address }
        />

        <TextField
            error = {this.state.phone.error}
            label='Số điện thoại mới'
            title = 'Không được bỏ trống'
            value={this.state.phone.val}
            onChangeText={ (phone) => this.state.phone.val = phone }
          />

          <ShadenTouchableHightLight
            onPress = {this.updateInfo}
            marginTop = {15}
            padding = {15}
            backgroundColor = {PRIMARY_COLOR}
            flexDirection = 'row'>
              <FAIcon
                name = "edit"
                size = {15}
                color = 'white'
                style = {primaryStyles.Icon}
              />
              <Text style = {primaryStyles.textWhite}>Cập nhật thông tin</Text>
          </ShadenTouchableHightLight>
        </ScrollView>
      </View>
    )
  }
}

export default connect(
  /** State requirer to read by container component */
  (data)=>data,
  action
)(ChangeInfo)

const styles = StyleSheet.create({
  contentContainer: {
    margin: 20,
    marginTop: 0,
    justifyContent: 'center',
  },

  mt: {
    marginTop: 10
  },
})