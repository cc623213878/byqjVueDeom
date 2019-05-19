<template>
  <el-dialog :visible.sync="dialogVisible" title="字典信息" @opened="dialogOpen" @closed="dialogClose">
    <el-form ref="form" :model="form" label-width="80px" size="small">
      <el-form-item :rules="[{ required: true, message: '不能为空'}]" prop="description" label="名称">
        <el-input v-model.trim="form.description"/>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model.trim="form.remark" type="textarea"/>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="saveDictionary">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import * as dictionaryService from '@/api/data/dictionary'
export default {
  name: 'DictionaryEditForm',
  props: {
    dictionary: {
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
      form: {
        remark: '',
        description: ''
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
    dialogOpen () {
      this.$refs.form.resetFields()
      if (this.dictionary.id) {
        const form = {}
        form.description = this.dictionary.description
        form.remark = this.dictionary.remark
        this.form = form
      } else {
        this.form = {}
      }
    },
    saveDictionary () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.dictionary.id) {
            // dictionaryService.getDictionary(this.dictionary.id).then(data => {
            // })
            const data = {
              'id': this.dictionary.id, // 类型：String  必有字段  备注：id
              'type': this.dictionary.type, // 类型：String  必有字段  备注：类型 银行名称"BANK",人员类型 "PERSON_TYPE", 人员类别"PERSON_KIND", 汇款类型"MONEY"
              'description': this.form.description, // 类型：String  必有字段  备注：内容
              'remark': this.form.remark
            }
            dictionaryService.updateDictionary(data).then(data => {
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
              'type': this.dictionary.type, // 类型：String  必有字段  备注：类型 银行名称"BANK",人员类型 "PERSON_TYPE", 人员类别"PERSON_KIND", 汇款类型"MONEY"
              'description': this.form.description, // 类型：String  必有字段  备注：内容
              'remark': this.form.remark
            }
            dictionaryService.addDictionary(data).then(data => {
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
