import request from '@/plugin/axios'

const url = '/dataKeep/dataKeepCollegeDepartment'

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

export function searchPerson (param) {
  const data = toData('searchPerson', param)
  return request({
    url: url,
    method: 'post',
    permission: ['SEARCH_PERSON'],
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}

export function modifyPerson (param) {
  const data = toData('modifyPerson', param)
  return request({
    url: url,
    method: 'post',
    permission: ['MODIFY_PERSION'],
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
export function addPerson (param) {
  const data = toData('addPerson', param)
  return request({
    url: url,
    method: 'post',
    permission: ['ADD_PERSON'],
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
export function deletePerson (param) {
  const data = toData('deletePerson', param)
  return request({
    url: url,
    method: 'post',
    permission: ['DELETE_PERSION'],
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
