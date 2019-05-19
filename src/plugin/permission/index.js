export default {
  install (Vue, options) {
    const store = options.store
    Vue.directive('permission', {
      bind: function (el, binding, vnode) {
        const checkCodes = store.state.d2admin.permission.functions
        let access = false
        for (const need of binding.value) {
          if (checkCodes.some(s => s === need)) {
            access = true
            break
          }
        }

        if (!access) {
          Vue.nextTick(() => {
            if (vnode.elm.parentNode) {
              vnode.elm.parentNode.removeChild(el)
            }
          })
        }
      }
    })
  }
}
