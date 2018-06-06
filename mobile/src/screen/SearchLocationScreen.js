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
  TouchableWithoutFeedback
} from 'react-native'

import { connect } from 'react-redux'
import action from '../redux/action'


import primaryStyle from '../style/index'
import SearchLocationTextInput from '../component/SearchLocationTextInput'
import SearchLocationListView from '../component/SearchLocationListView'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import objectHelper from '../helper/object'
import {getMarker} from '../helper/marker'
import googleAPI from '../helper/google'

class SearchLocationScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isShowSearchLocationResult: false,
      SearchLocationResult: []
    }

    var debounce = require('debounce')
    this.textInputOnChangeTextdebounced = debounce((text) => {
      googleAPI.autoCompletePlace(text)
      .then(({data}) => {
        this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState,{
          SearchLocationResult: googleAPI.formatAutoCompletePlaceResult(data)
        }))


        // ^ prevent dupplicate setstate, type first time it's already show, type 2nd time
        // shouldn't rerender to app
        if(this.state.isShowSearchLocationResult === false)
          this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState,{
            isShowSearchLocationResult: true
          }))
      })
    }, 350)
  }

  textInputOnChangeText(text) {
    if(text === '') {
      this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState,{
        isShowSearchLocationResult: false
      }))
    } else if (text !== '') {
            /**
       * Use google api for search for location map
       * With debounce of course
       */
      this.textInputOnChangeTextdebounced(text)
    }
  }



  static navigationOptions = {
    header: null
  }

  SearchLocationItemOnSelected(place_id) {
    // place id too details
    googleAPI.placeIdToDetail(place_id).then(({data}) => {
      this.props.setSelectedSearchLocationItem({
        place_id,
        data,
        markerImage: getMarker()
      })
    })

    this.props.navigation.goBack()
  }

  render() {
    return (
      <View style = {primaryStyle.container}>
        <SearchLocationTextInput
          onChangeText = {this.textInputOnChangeText.bind(this)}
          navigation = {this.props.navigation}
          editable = {true}
          isFocusOnStart = {true}
          isShowBackButton = {true}>
        </SearchLocationTextInput>

        {this.state.isShowSearchLocationResult &&
          <SearchLocationListView
          title = "Kết quả tìm kiếm"
          data = {this.state.SearchLocationResult}
          onSelected = {this.SearchLocationItemOnSelected.bind(this)}>
          </SearchLocationListView>
        }

        {!this.state.isShowSearchLocationResult &&
        <View style = {style.container} >
          <View style = {[primaryStyle.flexDirectionRow, style.tittleContainer]}>
            <MaterialIcon
            name = "info"
            size = {25}
            >

            </MaterialIcon>
            <Text style = {style.title}>Gõ để bắt đầu tìm kiếm địa điểm</Text>
          </View>
          <Text  style = {style.subTitle}>Không có dữ liệu để hiển thị</Text>
        </View>
        }
      </View>
    )
  }
}

const style = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5,
    textAlign: 'center'
  },

  tittleContainer: {
    marginLeft: 10,
    marginTop: 25
  },

  subTitle: {
    fontSize: 20,
    marginLeft: 15,
    textAlign: 'center'
  },

  container: {
    justifyContent: 'center'
  }
})

export default connect(
  /** State requirer to read by container component */
  ()=> ({}),
  action
)(SearchLocationScreen)