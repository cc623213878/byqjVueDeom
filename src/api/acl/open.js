import request from '@/plugin/axios'

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

export function SearchRoleClass (param) {
  const data = toData('SearchRoleClass', param)
  return request({
    url: 'system/role/searchRoleClass',
    method: 'post',
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}

export function searchDictionary (param) {
  const data = toData('searchDictionary', param)
  return request({
    url: '/dataKeep/searchDictionary',
    method: 'post',
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}

export function seachByCondition (param) {
  const data = toData('SeachByCondition', param)
  return request({
    url: '/classInfoManagement/seachByCondition',
    method: 'post',
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}

export function searchPost (param) {
  const data = toData('searchPost', param)
  return request({
    url: '/dataKeep/searchPost',
    method: 'post',
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}

export function departmentListFromDict (param) {
  const data = toData('DepartmentListFromDict', param)
  return request({
    url: '/departmentManagement/departmentListFromDict',
    method: 'post',
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
