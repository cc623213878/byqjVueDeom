import request from '@/plugin/axios'

const url = 'system/menueManagement'

function toData (functionNo) {
  const data = {
    head: {
      appVerNo: process.env.VUE_APP_VER_NO,
      functionNo: functionNo
    },
    param: {

    }
  }
  return data
}

// 获取路由
export function GetMenueInfo () {
  const data = toData('GetMenueInfo')
  return request({
    url: url,
    method: 'post',
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
