import store from '@/store'
import axios from 'axios'
import router from '@/router/index'
import { Message } from 'element-ui'
import util from '@/libs/util'
import loading from '@/libs/loading'
import message from '@/libs/message'
import permission from '@/libs/permission'

// 记录和显示错误
function errorLog (err) {
  // 添加到日志
  store.dispatch('d2admin/log/add', {
    type: 'error',
    err,
    info: '数据请求异常'
  })
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(err)
  }
  // 显示提示
  Message({
    message: err.message,
    type: 'error',
    duration: 5 * 1000
  })
}

// 创建一个 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  // baseURL: 'http:// /',
  timeout: 20000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    if (!permission.access(config, store)) {
      // eslint-disable-next-line no-throw-literal
      throw {
        type: '403',
        config: config
      }
    }
    loading.show(config)
    // 在请求发送之前做一些处理
    if (!/^https:\/\/|http:\/\//.test(config.url)) {
      const token = util.cookies.get('token')
      const tokenType = util.cookies.get('tokenType')
      if (token && token !== 'undefined' && token !== '') {
        // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
        // config.headers['Authorization'] = 'Bearer ' + token
        config.headers['Authorization'] = tokenType + ' ' + token
      } else {
        console.log('notoken')
      }
    }
    return config
  },
  error => {
    // 发送失败
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // console.log('成功')
    // console.log(response)
    loading.hide(response.config)

    const res = response.data
    // if (res.statusCode !== 200) {
    if (res.head.code !== '2000') {
      Message({
        message: res.head.zh_msg,
        type: 'error',
        duration: 3 * 1000
      })
      // if (res.head.code === '4000') {
      //   // 删除cookie
      //   util.cookies.remove('token')
      //   util.cookies.remove('tokenType')
      //   util.cookies.remove('uuid')
      //   util.cookies.remove('userName')
      //   // 清空 vuex 用户信息
      //   store.dispatch('d2admin/user/set', {}, { root: true })
      //   // 跳转路由
      //   router.push({
      //     name: 'login'
      //   })
      // }
      // return Promise.reject(res.msg)
      return res.head
    } else {
      message(response.config)
      return res.data
    }
  },
  error => {
    loading.hide(error.config)
    if (error.response && error.response.status === 401) {
      util.cookies.remove()
      if (error.config.url.indexOf('logout') === -1) {
        Message({
          message: '登陆信息已过期,请重新登陆!',
          type: 'error',
          duration: 3 * 1000
        })
      }
      setTimeout(() => {
        router.push({
          name: 'login'
        })
      }, 1000)
    } else if (error.response && error.response.status === 500) {
      errorLog(new Error(`系统错误!`))
    } else if (error.message && error.message.indexOf('timeout') > -1) {
      errorLog(new Error(`网络超时!`))
    } else if (error.type === '403') {
      errorLog(new Error(`没有请求权限!`))
    } else {
      errorLog(new Error(`网络错误!`))
    }
    return Promise.reject(error)
  }
)

export default service
