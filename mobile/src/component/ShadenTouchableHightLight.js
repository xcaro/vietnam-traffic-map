import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import colorHelper from '../helper/color'
import primaryStyle from '../style/index'
import objectHelper from '../helper/object'

const DEFAULT_BACKGROUNDCOLOR = '#ffffff'
const DEFAULT_SIZE = 64

export default class ShadenTouchableHightLight extends Component {
  constructor (props) {
    super(props)

    this.state = {
      underlayColor:
        colorHelper
          .shadeColor(
            this.props.backgroundColor || DEFAULT_BACKGROUNDCOLOR,
            this.props.shadenLevel || 0.4
          ),
      style: {
        justifyContent: this.props.isContentCenter ? 'center' : 'flex-start',
        alignItems: this.props.isContentCenter ? 'center' : 'flex-start',
        backgroundColor: this.props.backgroundColor || DEFAULT_BACKGROUNDCOLOR,
        elevation: 2
      },

      viewStyle: {}
    }

    this.state.style = objectHelper
      .addPropsIfDefined(this.state.style, [
        {prop: this.props.width, propName: 'width'},
        {prop: this.props.height, propName: 'height'},
        {prop: this.props.marginRight, propName: 'marginRight'},
        {prop: this.props.marginLeft, propName: 'marginLeft'},
        {prop: this.props.marginBottom, propName: 'marginBottom'},
        {prop: this.props.marginTop, propName: 'marginTop'},
        {prop: this.props.padding, propName: 'padding'},
        {prop: this.props.borderRadius, propName: 'borderRadius'},
        {prop: this.props.flex, propName: 'flex'}
      ])

    this.state.viewStyle = objectHelper
      .addPropsIfDefined(this.state.viewStyle, [
        {prop: this.props.flexDirection, propName: 'flexDirection'}
      ])
  }

  render () {
    return (
      <TouchableHighlight
        underlayColor={this.state.underlayColor}
        onPress={this.props.onPress}
        style={this.state.style}
      >
        <View style={this.state.viewStyle}>
          {this.props.children}
        </View>
      </TouchableHighlight >
    )
  }
}
