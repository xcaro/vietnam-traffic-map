import SplashScreen from 'react-native-splash-screen'
import CurrentLocationMarker from '../../component/CurrentLocationMarker'
import Spinner from 'react-native-loading-spinner-overlay'
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
  Linking,
  Button,
  Image,
  ScrollView
} from 'react-native'
import action from '../../redux/action'
import { connect } from 'react-redux'
import primaryStyle, {
  PRIMARY_COLOR
} from '../../style/index'
import Menu from '../../component/Menu'
import googleAPI from '../../helper/google'
import SearchLocationTextInput from '../../component/SearchLocationTextInput'
import RoundButton from '../../component/RoundButton'
import objectHelper from '../../helper/object'
import ShadenTouchableHightLight from '../../component/ShadenTouchableHightLight'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import notification from 'react-native-push-notification'
import errorHelper from '../../helper/error'
import appHelper from '../../helper/app'
import store from '../../redux/store'
import request from 'superagent'

import MapView, {
  Marker,
  ProviderPropType,
  Callout
} from 'react-native-maps'
import { trafficMakerIcons } from '../../helper/marker'
import styles from '../../style/index';

class HomeScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedSearchLocationItemFormatAddr: '',
      trafficMarkers: [],
      isShowReportTraffic: true
    }

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

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1)  // this.deg2rad below
    var dLon = this.deg2rad(lon2-lon1)
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    var d = R * c // Distance in km
    return d
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  async componentWillMount () {
    /**
     * Init web socket
     * Start fetch data from realtime
     */
    this.websocket = new WebSocket('ws://192.168.1.5:8000')
    this.websocket.onopen = () => {
      // map.addListener('idle', () => {
      //   const bounds = map.getBounds()
      //   const data = this.parseBoundsIntoLocation(bounds)
      //   this.websocket.send(JSON.stringify(data))
      // })

      let self = this
      this.websocket.onmessage = async ({data}) => {
        let parseData = JSON.parse(data)
        switch (parseData.type) {
          case 'add':
          case 'initial':
            self.setState(state => {
              return {...state,
                trafficMarkers: [...state.trafficMarkers, parseData.new_val]
              }
            })

            // Tính khoảng cách
            let distance = ''
            if (self.props.curLocation) {
              distance = this.getDistanceFromLatLonInKm(
                self.props.curLocation.coords.latitude,
                self.props.curLocation.coords.longitude,
                parseData.new_val.latitude,
                parseData.new_val.longitude)
              distance = distance.toFixed(2)
            } else {
              distance = 'Không biết'
            }

            // Lấy loại báo cáo
            if (this.props.trafficTypes) {
              let res = await request.get('http://deltavn.net/api/report-type')
              store.dispatch(action.setReportTypes(res.body.data))
            }

            const reportType = appHelper.trafficTypeFromTypeID(self.props.reportTypes, parseData.new_val.type_id)

            notification.localNotification({
              "title": "Loại báo cáo: " + reportType.name,
              "message": "Khoảng cách: " + distance + " km"
            })
            break
          case 'remove':
            self.setState(state => {
              return {...state,
                trafficMarkers: state.trafficMarkers.filter(trafficMaker => {
                  trafficMaker.id !== parseData.old_val.id
                })
              }
            })
            break
          case 'change':
            let array = [...self.state.trafficMarkers];
            let index = array.findIndex((e) => e.id === parseData.new_val.id)
            if (index === -1) {
              /**
               * Never happend
               */
              return
            }

            array[index] = parseData.new_val
            self.setState(state => {
              return {...state,
                trafficMarkers: array
              }
            })
            this.forceUpdate()
            break
        }
      }
    }
  }

  componentWillUnmount() {
    this.unsubscribe()
    // this.websocket.close()
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
          navigation = {this.props.navigation}
          isShowMenuButton = {true}
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
            {this.props.reportTypes && this.state.trafficMarkers.map(trafficMaker => {
              let trafficReportType = appHelper.trafficTypeFromTypeID(this.props.reportTypes, trafficMaker.type_id)
              let image = null
              if (trafficMaker.confirm) {
                image = trafficReportType.confirmed_icon
              } else {
                image = trafficReportType.unconfirmed_icon
              }

              return (
                <Marker
                key = {image}
                  onPress = {() => {
                    this.props.navigation.navigate('ReportTrafficInfo', {
                      trafficReport: trafficMaker
                    })
                  }}
                  key = {trafficMaker.id}
                  coordinate = {{
                    latitude: Number(trafficMaker.latitude),
                    longitude: Number(trafficMaker.longitude)
                  }} >

                      <Image
                        key = {image}
                        style={styles.markerImage}
                        source={{uri: image}} />
                  </Marker>
              )
            })}

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
          <View style = {style.separator}></View>
            <ShadenTouchableHightLight
              marginTop = {30}
              marginRight = {15}
              padding = {10}
              onPress = {() => {
                this.props.navigation.navigate('ChoseNearbyLocation')
              }}>
              <MaterialIcon
                name = "location-on"
                size = {25}>
              </MaterialIcon>
            </ShadenTouchableHightLight>
            <View style = {style.separator}></View>
            <ShadenTouchableHightLight
              marginBottom = {0}
              marginRight = {15}
              padding = {10}
              onPress = {() => {
                this.props.navigation.navigate('ReportTrafficConfig')
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
        {this.props.searchNearLocationResult &&
            <ScrollView
            style={{
              width: '100%',
              position: 'absolute',
              bottom: 0,
              height: 200
            }}
            contentContainerStyle={{
              backgroundColor: PRIMARY_COLOR
            }}>
              <ShadenTouchableHightLight
                onPress={()=>{
                  this.props.removeSearchNear()
                }}
                margin={10}
                padding = {10}>
                  <Text>
                      Đóng
                  </Text>
              </ShadenTouchableHightLight>
              {this.props.searchNearLocationResult.data.map(result => (
                <ShadenTouchableHightLight
                onPress={()=>{
                  googleAPI.placeIdToDetail(result.place_id).then(({data}) => {
                    this.props.setSelectedSearchLocationItem({
                      place_id: result.place_id,
                      data,
                      markerImage: this.props.searchNearLocationResult.markerImage
                    })
                  })
                }}
                margin={10}
                padding = {10}
                key = {result.id}>
                  <Text>
                  {result.name}
                  </Text>
                </ShadenTouchableHightLight>
              ))}
            </ScrollView>}
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
  (data)=>data,
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
