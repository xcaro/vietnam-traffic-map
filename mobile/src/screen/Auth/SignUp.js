import {
  TextInput,
  StyleSheet,
  View,
  Text,
  ScrollView,
  WebView
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
import SearchLocationTextInput from '../../component/SearchLocationTextInput'
import ShadenTouchableHightLight from '../../component/ShadenTouchableHightLight'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import action from '../../redux/action'


export default class SignUp extends Component {
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
      name: new validateObject('Tên'),
      userName: new validateObject('Tên đăng nhập'),
      passWord: new validateObject('Mật khẩu'),
      email: new validateObject('Email'),
      address: new validateObject('địa chỉ'),
      phone: new validateObject('Số điện thoại'),
    }
  }

  register () {
    /**
     * Validate tất cả input
     */
    if (
      name.startValidate().required().isValid() &&
      userName.startValidate().required().isValid() &&
      passWord.startValidate().required().isValid() &&
      email.startValidate().required().isValid() &&
      address.startValidate().required().isValid() &&
      phone.startValidate().required().isValid()
    ) {

    }

     /**
      * Nếu không có lỗi tiến hành đăngn
      */
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
            label='Họ tên'
            title = 'Không được bỏ trống'
            value={this.state.name.val}
            onChangeText={ (name) => this.state.name.val = name }
          />

          <TextField
            label='Tên đăng nhập'
            title = 'Không được bỏ trống'
            value={this.state.userName.val}
            onChangeText={ (userName) => this.state.userName.val = userName  }
          />

          <TextField
            label='Mật khẩu'
            title = 'Không được bỏ trống'
            secureTextEntry = {true}
            value={this.state.passWord.val}
            onChangeText={ (passWord) => this.state.passWord.val = passWord }
          />

          <TextField
            label='Email'
            title = 'Không được bỏ trống'
            value={this.state.email.val}
            onChangeText={ (email) => this.state.email.val = email }
          />

          <TextField
            label='Địa chỉ'
            title = 'Không được bỏ trống'
            value={this.state.address.val}
            onChangeText={ (address) => this.state.address.val = address }
          />

          <TextField
            label='Số điện thoại'
            title = 'Không được bỏ trống'
            value={this.state.phone.val}
            onChangeText={ (phone) => this.state.phone.val = phone  }) }
          />

          <ShadenTouchableHightLight
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
            click = {register}
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