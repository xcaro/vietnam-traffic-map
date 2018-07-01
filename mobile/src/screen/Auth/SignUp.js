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
import action from '../../redux/action'
import { TextField } from 'react-native-material-textfield'
import request from 'superagent'
import SearchLocationTextInput from '../../component/SearchLocationTextInput'
import ShadenTouchableHightLight from '../../component/ShadenTouchableHightLight'
import FAIcon from 'react-native-vector-icons/FontAwesome'


class SignUp extends Component {
  static navigationOptions = {
    title: 'Đăng ký',
    drawerIcon: ({ tintColor }) => (
      <FAIcon
        name = "user-plus"
        size = {25}
        color = {tintColor}
      />
    ),
  }


  constructor (props) {
    super(props)

    this.state = {
      name: new validateObject('Tên', 'lorem'),
      username: new validateObject('Tên đăng nhập', 'admin'),
      password: new validateObject('Mật khẩu', 'loremispum'),
      email: new validateObject('Email', 'phmngocnghia@gmail.com'),
      address: new validateObject('địa chỉ', 'test'),
      phone: new validateObject('Số điện thoại', '0904983594'),
    }
  }

  register = () => {
    /**
     * Validate tất cả input
     */
    this.setState({
      name: this.state.name.startValidate().required(),
      username: this.state.username.startValidate().required(),
      password: this.state.password.startValidate().required().lengthBetween(6, 24),
      email: this.state.email.startValidate().required().email(),
      address: this.state.address.startValidate().required(),
      phone: this.state.phone.startValidate().required().numeric().lengthMin(9),
    })

    this.props.showLoading()
    if (
      this.state.name.isValid() &&
      this.state.username.isValid() &&
      this.state.password.isValid() &&
      this.state.email.isValid() &&
      this.state.address.isValid() &&
      this.state.phone.isValid()
    ) {
      this.props.showLoading()
      request.post('http://deltavn.net/api/user').send({
        name: this.state.name.val,
        username: this.state.username.val,
        password: this.state.password.val,
        email: this.state.email.val,
        address: this.state.address.val,
        phone: this.state.phone.val
      }).then(() => {
        Alert.alert('Thông báo', 'Tạo tài khoản thành công', [
          {
            text: "OK",
            onPress: () => {
              this.props.navigation.navigate('SignIn')
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
        <SearchLocationTextInput
          navigation = {this.props.navigation}
          isShowMenuButton = {true}
          editable = {false}
          text = 'Đăng ký'>
        </SearchLocationTextInput>
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle = {styles.contentContainer}>
          <TextField
            error = {this.state.name.error}
            label='Họ tên'
            title = 'Không được bỏ trống'
            value={this.state.name.val}
            onChangeText={ (name) => this.state.name.val = name }
          />

          <TextField
            error = {this.state.username.error}
            label='Tên đăng nhập'
            title = 'Không được bỏ trống'
            value={this.state.username.val}
            onChangeText={ (username) => this.state.username.val = username  }
          />

          <TextField
            error = {this.state.password.error}
            label='Mật khẩu'
            title = 'Phải từ 6 - 24 kí tự'
            secureTextEntry = {true}
            value={this.state.password.val}
            onChangeText={ (password) => this.state.password.val = password }
          />

          <TextField
            error = {this.state.email.error}
            label='Email'
            title = 'Không được bỏ trống'
            value={this.state.email.val}
            onChangeText={ (email) => this.state.email.val = email }
          />

          <TextField
            error = {this.state.address.error}
            label='Địa chỉ'
            title = 'Không được bỏ trống'
            value={this.state.address.val}
            onChangeText={ (address) => this.state.address.val = address }
          />

          <TextField
            error = {this.state.phone.error}
            label='Số điện thoại'
            title = 'Không được bỏ trống'
            value={this.state.phone.val}
            onChangeText={ (phone) => this.state.phone.val = phone }
          />

          <ShadenTouchableHightLight
            onPress = {this.register}
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
              <Text style = {primaryStyles.textWhite}>Đăng ký</Text>
          </ShadenTouchableHightLight>

          <ShadenTouchableHightLight
            onPress = {this.register}
            marginTop = {20}
            padding = {15}
            backgroundColor = '#d62d20'
            flexDirection = 'row'>
              <FAIcon
                name = "google"
                size = {15}
                color = 'white'
                style = {primaryStyles.Icon}
              />
              <Text style = {primaryStyles.textWhite}>Đăng ký bằng google</Text>
          </ShadenTouchableHightLight>

          <ShadenTouchableHightLight
            marginTop = {20}
            padding = {15}
            backgroundColor = '#d62d20'
            flexDirection = 'row'>
              <FAIcon
                name = "google"
                size = {15}
                color = 'white'
                style = {primaryStyles.Icon}
              />
              <Text style = {primaryStyles.textWhite}>Đăng ký bằng google</Text>
          </ShadenTouchableHightLight>
        </ScrollView>
      </View>
    )
  }
}

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

export default connect(
  /** State requirer to read by container component */
  (data)=>(
    data
  ),

  action
)(SignUp)