export default {
  TOGGLE (state, propertyName) {
    state[propertyName] = !state[propertyName]
  },

  SET (state, data) {
    state[data.propertyName] = data.payload
  }
}
