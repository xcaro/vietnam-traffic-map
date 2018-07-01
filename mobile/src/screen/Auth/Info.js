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

class UserInfo extends Component {
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


  constructor (props) {
    super(props)
    this.state = {
      user: null
    }

  }

  componentDidMount () {
    this.props.showLoading()
    request.post('http://deltavn.net/api/me').set({
      'Authorization': `Bearer ${this.props.idToken}`
    }).then((res) => {
      this.setState({
        user: res.body.data
      })
      this.state.data = res.body.data
    }).finally(() => {
      this.props.hideLoading()
    })
  }

  render () {
    return (
      <View>
        <SearchLocationTextInput
          navigation = {this.props.navigation}
          isShowMenuButton = {true}
          editable = {false}
          text = 'Tài khoản'>
        </SearchLocationTextInput>
        {this.state.user &&
        <View style = {{
          margin: 20
        }}>
          <Text>Họ tên: {this.props.user.name}</Text>
          <Text>Tên đăng nhập: {this.props.user.username}</Text>
          <Text>Địa chỉ: {this.props.user.address}</Text>
          <Text>Số điện thoại: {this.props.user.phone}</Text>
          <Text>Quyền: {this.props.user.role.title}</Text>

          <ShadenTouchableHightLight
            onPress = {() => {
              this.props.navigation.navigate('ChangePassword')
            }}
            marginTop = {20}
            padding = {15}
            backgroundColor = {PRIMARY_COLOR}
            flexDirection = 'row'>
              <FAIcon
                name = "key"
                size = {15}
                color ='white'
                style = {primaryStyles.Icon}
              />
              <Text style = {primaryStyles.textWhite}>Đổi mật khẩu</Text>
          </ShadenTouchableHightLight>
          <ShadenTouchableHightLight
            onPress = {() => {
              this.props.navigation.navigate('ChangeInfo')
            }}
            marginTop = {20}
            padding = {15}
            backgroundColor = {PRIMARY_COLOR}
            flexDirection = 'row'>
              <FAIcon
                name = "edit"
                size = {15}
                color = 'white'
                style = {primaryStyles.Icon}
              />
              <Text style = {primaryStyles.textWhite}>Đổi thông tin tài khoản</Text>
          </ShadenTouchableHightLight>
        </View>}
      </View>
    )
  }
}

export default connect(
  /** State requirer to read by container component */
  (data)=>data,
  action
)(UserInfo)

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