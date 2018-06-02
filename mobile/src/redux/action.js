// Action Type
export const SET_CURRENTLOCATION = 'SET_CURRENTLOCATION'
export const REMOVE_CURRENTLOCATION = 'REMOVE_CURRENTLOCATION'

export const SET_SELECTEDSEARCHLOCATIONITEM = 'SET_SELECTEDSEARCHLOCATIONITEM'
export const REMOVE_SELECTEDSEARCHLOCATIONITEM = 'REMOVE_SELECTEDSEARCHLOCATIONITEM'

export const SET_IDTOKEN = 'SET_IDTOKEN'

// Action creator
export default {
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
