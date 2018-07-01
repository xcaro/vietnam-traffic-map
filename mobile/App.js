
import React, { Component } from 'react'
import {
  StackNavigator,
  DrawerNavigator,
  DrawerItems
} from 'react-navigation'

import {
  Text,
  ScrollView,
  AsyncStorage,
  Image,
  View,
  NetInfo,
  ConnectionType
} from 'react-native'
import firebase from 'react-native-firebase'

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import primaryStyles from './src/style/index'

import HomeScreen from './src/screen/Home/HomeScreen'
import SettingsScreen from './src/screen/Home/Settings'
import SearchLocationScreen from './src/screen/Home/SearchLocationScreen'
import ChoseNearbyLocationScreen from './src/screen/Home/ChoseNearbyLocationScreen'

import ReportTrafficInfoScreen from './src/screen/Report/ReportTrafficInfo'
import ReportTrafficScreen from './src/screen/Report/ReportTrafficScreen'
import ReportTrafficConfigScreen from './src/screen/Report/ReportTrafficConfigScreen'

import SearchRouteConfigScreen from './src/screen/SearchRoute/SearchRouteConfigScreen'
import SearchRouteResultScreen from './src/screen/SearchRoute/SearchRouteResultScreen'

import AdministrateClinicScreen from './src/screen/Clinic/Administrate'
import CreateClinicScreen from './src/screen/Clinic/Create'
import FindClinicScreen from './src/screen/Clinic/Find'

import SignOutScreen from './src/screen/Auth/SignOut'
import SignInScreen from './src/screen/Auth/SignIn'
import SignUpScreen from './src/screen/Auth/SignUp'
import ChangeInfoScreen from './src/screen/Auth/ChangeInfo'
import ChangePasswordScreen from './src/screen/Auth/ChangePassword'
import UserInfoScreen from './src/screen/Auth/Info'

import Spinner from 'react-native-loading-spinner-overlay'
import CustomContentComponent from './src/component/CustomContentComponent'
import appHelper from './src/helper/app'
import store from './src/redux/store'
import action from './src/redux/action'
import { Provider } from 'react-redux'
import superAgent from 'superagent'

import FAIcon from 'react-native-vector-icons/FontAwesome'
let userName = 'khách'

const UserInfoStack = StackNavigator({
  UserInfo: {
    screen: UserInfoScreen
  },
  ChangeInfo:{
    screen: ChangeInfoScreen
  },
  ChangePassword:{
    screen: ChangePasswordScreen
  }
}, {
  initialRouteName: 'UserInfo',
  navigationOptions: {
    title: 'Tài khoản',
    drawerIcon: ({ tintColor }) => (
      <FAIcon
        name = "user"
        size = {25}
        color = {tintColor}
      />
    ),headerStyle: {
      backgroundColor: '#0288D1'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }
})

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

    UserInfo: {
      screen: UserInfoStack
    },

    CreateClinic: {
      screen: CreateClinicScreen
    },


    Settings: {
      screen: SettingsScreen
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
    initialRouteName: 'CreateClinic',
    contentComponent: CustomContentComponent
  }
)

import request from 'superagent'

export default class App extends Component {
  constructor () {
    super()
    this.drawer = React.createRef()
    let promises = []
    request.get('http://deltavn.net/api/report-type').then((res) => {
      store.dispatch(action.setReportTypes(res.body.data))
    })

    this.state = {
      isShowLoading: false,
      isInitialLoading: true
    }

    store.subscribe(() => {
      let isShowLoading = store.getState().isShowLoading
      if (isShowLoading !== this.state.isShowLoading)
      this.setState({
        isShowLoading: store.getState().isShowLoading
      })
    })
  }

