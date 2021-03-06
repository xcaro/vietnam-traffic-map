import React ,{
  Component
} from 'react'

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

import {
  NavigationActions
} from 'react-navigation'

import ShadenTouchableHightLight from '../../component/ShadenTouchableHightLight'
import FormData, {getHeaders} from 'form-data'
import Icon from 'react-native-vector-icons/FontAwesome'
import primaryStyles from '../../style/index'
import ImagePicker from 'react-native-image-picker'
import RoundButton from '../../component/RoundButton'
import action from '../../redux/action'
import appHelper from '../../helper/app'
import request from 'superagent'
import { connect } from 'react-redux'

class ReportTrafficScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const {state} = navigation
    return {
      title: `Báo cáo ${state.params.reportType.name}`,
    }
  }

  constructor(props) {
    super()
    this.state = {
      comment: '',
      image: null,
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
                  this.setState({image: response.uri})
                }
              })
            }}

            backgroundColor = "#03A9F4"
            padding = {13}
            marginTop = {15}>
              <Icon style = {primaryStyles.Icon} name="plus-circle" size={20} color = "white" />
              <Text style = {styles.buttonText}>Thay đổi hình ảnh</Text>
          </ShadenTouchableHightLight>
      <View style = {styles.imgContainer}>
          { this.state.image &&
            <Image
              source={{uri: this.state.image}}
              style={{width: 300, height: 300}}
            />
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
        onChangeText={(comment) => {
            this.setState({ comment })
        }}
        onContentSizeChange={(event) => {
            this.setState({ height: event.nativeEvent.contentSize.height })
        }}
        style={[styles.default, {height: Math.max(35, this.state.height)}]}
        value={this.state.text}
      />

        <ShadenTouchableHightLight
          onPress = {() => {
            appHelper.getCurrentLocation(this.props).then(async (curLocation) => {
            /**
             * Form require data
             */
              let origin_lat = curLocation.coords.latitude
              let origin_lng = curLocation.coords.longitude
              let reportType = this.props.navigation.getParam('reportType')
              /**
               * Push this to server
               * Remember to server
               */
              let pushMe = new FormData()

              pushMe.append('latitude', origin_lat)
              pushMe.append('longitude', origin_lng)
              pushMe.append('type', reportType.id)
              pushMe.append('comment', this.state.comment)

              // Gửi hình sau

              pushMe.append('image', {
                uri: this.state.images,
                name: `selfie.jpg`,
                type: 'image/jpg'
              })

              // lấy ra ward + district
              let res = await request.get('https://maps.googleapis.com/maps/api/geocode/json')
                .query({key: 'AIzaSyA6jVBqVLTXFpNsxmEKx8HTFEIwmiq0usQ'})
                .query({latlng: `${origin_lat}, ${origin_lng}`})

              let geocode = res.body.results.filter(result => {
                return result.types.indexOf('street_address') !== -1
              })[0]

              // Find ward and district
              let ward = geocode.address_components.filter(addresscomponent => {
                return addresscomponent.types.indexOf('administrative_area_level_3') !== -1
              })[0].long_name

              let district = geocode.address_components.filter(addresscomponent => {
                return addresscomponent.types.indexOf('administrative_area_level_2') !== -1
              })[0].long_name


              request.post(
                'http://deltavn.net/api/report'
              )
                .attach('image', this.state.image)
                .field({ward})
                .field({district})
                .field('latitude', origin_lat)
                .field('longitude', origin_lng)
                .field('type', reportType.id)
                .field('comment', this.state.comment)
                .then((res) => {
                  Alert.alert('Thông báo' ,`Báo cáo ${reportType.name} thành công`)
                  this.props.navigation.dispatch(NavigationActions.pop({
                    n: 2
                  }))
                  this.props.navigation.navigate('Home')
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
}

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
    justifyContent: 'center',
    padding: 10,
    marginBottom: 20,
    marginTop: 15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, .25)',
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

