
import React, { Component } from 'react'
import {
  StackNavigator,
  DrawerNavigator,
  DrawerItems
} from 'react-navigation'

import {
  Text,
  ScrollView,
  AsyncStorage
} from 'react-native'
import firebase from 'react-native-firebase'

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import HomeScreen from './src/screen/Home/HomeScreen'
import SearchLocationScreen from './src/screen/Home/SearchLocationScreen'
import ChoseNearbyLocationScreen from './src/screen/Home/ChoseNearbyLocationScreen'
import ReportTrafficInfoScreen from './src/screen/Home/ReportTrafficInfo'

import ReportTrafficScreen from './src/screen/Report/ReportTrafficScreen'
import ReportTrafficConfigScreen from './src/screen/Report/ReportTrafficConfigScreen'

import SearchRouteConfigScreen from './src/screen/SearchRoute/SearchRouteConfigScreen'
import SearchRouteResultScreen from './src/screen/SearchRoute/SearchRouteResultScreen'

import CreateClinicScreen from './src/screen/Clinic/Create'
import FindClinicScreen from './src/screen/Clinic/Find'

import SignOutScreen from './src/screen/Auth/SignOut'
import SignInScreen from './src/screen/Auth/SignIn'
import SignUpScreen from './src/screen/Auth/SignUp'

import CustomContentComponent from './src/component/CustomContentComponent'
import store from './src/redux/store'
import action from './src/redux/action'
import { Provider } from 'react-redux'
import superAgent from 'superagent'

let userName = 'khách'
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

    SignInStackNavigation: {
      screen: SignInScreen
    },

    ChoseNearbyLocation: {
      screen: ChoseNearbyLocationScreen
    },

    ReportTrafficInfo: {
      screen: ReportTrafficInfoScreen
    }
  },

  {
    initialRouteName: 'Home',
    navigationOptions: {
      drawerLabel: 'Bản đồ',
      drawerIcon: ({ tintColor }) => (
        <MaterialIcon
          name = "map"
          size = {25}
          color = {tintColor}
        />
      ),
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
      screen: RootStack,
    },

    CreateClinic: {
      screen: CreateClinicScreen
    },

    FindClinic: {
      screen: FindClinicScreen
    },

    SignIn: {
      screen: SignInScreen
    },

    SignUp: {
      screen: SignUpScreen
    },

    SignOut: {
      screen: SignOutScreen
    }
  },
  {
    initialRouteName: 'Map',
    contentComponent: CustomContentComponent
  }
)

export default class App extends Component {
  constructor () {
    super()
    this.drawer = React.createRef()
  }

  componentDidMount () {
    AsyncStorage.getItem('idToken').then(idToken => store.dispatch(action.setIdToken(idToken)))
  }

  render () {
    return (
      <Provider store = {store}>
        <Drawer ref = {this.drawer} />
      </Provider>
    )
  }
}
