import {
  StackNavigator
} from 'react-navigation'

import React, {
  Component
} from 'react'

import {
  AppRegistry,
  TextInput,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  Linking
} from 'react-native'

import primaryStyle from '../style/index'

import { connect } from 'react-redux'
import action from '../redux/action'
import TextInputWithClearButton from '../component/TextInputWithClearButton'
import Icon from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import RoundButton from '../component/RoundButton'
import SearchLocationListView from '../component/SearchLocationListView'
import ShadenTouchableHightLight from '../component/ShadenTouchableHightLight'
import RNGooglePlaces from 'react-native-google-places'
import googleAPI from '../helper/google'
import objectHelper from '../helper/object'
import errorHelper from '../helper/error'

class SearchRouteConfigScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isShowSearchLocationOriginResult: true
    }

    var debounce = require('debounce')

    this.textInputOrignOnChangeTextdebounced = googleAPI.debounceAutoComplete(350, ({data}) => {
      this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState,{
        SearchLocationOriginResult: googleAPI.formatAutoCompletePlaceResult(data)
      }))
    })

    this.textInputDestinationOnChangeTextdebounced = googleAPI.debounceAutoComplete(350, ({data}) => {
      this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState,{
        SearchLocationDestinationResult: googleAPI.formatAutoCompletePlaceResult(data)
      }))
    })

    this.TextInputOrigin = React.createRef()
    this.TextInputDestination = React.createRef()
  }

  static navigationOptions  = {
    header: null
  }

  isOriginAndDestinationDupplicate() {
    return (this.state.originCoordinate === this.state.destinationCoordinate)
  }

  alertOriginAndDestinationDupplicate() {
    Alert.alert(
      'Đã xảy ra lỗi trong quá trình tìm kiếm đường đi',
      'Điểm đi và điểm đến không được trùng vị trí với nhau',
      [
        {text: 'OK'},
      ]
    )
  }

  setLocationTextInputOrigin(description, place_coordinate) {
    var isEqual = require('lodash.isequal')

    // Check console.logfor dupplicate
    if(isEqual(place_coordinate,this.state.destinationCoordinate))
    {
      Alert.alert(
        'Đã xảy ra lỗi trong quá trình chọn điểm đi',
        'Điểm đi không được trùng với điểm đến',
        [
          {'text':'OK'}
        ]
      )
      return
    }

    this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState,{
      // Set active color
      isTextInptOriginActived: true,

      // Set text incase of swap need
      TextInputOriginText: description,

      // Set origin
      originCoordinate: place_coordinate

    }))

    // Set text
    this.TextInputOrigin.current.setText(description)

        // If the opposite have value, redirect to ... ?
    if(this.state.destinationCoordinate != null) {
      // Navigate
      this.startMapIntent()
    }
  }

  setLocationTextInputDestination(description, place_coordinate) {
    var isEqual = require('lodash.isequal')

    // Check console.logfor dupplicate
    if(isEqual(place_coordinate,this.state.originCoordinate))
    {
      Alert.alert(
        'Đã xảy ra lỗi trong quá trình chọn điểm đến',
        'Điểm đến không được trùng với điểm đi',
        [
          {'text':'OK'}
        ]
      )
      return
    }


    this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState,{
      // Set active color
      isTextInptDestinationActived: true,

      // Set text incase of swap need
      TextInputDestinationText: description,

      // Set origin
      destinationCoordinate: place_coordinate
    }))

    // Set text
    this.TextInputDestination.current.setText(description)

    // If the opposite have value, redirect to ... ?
    if(this.state.originCoordinate != null) {
      // Navigate
      this.startMapIntent()
    }
  }

  startMapIntent() {
    let origin_lat = this.state.originCoordinate.latitude
    let origin_lng = this.state.originCoordinate.longitude
    this.destination_lat = this.state.destinationCoordinate.latitude
    this.destination_lng = this.state.destinationCoordinate.longitude

    var url = `http://maps.google.com/maps?saddr=${origin_lat},${origin_lng}&daddr=${this.destination_lat},${this.destination_lng}`
    Linking.openURL(url)
  }


  ShowSearchLocationOriginResult() {
    if(this.state.SearchLocationOriginResult)
    return (
      <SearchLocationListView
            title = "Kết quả tìm kiếm"
            data = {this.state.SearchLocationOriginResult}
            onSelected = {(place_id, {description}) => {
              //get coordinate
              googleAPI.placeIdToCoordinate(place_id).then(coordinate => {
                this.setLocationTextInputOrigin(description, coordinate)
              })
            }}>
      </SearchLocationListView>
    )
    else
    return (
      <Text style = {style.emptyText}>Gõ để bắt đầu tìm kiếm điếm điểm đi</Text>
    )
  }

  ShowSearchLocationDestinationResult() {
    if(this.state.SearchLocationDestinationResult)
    return (
      <SearchLocationListView
            title = "Kết quả tìm kiếm"
            data = {this.state.SearchLocationDestinationResult}
            onSelected = {(place_id, {description}) => {
              //get coordinate
              googleAPI.placeIdToCoordinate(place_id).then(coordinate => {
                this.setLocationTextInputDestination(description, coordinate)
              })
            }}>
          </SearchLocationListView>
    )
    else
    return (
      <Text style = {style.emptyText}>Gõ để bắt đầu tìm kiếm điếm đến</Text>
    )
  }

  swapTextInput() {
    // Save current value
    let TextInputOriginText = this.state.TextInputOriginText || ''
    let TextInputDestinationText = this.state.TextInputDestinationText || ''

    // Swap text
    this.TextInputOrigin.current.setText(TextInputDestinationText)
    this.TextInputDestination.current.setText(TextInputOriginText)

    // Swap state
    this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState, {
      TextInputOriginText: TextInputDestinationText,
      TextInputDestinationText: TextInputOriginText,

      //Swap active state
      isTextInptOriginActived: this.state.isTextInptDestinationActived || false,
      isTextInptDestinationActived: this.state.isTextInptOriginActived || false,

      //Swap coordinate
      originCoordinate: this.state.destinationCoordinate || null,
      destinationCoordinate: this.state.originCoordinate || null

    }))

    // Swap redux
  }

  setTextInputAsCurrentLocationOK(coordinate) {
    console.log(coordinate)
    var coords = coordinate.coords

    if(this.state.isShowSearchLocationOriginResult)
      //Set text input origin
      this.setLocationTextInputOrigin("Vị trí hiện tại", {
        latitude: coords.latitude,
        longitude: coords.longitude
      })

      else
      //set text input destination
      this.setLocationTextInputDestination("Vị trí hiện tại",  {
        latitude: coords.latitude,
        longitude: coords.longitude
      })
    }

  //Round button
  setTextInputAsCurrentPostion() {
    // if(!this.props.curLocation) {
      if(true) {
      navigator.geolocation.getCurrentPosition((position) => {
         // OK

         this.setTextInputAsCurrentLocationOK({coords : {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
         }})
      }, () => {
        errorHelper.showGpsError()
      })
    } else {
      this.setTextInputAsCurrentLocationOK(this.props.curLocation)
    }
  }

  setTextInputAsPickerPosition() {
    RNGooglePlaces.openPlacePickerModal()
    .then((place) => {

      //Extract data using es6 destructor
      let {
        latitude,
        longitude,
      } = place

      if(this.state.isShowSearchLocationOriginResult)
      //Set text input origin
      this.setLocationTextInputOrigin(place.address, {
        latitude,
        longitude,
      })

      else
      //set text input destination
      this.setLocationTextInputDestination(place.address,  {
        latitude,
        longitude,
      })


    })
    .catch(error => console.log(error.message))  // error is a Javascript Error object
  }

  render() {
    return (
      <View>
        <View style = {[
          primaryStyle.flexDirectionRow,
          primaryStyle.bgPrimary,
          primaryStyle.alignItemCenter]}>
          <RoundButton
          elavation = {0}
          size = {48}
          backgroundColor = "#3498db"
          onPress = {() => {
            this.props.navigation.goBack()
          }}>
            <Icon name="chevron-left" size={20} color="white" style = {style.iconLeft} />
          </RoundButton>

          <View style = {primaryStyle.container}>
            <TextInputWithClearButton
            label = "Từ"
            isActive = {this.state.isTextInptOriginActived}
            onChangeText = {(text) => {
              if(this.state.SearchLocationOriginResult)
                this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState, {
                  isTextInptOriginActived: false
                }))

                if(text !== '') {
                  this.textInputOrignOnChangeTextdebounced(text)
                }
            }}
            onFocus = {() => {
              this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState, {
                isShowSearchLocationOriginResult: true
              }))
            }}
            isFocusOnStart = {true}
            ref = {this.TextInputOrigin}
            onClear = {() => {
              this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState, {
                originCoordinate: null,
                TextInputOriginText: ''
              }))
            }}
            onBlur = {() => {
                  /**
                 * If coordinate have been set
                 * reset it text and active textinput when it going blue
                 */
                if(this.state.originCoordinate) {
                  this.TextInputOrigin.current.setText(this.state.TextInputOriginText)
                  this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState => {
                    isTextInptOriginActived: true
                  }))
                }
            }}>
            </TextInputWithClearButton>

            <View style = {style.seperator}></View>

            <TextInputWithClearButton
            label = "Tới"
            isActive = {this.state.isTextInptDestinationActived}
            onChangeText = {(text) => {
              if(this.state.SearchLocationDestinationResult)
              this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState, {
                isTextInptDestinationActived: false
              }))

              if(text !== '') {
                this.textInputDestinationOnChangeTextdebounced(text)
              }
            }}
            onFocus = {() => {
              this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState, {
                isShowSearchLocationOriginResult: false
              }))
            }}
            ref = {this.TextInputDestination}
            onClear = {() => {
              this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState, {
                destinationCoordinate: null,
                TextInputDestinationText: ''
              }))
            }}
            onBlur = {() => {
              if(this.state.destinationCoordinate) {
                this.TextInputOrigin.current.setText(this.state.TextInputOriginText)
                this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState, {
                  isTextInptDestinationActived: true
                }))
              }
            }}>
            </TextInputWithClearButton>

          </View>
          <RoundButton
          elavation = {0}
          size = {48}
          backgroundColor = "#3498db"
          onPress = {this.swapTextInput.bind(this)}>
            <MaterialIcon name="swap-vert" size={40} color="white" style = {style.iconRight} />
          </RoundButton>
        </View>
        <View>
        <ScrollView style = {primaryStyle.borderTop}>
          <ShadenTouchableHightLight
          backgroundColor = "#3498db"
          padding = {15}
          marginTop = {0}
          flexDirection = "row"
          onPress = {this.setTextInputAsCurrentPostion.bind(this)}>
            <View style = {primaryStyle.flexDirectionRow}>
              <MaterialIcon
                  name = "my-location"
                  size = {25}
                  style = {style.iconInsideBtn}
                  color = "white">
                </MaterialIcon>
              <Text style = {[style.btn, primaryStyle.textWhite]}>Sử dụng vị trí hiện tại của bạn</Text>
            </View>

          </ShadenTouchableHightLight>

          <ShadenTouchableHightLight
          backgroundColor = "#3498db"
          padding = {15}
          marginTop = {0}
          onPress = {this.setTextInputAsPickerPosition.bind(this)}>
          <View style = {primaryStyle.flexDirectionRow}>
              <MaterialIcon
                  name = "add-location"
                  size = {25}
                  style = {style.iconInsideBtn}
                  color = "white">
                </MaterialIcon>
              <Text style = {[style.btn, primaryStyle.textWhite]}>Chọn một điểm trên bản đồ</Text>
            </View>
          </ShadenTouchableHightLight>

          {this.state.isShowSearchLocationOriginResult &&
            this.ShowSearchLocationOriginResult()
          }

          {!this.state.isShowSearchLocationOriginResult &&
            this.ShowSearchLocationDestinationResult()
          }

        </ScrollView>
        </View>

      </View>
    )
  }
}


const style = StyleSheet.create({
  emptyText: {
    margin: 10,
    marginTop: 20,
    fontSize: 20,
  },

  btn: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  iconInsideBtn: {
    paddingLeft: 0,
    paddingRight: 10
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

  iconRight: {
    paddingLeft: 5,
    paddingRight: 0
  },

  icon: {
    paddingTop: 16,
    backgroundColor: 'red'
  },

  container: {
    flexDirection: 'row'
  },

  iconContainer: {
    alignContent: 'center',
    alignItems: 'center'
  },

  textInputContainer: {
    flex: 1
  }
})

export default connect(
  /** State requirer to read by container component */
  ({
    curLocation
  })=>(
    {curLocation}
  ),
  action
)(SearchRouteConfigScreen)

