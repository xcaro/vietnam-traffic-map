import {
  TextInput,
  Picker,
  View,
  Alert,
  AsyncStorage
} from 'react-native'

import React, {
  Component
} from 'react'

import { connect } from 'react-redux'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import action from '../../redux/action'
import request from 'superagent'


class SignOut extends Component {
  static navigationOptions = {
    title: 'Đăng xuất',
    drawerIcon: ({ tintColor }) => (
      <FAIcon
        name = "sign-out"
        size = {25}
        color = {tintColor}
      />
    ),
  }

  constructor (props) {
    super(props)
    AsyncStorage.removeItem('idToken')
    request.post('http://deltavn.net/api/logout').set({
      'Authorization': `Bearer ${this.props.idToken}`
    }).then(() => {
          /**
           * Clear user
           * Clear token
           */
          this.props.setIdToken(null)
          this.props.setUser(null)

          /**
           * navigate home route
           * Clear all history
           */
          this.props.navigation.navigate('Map')
    })
  }

  render () {
    return (
      <View>
      </View>
    )
  }
}

export default connect(
  /** State requirer to read by container component */
  ({idToken}) => ({idToken}),
  action
)(SignOut)