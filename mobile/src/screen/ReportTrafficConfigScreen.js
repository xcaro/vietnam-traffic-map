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
        <View style={style.topContainer}>
        <View style={style.container}>
          <ShadenTouchableHightLight
            padding={20}
            backgroundColor = "#4f6676"
            flexDirection = "row"
            alignItems = "center"
            onPress={() => {
              this.props.navigation.navigate('ReportTraffic', {
                reportTrafficType: reportTrafficType.TrafficJam
              })
            }}>
            <View style={style.img}>
              <Image source={require('../assets/traffic_menu/jam.png')} />
            </View>
            <Text style={style.text}>Kẹt xe</Text>
          </ShadenTouchableHightLight>

          <ShadenTouchableHightLight
            padding={20}
            backgroundColor = "#4f6676"
            flexDirection = "row"
            alignItems = "center"
            onPress={() => {
              this.props.navigation.navigate('ReportTraffic', {
                reportTrafficType: reportTrafficType.TrafficJam
              })
            }}>
            <View style={style.img}>
              <Image source={require('../assets/traffic_menu/jam.png')} />
            </View>
            <Text style={style.text}>Tai nạn</Text>
          </ShadenTouchableHightLight>

          <ShadenTouchableHightLight
            padding={20}
            backgroundColor = "#4f6676"
            flexDirection = "row"
            alignItems = "center"
            onPress={() => {
              this.props.navigation.navigate('ReportTraffic', {
                reportTrafficType: reportTrafficType.TrafficJam
              })
            }}>
            <View style={style.img}>
              <Image source={require('../assets/traffic_menu/jam.png')} />
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

