import request from '@/plugin/axios'

const url = '/dataKeep/dataKeepDictionaryKeep'

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

export function searchDictionary (param) {
  const data = toData('searchDictionary', param)
  return request({
    url: url,
    method: 'post',
    permission: ['SEARCH_DICTIONARY'],
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}

export function updateDictionary (param) {
  const data = toData('updateDictionary', param)
  return request({
    url: url,
    method: 'post',
    permission: ['UPDATE_DICTIONARY'],
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
  })
}
export function addDictionary (param) {
  const data = toData('addDictionary', param)
  return request({
    url: url,
    method: 'post',
    permission: ['ADD_DICTIONARRY'],
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
export function deleteDictionary (param) {
  const data = toData('deleteDictionary', param)
  return request({
    url: url,
    method: 'post',
    permission: ['DELETE_DICTIONARY'],
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
