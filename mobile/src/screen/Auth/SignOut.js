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
          AsyncStorage.removeItem('idToken')
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
  null,
  action
)(SignOut)