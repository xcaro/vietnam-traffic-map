import {
  Alert,
} from 'react-native';

export default {
  showGpsError() {
    Alert.alert(
      'Không thê lấy thông tin vị trí hiện tại',
      'Vui lòng mở dịch vụ GPS để sử dụng chức năng này',
      [
        {text:'OK'}
      ]
    )
  }
}