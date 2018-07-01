import {
  TextInput,
  StyleSheet,
  View,
  Text,
  ScrollView,
  WebView,
  Alert
} from 'react-native'

import React, {
  Component
} from 'react'

import {
  PRIMARY_COLOR
} from '../../style/index'
import primaryStyles from '../../style/index'
import {
  validateObject
} from '../../helper/validate'
import { connect } from 'react-redux'
import { TextField } from 'react-native-material-textfield'
import request from 'superagent'
import SearchLocationTextInput from '../../component/SearchLocationTextInput'
import ShadenTouchableHightLight from '../../component/ShadenTouchableHightLight'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import action from '../../redux/action'


class ChangeInfo extends Component {
  static navigationOptions = {
    title: 'Cập nhật thông tin',
  }

  constructor (props) {
    super(props)

    this.state = {
      data : null
    }

    this.props.showLoading()
    request.post('http://deltavn.net/api/me').set({
      'Authorization': `Bearer ${this.props.idToken}`
    }).then((res) => {
      this.state.data = res.body.data
      this.setState({
        data : {
          name: new validateObject('Tên', this.props.user.name),
          address: new validateObject('địa chỉ', this.props.user.address),
          phone: new validateObject('Số điện thoại', this.props.user.phone),
          email: new validateObject('Email', this.props.user.email),
        }
      })
    }).finally(() => {
      this.props.hideLoading()
    })
  }

  componentDidMount () {
    // Loading lấy data
  }

  updateInfo = () => {
    /**
     * Validate tất cả input
     */
    this.setState({
      name: this.state.data.name.startValidate().required(),
      address: this.state.data.address.startValidate().required(),
      phone: this.state.data.phone.startValidate().required().numeric().lengthMin(9),
    })

    let self = this
    if (
      self.state.data.name.isValid() &&
      self.state.data.address.isValid() &&
      self.state.data.phone.isValid()
    ) {
      this.props.showLoading()
      request.post('http://deltavn.net/api/user/change-info').set({
        'Authorization': `Bearer ${self.props.idToken}`
      }).send({
        name: self.state.data.name.val,
        address: self.state.data.address.val,
        phone: self.state.data.phone.val,
        username: self.props.user.username
      }).then(() => {
        request.post('http://deltavn.net/api/me').set({
          'Authorization': `Bearer ${self.props.idToken}`
        }).then((res) => {
          this.props.setUser(res.body.data)
        })
        Alert.alert('Thông báo', 'Cập nhật thông tin tài khoản thành công', [
          {
            text: "OK",
            onPress: () => {
              self.props.navigation.goBack()
            }
          }
        ])
      }).catch(res => {
        Alert.alert('Đã xảy ra lỗi khi cập nhập thông tin', JSON.stringify(res))
      }).finally(() => {
        this.props.hideLoading()
      })
    }
  }

  render () {
    return (
      <View>
        {this.state.data && <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle = {styles.contentContainer}>
        <TextField
            error = {this.state.data.name.error}
            label='Tên mới'
            title = 'Không được bỏ trống'
            value={this.state.data.name.val}
            onChangeText={ (name) => this.state.data.name.val = name }
          />

        <TextField
          error = {this.state.data.address.error}
          label='Địa chỉ mới'
          title = 'Không được bỏ trống'
          value={this.state.data.address.val}
          onChangeText={ (address) => this.state.data.address.val = address }
        />

        <TextField
            error = {this.state.data.phone.error}
            label='Số điện thoại mới'
            title = 'Không được bỏ trống'
            value={this.state.data.phone.val}
            onChangeText={ (phone) => this.state.data.phone.val = phone }
          />

          <ShadenTouchableHightLight
            onPress = {this.updateInfo}
            marginTop = {15}
            padding = {15}
            backgroundColor = {PRIMARY_COLOR}
            flexDirection = 'row'>
              <FAIcon
                name = "edit"
                size = {15}
                color = 'white'
                style = {primaryStyles.Icon}
              />
              <Text style = {primaryStyles.textWhite}>Cập nhật thông tin</Text>
          </ShadenTouchableHightLight>
        </ScrollView>}
      </View>
    )
  }
}

export default connect(
  /** State requirer to read by container component */
  (data)=>data,
  action
)(ChangeInfo)

const styles = StyleSheet.create({
  contentContainer: {
    margin: 20,
    marginTop: 0,
    justifyContent: 'center',
  },

  mt: {
    marginTop: 10
  },
})