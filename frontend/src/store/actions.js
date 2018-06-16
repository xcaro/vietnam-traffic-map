export default {
  toggle ({commit}, data) {
    commit('TOGGLE', data)
  },

  set ({commit}, data) {
    commit('SET', data)
  }
}
