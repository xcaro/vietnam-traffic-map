
import React, { Component } from 'react';
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom
} from 'react-navigation';

import HomeScreen from './src/screen/HomeScreen'
import SearchLocationScreen from './src/screen/SearchLocationScreen'
import SearchRouteConfigScreen from './src/screen/SearchRouteConfigScreen'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import ReportTrafficScreen from './src/screen/ReportTrafficScreen'
import ReportTrafficConfigScreen from './src/screen/ReportTrafficConfigScreen'
import ChoseNearbyLocationScreen from './src/screen/ChoseNearbyLocationScreen'
import AuthenticationScreen from './src/screen/AuthenticationScreen'
import store from './src/redux/store'
import { Provider } from 'react-redux'


const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
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

    Authentication: {
      screen: AuthenticationScreen
    }
  },

  {
    initialRouteName: 'ReportTraffic',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#0288D1',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  }
);
RootStack.navigationOptions = {
  label: 'Bản đồ',
}
const TabNav = TabNavigator({
  'Bản đồ': { screen: RootStack , navigationOptions: {
     tabBarLabel: 'Bản đồ'
    }
  },

  'Gần đây': {
    screen: ChoseNearbyLocationScreen  },
}, {
  initialRouteName: 'Bản đồ',
  navigationOptions: ({navigation}) => ({
    tabBarIcon: ({tintColor}) => {
      const {routeName}  = navigation.state
      switch(routeName){
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
  },
});

export default class App extends Component {
  render() {
    return (
      <Provider store = {store}>
        <TabNav/>
      </Provider>
    );
  }
}

/**
 * Debug only
 */

import {NativeModules} from 'react-native';
NativeModules.ExceptionsManager = null;

