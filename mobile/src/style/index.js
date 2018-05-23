import React ,{
  StyleSheet
} from 'react-native';

const PRIMARY_COLOR = '#383c45'
const SECONDARY_COLOR = 'rgb(52, 73, 94)'
const BORDER_COLOR = 'rgba(255,255,255,0.1)'

const styles = StyleSheet.create({
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.65)'
  },

  bgRed: {
    backgroundColor: 'red'
  },

  container: {
    flex: 1,
  },

  textWhite: {
    color:'white'
  },

  alignItemCenter: {
    alignItems: 'center'
  },

  EverythingCenter: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },

  justifyContentCenter: {
    justifyContent: 'center'
  },

  bgPrimary: {
    backgroundColor: PRIMARY_COLOR
  },

  bgSecondary: {
    backgroundColor: SECONDARY_COLOR
  },

  textCenter: {
    textAlign: 'center'
  },

  textPrimary: {
    color: PRIMARY_COLOR
  },

  textBold: {
    fontWeight: 'bold'
  },

  textSecondary: {
    color: SECONDARY_COLOR
  },

  flexDirectionRow: {
    flexDirection: 'row'
  },

  themePrimary: {
    backgroundColor: PRIMARY_COLOR,
    color: SECONDARY_COLOR
  },

  themeSecondary: {
    backgroundColor: PRIMARY_COLOR,
    color: SECONDARY_COLOR
  },

  fontSizePrimary: {
    fontSize: 18
  },

  marginBottom: {
    marginBottom: 20
  },

  marginTop: {
    marginTop: 20
  },

  shadow: {
    elevation: 2
  }
})

export default styles