import SplashScreen from 'react-native-splash-screen'
import CurrentLocationMarker from '../component/CurrentLocationMarker'
import React ,{
  Component
} from 'react'
import {
  AppRegistry,
  TextInput,
  View,
  Text,
  StyleSheet,
  Keyboard,
  Linking
} from 'react-native'
import action from '../redux/action'
import { connect } from 'react-redux'
import primaryStyle from '../style/index'
import Menu from '../component/Menu'
import SearchLocationTextInput from '../component/SearchLocationTextInput'
import RoundButton from '../component/RoundButton'
import objectHelper from '../helper/object'
import ShadenTouchableHightLight from '../component/ShadenTouchableHightLight'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import errorHelper from '../helper/error'
import appHelper from '../helper/app'
import store from '../redux/store'

import MapView, {
  Marker,
  ProviderPropType,
  Callout
} from 'react-native-maps'

class HomeScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedSearchLocationItemFormatAddr: '',
      isShowReportTraffic: true
    }


    this.ws = new WebSocket('ws://localhost:8080')

    appHelper.getCurrentLocation(this.props, false)

    /**
     * Start the tracking location
     */
    this.selectedSearchLocationItem = null
    this.unsubscribe = store.subscribe(() => {

      /**
       * If data have really been changed
       */
      let newselectedSearchLocationItem = store.getState().selectedSearchLocationItem
      if(newselectedSearchLocationItem !== this.selectedSearchLocationItem) {

        this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState, {
          selectedSearchLocationItemFormatAddr:
          !newselectedSearchLocationItem ?
          "" :
          newselectedSearchLocationItem.data.result.name ||
          newselectedSearchLocationItem.data.result.formatted_address
        }))

        /**
         * Animated to search location
         */
        if(newselectedSearchLocationItem !== null)
        this.mapRef.current.animateToRegion({
          latitude: newselectedSearchLocationItem.data.result.geometry.location.lat,
          longitude: newselectedSearchLocationItem.data.result.geometry.location.lng,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        }, 300)

        /**
         * Save the new data
         */
        this.selectedSearchLocationItem = newselectedSearchLocationItem
      }

    })

    this.mapRef = React.createRef()
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={
        primaryStyle.container
      }>
        <SearchLocationTextInput
          editable = {false}
          onPress={() => {
            // Navigatate
            this.props.navigation.navigate('SearchLocation')
          }}
          onClear= {() =>{
            this.props.removeSelectedSearchLocationItem()
          }}

          isAlwaysShowClearTextButton = {true}
          text = {this.state.selectedSearchLocationItemFormatAddr}>
        </SearchLocationTextInput>

        <View style={[
          primaryStyle.container,
          style.container
        ]}>

          <MapView
            onRegionChangeComplete = {(region) => {
              /**
               * Validate if zoom level is too small
               */
              let zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)
              if (zoom < 8) {
                this.setState({
                  isShowReportTraffic: false
                })
                return
              } else if (!this.state.isShowReportTraffic) {
                this.setState({
                  isShowReportTraffic: true
                })
              }

              /**
               * Send current region to web socket
               * Subscribe to update
               */
              this.ws.onopen = () => {
                // connection opened
                this.ws.send('something'); // send a message
              };

              this.ws.onmessage = (e) => {
                // a message was received
                console.log(e.data);
              };

              this.ws.onerror = (e) => {
                // an error occurred
                console.log(e.message);
              };

              this.ws.onclose = (e) => {
                // connection closed
                console.log(e.code, e.reason);
              };
            }}
            toolbarEnabled = {false}
            ref = {this.mapRef}
            style={style.map}

            initialRegion={{
              latitude: 10.762622,
              longitude: 106.806692,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}
          >
            {this.props.selectedSearchLocationItem &&
              <Marker
                image = {this.props.selectedSearchLocationItem.markerImage}
                coordinate = {{
                  latitude: this.props.selectedSearchLocationItem.data.result.geometry.location.lat,
                  longitude: this.props.selectedSearchLocationItem.data.result.geometry.location.lng
                }}
                title = {this.props.selectedSearchLocationItem.data.result.name}
                description = {this.props.selectedSearchLocationItem.data.result.formatted_address}>
              </Marker>


            }

            {this.props.curLocation &&
              <CurrentLocationMarker
                coordinate = {{
                  latitude: this.props.curLocation.coords.latitude,
                  longitude: this.props.curLocation.coords.longitude,
                }}

                accuracy = {this.props.curLocation.coords.accuracy}>
              </CurrentLocationMarker>
            }
          </MapView>

          <View style = {primaryStyle.container}>
            <ShadenTouchableHightLight
              marginTop = {20}
              marginRight = {15}
              padding = {10}
              onPress = {() => {

              }}>
              <MaterialIcon
                name = "traffic"
                size = {25}>
              </MaterialIcon>
            </ShadenTouchableHightLight>
            <View style = {style.separator}></View>
            <ShadenTouchableHightLight
              marginBottom = {0}
              marginRight = {15}
              padding = {10}
              onPress = {() => {
                appHelper.navigateCheckSignIn(
                  this.props.navigation,
                  this.props.idToken,
                  'ReportTrafficConfig'
                )
              }}>
              <MaterialIcon
                name = "announcement"
                size = {25}>
              </MaterialIcon>
            </ShadenTouchableHightLight>
          </View>

          <RoundButton
            size = {60}
            backgroundColor = '#3498db'
            marginRight = {15}
            onPress = {(() => {
              if(!this.props.selectedSearchLocationItem) {
                this.props.navigation.navigate('SearchRouteConfig')
                return
              }

              appHelper.getCurrentLocation(this.props).then((curLocation) => {
                let destination = {}
                destination.latitude = this.props.selectedSearchLocationItem.data.result.geometry.location.lat
                destination.longitude = this.props.selectedSearchLocationItem.data.result.geometry.location.lng

                this.props.navigation.navigate('SearchRouteResult', {
                  origin: curLocation.coords,
                  destination: destination,
                  originLocation: 'Vị trí của bạn',
                  destinationLocation: this.state.selectedSearchLocationItemFormatAddr
                })
              }).catch((err) => {
                var a = err
                this.props.navigation.navigate('SearchRouteConfig')
              })
            }).bind(this)}>
            <MaterialIcon
              style = {
                primaryStyle.textWhite
              }
              name = "directions"
              size = {25}>
            </MaterialIcon>

            <Text style = {[
              primaryStyle.textWhite,
              primaryStyle.textCenter,
              primaryStyle.textBold
            ]}>
              ĐI
            </Text>
          </RoundButton>


          <RoundButton
              marginTop = {20}
              marginBottom = {25}
              marginRight = {15}
              size = {60}
              onPress = {() => {
                // Prss this button too fast, watchLocation is not init in time have to check for it manually
                if(!this.props.curLocation)
                  appHelper.getCurrentLocation(this.props).then(() => {
                    this.animateToCurrentLocation()
                  })
                else {
                  this.animateToCurrentLocation()
                }
              }}>
              <MaterialIcon
                name = "my-location"
                size = {25}>
              </MaterialIcon>
            </RoundButton>


        </View>
      </View>
    )
  }

  animateToCurrentLocation() {
    var {
      longitude,
      latitude
    } = this.props.curLocation.coords

    var coordinate = {
      latitude,
      longitude
    }

    // Else animate to coordinate
    this.mapRef.current.animateToCoordinate(coordinate, 1500)
  }

  componentDidMount() {
    SplashScreen.hide()
  }
}

export default connect(
  /** State requirer to read by container component */
  ({
    curLocation, selectedSearchLocationItem, idToken
  })=>(
    {curLocation, selectedSearchLocationItem, idToken}
  ),

  action
)(HomeScreen)

const style = StyleSheet.create({
  container: {
    flexDirection:'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },

  buttonText: {
    fontSize: 18
  },

  separator: {
    height: 1
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },
})

SplashScreen.hide()
