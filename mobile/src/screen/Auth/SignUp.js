import {
  TextInput,
  StyleSheet,
  View,
  Text
} from 'react-native'

import React, {
  Component
} from 'react'

import {
  PRIMARY_COLOR
} from '../../style/index'
import primaryStyles from '../../style/index'
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
      userName: '',
      passWord: '',
      retypePassword: '',
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
        <View style = {styles.contentContainer}>
          <TextField
            label='Email'
            title = 'Không được bỏ trống'
            value={this.state.userName}
            onChangeText={ (userName) => this.setState({ userName }) }
          />

          <TextField
            label='Mật khẩu'
            title = 'Không được bỏ trống'
            secureTextEntry = {true}
            value={this.state.passWord}
            onChangeText={ (passWord) => this.setState({ passWord }) }
          />

          <TextField
            label='Nhập lại mật khẩu'
            title = 'Không được bỏ trống'
            secureTextEntry = {true}
            value={this.state.retypePassword}
            onChangeText={ (retypePassword) => this.setState({ retypePassword }) }
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
        </View>
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