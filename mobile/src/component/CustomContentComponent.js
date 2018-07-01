import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import React, {
  Component
} from 'react'

import {
  DrawerItems
} from 'react-navigation'

import firebase from 'react-native-firebase'
import { connect } from 'react-redux'
import store from '../redux/store'

const hiddenUserItem = [
  'SignIn',
  'SignUp'
]

const showGuestItem = hiddenUserItem.slice(0)
showGuestItem.push('Settings', 'Map')

import FAIcon from 'react-native-vector-icons/FontAwesome'
import primaryStyles from '../style/index'
class CustomContentComponent extends Component {


  constructor (props) {
    super (props)
    this.state = {...props}

    /**
     * Watch for auth change: subscribe to redux store => determine user type has change
     * Determine user type
     * Change content base on user type
     */

    this.originalItems = this.state.items
    this.currentidToken = store.getState().idToken

    if (this.currentidToken === null) {
      /**
       * Hide drawer item that should be hide if user is guest
       */
      let filterItems = this.originalItems.filter(item => showGuestItem.includes(item.key))
      this.state.items = filterItems
    } else {
      /**
      * Filter drawer item base on user type
      */

      let filterItems = this.originalItems.filter(item => !hiddenUserItem.includes(item.key))
      this.state.items = filterItems
    }
  }

  static getDerivedStateFromProps(props, state) {
    /**
     * Change active items key is enough
     * It's notify what current route
     */
    if (props.activeItemKey !== state.activeItemKey) {
      return {
        activeItemKey: props.activeItemKey
      }
    } else {
      return null
    }
  }

  componentDidMount () {
    this.unsubscribe = store.subscribe(() => {
      let idToken = store.getState().idToken

      /**
       * If user has been changed
       * Normal compare is enough cause we only have 2 types :
       * null : guest
       * object : signed user
       */
      if (idToken === this.currentidToken) {
        return
      }

      if (idToken === null) {
        /**
         * Hide drawer item that should be hide if user is guest
         */
        let filterItems = this.originalItems.filter(item => showGuestItem.includes(item.key))
        this.setState(state => {
          return {
            ...state,
            items: filterItems
          }
        })
      } else {
        /**
        * Filter drawer item base on user type
        */
        let filterItems = this.originalItems.filter(item => !hiddenUserItem.includes(item.key))
        this.setState(state => {
          return {
            ...state,
            items: filterItems
          }
        })
      }

      /**
       * Finally assign user to currentUser variable
       * To keep track of what has been changed
       */
      this.currentidToken = idToken
    })
  }

  render () {
    return (
      <View>
        <View style = {styles.profileContainer}>
          <FAIcon style = {primaryStyles.Icon} name = "user" size = {17} color = "white" />
          <Text style = {styles.profileText}>{this.props.user ? this.props.user.displayName.length <= 20 ? this.props.user.displayName :this.props.user.displayName.substring(0,20)+"..." : 'Khách'}</Text>
        </View>
        <DrawerItems {...this.state} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  profileContainer: {
    paddingLeft: 30,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#3498db',
    flexDirection: 'row'
  },

  profileText: {
    marginLeft: 5,
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold'
  }
})

export default connect(
  /** State requirer to read by container component */
  ({
    idToken
  })=>(
    {idToken}
  ),

  null
)(CustomContentComponent)