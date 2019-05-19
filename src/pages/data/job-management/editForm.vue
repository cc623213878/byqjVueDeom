<template>
  <el-dialog :visible.sync="dialogVisible" title="岗位信息" @opened="dialogOpen" @closed="dialogClose">
    <el-form ref="form" :model="form" label-width="80px" size="small">
      <el-form-item :rules="[{ required: true, message: '不能为空'}]" prop="name" label="名称">
        <el-input v-model.trim="form.name"/>
      </el-form-item>
      <el-form-item prop="free" label="预设费用">
        <el-input-number v-model="free" :min="0" :step="10"/>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model.trim="form.remark" type="textarea"/>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="savePost">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import * as postService from '@/api/data/post'
export default {
  name: 'PostEditForm',
  props: {
    post: {
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
      free: 0,
      form: {
        name: '',
        remark: ''
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
      if (this.post.id) {
        const form = {}
        form.name = this.post.name
        form.remark = this.post.remark
        this.form = form
        this.free = this.post.free
      } else {
        this.form = {}
      }
    },
    savePost () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.post.id) {
            const data = {
              'id': this.post.id, // 类型：String  必有字段  备注：id
              'name': this.form.name, // 类型：String  必有字段  备注：类型 银行名称"BANK",人员类型 "PERSON_TYPE", 人员类别"PERSON_KIND", 汇款类型"MONEY"
              'free': this.free.toString(), // 类型：String  必有字段  备注：内容
              'remark': this.form.remark
            }
            postService.updatePost(data).then(data => {
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
              'name': this.form.name, // 类型：String  必有字段  备注：类型 银行名称"BANK",人员类型 "PERSON_TYPE", 人员类别"PERSON_KIND", 汇款类型"MONEY"
              'free': this.free.toString(), // 类型：String  必有字段  备注：内容
              'remark': this.form.remark
            }
            postService.addPost(data).then(data => {
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
      this.$refs.form.resetFields()
      this.$refs['form'].resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
