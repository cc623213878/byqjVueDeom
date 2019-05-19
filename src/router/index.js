import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'

import util from '@/libs/util.js'

// 路由数据
import routes from './routes'

// 固定菜单与路由
import menuHeader from '@/menu/header'
import menuAside from '@/menu/aside'
import {
  frameInRoutes
} from '@/router/routes'
// 路由与组件映射关系
import routerMapComponents from '@/routerMapComponents'

// import * as userService from '@/api/sys/login'

Vue.use(VueRouter)
let isLoad = false
// 导出路由 在 main.js 里使用
const createRouter = () => new VueRouter({
  routes,
  mode: 'history'
})
const router = createRouter()

const fetchPermissionInfo = async () => {
  // 处理动态添加的路由
  const formatMenus = function (menus) {
    if (menus) {
      menus.forEach(menu => {
        if (menu.children) {
          if (menu.children.length === 0) {
            delete menu.children
          }
          formatMenus(menu.children)
        }
      })
    }
  }
  // 处理动态添加的路由
  const formatRoutes = function (routes) {
    if (routes) {
      routes.forEach(route => {
        if (route.children) {
          if (route.children.length === 0) {
            delete route.children
          }
          formatRoutes(route.children)
        }
        route.component = routerMapComponents[route.component]
      })
    }
  }
  try {
    // const userPermissionInfo = await userService.GetMenueInfo()
    // if (!userPermissionInfo.code) {
    //   // 设置 vuex 用户信息
    //   store.dispatch(
    //     'd2admin/user/set',
    //     {
    //       name: userPermissionInfo.userName.userName
    //     },
    //     { root: true }
    //   )
    //   util.cookies.set('userName', userPermissionInfo.userName.userName)
    // }

    const userPermissionInfo = {
      accessMenus: [{
        'title': '成绩管理',
        'path': '/score',
        'icon': 'area-chart',
        'children': []
      }, {
        'title': '数据维护',
        'path': '/data',
        'icon': 'clone',
        'children': [{
          'title': '学生管理',
          'path': '/data/student-management',
          'icon': 'bank',
          'children': []
        }, {
          'title': '学院部门',
          'path': '/data/college-department',
          'icon': 'bank',
          'children': []
        }, {
          'title': '教室管理',
          'path': '/data/class-management',
          'icon': 'graduation-cap',
          'children': []
        }, {
          'title': '岗位管理',
          'path': '/data/job-management',
          'icon': 'address-card-o',
          'children': []
        }, {
          'title': '字典维护',
          'path': '/data/maintenance-dictionary',
          'icon': 'book',
          'children': []
        }]
      }],
      accessRoutes: [{
        'name': 'Score',
        'path': '/score',
        'component': 'score',
        'componentPath': 'pages/score/index',
        'meta': {
          'title': '成绩管理',
          'cache': true
        },
        'children': []
      }, {
        'name': 'Data',
        'path': '/data',
        'component': 'layoutHeaderAside',
        'componentPath': 'layout/header-aside/layout',
        'meta': {
          'title': '数据维护',
          'cache': true
        },
        'children': [{
          'name': 'StudentManagement',
          'path': '/data/student-management',
          'component': 'student-management',
          'componentPath': 'pages/data/student-management/index',
          'meta': {
            'title': '学生管理',
            'cache': true
          },
          'children': []
        }, {
          'name': 'CollegeDepartment',
          'path': '/data/college-department',
          'component': 'college-department',
          'componentPath': 'pages/data/college-department/index',
          'meta': {
            'title': '学院部门',
            'cache': true
          },
          'children': []
        }, {
          'name': 'ClassManagement',
          'path': '/data/class-management',
          'component': 'class-management',
          'componentPath': 'pages/data/class-management/index',
          'meta': {
            'title': '教室管理',
            'cache': true
          },
          'children': []
        }, {
          'name': 'JobManagement',
          'path': '/data/job-management',
          'component': 'job-management',
          'componentPath': 'ages/data/job-management/index',
          'meta': {
            'title': '岗位管理',
            'cache': true
          },
          'children': []
        }, {
          'name': 'DictionaryMaintenance',
          'path': '/data/maintenance-dictionary',
          'component': 'maintenance-dictionary',
          'componentPath': 'pages/data/maintenance-dictionary/index',
          'meta': {
            'title': '字典维护',
            'cache': true
          },
          'children': []
        }]
      }],
      userPermissions: [],
      userName: {
        'userId': 'admin',
        'userName': 'admin',
        'realName': null,
        'email': null,
        'phone': null,
        'sex': null,
        'post': '',
        'createTime': 1552052084000,
        'updateTime': 1556266961000,
        'loginType': null,
        'deptId': '42',
        'idCard': null
      }
    }
    // 设置 vuex 用户信息
    store.dispatch(
      'd2admin/user/set', {
        name: userPermissionInfo.userName.userName
      }, {
        root: true
      }
    )
    util.cookies.set('userName', userPermissionInfo.userName.userName)
    const firstMenu = {
      path: '/',
      component: 'layoutHeaderAside',
      children: []
    }
    const permission = {
      functions: []
    }
    permission.functions = userPermissionInfo.userPermissions
    if (userPermissionInfo.accessMenus) {
      formatMenus(userPermissionInfo.accessMenus)
    }
    if (userPermissionInfo.accessRoutes) {
      userPermissionInfo.accessRoutes.forEach(route => {
        if (route.children.length === 0) {
          firstMenu.children.push(route)
        }
      })
    }
    const fullRouter = userPermissionInfo.accessRoutes.filter(
      route => route.children.length !== 0
    )
    fullRouter.push(firstMenu)
    formatRoutes(fullRouter)
    const allMenuAside = [...menuAside, ...userPermissionInfo.accessMenus]
    const allMenuHeader = [...menuHeader, ...userPermissionInfo.accessMenus]

    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router

    // 动态添加路由
    router.addRoutes(fullRouter)
    // 处理路由 得到每一级的路由设置
    store.commit('d2admin/page/init', [...frameInRoutes, ...fullRouter])
    // 设置顶栏菜单
    store.commit('d2admin/menu/headerSet', allMenuHeader)
    // 设置侧边栏菜单
    store.commit('d2admin/menu/fullAsideSet', allMenuAside)
    // 初始化菜单搜索功能
    store.commit('d2admin/search/init', allMenuHeader)
    // 设置权限信息
    store.commit('d2admin/permission/set', permission)
    // 加载上次退出时的多页列表
    store.dispatch('d2admin/page/openedLoad')
  } catch (ex) {
    console.log(ex)
  }
  await Promise.resolve()
}
// 免校验token白名单
const whiteList = ['/login']

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  if (whiteList.indexOf(to.path) === -1) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    const token = util.cookies.get('token')
    if (token && token !== 'undefined' && token !== '') {
      // determine whether the user has obtained his permission roles through getInfo
      if (!isLoad) {
        await fetchPermissionInfo()
        isLoad = true
        next(to.path, true)
      }
      const userName = util.cookies.get('userName')
      if (userName && userName !== 'undefined') {
        next()
      } else {
        try {
          // dynamically add accessible routes
          await fetchPermissionInfo()
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next(to.path, true)
        } catch (error) {
          // remove token and go to login page to re-login
          // 删除cookie
          util.cookies.remove('token')
          util.cookies.remove('tokenType')
          util.cookies.remove('uuid')
          util.cookies.remove('userName')
          // 清空 vuex 用户信息
          store.dispatch('d2admin/user/set', {}, {
            root: true
          })
          // 跳转路由
          router.push({
            name: 'login'
          })
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    } else {
      // 将当前预计打开的页面完整地址临时存储 登录后继续跳转
      // 这个 cookie(redirect) 会在登录后自动删除
      util.cookies.set('redirect', to.fullPath)
      // 没有登录的时候跳转到登录界面
      next({
        name: 'login'
      })
    }
  } else {
    next()
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 需要的信息
  const app = router.app
  const {
    name,
    params,
    query
  } = to
  // 多页控制 打开新的页面
  app.$store.dispatch('d2admin/page/open', {
    name,
    params,
    query
  })
  // 更改标题
  util.title(to.meta.title)
})

export default router
