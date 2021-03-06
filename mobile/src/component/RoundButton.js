import React, { Component } from 'react'
import ShadenTouchableHightLight from './ShadenTouchableHightLight'

export default class RoundButtonWithIcon extends Component {
  render () {
    return (
      <ShadenTouchableHightLight
        isContentCenter={true}
        flex={this.props.flex}
        backgroundColor={this.props.backgroundColor}
        onPress={this.props.onPress}
        borderRadius={50}
        elavation={this.props.elavation}
        width={this.props.size}
        height={this.props.size}
        marginTop={this.props.marginTop}
        marginBottom={this.props.marginBottom}
        marginLeft={this.props.marginLeft}
        marginRight={this.props.marginRight}
      >
        {this.props.children}
      </ShadenTouchableHightLight >
    )
  }
}
