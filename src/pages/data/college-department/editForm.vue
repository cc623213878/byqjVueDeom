<template>
  <el-dialog :visible.sync="dialogVisible" title="人员信息" @opened="dialogOpen" @closed="dialogClose">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" size="small">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="workCode" label="工号学号">
            <el-input v-model.trim="form.workCode"/>
          </el-form-item>
          <el-form-item prop="name" label="姓名">
            <el-input v-model.trim="form.name"/>
          </el-form-item>
          <el-form-item prop="phone" label="联系电话">
            <el-input v-model.trim="form.phone"/>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="select.sex" placeholder="请选择">
              <el-option label="男" value="男"/>
              <el-option label="女" value="女"/>
            </el-select>
          </el-form-item>
          <el-form-item prop="pid" label="身份证号">
            <el-input v-model.trim="form.pid"/>
          </el-form-item>
          <el-form-item prop="bank" label="银行">
            <el-select v-model="select.bank" placeholder="请选择">
              <el-option
                v-for="item in options.bankSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="bankOpenCode" label="开户行代码">
            <el-input v-model.trim="form.bankOpenCode"/>
          </el-form-item>
          <el-form-item prop="bankOpen" label="开户行名称">
            <el-input v-model.trim="form.bankOpen"/>
          </el-form-item>
          <el-form-item prop="bankCode" label="银行卡号">
            <el-input v-model.trim="form.bankCode"/>
          </el-form-item>
          <el-form-item label="人员类别">
            <el-select v-model="select.category" placeholder="请选择">
              <el-option
                v-for="item in options.categorySelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="人员类型">
            <el-select v-model="select.type" placeholder="请选择">
              <el-option
                v-for="item in options.typeSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="汇款类型">
            <el-select v-model="select.moneyType" placeholder="请选择">
              <el-option
                v-for="item in options.moneyTypeSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label-width="140px" label="是否加入财务系统" prop="finance">
        <el-input v-model.trim="form.finance"/>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="saveRole">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<style>
.el-select {
  width: 100%;
}
</style>

