export default {
  namespaced: true,
  state: {
    // 功能编码
    functions: []
  },
  mutations: {
    set (state, data) {
      state.functions = data.functions
    }
  }
}
