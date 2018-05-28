import React ,{
  Component
} from 'react';

import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView
} from 'react-native'

import ShadenTouchableHightLight from '../component/ShadenTouchableHightLight'
import FormData, {getHeaders} from 'form-data';
import Icon from 'react-native-vector-icons/FontAwesome'
import primaryStyles from '../style/index'
import ImagePicker from 'react-native-image-picker'
import reportTrafficType from '../helper/enum'
import RoundButton from '../component/RoundButton'
import action from '../redux/action'
import appHelper from '../helper/app'
import axious from 'axios'
import { connect } from 'react-redux'

class ReportTrafficScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const {state} = navigation;
    return {
      //title: `Báo cáo ${state.params.reportTrafficType}`,
    };
  };

  constructor(props) {
    super()
    this.state = {
      description: '',
      images: [],
      height: 0
    }
  }


  render() {
    return (
    <ScrollView style = {styles.topContainer}>
      <View style = {primaryStyles.flexDirectionRow}>
        <Icon style = {primaryStyles.Icon} name="file-image-o" size={20}/>
        <Text style = {styles.title}>Hình ảnh :</Text>
      </View>
          <ShadenTouchableHightLight
            onPress = {() => {

            }}
            flexDirection = "row"
            onPress={() => {
              ImagePicker.showImagePicker(imagePickerOptions, (response) => {
                if (response.data) {
                  if (this.state.images.includes(response.uri)) {
                    Alert.alert(
                      'Đã xảy ra lỗi',
                      'Hình ảnh này đã tồn tại rồi, Vui lòng chọn hình ảnh khác !',
                      [
                        {text: 'OK'}
                      ])
                    return;
                  }
                  this.setState({images: [...this.state.images,response.uri ]})
                }
              });
            }}

            backgroundColor = "#03A9F4"
            padding = {13}
            marginTop = {15}>
              <Icon style = {primaryStyles.Icon} name="plus-circle" size={20} color = "white" />
              <Text style = {styles.buttonText}>Thêm hình ảnh</Text>
          </ShadenTouchableHightLight>
      <View style = {styles.imgContainer}>
          {this.state.images.map(image => {
              return (
                <Image
                  key = {image}
                  source={{uri: image}}
                  style={{width: 125, height: 125}}
                />
              )
            })
          }
      </View>

      <View style = {primaryStyles.flexDirectionRow}>
        <Icon style = {primaryStyles.Icon} name="pencil-square" size={20}/>
        <Text style = {styles.title}>Mô tả :</Text>
      </View>

        <TextInput
        underlineColorAndroid = "#1565C0"
        style = {styles.textInput}
        returnKeyLabel = "next"
        multiline={true}
        onChangeText={(description) => {
            this.setState({ description })
        }}
        onContentSizeChange={(event) => {
            this.setState({ height: event.nativeEvent.contentSize.height })
        }}
        style={[styles.default, {height: Math.max(35, this.state.height)}]}
        value={this.state.text}
      />

        <ShadenTouchableHightLight
          onPress = {() => {

            appHelper.getCurrentLocation(this.props, false).then((curLocation) => {
            /**
             * Form require data
             */
              let origin_lat = curLocation.coords.latitude
              let origin_lng = curLocation.coords.longitude
              let reportTrafficType = this.props.navigation.getParam(reportTrafficType, 'test')
              /**
               * Push this to server
               * Remember to server
               */
              let pushMe = new FormData()

              pushMe.append('location', {
                lat: origin_lat,
                lng: origin_lng
              })
              pushMe.append('reportTrafficType', reportTrafficType)
              pushMe.append('description', this.state.description)

              let i = 0
              for (image of this.state.images) {
                pushMe.append('images', {
                  uri: image,
                  name: `selfie${i}.jpg`,
                  type: 'image/jpg'
                })
                i++;
              }

              axious.post(
                'http://192.168.1.4:3000/trafficReport',
                pushMe
              )
                .then((res) => {
                  Alert.alert('Thông báo' ,`Báo cáo ${reportTrafficType} thành công`)
              }).catch((err) => {
                /**
                 * should be https url otherwise it keep throw : network err
                 */
                if(err.request._response !== "Unrecognized FormData part.") {
                  Alert.alert('Đã xảy ra lỗi','Không thể kết nối tới server')
                } else {
                  Alert.alert('Thông báo' ,`Báo cáo ${reportTrafficType} thành công`)
                }
              })
            })
          }}
          flexDirection = "row"
          backgroundColor = "#03A9F4"
          padding = {15}
          marginTop = {15}>
            <Icon style = {primaryStyles.Icon} name="paper-plane" size={20} color = "white" />
            <Text style = {styles.buttonText}>Gửi báo cáo</Text>
        </ShadenTouchableHightLight>
    </ScrollView>
    )
  }
}

const imagePickerOptions = {
  title: 'Chọn hình ảnh',
  takePhotoButtonTitle: 'Chụp hình',
  chooseFromLibraryButtonTitle: 'Chọn hình từ thư viện ảnh',
  mediaType: 'photo',
  permissionDenied: {
    title: 'Không có quyền truy cập camera và thư viện',
    text: 'Vui lòng cấp quyền để sử dụng chức năng này',
    reTryTitle: 'Thử lại',
    okTitle: 'Hủy',
  },
  cancelButtonTitle: 'Hủy bỏ',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

const styles = StyleSheet.create({
  submitButton: {
    marginTop: 20,
    flex: 0
  },

  pickImage: {
    margin: 20
  },

  imgContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 15
  },

  textInput: {
    height: 50,
    fontSize: 18,
  },

  topContainer: {
    flex: 1,
    margin: 20
  },

  buttonText: {
    fontSize: 18,
    color: 'white'
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
})

export default connect(
  /** State requirer to read by container component */
  ({
    curLocation, selectedSearchLocationItem
  })=>(
    {curLocation, selectedSearchLocationItem}
  ),

  action
)(ReportTrafficScreen)

