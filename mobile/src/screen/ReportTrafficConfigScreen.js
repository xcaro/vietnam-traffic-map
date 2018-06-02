import React ,{
    Component
  } from 'react'

  import {
    View,
    Image,
    Text,
    StyleSheet
  } from 'react-native'

  import ShadenTouchableHightLight from '../component/ShadenTouchableHightLight'
  import {reportTrafficType} from '../helper/enum'
  import RoundButton from '../component/RoundButton'
  import primaryStyle from '../style/index'

  export default class ReportTrafficConfigScreen extends Component {
    static navigationOptions = {
      title: 'Báo cáo tình trạng giao thông',
    }

    render() {
      return (
      <View style = {style.topContainer}>
        <View style = {style.container}>
          <ShadenTouchableHightLight
          flex = {1}
          isContentCenter  = {true}
          onPress = {() => {
            this.props.navigation.navigate('ReportTraffic', {
              reportTrafficType: reportTrafficType.TrafficJam
            })
          }}>
            <View style = {style.img}>
              <Image  source = {require('../assets/traffic_menu/trafficJam.png')}></Image>
            </View>
            <Text style = {style.text}>Tắc đường</Text>
          </ShadenTouchableHightLight>

          <ShadenTouchableHightLight
          flex = {1}
          isContentCenter  = {true}
          onPress = {() => {
            this.props.navigation.navigate('ReportTraffic', {
              reportTrafficType: reportTrafficType.TrafficJam
            })
          }}>
            <View style = {style.img}>
              <Image  source = {require('../assets/traffic_menu/trafficJam.png')}></Image>
            </View>
            <Text style = {style.text}>Tại nạn</Text>
          </ShadenTouchableHightLight>
        </View>
      </View>

      )
    }
  }

  const style = StyleSheet.create({

    container: {
      flexDirection: 'row',
      backgroundColor: 'white',
      marginTop: 40
    },

    topContainer: {
      flex: 1,
      backgroundColor: 'white'
    },

    text: {
      fontSize: 20,
      marginLeft:10,
      marginTop: 10
    }
  })

