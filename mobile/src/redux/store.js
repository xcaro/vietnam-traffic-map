import reducer from './reducer'

import {
  createStore
} from 'redux'

const store = createStore(
  reducer,
  {
    curLocation: null,
    user: null,
    selectedSearchLocationItem: null,
    idToken: null,
    isShowLoading: false
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener

export default store
