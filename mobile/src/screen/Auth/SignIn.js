import {
  TextInput,
  Picker,
  View
} from 'react-native'

import React, {
  Component
} from 'react'

import { connect } from 'react-redux'
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
  }

  render () {
    return (
      <View>

      </View>
    )
  }
}