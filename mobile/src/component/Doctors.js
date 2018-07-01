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
import {
  validateObject
} from '../helper/validate';

export default class Doctor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      doctors: this.props.initData
    }
  }

  async submit () {
    // Validate hàng loạt tên bác sĩ
    let doctors = [...this.state.doctors]
    for (doctor of doctors) {
      doctor.name.startValidate().required()
    }
    this.setState({doctors})

    // Check validate hàng loạt
    let isValid = true
    for (doctor of doctors) {
      if (!doctor.name.isValid()) {
        isValid = false
        break
      }
    }

    // Validate push dữ liệu lên server
    if (
      isValid
    ) {
      this.props.submitCallBack(this.state.doctors)
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
          <ShadenTouchableHightLight
            onPress = {() => {
              this.setState((state) => ({
                doctors: [...state.doctors, {
                  title: 0,
                  name: new validateObject('Tên bác sĩ', ''),
                  description: ''
                }]
              }))
            }}
            marginTop = {15}
            padding = {15}
            backgroundColor = {PRIMARY_COLOR}
            flexDirection = 'row'>
              <FAIcon
                name = "plus-square"
                size = {15}
                color = 'white'
                style = {primaryStyles.Icon}
              />
              <Text style = {primaryStyles.textWhite}>Thêm bác sĩ</Text>
          </ShadenTouchableHightLight>

          {this.state.doctors.length === 0 && <View style={primaryStyles.seperator}></View>}

          <View>
            {this.state.doctors.map((doctor, index) => {
              return (
              <View key = {index} style={{
                borderWidth: 1,
                borderTopWidth: 0,
                borderColor: 'rgba(0,0,0,.1)',
                padding: 20,
                paddingTop: 0
              }}>
                <TextField
                  error={doctor.name.error}
                  label='Tên bác sĩ'
                  value={doctor.name.val}
                  onChangeText={(text)=>{
                    let doctors = [...this.state.doctors]
                    doctors[index].name.val = text
                    this.setState({
                      doctors
                    })
                  }}
                />
                 <Dropdown
                  value={doctor.title}
                  labelExtractor={({name})=>name}
                  valueExtractor={({id})=>id}
                  title = 'nhấn để chọn'
                  label='Học vị'
                  data={[
                    {name: 'Tiến sĩ', id: 0},
                    {name: 'Thạc sĩ', id: 1},
                    {name: 'Phó giáo sư', id: 2},
                    {name: 'Giáo sư', id: 3}
                  ]}
                />
                <TextField
                  numberOfLines={4}
                  multiline={true}
                  label='Mô tả bác sĩ'
                  value={doctor.description}
                />

                <ShadenTouchableHightLight
                  onPress = {() => {
                    let doctors = [this.state.doctors]
                    doctors.splice(index, 1)
                    this.setState({
                      doctors
                    })
                  }}
                  marginTop = {15}
                  padding = {15}
                  backgroundColor = '#F44336'
                  flexDirection = 'row'>
                    <FAIcon
                      name = "trash"
                      size = {15}
                      color = 'white'
                      style = {primaryStyles.Icon}
                    />
                    <Text style = {primaryStyles.textWhite}>Xóa</Text>
                </ShadenTouchableHightLight>
              </View>
              )
            })}
          </View>

          {this.props.isShowBack && <ShadenTouchableHightLight
            onPress = {this.props.backCallBack}
            marginTop = {30}
            padding = {15}
            backgroundColor = {PRIMARY_COLOR}
            flexDirection = 'row'>
              <FAIcon
                name = "undo"
                size = {15}
                color = 'white'
                style = {primaryStyles.Icon}
              />
              <Text style = {primaryStyles.textWhite}>Quay lại</Text>
          </ShadenTouchableHightLight>}

          <ShadenTouchableHightLight
            onPress = {this.submit.bind(this)}
            marginTop = {15}
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
