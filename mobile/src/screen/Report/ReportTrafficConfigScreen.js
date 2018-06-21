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
  import Spinner from 'react-native-loading-spinner-overlay'

  import ShadenTouchableHightLight from '../../component/ShadenTouchableHightLight'
  import {reportTrafficTypes} from '../../helper/enum'
  import RoundButton from '../../component/RoundButton'
  import primaryStyle from '../../style/index'
  import request from 'superagent'

  export default class ReportTrafficConfigScreen extends Component {
    static navigationOptions = {
      title: 'Báo cáo tình trạng giao thông',
    }

    constructor (props) {
      super(props)
      this.state = {
        reportTypes: this.props.navigation.getParam('reportTypes', [])
      }
    }

    componentDidMount () {
    }

    render() {
      return (
        <View style={style.topContainer}>
          <View style={style.container}>
          {
            this.state.reportTypes.map((reportType) => {
              return (
                <ShadenTouchableHightLight
                  key = {reportType.name}
                  margin = {10}
                  marginTop = {20}
                  padding={20}
                  backgroundColor = "#3c94d3"
                  flexDirection = "row"
                  alignItems = "center"
                  onPress={() => {
                    this.props.navigation.navigate('ReportTraffic', {
                      reportType
                    })
                  }}>
                  <View style={style.img}>
                    <Image source={reportType.img} />
                  </View>
                  <Text style={style.name}>{reportType.name}</Text>
                </ShadenTouchableHightLight>
              )
            })
          }
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

    name: {
      fontSize: 22,
      marginLeft: 10,
      color: 'white',
      fontWeight: 'bold'
    }
  })

