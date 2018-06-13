import {
  TextInput,
  Picker,
  View,
  Text,
  Button
} from 'react-native'

import React, {
  Component
} from 'react'

export default class CreateClinic extends Component {
  render () {
    return (
      <View>
        <View>
          <Text>Tên phòng khám</Text>
          <TextInput/>  
        </View>
        <View>
          <Text>Địa điểm phòng khám</Text>
          <TextInput/>
        </View>
        <View>
          <Text>Loại Phòng khám</Text>
          <Picker>
            <Picker.Item label = "Phòng khám nha khoa" value = "id của phòng khám" />
          </Picker>
        </View>
        <View>
          <Button/>
        </View>
      </View>
    )
  }
}