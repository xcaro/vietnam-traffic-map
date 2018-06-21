// Action Type
export const SET_CURRENTLOCATION = 'SET_CURRENTLOCATION'
export const REMOVE_CURRENTLOCATION = 'REMOVE_CURRENTLOCATION'

export const SET_SELECTEDSEARCHLOCATIONITEM = 'SET_SELECTEDSEARCHLOCATIONITEM'
export const REMOVE_SELECTEDSEARCHLOCATIONITEM = 'REMOVE_SELECTEDSEARCHLOCATIONITEM'

export const SET_IDTOKEN = 'SET_IDTOKEN'
export const SET_USER = 'SET_USER'

export const SHOW_LOADING = 'SHOW_LOADING'
export const HIDE_LOADING = 'HIDE_LOADING'

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

  setUser: (user) => {
    return {
      type: SET_USER,
      user
    }
  },

  setIdToken: (idToken) => {
    return {
      type: SET_IDTOKEN,
      idToken
    }
  },

  setCurLocation: (location) => {
    return {
      type: SET_CURRENTLOCATION,
      location
    }
  },

  removeCurLocation: () => {
    return {
      type: REMOVE_CURRENTLOCATION
    }
  },

  setSelectedSearchLocationItem: (SearchLocationItem) => {
    return {
      type: SET_SELECTEDSEARCHLOCATIONITEM,
      SearchLocationItem
    }
  },

  removeSelectedSearchLocationItem: () => {
    return {
      type: REMOVE_SELECTEDSEARCHLOCATIONITEM
    }
  }
}
