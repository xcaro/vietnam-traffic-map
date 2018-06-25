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
  REMOVE_SEARCH_NEAR,
  SET_SETTINGS,
  ADD_TRAFFIC_MARKER,
  EDIT_TRAFFIC_MARKER,
  DELETE_TRAFFIC_MARKER
} from './action'
import objectHelper from '../helper/object'

export default function (state, action) {
  switch (action.type) {
    case ADD_TRAFFIC_MARKER:
      return {...state, trafficMarkers: [...state.trafficMarkers, action.marker]}

    case EDIT_TRAFFIC_MARKER:
      let arr = JSON.parse(JSON.stringify(state.trafficMarkers))
      let index = arr.findIndex((e) => e.id === action.marker.id)
      if (index === -1) {
        /**
         * Never happend
         */
        return
      }

      arr[index] = action.marker
      return {...state, trafficMarkers: arr}


    case DELETE_TRAFFIC_MARKER:
      return {...state, trafficMarkers: state.trafficMarkers.filter(trafficMaker => {
        trafficMaker.id !== action.marker.id
      })
     }

    case SET_SETTINGS:
      return {...state, settings: action.settings}

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
