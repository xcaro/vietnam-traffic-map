import {
  SET_CURRENTLOCATION,
  REMOVE_CURRENTLOCATION,
  SET_SELECTEDSEARCHLOCATIONITEM,
  REMOVE_SELECTEDSEARCHLOCATIONITEM
} from './action'
import objectHelper from '../helper/object'

export default function (state, action) {
  switch (action.type) {
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