  componentWillMount () {
    this.websocket = new WebSocket('ws://192.168.1.2:8000')
    this.websocket.onopen = () => {
      let self = this
      this.websocket.onmessage = ({data}) => {
        let parseData = JSON.parse(data)
        switch (parseData.type) {
          case 'add':
          case 'initial':
            store.dispatch(action.addTrafficMarker(parseData.new_val))
            break
          case 'remove':
            store.dispatch(action.deleteTrafficMarker(parseData.old_val))
            break
          case 'change':
            store.dispatch(action.editTrafficMarker(parseData.new_val))
            break
        }
        if (parseData.type === 'add') { // Push notification
          let storeState = store.getState()
          /**
           * Kiểm tra settings
           * loại confirm
           * loại báo cáo
           * khoảng cách
           */
          if (storeState.settings.confirmed === 'Đã xác nhận' && !parseData.new_val.confirm) return
          if (storeState.settings.confirmed === 'Chưa xác nhận' && parseData.new_val.confirm) return
          if (storeState.settings.types.indexOf(Number(parseData.new_val.type_id)) === -1) return

          // Tính khoảng cách
          let distance = ''
          if (storeState.curLocation) {
            distance = getDistanceFromLatLonInKm(
              storeState.curLocation.coords.latitude,
              storeState.curLocation.coords.longitude,
              parseData.new_val.latitude,
              parseData.new_val.longitude)

            if (distance > storeState.settings.radius) return
            distance = distance.toFixed(2) + ' m'
          } else {
            distance = 'Không biết'
          }

          // Lấy loại báo cáo
          if (this.props.trafficTypes) {
            let res = request.get('http://deltavn.net/api/report-type').then((res) => {
              store.dispatch(action.setReportTypes(res.body.data))
            })
            const reportType = appHelper.trafficTypeFromTypeID(storeState.reportTypes, parseData.new_val.type_id)
            dispatchNotification(reportType, distance)
          }

          const reportType = appHelper.trafficTypeFromTypeID(storeState.reportTypes, parseData.new_val.type_id)
          dispatchNotification(reportType, distance)
        }
      }
    }
  }

  componentDidMount () {
    AsyncStorage.getItem('idToken').then(idToken => {
      if (idToken) {
        request.post('http://deltavn.net/api/me').set({
          'Authorization': `Bearer ${idToken}`
        }).then((res) => {
          store.dispatch(action.setUser(res.body.data))
        })
      }
      store.dispatch(action.setIdToken(idToken))
    })

    AsyncStorage.getItem('user').then(user => store.dispatch(action.setUser(user)))
    AsyncStorage.getItem('Settings').then(Settings => {
      if (Settings !== null) {
        store.dispatch(action.setSettings(JSON.parse(Settings)))
      }
    })
  }

  render () {
    return (
      <Provider store = {store}>
        <View style={primaryStyles.container}>
          <Spinner
            visible={this.state.isShowLoading}
            textContent={"Loading..."}
            textStyle={{color: '#FFF'}} />
          <Drawer ref = {this.drawer} />
        </View>
      </Provider>
    )
  }
}

let PushNotification = require('react-native-push-notification');
PushNotification.configure({

  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
      console.log( 'TOKEN:', token );
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
      console.log( 'NOTIFICATION:', notification );

      // process the notification

      // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
  senderID: "YOUR GCM SENDER ID",

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
      alert: true,
      badge: true,
      sound: true
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
    * (optional) default: true
    * - Specified if permissions (ios) and token (android and ios) will requested or not,
    * - if not, you must call PushNotificationsHandler.requestPermissions() later
    */
  requestPermissions: true,
});

function dispatchNotification (reportType, distance) {
  let name = reportType.name
  PushNotification.localNotification({
    "title": "Loại báo cáo: " + name,
    "message": "Khoảng cách: " + distance
  })
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1)  // deg2rad below
  var dLon = deg2rad(lon2-lon1)
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  var d = R * c // Distance in km
  return d * 1000
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

NetInfo.addEventListener(
  'connectionChange',
  (connectionInfo) => {
    switch (connectionInfo.type) {
      case 'none': console.log('Khong co ket noi internet')
      break
      default: console.log('co ket noi internet')
      break
    }
  }
);