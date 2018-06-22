import {
  StyleSheet,
  View,
  Text,
  TouchableNativeFeedback,
  Image,
  Alert
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
import request from 'superagent';

class ReportTrafficInfo extends Component {
  static navigationOptions = {
      title: `Thông tin báo cáo giao thông`,
  }

  render () {
    const trafficReport = this.props.navigation.getParam('trafficReport')
    const reportType = appHelper.trafficTypeFromTypeID(this.props.reportTypes, trafficReport.type_id)
    return (
      <View style = {[styles.topContainer, styles.mt]}>
        <View>
          <Text>Loại: {reportType.name}</Text>
          <Text>Thời gian: {trafficReport.created_at}</Text>
          <Text>Mô tả: {trafficReport.comment || 'Không có'}</Text>
          <Text>Trạng thái: {trafficReport.confirm ? 'Đã xác nhận' : 'Chưa xác nhận'}</Text>

          {this.props.idToken && <View style = {[styles.btnContainer, styles.mt]}>
            {!trafficReport.confirm ? <ShadenTouchableHightLight
              onPress = {() => {
                request.put(`http://deltavn.net/api/report/${trafficReport.id}/confirm`).set({
                  'Authorization': `Bearer ${this.props.idToken}`
                }).then(() => {
                  this.props.navigation.goBack()
                })

              }}
              padding = {15}
              marginRight = {10}
              backgroundColor = "#3498db"
              flexDirection = "row">
              <FAIcon name = "thumbs-up" size = {20} color = "white" style = {primaryStyles.Icon} />
              <Text style = {primaryStyles.textWhite}>Xác nhận</Text>
            </ShadenTouchableHightLight> : <ShadenTouchableHightLight
              onPress = {() => {
                request.put(`http://deltavn.net/api/report/${trafficReport.id}/unconfirm`).set({
                  'Authorization': `Bearer ${this.props.idToken}`
                }).then(() => {
                  this.props.navigation.goBack()
                }).catch(err => {
                  var a = err
                  debugger
                })

              }}
              padding = {15}
              marginRight = {10}
              backgroundColor = "#3498db"
              flexDirection = "row">
              <FAIcon name = "thumbs-up" size = {20} color = "white" style = {primaryStyles.Icon} />
              <Text style = {primaryStyles.textWhite}>Hủy xác nhận</Text>
            </ShadenTouchableHightLight>}

            <ShadenTouchableHightLight
              onPress = {() => {
                Alert.alert('Thông báo', 'Bạn có muốn hủy báo cáo này không', [
                  {
                    text: 'Có',
                    onPress: () => {
                      request.delete(`http://deltavn.net/api/report/${trafficReport.id}`).set({
                        'Authorization': `Bearer ${this.props.idToken}`
                      }).then(() => {
                        this.props.navigation.goBack()
                      })
                    }
                  },
                  {
                    text: 'Không'
                  }
                ])
              }}
              padding = {15}
              backgroundColor = "#3498db"
              flexDirection = "row">
              <FAIcon name = "trash" size = {20} color = "white" style = {primaryStyles.Icon} />
              <Text style = {primaryStyles.textWhite}>Đã kết thúc</Text>
            </ShadenTouchableHightLight>
          </View>}
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
    idToken, reportTypes
  })=>(
    {idToken, reportTypes}
  ),

  null
)(ReportTrafficInfo)