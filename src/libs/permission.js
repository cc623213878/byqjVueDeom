export default {
  access: function (config, store) {
    let functionAccess = true
    if (config.permission && config.permission.length > 0) {
      const needPermissions = config.permission
      const permissions = store.state.d2admin.permission.functions.concat()
      const hasPermission = permissions.some(s => {
        return needPermissions.indexOf(s) > -1
      })
      if (!hasPermission) {
        functionAccess = false
      }
    }
    return functionAccess
  }
}
