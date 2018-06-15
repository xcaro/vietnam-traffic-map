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


export default class SignIn extends Component {
  static navigationOptions = {
    title: 'Đăng nhập',
    drawerIcon: ({ tintColor }) => (
      <FAIcon
        name = "sign-in"
        size = {25}
        color = {tintColor}
      />
    ),
  }


  constructor (props) {
    super(props)

    this.state = {
      userName: '',
      passWord: ''
    }
  }

  render () {
    return (
      <View>
        <SearchLocationTextInput
          navigation = {this.props.navigation}
          isShowMenuButton = {true}
          editable = {false}
          text = 'Đăng nhập'>
        </SearchLocationTextInput>
        <View style = {styles.contentContainer}>
          <TextField
            label='Tên đăng nhập'
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


          <ShadenTouchableHightLight
            marginTop = {15}
            padding = {15}
            backgroundColor = {PRIMARY_COLOR}
            flexDirection = 'row'>
              <FAIcon
                name = "sign-in"
                size = {15}
                color = 'white'
                style = {primaryStyles.Icon}
              />
              <Text style = {primaryStyles.textWhite}>Đăng nhập</Text>
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
              <Text style = {primaryStyles.textWhite}>Đăng nhập bằng google</Text>
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