<script>
import * as personService from '@/api/data/person'
import * as dictionaryService from '@/api/data/dictionary'
export default {
  name: 'PersonEditForm',
  props: {
    person: {
      type: Object,
      default () {
        return {}
      }
    },
    collegeId: {
      type: String,
      default () {
        return ''
      }
    },
    collegeName: {
      type: String,
      default () {
        return ''
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
      options: {
        bankSelect: [],
        typeSelect: [],
        categorySelect: [],
        moneyTypeSelect: []
      },
      select: {
        bank: '', // 类型：String  必有字段  备注：银行CODE
        type: '', // 类型：String  必有字段  备注：人员类型
        category: '', // 类型：String  必有字段  备注：人员类别
        moneyType: '', // 类型：String  必有字段  备注：汇款类型
        sex: '男' // 类型：String  必有字段  备注：无
      },
      form: {
        name: '', // 类型：String  必有字段  备注：姓名
        workCode: '', // 类型：String  必有字段  备注：工号、学号等
        pid: '', // 类型：String  必有字段  备注：身份证号
        bankOpenCode: '', // 类型：String  必有字段  备注：开户行代码
        bankOpen: '', // 类型：String  必有字段  备注：开户行
        bankCode: '', // 类型：String  必有字段  备注：银行卡号
        phone: '', // 类型：String  必有字段  备注：无
        finance: '' // 类型：String  必有字段  备注：是否入财务系统
      },
      rules: {
        // 校验手机号码，主要通过validator来指定验证器名称
        name: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        workCode: [{
          required: true,
          message: '请输入工号学号',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          pattern: /^1[34578]\d{9}$/,
          message: '请输入正确的手机号',
          trigger: ['blur', 'change']
        }],
        pid: [{
          required: true,
          message: '请输入身份证号',
          trigger: 'blur'
        }, {
          pattern: /\d{17}[\d|X]/,
          message: '请输入正确的身份证号',
          trigger: ['blur', 'change']
        }],
        bankOpenCode: [{
          required: true,
          message: '请输入开户行代码',
          trigger: 'blur'
        }],
        bankOpen: [{
          required: true,
          message: '请输入开户行名称',
          trigger: 'blur'
        }],
        bankCode: [{
          required: true,
          message: '请输入银行卡号',
          trigger: 'blur'
        }],
        finance: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }]
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
    // 获取选项
    uploadSelect (type) {
      let param = {}
      const types = ['BANK', 'PERSON_TYPE', 'PERSON_KIND', 'MONEY']
      const selectTypes = ['bankSelect', 'typeSelect', 'categorySelect', 'moneyTypeSelect']
      let tempSelect = []
      for (let i = 0; i < 4; i++) {
        param = {
          'type': types[i],
          'pageNum': 1,
          'pageSize': 100
        }
        dictionaryService.searchDictionary(param).then(data => {
          if (!data.code) {
            for (const item in data.dictionaryList.list) {
              tempSelect.push({ value: data.dictionaryList.list[item].id, label: data.dictionaryList.list[item].description })
            }
            this.$set(this.options, selectTypes[i], tempSelect)
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
          this.select.bank = this.options.bankSelect[0].value
          break
        case 1:
          this.select.type = this.options.typeSelect[0].value
          break
        case 2:
          this.select.category = this.options.categorySelect[0].value
          break
        case 3:
          this.select.moneyType = this.options.moneyTypeSelect[0].value
          break
      }
    },
    dialogOpen () {
      this.$refs.form.resetFields()
      if (this.person.id) {
        this.uploadSelect(0)
        const form = {}
        form.name = this.person.name
        form.workCode = this.person.workCode // 类型：String  必有字段  备注：工号、学号等
        form.pid = this.person.pid // 类型：String  必有字段  备注：身份证号
        form.bankOpenCode = this.person.bankOpenCode // 类型：String  必有字段  备注：开户行代码
        form.bankOpen = this.person.bankOpen // 类型：String  必有字段  备注：开户行
        form.bankCode = this.person.bankCode // 类型：String  必有字段  备注：银行卡号
        form.phone = this.person.phone // 类型：String  必有字段  备注：无
        form.finance = this.person.finance // 类型：String  必有字段  备注：是否入财务系统
        this.form = form
        this.select.bank = this.person.bank // 类型：String  必有字段  备注：银行CODE
        this.select.type = this.person.type // 类型：String  必有字段  备注：人员类型
        this.select.category = this.person.category // 类型：String  必有字段  备注：人员类别
        this.select.moneyType = this.person.moneyType // 类型：String  必有字段  备注：汇款类型
        this.select.sex = this.person.sex // 类型：String  必有字段  备注：无
      } else {
        this.uploadSelect(1)
        this.form = {}
      }
    },
    saveRole () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          const data = {
            id: this.person.id,
            name: this.form.name, // 类型：String  必有字段  备注：姓名
            collegeId: this.collegeId, // 类型：String  必有字段  备注：所属学院或部门ID
            workCode: this.form.workCode, // 类型：String  必有字段  备注：工号、学号等
            pid: this.form.pid, // 类型：String  必有字段  备注：身份证号
            bankOpenCode: this.form.bankOpenCode, // 类型：String  必有字段  备注：开户行代码
            bankOpen: this.form.bankOpen, // 类型：String  必有字段  备注：开户行
            bankCode: this.form.bankCode, // 类型：String  必有字段  备注：银行卡号
            phone: this.form.phone, // 类型：String  必有字段  备注：无
            finance: this.form.finance, // 类型：String  必有字段  备注：是否入财务系统
            bank: this.select.bank.toString(), // 类型：String  必有字段  备注：银行CODE
            type: this.select.type.toString(), // 类型：String  必有字段  备注：人员类型
            category: this.select.category.toString(), // 类型：String  必有字段  备注：人员类别
            moneyType: this.select.moneyType.toString(), // 类型：String  必有字段  备注：汇款类型
            sex: this.select.sex // 类型：String  必有字段  备注：无
          }
          if (this.person.id) {
            personService.modifyPerson(data).then(data => {
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
            personService.addPerson(data).then(data => {
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
