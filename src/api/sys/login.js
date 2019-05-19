import request from '@/plugin/axios'

const url = 'authentication/form'
const userCenter = '/system/userCenter'

function toData (functionNo, param) {
  const data = {
    head: {
      appVerNo: process.env.VUE_APP_VER_NO,
      functionNo: functionNo
    },
    param: param
  }
  return data
}

var base64 = {
  encode (str) {
    // 对字符串进行编码
    var encode = encodeURI(str)
    // 对编码的字符串转化base64
    var base64 = btoa(encode)
    return base64
  }
}

export function AccountLogin (data) {
  return request({
    url: url,
    method: 'post',
    data: toData(null, data),
    headers: { Authorization: 'Basic ' + base64.encode('byqj:byqj') },
    loading: {
      type: 'loading',
      options: {
        fullscreen: true,
        lock: true,
        text: '正在登陆...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      }
    }
  })
}

export function GetImageCode (data) {
  return request({
    url: 'code',
    method: 'post',
    data: data
  })
}

export function GetMenueInfo () {
  const param = {
    head: {
      appVerNo: process.env.VUE_APP_VER_NO,
      functionNo: 'GetMenueInfo'
    }
  }
  return request({
    url: 'system/menueManagement',
    method: 'post',
    data: param
  })
}

// 修改密码
export function UpdatePassword (param) {
  const data = toData('UpdatePassword', param)
  return request({
    url: userCenter,
    method: 'post',
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
