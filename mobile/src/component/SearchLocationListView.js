import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  FlatList
} from 'react-native'
import primaryStyle from '../style/index'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import SearchLocationListItem from '../component/SearchLocationListItem'

export default class SearchLocationListView extends Component {
  renderItem ({item}) {
    return (
      <SearchLocationListItem
        title={item.title}
        description={item.description}
        isSavedLocation={item.isSavedLocation}
        onSelected={this.props.onSelected.bind(this, item.key, item)} />
    )
  }
  space () {
    return (<View style={style.separator} />)
  }

  render () {
    return (
      <View>
        <Text style={style.title}>{this.props.title}</Text>
        <FlatList
          data={this.props.data}
          renderItem={this.renderItem.bind(this)}
          ListEmptyComponent={<Text style={style.emty}>Không tìm thấy địa điểm nào</Text>}
          ItemSeparatorComponent={this.space}
        />
      </View>
    )
  }
}

const style = StyleSheet.create({
  separator: {
    flex: 1,
    height: 0
  },

  title: {
    padding: 10,
    fontSize: 25,
    fontWeight: 'bold'
  },

  emty: {
    paddingLeft: 10,
    fontSize: 17
  }

})
