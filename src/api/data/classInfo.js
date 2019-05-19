import request from '@/plugin/axios'

const url = '/classInfoManagement'

function toData (functionNo, param) {
  const data = {
    head: {
      appVerNo: '1.0.0',
      functionNo: functionNo
    },
    param: param
  }
  return data
}

export function SeachByCondition (param) {
  const data = toData('SeachByCondition', param)
  return request({
    url: url,
    method: 'post',
    permission: ['SEARCH_CLASS_ROOM_INFO'],
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}

export function UpdateClassroom (param) {
  const data = toData('UpdateClassroom', param)
  return request({
    url: url,
    method: 'post',
    permission: ['UPDATE_CLASS_ROOM'],
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    },
    success: {
      type: 'message',
      options: {
        message: '修改成功',
        type: 'success'
      }
    }
    // data: data
  })
}
export function AddClassroom (param) {
  const data = toData('AddClassroom', param)
  return request({
    url: url,
    method: 'post',
    permission: ['ADD_CLASS_ROOM'],
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    },
    success: {
      type: 'message',
      options: {
        message: '添加成功',
        type: 'success'
      }
    }
    // data: data
  })
}
export function DeleteClassroom (param) {
  const data = toData('DeleteClassroom', param)
  return request({
    url: url,
    method: 'post',
    permission: ['DELETE_CLASS_ROOM'],
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    },
    success: {
      type: 'message',
      options: {
        message: '删除成功',
        type: 'success'
      }
    }
    // data: data
  })
}
export function UpdateStatus (param) {
  const data = toData('UpdateStatus', param)
  return request({
    url: url,
    method: 'post',
    permission: ['UPDATE_USE_STATUS'],
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    },
    success: {
      type: 'message',
      options: {
        message: '操作成功',
        type: 'success'
      }
    }
    // data: data
  })
}
