<template>
  <el-dialog :visible.sync="dialogVisible" width="70%" @open="dialogOpen">
    <div slot="title">{{ role.kmmc }}</div>
    <el-table v-loading="loading" :data="tableData" size="small" stripe highlight-current-row>
      <el-table-column label="序号" type="index" align="center" fixed="left"/>
      <el-table-column label="姓名" prop="xm" align="center" fixed="left"/>
      <el-table-column label="证件号" prop="zjhm" align="center" fixed="left"/>
      <el-table-column label="学号" prop="xh" align="center" fixed="left"/>
      <el-table-column label="所属学校" prop="ssxx" align="center"/>
      <el-table-column label="学历" prop="xl" align="center"/>
      <el-table-column label="学制" prop="xz" align="center"/>
      <el-table-column label="年级" prop="nz" align="center"/>
      <el-table-column label="院系" prop="yx" align="center"/>
      <el-table-column label="专业" prop="zy" align="center"/>
      <el-table-column label="班级" prop="bj" align="center"/>
      <el-table-column label="笔试准考证号" prop="bszkzh" align="center"/>
      <el-table-column label="成绩单号" prop="cjdh" align="center"/>
      <el-table-column label="总分" prop="zf" align="center"/>
      <el-table-column label="成绩1" prop="cj1" align="center"/>
      <el-table-column label="成绩2" prop="cj2" align="center"/>
      <el-table-column label="成绩3" prop="cj3" align="center"/>
      <el-table-column label="成绩4" prop="cj4" align="center"/>
      <el-table-column label="备注" prop="bz" align="center"/>
    </el-table>
    <div slot="footer">
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
    </div>
  </el-dialog>
</template>
<script>
  import * as gradeManagement from '@/api/score/gradeManagement'

  export default {
    name: 'ScoreDialog',
    props: {
      role: {
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
      },
      total: {
        type: Number,
        default () {
          return 0
        }
      },
      tableDataCh: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        dialogVisible: false,
        loading: false,
        tableData: [],
        page: {
          current: 1,
          size: 5,
          total: 0
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
        // this.getTableData()
        this.page.total = this.total
        this.tableData = this.tableDataCh
      },
      // 获取表格数据
      getTableData () {
        const param = {
          'pageNum': this.page.current,
          'pageSize': this.page.size,
          'kssjhcs': this.role.kssjhcs,
          'bskmmc': this.role.kmmc
        }
        this.loading = true
        gradeManagement.searchPerson(param).then(data => {
          this.loading = false
          if (!data.code) {
            this.tableData = data.personMessge.list
            this.page.total = parseInt(data.personMessge.total)
          }
        }).catch(err => {
          if (err) {
            this.loading = false
          }
        })
      },
      // 分页页面数量改变
      handleSizeChange (val) {
        this.page.size = val
        this.getTableData()
      },
      // 分页页面改变
      handleCurrentChange (val) {
        this.page.current = val
        this.getTableData()
      }
    }
  }
</script>
