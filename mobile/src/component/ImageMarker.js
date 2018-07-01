import React, { Component } from 'react';
import { Image, View } from 'react-native';
import MapView from 'react-native-maps';
import styles from '../style/index';

class Marker extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false };
  }

  onLoad() {
    this.setState({ loaded: true });
  }

  render() {

    const { image, latitude, longitude, onPress,  } = this.props;
    const loaded = image && this.state.loaded;
    const onLoad = this.onLoad.bind(this);
    return (
      <MapView.Marker
      onPress={onPress}
      tracksViewChanges = {false}
        onPress = {onPress}
        coordinate={{ latitude, longitude }} >
        { loaded &&
          <Image
          style={styles.markerImage}
          source={{uri: image}}
          onLoad={onLoad} />
        }

        {!loaded && <Image
              style={styles.markerImage}
              source={{uri: image}}
              onLoad={onLoad} />}
        </MapView.Marker>
    )
  }
}

export default Marker