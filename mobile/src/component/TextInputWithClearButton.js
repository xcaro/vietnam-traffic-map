import React, { Component } from 'react';

import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  AppRegistry,
  TextInput,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';

// Use prebuilt version of RNVI in dist folder
import Icon from 'react-native-vector-icons/FontAwesome';
import primaryStyle from '../style/index'
import objectHelper from '../helper/object'


export default class TextInputWithClearButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowClearTextButton: false,
      istextInputOnFocus:false,
      textInputText: ''
    }

    this.textInput = React.createRef()
  }

  componentDidMount() {
    // props isFocusOnStart
    if(this.props.isFocusOnStart)
      this.textInput.focus()
  }

  textInputOnFocus() {
    if(this.state.textInputText != '')
      this.setState(previousState => {
        return objectHelper.CloneAndSetPropOfObject(previousState, {
          isShowClearTextButton: true
        })
      })

    /**Set focus state */
    this.setState(previousState => {
      return objectHelper.CloneAndSetPropOfObject(previousState, {
        istextInputOnFocus: true
      })
    })

    if(this.props.onFocus)
      this.props.onFocus()
  }

  textInputOnBlur() {
    if(this.state.isShowClearTextButton)
    this.setState(previousState => {
       return objectHelper.CloneAndSetPropOfObject(previousState, {
        isShowClearTextButton: false
      })
    })

    /**Remove focus state */
    this.setState(previousState => {
       return objectHelper.CloneAndSetPropOfObject(previousState, {
        istextInputOnFocus: false
      })
    })

    /**
     * Call predifined onblue
     */
    if(this.props.onBlur)
      this.props.onBlur()
  }

  textInputOnChangeText(newText) {
    this.setState(previousState => {
       return objectHelper.CloneAndSetPropOfObject(previousState, {
        textInputText: newText
      })
    })

    /**Check if current is focus set while in focus */
    if(this.state.istextInputOnFocus && newText !== '')
    /**If focus tand have text then show clear all button */
    this.setState(previousState => {
       return objectHelper.CloneAndSetPropOfObject(previousState, {
        isShowClearTextButton: true
      })
    })

    else
    /**Text change is empty hide clear all button*/
    this.setState(previousState => {
       return objectHelper.CloneAndSetPropOfObject(previousState, {
        isShowClearTextButton: false
      })
    })

    if(this.props.onChangeText)
      this.props.onChangeText(newText)
  }

  isShowClearTextInput() {
    var is = (
      this.state.isShowClearTextButton || (
        this.props.isAlwaysShowClearTextButton &&
        this.props.text !== ''
      )
    )

    return (is)
  }

  setText(text) {
    this.textInput.setNativeProps({
      text
    })

    this.setState(previousState => objectHelper.CloneAndSetPropOfObject(previousState, {
      textInputText: text
    }))
  }

  render() {
    return (

      <View style = {[primaryStyle.flexDirectionRow, primaryStyle.alignItemCenter,primaryStyle.bgPrimary]}>
        {this.props.label &&
          <Text style = {style.label}>{this.props.label}</Text>
        }
        <View style = {primaryStyle.container}>
          <TouchableWithoutFeedback onPress = {this.props.onPress}>
            <View

              style={[

                style.container
              ]}>


                <TextInput
                onChangeText = {this.props.onChangeText}
                ref={component => this.textInput = component}
                editable = {this.props.editable}
                returnKeyType = "search"
                value = {this.props.text || this.state.textInputText}
                onBlur = {this.textInputOnBlur.bind(this)}
                onFocus = {this.textInputOnFocus.bind(this)}
                onChangeText = {this.textInputOnChangeText.bind(this)}
                underlineColorAndroid="transparent"
                style={[
                primaryStyle.container,
                this.props.isActive ? style.active : primaryStyle.textWhite,
                style.padding,
                style.input
              ]}/>

                {this.isShowClearTextInput() &&
                <TouchableWithoutFeedback
                  onPress = {
                    () => {
                      this.setState(previousState => Object.assign({}, previousState, {
                        isShowClearTextButton: false,
                        textInputText: ''
                      }))

                      if(this.props.onClear)
                        this.props.onClear()
                    }
                  }>
                    <Icon
                    name = "times-circle"
                    size={20}
                    style={[

                    primaryStyle.textWhite,
                    style.padding,
                    style.iconRight,
                    style.icon
                  ]}></Icon>
                </TouchableWithoutFeedback>
                }
              </View>
          </TouchableWithoutFeedback>
        </View>
      </View>

    )
  }
}

const style = StyleSheet.create({
  active: {
    color: '#44d62c'
  },

  container:{
    flexDirection: 'row'
  },

  padding: {
    paddingBottom: 12
  },

  iconLeft: {
    paddingLeft: 11,
    paddingRight: 8
  },

  iconRight: {
    paddingLeft: 8,
    paddingRight: 11
  },

  icon: {
    paddingTop: 16
  },

  input: {
    paddingTop: 12,
    fontSize: 18,
    paddingRight:10,
  },

  label: {
    fontSize: 18,
    color: 'rgba(255,255,255,.7)',
    paddingRight: 10
  }
})