import { AppRegistry, YellowBox } from 'react-native'
import App from './App'

AppRegistry.registerComponent('mobile', () => App)
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'])
