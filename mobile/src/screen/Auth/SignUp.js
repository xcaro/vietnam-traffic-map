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