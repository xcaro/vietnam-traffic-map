// Action Type
export const SET_CURRENTLOCATION = 'SET_CURRENTLOCATION'
export const REMOVE_CURRENTLOCATION = 'REMOVE_CURRENTLOCATION'

export const SET_SELECTEDSEARCHLOCATIONITEM = 'SET_SELECTEDSEARCHLOCATIONITEM'
export const REMOVE_SELECTEDSEARCHLOCATIONITEM = 'REMOVE_SELECTEDSEARCHLOCATIONITEM'

export const SET_IDTOKEN = 'SET_IDTOKEN'
export const SET_USER = 'SET_USER'

export const SHOW_LOADING = 'SHOW_LOADING'
export const HIDE_LOADING = 'HIDE_LOADING'
export const SET_REPORT_TYPE = 'SET_REPORT_TYPES'
export const SET_SEARCH_NEAR = 'SET_SEARCH_NEAR'
export const REMOVE_SEARCH_NEAR = 'REMOVE_SEARCH_NEAR'

function generateActionCreateor (type, ...argNames) {
  let action = {type}

  return (...arg) => {
    argNames.forEach((argName, index) => {
      action[argName] = arg[index]
    })
    return action
  }
}

// Action creator
export default {
  showLoading: generateActionCreateor(SHOW_LOADING),
  hideLoading: generateActionCreateor(HIDE_LOADING),
  setReportTypes: generateActionCreateor(SET_REPORT_TYPE, 'reportTypes'),
  setUser: generateActionCreateor(SET_USER, 'user'),
  setIdToken: generateActionCreateor(SET_IDTOKEN, 'idToken'),
  setCurLocation: generateActionCreateor(SET_CURRENTLOCATION, 'location'),
  removeCurLocation: generateActionCreateor(REMOVE_CURRENTLOCATION),
  setSelectedSearchLocationItem: generateActionCreateor(SET_SELECTEDSEARCHLOCATIONITEM, 'SearchLocationItem'),
  removeSelectedSearchLocationItem: generateActionCreateor(REMOVE_SELECTEDSEARCHLOCATIONITEM),
  setSearchNear: generateActionCreateor(SET_SEARCH_NEAR, 'result'),
  removeSearchNear: generateActionCreateor(REMOVE_SEARCH_NEAR, 'REMOVE_SEARCH_NEAR')
}
