import {
  SET_CURRENTLOCATION,
  REMOVE_CURRENTLOCATION,
  SET_SELECTEDSEARCHLOCATIONITEM,
  REMOVE_SELECTEDSEARCHLOCATIONITEM,
  SET_IDTOKEN,
  SET_USER,
  SHOW_LOADING,
  HIDE_LOADING,
  SET_REPORT_TYPE,
  SET_SEARCH_NEAR,
  REMOVE_SEARCH_NEAR
} from './action'
import objectHelper from '../helper/object'

export default function (state, action) {
  switch (action.type) {
    case SET_SEARCH_NEAR:
      return {...state, searchNearLocationResult: action. result}

    case REMOVE_SEARCH_NEAR:
      return {...state, searchNearLocationResult: null}
    case SET_REPORT_TYPE:
      return {...state, reportTypes: action.reportTypes}

    case SHOW_LOADING:
      return {...state, isShowLoading: true}

    case HIDE_LOADING:
      return {...state, isShowLoading: false}

    case SET_IDTOKEN :
      return objectHelper.CloneAndSetPropOfObject(state, {
        idToken: action.idToken
      })

    case SET_USER :
      return objectHelper.CloneAndSetPropOfObject(state, {
        user: action.user
      })

    case SET_CURRENTLOCATION :
      return objectHelper.CloneAndSetPropOfObject(state, {
        curLocation: action.location
      })

    case REMOVE_CURRENTLOCATION:
      return objectHelper.CloneAndSetPropOfObject(state, {
        curLocation: null
      })

    case SET_SELECTEDSEARCHLOCATIONITEM :
      return objectHelper.CloneAndSetPropOfObject(state, {
        selectedSearchLocationItem: action.SearchLocationItem
      })

    case REMOVE_SELECTEDSEARCHLOCATIONITEM :
      return objectHelper.CloneAndSetPropOfObject(state, {
        selectedSearchLocationItem: null
      })

    default:
      return state
  }
}
