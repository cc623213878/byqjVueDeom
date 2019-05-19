<template>
  <div class="login-page">
    <div id="login" class="layer bg"/>
    <div class="layer flex-center">
      <!-- logo部分 -->
      <div class="logo-group">
        <img src="@/pages/login/image/logo.png" alt="logo">
      </div>
      <!-- 表单部分 -->
      <div class="form-group">
        <el-card>
          <el-form
            ref="loginForm"
            :rules="rules"
            :model="formLogin"
            label-position="top"
            size="default"
          >
            <el-form-item prop="userId">
              <el-input v-model="formLogin.userId" type="text" placeholder="用户名">
                <template slot="prepend">用户名</template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="formLogin.password" type="password" placeholder="密码">
                <template slot="prepend">&nbsp;&nbsp;密码&nbsp;&nbsp;</template>
              </el-input>
            </el-form-item>
            <!-- <el-form-item prop="code">
              <el-input v-model="formLogin.code" type="text" placeholder="- - - -">
                <template slot="prepend">验证码</template>
                <template slot="append">
                  <img
                    :src="imageCode"
                    class="login-code"
                    title="点击刷新验证码"
                    alt="验证码"
                    @click="getImageCode"
                  >
                </template>
              </el-input>
            </el-form-item>-->
            <el-button-group>
              <el-button size="default" type="primary" @click="submit">登录</el-button>
            </el-button-group>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// import * as logins from '@/api/sys/login'
import util from '@/libs/util'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('验证码为4位'))
      } else {
        callback()
      }
    }
    return {
      // 表单
      formLogin: {
        userId: 'admin',
        password: '888888',
        code: 'v9am'
      },
      // 校验
      rules: {
        userId: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }]
      },
      uuid: '',
      imageCode: ''
    }
  },
  mounted () {
    // 初始化例子插件

    var d = new Date().getTime()
    this.uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    // this.getImageCode()
  },
  methods: {
    ...mapActions('d2admin/account', ['login']),
    /**
     * @description 接收选择一个用户快速登录的事件
     * @param {Object} user 用户信息
     */
    handleUserBtnClick (user) {
      this.formLogin.userId = user.userId
      this.formLogin.password = user.password
      // this.submit();
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          util.cookies.remove('token')
          this.login({
            vm: this,
            deviceId: this.uuid,
            imageCode: this.formLogin.code.toLowerCase(),
            userId: this.formLogin.userId,
            password: this.formLogin.password
          })
        }
      })
    }
    // 获取验证码
    // getImageCode () {
    //   const param = {
    //     'head': {
    //       'appVerNo': process.env.VUE_APP_VER_NO,
    //       'functionNo': 'GetImageCode'
    //     },
    //     'param': {
    //       'deviceId': this.uuid
    //     }
    //   }
    //   logins.GetImageCode(param).then(data => {
    //     if (!data.hasOwnProperty('code')) {
    //       this.imageCode = 'data:image/png;base64,' + data.imageCode
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss">
@import "./style.scss";
.login-code {
  width: 80px;
  cursor: pointer;
}
</style>
