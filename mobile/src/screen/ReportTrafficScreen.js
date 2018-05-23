import React ,{
  Component
} from 'react';

import {
  View,
  Image,
  Text,
  StyleSheet
} from 'react-native'

import ShadenTouchableHightLight from '../component/ShadenTouchableHightLight'
import RoundButton from '../component/RoundButton'
import primaryStyle from '../style/index'


export default class ReportTrafficScreen extends Component {
  static navigationOptions = {
    title: 'Báo cáo tình trạng giao thông',
  };

  render() {
    return (
    <View style = {style.topContainer}>
      <View style = {style.container}>
        <ShadenTouchableHightLight
        borderRadius = {0}
        flex = {1}
        isContentCenter  = {true}
        onPress = {() => {

        }}>
          <View style = {style.img}>
            <Image  source = {require('../assets/report_traffic/traffic_jam.png')}></Image>
          </View>
          <Text style = {style.text}>Tắc đường</Text>
        </ShadenTouchableHightLight>

        <ShadenTouchableHightLight
        flex = {1}
        isContentCenter  = {true}
        onPress = {() => {

        }}>
          <View style = {style.img}>
            <Image  source = {require('../assets/report_traffic/traffic_jam.png')}></Image>
          </View>
          <Text style = {style.text}>Tắc đường</Text>
        </ShadenTouchableHightLight>


      </View>
      <View style = {style.container}>
      <ShadenTouchableHightLight
        flex = {1}
        isContentCenter  = {true}
        onPress = {() => {

        }}>
          <View style = {style.img}>
            <Image  source = {require('../assets/report_traffic/traffic_jam.png')}></Image>
          </View>
          <Text style = {style.text}>Tắc đường</Text>
        </ShadenTouchableHightLight>

        <ShadenTouchableHightLight
        flex = {1}
        isContentCenter  = {true}
        onPress = {() => {

        }}>
          <View style = {style.img}>
            <Image  source = {require('../assets/report_traffic/traffic_jam.png')}></Image>
          </View>
          <Text style = {style.text}>Tắc đường</Text>
        </ShadenTouchableHightLight>
      </View>
    </View>

    )
  }
}

const style = StyleSheet.create({
  img: {
    marginTop: 30,
    marginBottom: 15,
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },

  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },

  topContainer: {
    flex: 1,
    backgroundColor: 'white'
  },

  text: {
    paddingBottom: 30,
    fontSize: 18,
    color: '#01b6b2',
    marginLeft:10,
  }
})

