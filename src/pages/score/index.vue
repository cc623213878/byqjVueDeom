<template>
  <d2-container>
    <!-- 头部form -->
    <template slot="header">
      <el-form
        ref="searchForm"
        :inline="true"
        :model="searchForm"
        size="mini"
        style="margin-bottom: -18px;"
      >
        <el-form-item label="考试名称" prop="kmmc">
          <el-select v-model="searchForm.kmmc" placeholder="请选择" @change="changeKmmc">
            <el-option
              v-for="item in gradeCondition"
              :key="item.kmmc"
              :label="item.kmmc"
              :value="item.kmmc"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考试时间或次数" prop="kssjhcs">
          <el-select v-model="searchForm.kssjhcs" placeholder="请选择">
            <el-option v-for="item in kssjhcsList" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchFormSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearchFormReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearchFormRefresh">
            <d2-icon name="refresh"/>刷新
          </el-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 表格按钮 -->
    <div class="buttonLine">
      <el-button :loading="downLoading" type="primary" size="mini" @click="downLoadAll">
        <i class="el-icon-download"/>下载模板
      </el-button>
      <el-upload
        :action="action"
        :show-file-list="false"
        :before-upload="beforUpload"
        class="upload-demo"
      >
        <el-button type="primary" size="mini">
          <i class="el-icon-upload2"/>上传成绩
        </el-button>
      </el-upload>

      <el-button
        v-if="multipleSelection.length>0"
        type="danger"
        size="mini"
        @click="delAllSelect"
      >删除</el-button>
    </div>
    <!-- 表格内容 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      size="small"
      stripe
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" type="index" align="center"/>
      <el-table-column label="考试名称" prop="kmmc" align="center"/>
      <el-table-column label="考试时间或次数" prop="kssjhcs" align="center"/>

      <el-table-column fixed="right" label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-tooltip content="查看" placement="top">
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-search"
              circle
              @click="openDialog(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="上传" placement="top">
            <el-upload :action="action" :show-file-list="false" :before-upload="beforSingleUpload">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-upload2"
                circle
                @click="upLoadOne(scope.row.id)"
              />
            </el-upload>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格分页 -->
    <template slot="footer">
      <el-pagination
        :current-page="page.current"
        :page-size="page.size"
        :total="page.total"
        :page-sizes="[10,20, 30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin: -10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </template>
    <score-dialog
      :role="role"
      :table-data-ch="tableDataCh"
      :total="totalCh"
      v-model="showScoreDialog"
      :modal-name="role.name"
    />
  </d2-container>
