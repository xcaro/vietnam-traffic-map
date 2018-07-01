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

class ChangePassword extends Component {
  static navigationOptions = {
    title: 'Đổi mật khẩu',
  }


  constructor (props) {
    super(props)

    this.state = {
      current_password: new validateObject('Mật khẩu', '123456'),
      new_password: new validateObject('Mật khẩu mới', '123456'),
      renew_password: new validateObject('Nhập lại mật khẩu mới', '123456'),
    }
  }

  changePassword = () => {
    /**
     * Validate tất cả input
     */
    this.setState({
      current_password: this.state.current_password.startValidate().required().lengthBetween(6, 24),
      renew_password: this.state.renew_password.startValidate().required().equal(this.state.new_password).lengthBetween(6, 24),
      new_password: this.state.new_password.startValidate().required().lengthBetween(6, 24)
    })

    if (
      this.state.current_password.isValid() &&
      this.state.renew_password.isValid() &&
      this.state.new_password.isValid()
    ) {
      this.props.showLoading()
      request.post('http://deltavn.net//api/user/change-password').send({
        current_password: this.state.current_password.val,
        renew_password: this.state.renew_password.val,
        new_password: this.state.new_password.val
      }).set({
        'Authorization': 'Bearer ' + this.props.idToken
      }).then((res) => {
        if (!res.body.success) {
          Alert.alert('Lỗi', res.body.message)
          return
        }
        Alert.alert('Thông báo', 'Đổi mật khẩu thành công', [
          {
            text: "OK",
            onPress: () => {
              /**
               * SignOut
               */
              this.props.navigation.goBack()
              this.props.navigation.navigate('SignOut')
            }
          }
        ])
      }).catch(res => {
        for (key in res.response.body.messages) {
          this.state[key].error = res.response.body.messages[key][0]
        }
        this.forceUpdate()
      }).finally(() => {
        this.props.hideLoading()
      })
    }
  }

  render () {
    return (
      <View>
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle = {styles.contentContainer}>
          <TextField
            error = {this.state.current_password.error}
            label='Mật khẩu'
            title = 'Phải giống mật khẩu cũ'
            secureTextEntry = {true}
            value={this.state.current_password.val}
            onChangeText={ (current_password) => this.state.current_password.val = current_password }
          />

          <TextField
            error = {this.state.new_password.error}
            label='Mật khẩu mới'
            title = 'Phải từ 6 - 24 kí tự'
            secureTextEntry = {true}
            value={this.state.new_password.val}
            onChangeText={ (new_password) => this.state.new_password.val = new_password }
          />

          <TextField
            error = {this.state.renew_password.error}
            label='Nhập lại mật khẩu mới'
            title = 'Phải từ 6 - 24 kí tự'
            secureTextEntry = {true}
            value={this.state.renew_password.val}
            onChangeText={ (renew_password) => this.state.renew_password.val = renew_password }
          />

          <ShadenTouchableHightLight
            onPress = {this.changePassword.bind(this)}
            marginTop = {15}
            padding = {15}
            backgroundColor = {PRIMARY_COLOR}
            flexDirection = 'row'>
              <FAIcon
                name = "user-plus"
                size = {15}
                color = 'white'
                style = {primaryStyles.Icon}
              />
              <Text style = {primaryStyles.textWhite}>Đổi mật khẩu</Text>
          </ShadenTouchableHightLight>
        </ScrollView>
      </View>
    )
  }
}

export default connect(
  /** State requirer to read by container component */
  (idToken)=>idToken,
  action
)(ChangePassword)

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