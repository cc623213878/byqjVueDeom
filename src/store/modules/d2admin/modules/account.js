import util from '@/libs/util.js'
// import { AccountLogin } from '@/api/sys/login'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} param context
     * @param {Object} param vm {Object} vue 实例
     * @param {Object} param username {String} 用户账号
     * @param {Object} param password {String} 密码
     * @param {Object} param route {Object} 登录成功后定向的路由对象
     */
    login (
      { dispatch },
      {
        vm,
        userId,
        deviceId,
        imageCode,
        password,
        route = {
          name: 'index'
        }
      }
    ) {
      // 开始请求登录接口
      // AccountLogin({
      //   userId,
      //   deviceId,
      //   imageCode,
      //   password
      // })
      //   .then(async res => {
      //     // 设置 cookie 一定要存 uuid 和 token 两个 cookie
      //     // 整个系统依赖这两个数据进行校验和存储
      //     // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
      //     // token 代表用户当前登录状态 建议在网络请求中携带 token
      //     // 如有必要 token 需要定时更新，默认保存一天
      //     util.cookies.set('uuid', res.userId)
      //     util.cookies.set('token', res.access_token)
      //     util.cookies.set('tokenType', res.token_type)
      //     util.cookies.remove('userName')
      //     // 用户登录后从持久化数据加载一系列的设置
      //     await dispatch('load')
      //     // 更新路由 尝试去获取 cookie 里保存的需要重定向的页面完整地址
      //     const path = util.cookies.get('redirect')
      //     // 根据是否存有重定向页面判断如何重定向
      //     vm.$router.replace(path ? { path } : route)
      //     // 删除 cookie 中保存的重定向页面
      //     util.cookies.remove('redirect')
      //   })
      //   .catch(err => {
      //     console.log('err: ', err)
      //   })

      util.cookies.set('uuid', '123')
      util.cookies.set('token', '123123')
      util.cookies.set('tokenType', '123123')
      util.cookies.set('tokenType', 'admin')
      // 用户登录后从持久化数据加载一系列的设置
      dispatch('load')
      // 更新路由 尝试去获取 cookie 里保存的需要重定向的页面完整地址
      const path = util.cookies.get('redirect')
      // 根据是否存有重定向页面判断如何重定向
      vm.$router.replace(path ? { path } : route)
      // 删除 cookie 中保存的重定向页面
      util.cookies.remove('redirect')
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} param context
     * @param {Object} param vm {Object} vue 实例
     * @param {Object} param confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { vm, confirm = false }) {
      /**
       * @description 注销
       */
      async function logout () {
        // 删除cookie
        util.cookies.remove('token')
        util.cookies.remove('tokenType')
        util.cookies.remove('uuid')
        util.cookies.remove('userName')
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set', {}, { root: true })
        // 跳转路由
        vm.$router.push({
          name: 'login'
        })
      }
      // 判断是否需要确认
      if (confirm) {
        vm.$confirm(
          '注销当前账户吗?  打开的标签页和用户设置将会被保存。',
          '确认操作',
          {
            confirmButtonText: '确定注销',
            cancelButtonText: '放弃',
            type: 'warning'
          }
        )
          .then(() => {
            logout()
            // 注销后重置应用，目前没有找到更好的方法
            // setTimeout(() => {
            //   location.reload()
            // }, 1000)
          })
          .catch(() => {
          })
      } else {
        logout()
        // setTimeout(() => {
        //   location.reload()
        // }, 1000)
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} state vuex state
     */
    load ({ commit, dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 加载用户名
        await dispatch('d2admin/user/load', null, { root: true })
        // DB -> store 加载主题
        await dispatch('d2admin/theme/load', null, { root: true })
        // DB -> store 加载页面过渡效果设置
        await dispatch('d2admin/transition/load', null, { root: true })
        // DB -> store 持久化数据加载侧边栏折叠状态
        await dispatch('d2admin/menu/asideCollapseLoad', null, { root: true })
        // end
        resolve()
      })
    }
  }
}