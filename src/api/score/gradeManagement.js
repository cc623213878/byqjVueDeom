import request from '@/plugin/axios'

const url = 'gradeManagement'
const urlAddGrade = 'addGrade'
const urlAddSingleGrade = 'addSingleGrade'

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

// 删除考试
export function deleteGrade (param) {
  const data = toData('deleteGrade', param)
  return request({
    url: url,
    method: 'post',
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

// 查询考试
export function searchGrade (param) {
  const data = toData('searchGrade', param)
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

// 查询考试条件类型
export function searchGradeCondition (param) {
  const data = toData('searchGradeCondition', param)
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

// 查询考试人员
export function searchPerson (param) {
  const data = toData('searchPerson', param)
  return request({
    url: url,
    method: 'post',
    data: data,
    loading: {
      type: 'loading',
      options: {
        fullscreen: true,
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      }
    }
  })
}

// 下载模板
export function downloadTemplate (param) {
  const data = toData('downloadTemplate', param)
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

// 上传模板
export function addGrade (param) {
  return request({
    url: urlAddGrade,
    method: 'post',
    data: param,
    loading: {
      type: 'nprogress',
      interval: 500
    },
    success: {
      type: 'message',
      options: {
        message: '上传成功',
        type: 'success'
      }
    }
  })
}

// 上传单个模板
export function addSingleGrade (param) {
  return request({
    url: urlAddSingleGrade,
    method: 'post',
    data: param,
    loading: {
      type: 'nprogress',
      interval: 500
    },
    success: {
      type: 'message',
      options: {
        message: '上传成功',
        type: 'success'
      }
    }
  })
}
