import request from '@/plugin/axios'

const url = '/dataKeep/dataKeepPostManagement'

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

export function searchPost (param) {
  const data = toData('searchPost', param)
  return request({
    url: url,
    method: 'post',
    permission: ['SEARCH_POST'],
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}

export function updatePost (param) {
  const data = toData('updatePost', param)
  return request({
    url: url,
    method: 'post',
    permission: ['UPDATE_POST'],
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
export function addPost (param) {
  const data = toData('addPost', param)
  return request({
    url: url,
    method: 'post',
    permission: ['ADD_POST'],
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
export function deletePost (param) {
  const data = toData('deletePost', param)
  return request({
    url: url,
    method: 'post',
    permission: ['DELETE_POST'],
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
