import {
  TextInput,
  StyleSheet,
  View,
  Text,
  Alert,
  AsyncStorage
} from 'react-native'

import React, {
  Component
} from 'react'

import superagent from 'superagent'

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


class SignIn extends Component {
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
      passWord: '',
      userNameError: '',
      passWordError: ''
    }
  }

  render () {
    let isHideTileBar = this.props.navigation.getParam('isHideTileBar')
    return (
      <View>
        {isHideTileBar ? null :
          <SearchLocationTextInput
            navigation = {this.props.navigation}
            isShowMenuButton = {true}
            editable = {false}
            text = 'Đăng nhập'>
          </SearchLocationTextInput>
        }
        <View style = {styles.contentContainer}>
          <TextField
            error = {this.state.userNameError}
            label='Tên đăng nhập'
            title = 'Không được bỏ trống'
            value={this.state.userName}
            onChangeText={ (userName) => this.setState({ userName }) }
          />

          <TextField
            error = {this.state.passWordError}
            label='Mật khẩu'
            title = 'Không được bỏ trống'
            secureTextEntry = {true}
            value={this.state.passWord}
            onChangeText={ (passWord) => this.setState({ passWord }) }
          />


          <ShadenTouchableHightLight
            onPress = {(() => {
              /**Kiểm tra tên đăng nhập */
              if (this.state.userName === "")
              {
                this.setState({
                  userNameError: 'Tên đăng nhập không được bỏ trống'
                })

                return
              }
              else if (this.state.userNameError !== "") {
                this.setState({
                  userNameError: ''
                })
              }

              /**Kiểm tra mật khẩu */
              if (this.state.passWord === "")
              {
                this.setState({
                  userNameError: 'mật khẩu không được bỏ trống'
                })

                return
              }
              else if (this.state.userNameError !== "") {
                this.setState({
                  userNameError: ''
                })
              }

              /**Kiểm tra trên server */
              superagent
                .post('http://deltavn.net/api/login')
                .send({
                  username: this.state.userName,
                  password: this.state.passWord
                })
                .then(async res => {
                  this.props.setIdToken(res.body.access_token)

                  /**
                   * Save idtoken
                   */
                  await AsyncStorage.setItem('idToken', res.body.access_token)

                  /**
                   * Đăng nhập thành công
                   */
                  let routeToRedirect = this.props.navigation.getParam('routeToRedirect')
                  if (routeToRedirect) {
                    this.props.navigation.navigate(routeToRedirect)
                  } else {
                    this.props.navigation.navigate('Map')
                  }
                })
                .catch(err => {
                  Alert.alert('Lỗi','Sai tên đăng nhập hoặc mật khẩu')
                })
            })}
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

export default connect(
  /** State requirer to read by container component */
  ({
    curLocation, selectedSearchLocationItem, idToken
  })=>(
    {curLocation, selectedSearchLocationItem, idToken}
  ),

  action
)(SignIn)