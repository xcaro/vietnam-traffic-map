import React ,{
    Component
  } from 'react'

  import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
  } from 'react-native'

  import ShadenTouchableHightLight from '../../component/ShadenTouchableHightLight'
  import {reportTrafficType} from '../../helper/enum'
  import RoundButton from '../../component/RoundButton'
  import primaryStyle from '../../style/index'

  export default class ReportTrafficConfigScreen extends Component {
    static navigationOptions = {
      title: 'Báo cáo tình trạng giao thông',
    }

    render() {
      return (
        <View style={style.topContainer}>
        <View style={style.container}>
          <ShadenTouchableHightLight
            margin = {10}
            marginTop = {20}
            padding={20}
            backgroundColor = "#3c94d3"
            flexDirection = "row"
            alignItems = "center"
            onPress={() => {
              this.props.navigation.navigate('ReportTraffic', {
                reportTrafficType: reportTrafficType.TrafficJam
              })
            }}>
            <View style={style.img}>
              <Image source={require('../../assets/traffic_menu/jam.png')} />
            </View>
            <Text style={style.text}>Kẹt xe</Text>
          </ShadenTouchableHightLight>

          <ShadenTouchableHightLight
            margin = {10}
            padding={20}
            backgroundColor = "#3a98d8"
            flexDirection = "row"
            alignItems = "center"
            onPress={() => {
              this.props.navigation.navigate('ReportTraffic', {
                reportTrafficType: reportTrafficType.CarAccident
              })
            }}>
            <View style={style.img}>
              <Image source={require('../../assets/traffic_menu/accident.png')} />
            </View>
            <Text style={style.text}>Tai nạn</Text>
          </ShadenTouchableHightLight>

          <ShadenTouchableHightLight
            margin = {10}
            padding={20}
            backgroundColor = "#3c94d3"
            flexDirection = "row"
            alignItems = "center"
            onPress={() => {
              this.props.navigation.navigate('ReportTraffic', {
                reportTrafficType: reportTrafficType.Flood
              })
            }}>
            <View style={style.img}>
              <Image source={require('../../assets/traffic_menu/flood.png')} />
            </View>
            <Text style={style.text}>Lũ lụt</Text>
          </ShadenTouchableHightLight>
        </View>
      </View>
      )
    }
  }

  const style = StyleSheet.create({
    img: {
      justifyContent: 'center'
    },

    container: {
      flexWrap: 'wrap',
      backgroundColor: 'white'
    },

    topContainer: {
      flex: 1,
      backgroundColor: 'white'
    },

    text: {
      fontSize: 22,
      marginLeft: 10,
      color: 'white',
      fontWeight: 'bold'
    }
  })