</template>
<script>
import * as gradeManagement from '@/api/score/gradeManagement'
import scoreDialog from './scoreDialog'
export default {
  name: 'Score',
  components: {
    scoreDialog
  },
  data () {
    return {
      searchForm: {
        kssjhcs: '',
        kmmc: ''
      },
      loading: false,
      downLoading: false,
      tableData: [],
      multipleSelection: [],
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      sort: {
        kssjhcs: '',
        kmmc: ''
      },
      role: { id: '', name: '' },
      showScoreDialog: false,
      gradeCondition: [],
      kmmcs: [],
      kssjhcsList: [],
      action: process.env.VUE_APP_API + '/addGrade',
      actionSingle: process.env.VUE_APP_API + '/addSingleGrade',
      examId: '',
      // 子界面数据
      tableDataCh: [],
      totalCh: 0
    }
  },
  // 页面加载前
  mounted () {
    this.searchGradeCondition()
    this.getTableData()
  },
  methods: {
    // 获取搜索下拉框
    searchGradeCondition () {
      const param = {}
      gradeManagement.searchGradeCondition(param).then((data) => {
        if (!data.code) {
          this.gradeCondition = data.gradeCondition
          this.kmmcs = []
          this.kssjhcsList = []
          if (data.gradeCondition) {
            data.gradeCondition.forEach(element => {
              if (element) {
                this.kmmcs.push(element.kmmc)
              }
            })
          }
        }
      })
    },
    // 下拉框选中值发生变化
    changeKmmc (opt) {
      this.searchForm.kmmc = opt
      this.searchForm.kssjhcs = ''
      this.gradeCondition.forEach(element => {
        if (element) {
          if (element.kmmc === opt) {
            this.kssjhcsList = element.kssjhcsList
          }
        }
      })
    },
    // 获取表格内容
    getTableData () {
      const param = {
        'pageNum': this.page.current,
        'pageSize': this.page.size,
        'kssjhcs': this.searchForm.kssjhcs,
        'kmmc': this.searchForm.kmmc
      }
      this.loading = true
      gradeManagement.searchGrade(param).then(data => {
        this.loading = false
        if (!data.code) {
          this.tableData = data.gradeList.list
          this.page.total = parseInt(data.gradeList.total)
        }
      }).catch(err => {
        if (err) {
          this.loading = false
        }
      })
    },
    // 搜索查询
    handleSearchFormSubmit () {
      this.getTableData()
    },
    // 搜索重置
    handleSearchFormReset () {
      this.$refs.searchForm.resetFields()
      this.kssjhcsList = []
      this.getTableData()
    },
    // 搜索刷新
    handleSearchFormRefresh () {
      // this.searchForm = {}
      this.getTableData()
    },
    // 表格复选框改变
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 分页条数变化
    handleSizeChange (val) {
      this.page.size = val
      this.getTableData()
    },
    // 分页页面变化
    handleCurrentChange (val) {
      this.page.current = val
      this.getTableData()
    },
    // 表格多条删除
    delAllSelect () {
      this.$confirm('确认删除？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        const param = {
          'deleteList': this.multipleSelection.map(s => s.id)
        }
        this.loading = true
        gradeManagement.deleteGrade(param).then((data) => {
          this.loading = false
          if (!data.code) {
            this.getTableData()
          }
        }).catch(err => {
          if (err) {
            this.loading = false
          }
        })
      }).catch(() => {
      })
    },
    // 查看单个考试
    openDialog (row) {
      this.role = row
      this.searchPerson(row)
    },
    // 获取表格数据
    searchPerson (role) {
      const param = {
        'pageNum': 1,
        'pageSize': 5,
        'kssjhcs': role.kssjhcs,
        'bskmmc': role.kmmc
      }
      gradeManagement.searchPerson(param).then(data => {
        if (!data.code) {
          this.tableDataCh = data.personMessge.list
          this.totalCh = parseInt(data.personMessge.total)
          this.showScoreDialog = true
        }
      })
    },
    // 上传前
    beforUpload (file) {
      const Xls = file.name.split('.')
      if (Xls[1] === 'xls') {
        const param = new FormData()
        param.append('file', file)
        gradeManagement.addGrade(param).then(data => {
          if (!data.code) {
            this.getTableData()
          }
        })
        return false
      } else {
        this.$message.error('上传文件只能是 xls 格式!')
        return false
      }
    },
    // 单个考试上传前
    beforSingleUpload (file) {
      const Xls = file.name.split('.')
      if (Xls[1] === 'xls') {
        const param = new FormData()
        param.append('file', file)
        param.append('examId', this.examId)
        gradeManagement.addSingleGrade(param).then(data => {
          if (!data.code) {
            this.getTableData()
          }
        })
        return false
      } else {
        this.$message.error('上传文件只能是 xls 格式!')
        return false
      }
    },
    // 上传单个考试
    upLoadOne (id) {
      this.examId = id
    },
    // 下载考试模板
    downLoadAll () {
      const param = {}
      this.downLoading = true
      gradeManagement.downloadTemplate(param).then(data => {
        this.downLoading = false
        if (!data.code) {
          window.open(data.downloadUrl)
        }
      }).catch(err => {
        if (err) {
          this.downLoading = false
        }
      })
    }
  }
}
</script>

<style>
.d2-container-full__footer {
  display: flex;
  justify-content: flex-end;
}
.buttonLine {
  display: flex;
}

.buttonLine button {
  margin: 10px;
}
</style>

<style scoped>
.el-table td div {
  display: inline-block;
  margin: auto 5px;
}
</style>
