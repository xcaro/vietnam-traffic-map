import {
  TextInput,
  Picker,
  View,
  Text,
  Button,
  Image
} from 'react-native'

import React, {
  Component
} from 'react'

import FAIcon from 'react-native-vector-icons/FontAwesome'

import { connect } from 'react-redux'
import appHelper from '../../helper/app'
import primaryStyles from '../../style/index'

import SearchLocationTextInput from '../../component/SearchLocationTextInput'

class ReportTrafficInfo extends Component {
  static navigationOptions = {
      title: `Thông tin báo cáo giao thông`,
  }

  render () {
    const trafficReport = this.props.navigation.getParam('trafficReport')
    return (
      <View style = {[primaryStyles.container, {
        justifyContent: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop = 20
      }]}>
      <View>
        <Text>Loại: {appHelper.trafficTypeToString(trafficReport.type)}</Text>
        <Text>Thời gian: {trafficReport.time}</Text>
        <Text>Mô tả: {trafficReport.comment}</Text>
        <Text>Trạng thái: {trafficReport.confirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</Text>
        <View style={{
          marginTop: 200,
        }}>
      </View>
        <Image
          borderRadius = {3}
          marginTop = {10}
          style={{width: 300, height: 300}}
          source={{uri: trafficReport.image}}
        />
        </View>
        {!trafficReport.image &&
        <View style = {[primaryStyles.container]}>
          <Image width = {300} height = {300} source = {{uri: trafficReport.image}} />
        </View>
        }
      </View>
    )
  }
}

export default connect(
  /** State requirer to read by container component */
  ({
    user
  })=>(
    {user}
  ),

  null
)(ReportTrafficInfo)