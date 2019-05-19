<template>
  <el-dialog :visible.sync="dialogVisible" title="教室信息" @opened="dialogOpen" @closed="dialogClose">
    <el-form ref="form" :model="form" label-width="80px" size="small">
      <el-form-item :rules="[{ required: true, message: '不能为空'}]" prop="className" label="教室名称">
        <el-input v-model.trim="form.className"/>
      </el-form-item>
      <el-form-item label="考点">
        <el-select v-model="formFixedInfo.examPointCode" placeholder="请选择">
          <el-option
            v-for="item in examPointSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="考试类型">
        <el-select v-model="formFixedInfo.examTypeCode" placeholder="请选择">
          <el-option
            v-for="item in examTypeSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="容量">
        <el-input-number v-model="formFixedInfo.capacity" :min="0"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="formFixedInfo.status"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model.trim="form.remark" type="textarea"/>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="saveclass">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<style scoped>
.el-select {
  width: 100%;
}
</style>

<script>
import * as classService from '@/api/data/classInfo'
import * as dictionaryService from '@/api/data/dictionary'
export default {
  name: 'ClassEditForm',
  props: {
    classRow: {
      type: Object,
      default () {
        return {}
      }
    },
    value: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      examPointSelect: [],
      examTypeSelect: [],
      formFixedInfo: {
        examPointCode: null, // 类型：Number  必有字段  备注：考点
        examTypeCode: null, // 类型：Number  必有字段  备注：考试类型
        status: true, // 类型：Number  必有字段  备注：状态
        capacity: 0
      },
      form: {
        className: '', // 类型：String  必有字段  备注：教室名称
        remark: '' // 类型：String  必有字段  备注：备注
      }
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    getStatus () {
      let status = 1
      if (this.formFixedInfo.status === true) {
        status = 0
      } else {
        status = 1
      }
      return status
    },
    setStatus () {
      let status = true
      if (this.classRow.status === 0) {
        status = true
      } else {
        status = false
      }
      return status
    },
    // 获取选项
    uploadSelect (type) {
      let param = {}
      const types = ['EXAM_POINT', 'EXAM_TYPE']
      const selectTypes = ['examPointSelect', 'examTypeSelect']
      let tempSelect = []
      for (let i = 0; i < 2; i++) {
        param = {
          'type': types[i],
          'pageNum': 1,
          'pageSize': 100
        }
        dictionaryService.searchDictionary(param).then(data => {
          if (!data.code) {
            for (const item in data.dictionaryList.list) {
              tempSelect.push({ value: data.dictionaryList.list[item].code, label: data.dictionaryList.list[item].description })
            }
            this.$set(this, selectTypes[i], tempSelect)
            if (type === 1) {
              this.setDefaultOption(i)
            }
            tempSelect = []
          }
        })
      }
    },
    // 设置下拉框默认值
    setDefaultOption (i) {
      switch (i) {
        case 0:
          this.formFixedInfo.examPointCode = this.examPointSelect[0].value
          break
        case 1:
          this.formFixedInfo.examTypeCode = this.examTypeSelect[0].value
          break
      }
    },
    dialogOpen () {
      this.$refs.form.resetFields()
      if (this.classRow.id) {
        this.uploadSelect(0)
        const form = {}
        form.className = this.classRow.name
        form.remark = this.classRow.remark
        this.form = form
        this.formFixedInfo.status = this.setStatus()
        this.formFixedInfo.examPointCode = this.classRow.place
        this.formFixedInfo.examTypeCode = this.classRow.type
        this.formFixedInfo.capacity = this.classRow.capacity
      } else {
        this.uploadSelect(1)
        this.form = {}
      }
    },
    saveclass () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.classRow.id) {
            const data = {
              'id': this.classRow.id, // 类型：String  必有字段  备注：id
              'className': this.form.className, // 类型：String  必有字段  备注：教室名称
              'remark': this.form.remark, // 类型：String  必有字段  备注：备注
              'status': this.getStatus(), // 类型：Number  必有字段  备注：状态
              'examPointCode': this.formFixedInfo.examPointCode, // 类型：Number  必有字段  备注：考点
              'examTypeCode': this.formFixedInfo.examTypeCode, // 类型：Number  必有字段  备注：考试类型
              'capacity': this.formFixedInfo.capacity
            }
            classService.UpdateClassroom(data).then(data => {
              this.loading = false
              if (!data.hasOwnProperty('code')) {
                this.dialogVisible = false
                this.$emit('submit')
              }
            }).catch(err => {
              if (err) {
                this.loading = false
              }
            })
          } else {
            const data = {
              'className': this.form.className, // 类型：String  必有字段  备注：教室名称
              'remark': this.form.remark, // 类型：String  必有字段  备注：备注
              'status': this.getStatus(), // 类型：Number  必有字段  备注：状态
              'examPointCode': this.formFixedInfo.examPointCode, // 类型：Number  必有字段  备注：考点
              'examTypeCode': this.formFixedInfo.examTypeCode, // 类型：Number  必有字段  备注：考试类型
              'capacity': this.formFixedInfo.capacity
            }
            classService.AddClassroom(data).then(data => {
              this.loading = false
              if (!data.hasOwnProperty('code')) {
                this.dialogVisible = false
                this.$emit('submit')
              }
            }).catch(err => {
              if (err) {
                this.loading = false
              }
            })
          }
        } else {
          return false
        }
      })
    },
    close () {
      this.dialogClose()
    },
    dialogClose () {
      this.$refs['form'].resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
