import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import SearchLocationTextInput from '../../component/SearchLocationTextInput'
import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor'
import ShadenTouchableHightLight from '../../component/ShadenTouchableHightLight'
import RNGooglePlaces from 'react-native-google-places';
import { TextField } from 'react-native-material-textfield'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import request from 'superagent'

import primaryStyles from '../../style/index'
import { connect } from 'react-redux'
import action from '../../redux/action'

import {
  StackNavigator
} from 'react-navigation'

import {
  validateObject
} from '../../helper/validate'

import ClinicInfo from '../../component/ClinicInfo'
import Doctors from '../../component/Doctors'

const UserInfoStack = StackNavigator({
  ClinicInfo: {
    screen: ClinicInfo
  },
  Doctors:{
    screen: Doctors
  }
}, {
  initialRouteName: 'ClinicInfo',
  navigationOptions: {
    header: null,
  }
})

class CreateClinic extends Component {
  static navigationOptions = {
    header: null,
    drawerIcon: ({ tintColor }) => (
      <FAIcon
        name = "user"
        size = {25}
        color = {tintColor}
      />
    ),
  }

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      data: {
        name: new validateObject('Tên phòng khám', ''),
        latitude: 0,
        longitude: 0,
        address: '',
        type: 1,
        description: '',
        doctors: [],
        ward: '',
        district: '',
        place_id: ''
      }
    }
  }

  render() {
    let self = this
    return (
      <View style={styles.container}>
        <SearchLocationTextInput
          navigation = {this.props.navigation}
          isShowMenuButton = {true}
          editable = {false}
          text = 'Tạo phòng khám'>
        </SearchLocationTextInput>
        {this.state.step === 0 && <ClinicInfo
          submitText="Bước tiếp theo"
          submitCallBack={(data)=>{
            let newData = {...data}
            newData.name = newData.name.val
            self.setState((state) => ({
              data: newData,
              step: state.step + 1
            }))
          }}
          initData={this.state.data}
          ParentProps = {this.props} />}
        {this.state.step === 1 && <Doctors
          backCallBack={()=>{
            self.setState((state) => ({
              step: state.step - 1
            }))
          }}
          isShowBack={true}
          submitText="Tạo phòng khám"
          submitCallBack={(doctors)=>{
              // Tạo object mới
              let pushData = {...this.state.data}

              // Gán doctor + format
              pushData.doctors = doctors

              // Lấy ward + district
              request.get('https://maps.googleapis.com/maps/api/geocode/json')
                .query({key: 'AIzaSyA6jVBqVLTXFpNsxmEKx8HTFEIwmiq0usQ'})
                .query({latlng: `${pushData.latitude}, ${pushData.longitude}`})
                .then((res) => {
                  let geocode = res.body.results.filter(result => {
                    return result.types.indexOf('street_address') !== -1
                  })[0]

                  // Find ward and district
                  pushData.ward = geocode.address_components.filter(addresscomponent => {
                    return addresscomponent.types.indexOf('administrative_area_level_3') !== -1
                  })[0].long_name

                  pushData.district = geocode.address_components.filter(addresscomponent => {
                    return addresscomponent.types.indexOf('administrative_area_level_2') !== -1
                  })[0].long_name

                  console.log(JSON.stringify(pushData), self.props.idToken)

                  request.post('http://deltavn.net/api/clinic').send(pushData).set({
                    'Authorization': `Bearer ${self.props.idToken}`
                  }).then(() => {
                    alert('Tạo phòng khám thánh công, Nhân viên của chúng tôi sẽ liên hệ xác nhận phòng khám của bạn trong 24h')
                    this.props.navigation.navigate('Map')
                  })
                })
          }}
          initData={[]}
          ParentProps = {this.props} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  richText: {
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

export default connect(
  /** State requirer to read by container component */
  (data)=>data,
  action
)(CreateClinic)