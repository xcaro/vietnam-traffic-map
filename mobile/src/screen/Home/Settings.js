import React, {
  Component
} from 'react'

import {
  View,
  Text,
  StyleSheet,
  Slider,
  AsyncStorage,
  Alert
} from 'react-native'

import CheckBox from 'react-native-check-box'
import {connect} from 'react-redux'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import { Dropdown } from 'react-native-material-dropdown'
import primaryStyles, {
  PRIMARY_COLOR
} from '../../style/index'
import action from '../../redux/action'
import SearchLocationTextInput from '../../component/SearchLocationTextInput'
import ShadenTouchableHightLight from '../../component/ShadenTouchableHightLight'

class Settings extends Component {
  static navigationOptions = {
    drawerLabel: 'Cài đặt',
    drawerIcon: ({ tintColor }) => (
      <FAIcon
        name = "cog"
        size = {25}
        color = {tintColor}
      />
    ),
  }

  constructor (props) {
    super(props)
    this.userList = {}
    this.props.reportTypes.forEach((reportType) => {
      this.userList[reportType.type_id] = reportType.name
    })
    this.state = Object.assign({}, this.props.settings)
  }

  render () {
    return (
      <View>
        <SearchLocationTextInput
          navigation = {this.props.navigation}
          isShowMenuButton = {true}
          editable = {false}
          text = 'Cài đặt'>
        </SearchLocationTextInput>

        <View style={styles.container}>
          <Text style={styles.title}>Thông báo</Text>
          <Text>Bán kính nhận thông báo giao thông: {this.state.radius} (m)</Text>
            <Slider
              marginTop={10}
              marginBottom={10}
              onValueChange={(radius)=>{this.setState({radius})}}
              value={this.state.radius}
              minimumValue={1000}
              maximumValue={10000}
              step={1000} />
          <Dropdown
            onChangeText={(text)=>{
              this.setState({confirmed: text})

            }}
            value={this.state.confirmed}
            title = 'nhấn để chọn'
            label='Loại thông báo'
            data={[
              {value: 'Cả hai'},
              {value: 'Đã xác nhận'},
              {value: 'Chưa xác nhận'}
            ]}
          />
          <Text style={primaryStyles.textBold}>Trạng thái thông báo muốn nhận thông báo</Text>
          {this.props.reportTypes.map((reportType)=>{
            return (
              <CheckBox
                key={reportType.id}
                onClick={()=>{
                  var i = this.state.types.indexOf(reportType.id)
                  if (i === -1)
                      this.setState(state => ({
                        types: [...state.types, reportType.id]
                      }))
                  else {
                    let newTypes = this.state.types.slice(0)
                    newTypes.splice(i, 1)
                    this.setState(state => ({
                      types: [...state.types, reportType.id]
                    }))
                  }
                }}
                isChecked={this.state.types.indexOf(reportType.id) !== -1}
                leftText={reportType.name} />
            )
          })}
          <ShadenTouchableHightLight
            onPress = {() => {
              this.props.setSettings(this.state)
              AsyncStorage.setItem('settings', JSON.stringify(this.state)).then(() => {
                Alert.alert('Thông báo', 'Lưu cài đặt thành công')
              })
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
              <Text style = {primaryStyles.textWhite}>Cập nhật cài đặt</Text>
          </ShadenTouchableHightLight>
        </View>
      </View>
    )
  }
}

export default connect(
  /** State requirer to read by container component */
  (data)=>data,
  action
)(Settings)

const styles = {
  title: {
    fontWeight: 'bold',
    fontSize: 20
  },

  container: {
    margin: 20
  }
}

