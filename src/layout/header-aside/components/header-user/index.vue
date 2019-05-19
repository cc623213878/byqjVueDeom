<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">你好 {{ info.name }}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="changePwd">
        <d2-icon name="pencil" class="d2-mr-5"/>修改密码
      </el-dropdown-item>
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>注销
      </el-dropdown-item>
    </el-dropdown-menu>
    <el-dialog :visible.sync="dialogFormVisible" title="修改密码" class="dialogWidth" @before-close="close">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" type="password" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" type="password" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="reNewPassword">
          <el-input v-model="form.reNewPassword" type="password" placeholder="请输入"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="UpdatePassword">确 定</el-button>
      </div>
    </el-dialog>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import * as loginJs from '@/api/sys/login'
import router from '@/router/index'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      loading: false,
      form: {
        oldPassword: '',
        newPassword: '',
        reNewPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        reNewPassword: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('d2admin/user', ['info'])
  },
  methods: {
    ...mapActions('d2admin/account', ['logout']),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        vm: this,
        confirm: true
      })
    },
    changePwd () {
      console.log('修改')
      this.dialogFormVisible = true
    },
    // 修改密码
    UpdatePassword () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const param = {
            'oldPassword': this.form.oldPassword,
            'newPassword': this.form.newPassword
          }
          this.loading = true
          loginJs.UpdatePassword(param).then(data => {
            this.loading = false
            if (!data.code) {
              this.dialogFormVisible = false
              setTimeout(() => {
                router.push({
                  name: 'login'
                })
              }, 1000)
            }
          }).catch(err => {
            if (err) {
              this.loading = false
              this.dialogFormVisible = false
            }
          })
        }
      })
    },
    close () {
      console.log('关闭')
      this.$refs.form.resetFields()
    }
  }

}
</script>
<style>
.el-dialog{
  width:400px;
}
</style>
