// polyfill
import 'babel-polyfill'
// Vue
import Vue from 'vue'
import App from './App'
// store
import store from '@/store/index'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// 路由
import router from './router'

// 核心插件
Vue.use(d2Admin, { store })

new Vue({
  router,
  store,
  watch: {
    '$route.matched' (val) {
      const fullAside = this.$store.state.d2admin.menu.fullAside
      const _side = fullAside.filter(menu => menu.path === val[0].path)
      this.$store.commit(
        'd2admin/menu/asideSet',
        _side.length > 0 ? _side[0].children : []
      )
    }
  },
  created () { },
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  },
  render: h => h(App)
}).$mount('#app')