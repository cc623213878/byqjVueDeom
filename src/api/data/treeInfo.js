import request from '@/plugin/axios'

const url = '/departmentManagement'

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

export function DepartmentListFromDict (param) {
  const data = toData('DepartmentListFromDict', param)
  return request({
    url: url,
    method: 'post',
    permission: ['DATA_KEEP_SEARCH_DEPARTMETN'],
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}

export function UpdateDepartment (param) {
  const data = toData('UpdateDepartment', param)
  return request({
    url: url,
    method: 'post',
    permission: ['DATA_KEEP_UPDATE_DEPARTMETN'],
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
export function AddDepartment (param) {
  const data = toData('AddDepartment', param)
  return request({
    url: url,
    method: 'post',
    data: data,
    permission: ['DATA_KEEP_ADD_DEPARTMENT'],
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
  })
}
export function DeleteDepartment (param) {
  const data = toData('DeleteDepartment', param)
  return request({
    url: url,
    method: 'post',
    permission: ['DATA_KEEP_DELETE_DEPARTMENT'],
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
  })
}
