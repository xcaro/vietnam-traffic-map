import {
  StyleSheet,
  View,
  Text,
  TouchableNativeFeedback,
  Image,

} from 'react-native'

import React, {
  Component
} from 'react'

import FAIcon from 'react-native-vector-icons/FontAwesome'

import { connect } from 'react-redux'
import appHelper from '../../helper/app'
import primaryStyles from '../../style/index'

import SearchLocationTextInput from '../../component/SearchLocationTextInput'
import ShadenTouchableHightLight from '../../component/ShadenTouchableHightLight'

class ReportTrafficInfo extends Component {
  static navigationOptions = {
      title: `Thông tin báo cáo giao thông`,
  }

  render () {
    const trafficReport = this.props.navigation.getParam('trafficReport')
    return (
      <View style = {[styles.topContainer, styles.mt]}>
      <View>
        <Text>Loại: {appHelper.trafficTypeToString(trafficReport.type)}</Text>
        <Text>Thời gian: {trafficReport.time}</Text>
        <Text>Mô tả: {trafficReport.comment}</Text>
        <Text>Trạng thái: {trafficReport.confirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</Text>

        <Image
          borderRadius = {3}
          style={[styles.img, styles.mt]}
          source={{uri: trafficReport.image}}
        />

        <View style = {[styles.btnContainer, styles.mt]}>
          {!trafficReport.confirmed && <ShadenTouchableHightLight
            onPress = {() => {
              alert('test')
            }}
            padding = {15}
            marginRight = {10}
            backgroundColor = "#3498db"
            flexDirection = "row">
            <FAIcon name = "thumbs-up" size = {20} color = "white" style = {primaryStyles.Icon} />
            <Text style = {primaryStyles.textWhite}>Xác nhận</Text>
          </ShadenTouchableHightLight>}

          {trafficReport.confirmed && <ShadenTouchableHightLight
            onPress = {() => {
              alert('test')
            }}
            padding = {15}
            marginRight = {10}
            backgroundColor = "#3498db"
            flexDirection = "row">
            <FAIcon name = "thumbs-down" size = {20} color = "white" style = {primaryStyles.Icon} />
            <Text style = {primaryStyles.textWhite}>Hủy xác nhận</Text>
          </ShadenTouchableHightLight>}

          <ShadenTouchableHightLight
            onPress = {() => {
              alert('test')
            }}
            padding = {15}
            backgroundColor = "#3498db"
            flexDirection = "row">
            <FAIcon name = "trash" size = {20} color = "white" style = {primaryStyles.Icon} />
            <Text style = {primaryStyles.textWhite}>Đã kết thúc</Text>
          </ShadenTouchableHightLight>
        </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topContainer : {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  mt: {
    marginTop: 20
  },

  img : {width: 300, height: 300},

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  }
})

export default connect(
  /** State requirer to read by container component */
  ({
    user
  })=>(
    {user}
  ),

  null
)(ReportTrafficInfo)