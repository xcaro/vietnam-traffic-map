
import React, { Component } from 'react'
import {
  StackNavigator,
  DrawerNavigator
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
import CreateClinicScreen from './src/screen/Clinic/Create'
import FindClinicScreen from './src/screen/Clinic/Find'
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
    },

    ChoseNearbyLocation: {
      screen: ChoseNearbyLocationScreen
    }
  },

  {
    initialRouteName: 'Home',
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

const Drawer = DrawerNavigator(
  {
    Map: {
      screen: RootStack
    },

    CreateClinic: {
      screen: CreateClinicScreen
    },

    FindClinic: {
      screen: FindClinicScreen
    }
  },
  {
    initialRouteName: 'Map'
  }
)

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
        <RootStack/>
      </Provider>
    )
  }
}
