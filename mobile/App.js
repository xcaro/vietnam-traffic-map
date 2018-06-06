
import React, { Component } from 'react'
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom
} from 'react-navigation'
import firebase from 'react-native-firebase'

import HomeScreen from './src/screen/HomeScreen'
import SearchLocationScreen from './src/screen/SearchLocationScreen'
import SearchRouteConfigScreen from './src/screen/SearchRouteConfigScreen'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import ReportTrafficScreen from './src/screen/ReportTrafficScreen'
import ReportTrafficConfigScreen from './src/screen/ReportTrafficConfigScreen'
import SearchRouteResultScreen from './src/screen/SearchRouteResultScreen'
import ChoseNearbyLocationScreen from './src/screen/ChoseNearbyLocationScreen'
import AuthenticationScreen from './src/screen/AuthenticationScreen'
import store from './src/redux/store'
import action from './src/redux/action'
import { Provider } from 'react-redux'
import superAgent from 'superagent'

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen
    },

    SearchLocation: {
      screen: SearchLocationScreen
    },

    SearchRouteConfig: {
      screen: SearchRouteConfigScreen
    },

    ReportTraffic: {
      screen: ReportTrafficScreen
    },

    ReportTrafficConfig: {
      screen: ReportTrafficConfigScreen
    },

    SearchRouteResult: {
      screen: SearchRouteResultScreen
    },

    Authentication: {
      screen: AuthenticationScreen
    }
  },

  {
    initialRouteName: 'ReportTrafficConfig',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#0288D1'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }
  }
)
RootStack.navigationOptions = {
  label: 'Bản đồ'
}
const TabNav = TabNavigator({
  'Bản đồ': {
    screen: RootStack,
    navigationOptions: {
      tabBarLabel: 'Bản đồ'
    }
  },

  'Gần đây': {
    screen: ChoseNearbyLocationScreen
  }
}, {
  initialRouteName: 'Bản đồ',
  navigationOptions: ({navigation}) => ({
    tabBarIcon: ({tintColor}) => {
      const {routeName} = navigation.state
      switch (routeName) {
        case 'Bản đồ':
          return (<MaterialIcon color = {tintColor} name = "map" size = {22}>
          </MaterialIcon>)
        case 'Gần đây':
          return (<MaterialIcon color = {tintColor} name = "location-on" size = {25}>
          </MaterialIcon>)
      }
    }
  }),

  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    inactiveTintColor: 'gray',
    activeTintColor: '#3498db',
    labelStyle: {
      fontSize: 14
    }
  }
})

export default class App extends Component {
  constructor () {
    super()


    // firebase.auth().onAuthStateChanged((idToken) => {
    //   if (idToken === null) {
    //     store.dispatch(action.setIdToken(null))
    //     return
    //   }

    //   firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
    //     store.dispatch(action.setIdToken(idToken))
    //     superAgent
    //       .get('192.168.1.4:3000/trafficReport/isauth')
    //       .then((res) => {
    //         console.log(res)
    //       }).catch((err) => {
    //         console.log(err)
    //       })
    //   }).catch(function (error) {
    //     throw error
    //   })
    // })
  }

  render () {
    return (
      <Provider store = {store}>
        <TabNav/>
      </Provider>
    )
  }
}
