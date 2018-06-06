import React, {
  Component
} from 'react'

import action from '../redux/action'
import { connect } from 'react-redux'
import googleHelper from '../helper/google'
import objectHelper from '../helper/object'
import Spinner from 'react-native-loading-spinner-overlay'
import Icon from 'react-native-vector-icons/FontAwesome'
import primaryStyle from '../style/index'
import MapView, {
  Marker, Callout, Polyline
} from 'react-native-maps'

import {
  AppRegistry,
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  Picker,
  WebView,
  Text,
  TouchableNativeFeedback,
  Modal
} from 'react-native'

import TextInputWithClearButton from '../component/TextInputWithClearButton'
import ErrorHelper from '../helper/error'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import RoundButton from '../component/RoundButton'

import polyline from '@mapbox/polyline'
const checkpoints = [
  require('../assets/marker/1.png'),
  require('../assets/marker/2.png'),
  require('../assets/marker/3.png'),
  require('../assets/marker/4.png'),
  require('../assets/marker/5.png'),
  require('../assets/marker/6.png'),
  require('../assets/marker/7.png'),
  require('../assets/marker/8.png'),
  require('../assets/marker/9.png'),
  require('../assets/marker/9+.png')
]

class SearchRouteConfigScreen extends Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)

    /**
     * Mock
     * origin
     * destination,
     * direction
     */

     if (!this.props.curLocation) {
      ErrorHelper.showGpsError()
      this.props.navigation.goBack()
     }

    let defaultValue = 0
    this.state = {
      origin: this.props.navigation.getParam('origin', defaultValue),
      destination: this.props.navigation.getParam('destination', defaultValue),
      originLocation: this.props.navigation.getParam('originLocation', defaultValue),
      destinationLocation: this.props.navigation.getParam('destinationLocation', defaultValue),
      // origin: {
      //   latitude: 10.772592,
      //   longitude: 106.678945

      // },
      // destination: {
      //   latitude: 10.769775,
      //   longitude: 106.685738,

      // },
      // originLocation: 'lorem',
      // destinationLocation: 'ispum',
      isLoading: true,
      direction: null,
      decodeRouteCoordinate: null
    }

    googleHelper.getDirection(
      this.state.origin,
      this.state.destination
    ).then(async (res) => {
      const data = res.data

      if (data.routes.length === 0) {
        return
      }

      const route = data.routes[0]
      let decodeRouteCoordinate = polyline.decode(route.overview_polyline.points).map(points => ({
        latitude: points[0],
        longitude: points[1]
      }))

      this.setState(state => objectHelper.CloneAndSetPropOfObject(state, {
        direction: data,
        decodeRouteCoordinate,
        steps: route.legs[0].steps,
        html_instructions: route.legs[0].steps[0].html_instructions,
        isShowSelectStepModal: false
      }))

      /**
       * Init the first step
       */

      const bearing = googleHelper.getBearing(
        route.legs[0].steps[0].start_location.lat,
        route.legs[0].steps[0].start_location.lng,
        route.legs[0].steps[0].end_location.lat,
        route.legs[0].steps[0].end_location.lng
      )

      this.mapRef.animateToCoordinate({
        latitude: route.legs[0].steps[0].start_location.lat,
        longitude: route.legs[0].steps[0].start_location.lng
      }, 100)

      setTimeout(() => {
        /**
         * Incase leave result screen and
         * Timeout is still tick
         */
        if (!bearing) {
          return
        }
        this.mapRef.animateToBearing(bearing, 300)
      }, 6500)
    }).catch(err => {
      Alert('Đã xảy ra lỗi : ' + JSON.stringify(err.response.data))
      this.props.navigation.goBack()
    }).finally(() => {
      this.setState({isLoading: false})
    })
  }

  render () {
    return (
      <View style = {[primaryStyle.container, primaryStyle.bgPrimary]}>
        <Spinner
          visible={this.state.isLoading}
          textContent={"Loading..."}
          textStyle={{color: '#FFF'}} />

        <View style = {[
          primaryStyle.flexDirectionRow,
          primaryStyle.alignItemCenter]}>
          <RoundButton
            elavation={0}
            size={48}
            backgroundColor="#3498db"
            onPress = {() => {
              this.props.navigation.goBack()
            }}>
            <Icon name="chevron-left" size={20} color="white" style={style.iconLeft} />
          </RoundButton>
          <View style={primaryStyle.container}>
            <Text style = {style.text}>
              Từ: {this.state.originLocation}
            </Text>
            <View style={style.seperator}></View>
            <Text style = {style.text}>
              Đến: {this.state.destinationLocation}
            </Text>
          </View>
        </View>

        {this.state.direction &&
          <View style = {primaryStyle.container}>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.isShowSelectStepModal}
              onRequestClose={() => {
                this.setState({
                  isShowSelectStepModal: false
                })
              }}>
                <ScrollView style = {[
                  primaryStyle.bgPrimary,
                  primaryStyle.container
                ]}>
                  {
                    this.state.steps.map((step, index) => {
                      const bearing = googleHelper.getBearing(
                        step.start_location.lat,
                        step.start_location.lng,
                        step.end_location.lat,
                        step.end_location.lng
                      )

                      return (
                      <View key = {index}>
                        <TouchableNativeFeedback
                          onPress = {() => {
                            this.setState({
                              isShowSelectStepModal: false,
                              html_instructions: step.html_instructions
                            })

                            this.mapRef.animateToCoordinate({
                              latitude: step.start_location.lat,
                              longitude: step.start_location.lng
                            }, 100)

                            setTimeout(() => {
                              this.mapRef.animateToBearing(bearing, 300)
                            }, 6700)
                          }}>
                            <Text style = {style.text}>{step.html_instructions.replace(/(<([^>]+)>)/ig, '')}</Text>
                        </TouchableNativeFeedback>
                        <View style={style.seperator}></View>
                      </View>
                      )})
                  }
                </ScrollView>
            </Modal>
            <View style={style.seperator}>
            </View>
            <TouchableNativeFeedback onPress = {() => {
                this.setState({
                  isShowSelectStepModal: true
                })
              }}>
                <View style = {primaryStyle.flexDirectionRow}>
                  <Text style = {[style.text, {
                    width: '90%'
                  }]}>
                    {this.state.html_instructions.replace(/(<([^>]+)>)/ig, '')}
                  </Text>
                  <Icon name = "caret-down" size = {20} color = 'white' />
                </View>
              </TouchableNativeFeedback>
              <View style = {primaryStyle.container}>
                <MapView
                  showsCompass = {false}
                  toolbarEnabled = {false}
                  pitchEnabled = {false}
                  onMapReady = {(() => {
                    this.mapRef.animateToViewingAngle(70, 200)
                  }).bind(this)}
                  ref = {(ref) => { this.mapRef = ref }}
                  style={style.map}
                  initialRegion={{
                    latitude: this.state.origin.latitude,
                    longitude: this.state.origin.longitude,
                    latitudeDelta: 0.0001,
                    longitudeDelta: 0.0001
                  }}>
                  <Marker
                    title = {this.state.destinationLocation}
                    image = {require('../assets/marker/destination.png')}
                    coordinate = {this.state.destination}/>

                  <Marker coordinate={{
                    latitude: this.props.curLocation.coords.latitude,
                    longitude: this.props.curLocation.coords.longitude,
                  }}
                    image={require('../assets/marker/curLocation.png')}
                    title='Vị trí hiện tại của bạn'/>
                  <Polyline
                    strokeColor = "#3498db"
                    strokeWidth = {5}
                    coordinates = {this.state.decodeRouteCoordinate}/>
                  {
                    this.state.steps.map((step, index) => {
                      const image = index + 1 > 9
                        ? checkpoints[9]
                        : checkpoints[index]

                      const bearing = googleHelper.getBearing(
                        step.start_location.lat,
                        step.start_location.lng,
                        step.end_location.lat,
                        step.end_location.lng
                      )

                      return (
                        <Marker
                          onPress = {() => {
                            // Camera sang hướng
                            this.mapRef.animateToCoordinate({
                              latitude: step.start_location.lat,
                              longitude: step.start_location.lng
                            }, 100)

                            setTimeout(() => {
                              this.mapRef.animateToBearing(bearing, 300)
                            }, 6700)

                            this.setState(state => objectHelper.CloneAndSetPropOfObject(state, {
                              html_instructions: step.html_instructions
                            }))
                          }}
                          key = {index}
                          image = {image}
                          coordinate = {{
                            latitude: step.start_location.lat,
                            longitude: step.start_location.lng
                          }}>
                        </Marker>
                      )
                    })
                  }
                </MapView>
              </View>
          </View>
        }


        {!this.state.direction &&
          <View style = {style.container} >
            <View style = {[primaryStyle.flexDirectionRow, style.tittleContainer]}>
              <MaterialIcon
                name = "error"
                size = {25}
                color = "white"
                style = {primaryStyle.Icon}
              >
              </MaterialIcon>
                <Text style = {style.text}>Không tìm thấy đường đi nào</Text>
            </View>
          </View>
        }
      </View>
    )
  }
}

const style = StyleSheet.create({
  text: {
    padding: 10,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  },

  map: {
    ...StyleSheet.absoluteFillObject
  },

  tittleContainer: {
    marginLeft: 10,
    marginTop: 25,
    justifyContent: 'center'
  },

  btn: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  seperator: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    height: 1
  },

  padding: {
    paddingBottom: 10
  },

  iconLeft: {
    paddingLeft: 10,
    paddingRight: 15
  },

  icon: {
    paddingTop: 16,
    backgroundColor: 'red'
  },
})

export default connect(
  /** State requirer to read by container component */
  ({
    curLocation
  }) => (
    {curLocation}
  ),
  action
)(SearchRouteConfigScreen)
