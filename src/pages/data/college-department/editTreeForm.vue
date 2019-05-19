<template>
  <el-dialog :visible.sync="dialogVisible" title="添加部门" @opened="dialogOpen" @closed="dialogClose">
    <el-form ref="form" :model="form" label-width="80px" size="small">
      <el-form-item :rules="[{ required: true, message: '不能为空'}]" prop="name" label="名称">
        <el-input v-model="form.name" maxlength="20"/>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="form.remark" type="textarea"/>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="savetree">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import * as treeService from '@/api/data/treeInfo'
export default {
  name: 'TreeEditForm',
  props: {
    nodeData: {
      type: Object,
      default () {
        return {}
      }
    },
    type: {
      type: Number,
      default () {
        return 0
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
        name: ''
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
      if (this.type === 2) {
        const form = {}
        form.name = this.nodeData.name
        form.remark = this.nodeData.remark
        this.form = form
      } else {
        this.form = {}
      }
    },
    savetree () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.type === 2) {
            // treeService.gettree(this.tree.id).then(data => {
            // })
            const data = {
              'id': this.nodeData.id, // 类型：String  必有字段  备注：修改部门id
              'name': this.form.name, // 类型：String  必有字段  备注：学院名称
              'parentId': this.nodeData.parentId, // 类型：String  必有字段  备注：父节点，如果是根节点为0
              'seq': 1, // 类型：Number  必有字段  备注：同级顺序
              'remark': this.form.remark, // 类型：String  必有字段  备注：备注
              'type': 1 // 类型：Number  必有字段  备注：在组织架构中type为0，数据字典中type为1
            }
            treeService.UpdateDepartment(data).then(data => {
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
          } else if (this.type === 1) {
            const data = {
              'name': this.form.name, // 类型：String  必有字段  备注：学院名称
              'parentId': this.nodeData.id, // 类型：String  必有字段  备注：父节点，如果是根节点为0
              'seq': 1, // 类型：Number  必有字段  备注：同级顺序
              'remark': this.form.remark, // 类型：String  必有字段  备注：备注
              'type': 1 // 类型：Number  必有字段  备注：在组织架构中type为0，数据字典中type为1
            }
            treeService.AddDepartment(data).then(data => {
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
              'name': this.form.name, // 类型：String  必有字段  备注：学院名称
              'parentId': '0', // 类型：String  必有字段  备注：父节点，如果是根节点为0
              'seq': 1, // 类型：Number  必有字段  备注：同级顺序
              'remark': this.form.remark, // 类型：String  必有字段  备注：备注
              'type': 1 // 类型：Number  必有字段  备注：在组织架构中type为0，数据字典中type为1
            }
            treeService.AddDepartment(data).then(data => {
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
