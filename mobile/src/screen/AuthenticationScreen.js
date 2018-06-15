import React ,{
  Component
} from 'react'

import {
  View,
  Image,
  Text,
  StyleSheet,
  Button
} from 'react-native'

import action from '../redux/action'
import { connect } from 'react-redux'
import FaIcon from 'react-native-vector-icons/FontAwesome'
import ShadenTouchableHightLight from '../component/ShadenTouchableHightLight'
import primaryStyle from '../style/index'
import firebase from 'react-native-firebase'

import { NavigationActions } from 'react-navigation'

import {
  LoginManager,
  AccessToken
} from 'react-native-fbsdk'

import {
  GoogleSignin
} from 'react-native-google-signin'


class AuthenticationScreen extends Component {
  static navigationOptions = {
    title: 'Đăng nhập',
  }

  authenticateFacebook () {
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      async function(result) {
        if (result.isCancelled) {
          return
        }

        const data = await AccessToken.getCurrentAccessToken()

        if (!data) {
          alert('Đã xảy ra lỗi khi đăng nhập bằng Facebook:')
          return
        }

        /**
         * OK
         */
        // create a new firebase credential with the token
        try {
          const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken)

          // login with credential
          const currentUser = await firebase.auth().signInAndRetrieveDataWithCredential(credential)

          this.props.navigation.dispatch(NavigationActions.pop({
            n: 1
          }))

          this.props.navigation.dispatch(NavigationActions.push({
            routeName: this.props.navigation.getParam('routeToRedirect')
          }))
        } catch (e) {
          alert('Đã xảy ra lỗi khi đăng nhập bằng Facebook: ' + e)
        }
      },

      function(error) {
        alert('Đã xảy ra lỗi khi đăng nhập bằng Facebook: ' + error)
      }
    )
  }

  async authenticateGoogle () {
    try {
      // Add any configuration settings here:
      await GoogleSignin.configure()
        const data = await GoogleSignin.signIn()

       // create a new firebase credential with the token
        const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
        // login with credential
        const currentUser = await firebase.auth().signInAndRetrieveDataWithCredential(credential)

        this.props.navigation.dispatch(NavigationActions.pop({
          n: 1
        }))

        this.props.navigation.dispatch(NavigationActions.push({
          routeName: this.props.navigation.getParam('routeToRedirect')
        }))
    } catch (e) {
        alert('Đã xảy ra lỗi khi đăng nhập bằng Google: ' + e)
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      loginProviders: [
        {
          title: 'Facebook',
          icon: 'facebook',
          callBack: this.authenticateFacebook,
          backgroundColor: '#3b5998'
        }, {
          title: 'Google',
          icon: 'google',
          callBack: this.authenticateGoogle,
          backgroundColor: '#d62d20'
        }
      ]
    }
  }

  render() {
    return (
      <View style = {styles.container}>
        {this.state.loginProviders.map((provider) => {
          return (
          <ShadenTouchableHightLight
          backgroundColor = {provider.backgroundColor}
          key = {provider.title}
          onPress = {provider.callBack.bind(this)}
          marginBottom = {20}
          padding = {20}
          flexDirection = "row">
            <FaIcon
            color = "white"
            name={provider.icon}
            size = {20}
            style = {styles.icon}>
            </FaIcon>
            <Text style = {styles.title}>
            Đăng nhập bằng {provider.title}
            </Text>
          </ShadenTouchableHightLight>
          )
        })
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30
  },

  title: {
    fontSize: 20,
    color: 'white'
  },

  icon: {
    marginTop: 4,
    marginRight: 10
  }
})

export default connect (
  /** State requirer to read by container component */
  ({
    user
  })=>(
    {user}
  ),

  action
)(AuthenticationScreen)