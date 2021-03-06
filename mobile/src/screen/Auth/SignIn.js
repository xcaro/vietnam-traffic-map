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

import {
  NavigationActions
} from 'react-navigation'

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
      userName: 'admin',
      passWord: '123456',
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

              let isError = false
              /**Kiểm tra tên đăng nhập */
              if (this.state.userName === "")
              {
                this.setState({
                  userNameError: 'Tên đăng nhập không được bỏ trống'
                })
                isError = true
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
                  passWordError: 'mật khẩu không được bỏ trống'
                })
                isError = true
              }
              else if (this.state.passWordError !== "") {
                this.setState({
                  passWordError: ''
                })
              }

              /**Kiểm tra trên server */
              if (!isError) {
                superagent
                  .post('http://deltavn.net/api/login')
                  .send({
                    username: this.state.userName,
                    password: this.state.passWord
                  })
                  .then(async res => {
                    this.props.setIdToken(res.body.access_token)
                    this.props.showLoading()
                    superagent.post('http://deltavn.net/api/me').set({
                      'Authorization': `Bearer ${res.body.access_token}`
                    }).then((res) => {
                      this.props.setUser(res.body.data)
                      AsyncStorage.setItem('user', JSON.stringify(res.body.data))
                      let routeToRedirect = this.props.navigation.getParam('routeToRedirect')

                      this.props.navigation.dispatch(NavigationActions.pop({
                        n:1
                      }))

                      let routeName = routeToRedirect || 'Map'
                      this.props.navigation.dispatch(NavigationActions.push({
                        routeName
                      }))
                    })


                    /**
                     * Đăng nhập thành công
                     */


                    /**
                     * Save idtoken
                     */
                    AsyncStorage.setItem('idToken', res.body.access_token)
                  })
                  .catch(err => {
                      Alert.alert('Lỗi','Sai tên đăng nhập hoặc mật khẩu')

                  }).finally(() => {
                    this.props.hideLoading()
                  })
              }
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
  (data)=>(
    data
  ),

  action
)(SignIn)