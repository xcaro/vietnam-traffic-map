import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor'
import ShadenTouchableHightLight from './ShadenTouchableHightLight'
import RNGooglePlaces from 'react-native-google-places';
import { TextField } from 'react-native-material-textfield'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import primaryStyles, { PRIMARY_COLOR } from '../style/index'
import { Dropdown } from 'react-native-material-dropdown'
import request from 'superagent'
import { validateObject } from '../helper/validate';

export default class ClinicInfo extends Component {

  constructor(props) {
    super(props);

    this.state = Object.assign({}, {data: props.initData}, {
      clinicType: [],
      locationError: ''
    })

    // Convert lại thành validate Object...

    if (typeof this.state.data.name !== 'object') {
      this.state.data.name = new validateObject('Tên phòng khám', this.state.data.name)
    }
  }

  componentDidMount () {
    this.props.ParentProps.showLoading()
    request.get('http://deltavn.net/api/clinic-type').set({
      'Authorization': `Bearer ${this.props.ParentProps.idToken}`
    }).then((res) => {
      this.setState({
        clinicType: res.body.data
      })
    }).finally(() => {
      this.props.ParentProps.hideLoading()
    })
  }

  async submit () {
    // Validate tên
    let newData = Object.assign({}, this.state.data)
    newData.name.startValidate().required()
    this.setState({
      data: newData
    })

    // Validate địa chỉ
    if (this.state.data.longitude === 0) {
      this.setState({
        locationError: 'Địa chỉ không được bỏ trống'
      })
    } else if (!this.state.locationError) {
      this.setState({
        locationError: ''
      })
    }

    if (
      this.state.data.name.isValid() &&
      this.state.data.longitude !== 0 &&
      this.state.data.latitude !== 0
    ) {
      this.state.data.description = await this.richtext.getContentHtml()
      this.props.submitCallBack(this.state.data)
    }
  }

  render() {
    return (
        <ScrollView style={{
          width: '100%',
          flex: 1,
          padding: 20,
          paddingTop: 0
        }}>
          <TextField
              error={this.state.data.name.error}
              value={this.state.data.name.val}
              onChangeText={(text)=>{
                let newData = Object.assign({}, this.state.data)
                newData.name.val = text
                this.setState({
                  data: newData
                })
              }}
              label='Tên phòng khám'
              title = 'Không được bỏ trống'
          />

          <Dropdown
            value={this.state.data.type}
            valueExtractor={({ id }) => id}
            labelExtractor={({ name }) => name}
            title = 'nhấn để chọn'
            label='Loại phòng khám'
            data={this.state.clinicType}
          />

          <TextField
              value={this.state.data.address}
              error={this.state.locationError}
              ref={(r) => this.locationTextInput = r}
              label='Vị trí phòng khám'
              title = 'Không được bỏ trống'
              onFocus={()=>{
                RNGooglePlaces.openAutocompleteModal({
                  type: 'address',
                  country: 'VN'
                })
                  .then((place) => {
                    if(place.types && place.types.indexOf('street_address') !== -1) {
                      let newData = Object.assign({}, this.state.data)
                      newData.longitude = place.longitude
                      newData.latitude = place.latitude
                      newData.address = place.address
                      this.setState({
                        data: newData
                      })
                      this.setState({
                        locationError: ''
                      })
                    } else {
                      let newData = Object.assign({}, this.state.data)
                      newData.longitude = 0
                      newData.latitude = 0
                      newData.address = ''
                      this.setState({
                        locationError: 'Địa chỉ phải có đầy đủ quận, huyện, số địa chỉ',
                      })
                    }
                  })
                  .finally(() => {
                    this.locationTextInput.blur()
                  })
              }}
          />
          <View style={{
            height: 170,
            marginTop: 30,
            borderColor: '#e5e5e5',
            borderRadius: 1,
            borderWidth: 1,
            borderBottomWidth: 0,
            paddingTop: 15
          }}>
          <RichTextEditor
              initialContentHTML={this.state.data.description}
              ref={(r)=>{
                this.richtext = r
              }}
              style={styles.richText}
              initialTitleHTML={'Mô tả phòng khám'}
              editorInitializedCallback={() => {
                this.richtext.setTitleFocusHandler(() => {
                  this.richtext.focusContent()
                });
              }}
          />
          </View>
          <RichTextToolbar
            onPressAddImage={()=> {
              ImagePicker.showImagePicker({
                includeBase64: true,
                compressImageQuality: 0.5
              }, (image) => {
                if (image.data) {
                  let imageSrc = `data:${image.mime};base64,${image.data}`
                  this.richtext.insertImage({ src: imageSrc })
                }
              })
            }}
            selectedButtonStyle={{
              backgroundColor: 'white'
            }}
            getEditor={() => this.richtext}
          />

          <ShadenTouchableHightLight
            onPress = {this.submit.bind(this)}
            marginTop = {30}
            marginBottom = {30}
            padding = {15}
            backgroundColor = {PRIMARY_COLOR}
            flexDirection = 'row'>
              <FAIcon
                name = "edit"
                size = {15}
                color = 'white'
                style = {primaryStyles.Icon}
              />
              <Text style = {primaryStyles.textWhite}>{this.props.submitText}</Text>
          </ShadenTouchableHightLight>

        </ScrollView>
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
