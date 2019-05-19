<template>
  <d2-container>
    <template slot="header">
      <el-form
        :inline="true"
        :model="searchInfo"
        size="mini"
        class="demo-form-inline"
        style="margin-bottom: -18px;"
      >
        <el-form-item label="教室名">
          <el-input v-model="searchInfo.className" placeholder="教室名"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchFormSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearchFormReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="color:#666;" icon="el-icon-refresh" @click="pageRefresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="openAdd">新增</el-button>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="tableData"
      :default-sort="{prop: 'date', order: 'descending'}"
      size="small"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="index" label="序号" align="center" width="80"/>
      <el-table-column prop="placeDescription" label="考点" align="center" width="120"/>
      <el-table-column prop="name" label="名称" align="center" show-overflow-tooltip/>
      <el-table-column prop="capacity" label="容量" align="center" show-overflow-tooltip/>
      <el-table-column prop="typeDescription" label="考试类型" align="center" show-overflow-tooltip/>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status==1">
            <el-tag size="small" type="info" @click="UpdateStatusOpen(scope.row)">已禁用</el-tag>
          </div>
          <div v-if="scope.row.status==0">
            <el-tag size="small" type="success" @click="UpdateStatusClose(scope.row)">已启用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip/>
      <el-table-column fixed="right" label="操作" align="center" min-width="150px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            title="编辑"
            size="mini"
            icon="el-icon-edit"
            circle
            @click="openEdit(scope.row)"
          />
          <el-button
            type="danger"
            title="删除"
            size="mini"
            icon="el-icon-delete"
            circle
            @click="handleDelete(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-pagination
        :current-page="page.current"
        :page-sizes="[10,20,30]"
        :page-size="page.size"
        :total="page.total"
        layout="total, sizes, prev, pager, next"
        style="margin: -10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </template>
    <edit-form :class-row="classRow" v-model="editFormVisible" @submit="getTableData"/>
  </d2-container>
</template>

<script>
import * as classService from '@/api/data/classInfo'
import editForm from './editForm'
export default {
  name: 'ClassManagement',
  components: { editForm },
  data () {
    return {
      searchInfo: {
        className: '',
        typeOptions: [{
          value: null,
          label: '全部'
        }, {
          value: 0,
          label: '已启用'
        }, {
          value: 1,
          label: '已停用'
        }],
        typeValue: null
      },
      classRow: {
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      },

      tableData: [],
      loading: false,
      editFormVisible: false
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.loading = true
      const param = {
        'className': this.searchInfo.className, // 类型：String  可有字段  备注：教室名称
        'status': null, // 类型：String  可有字段  备注：状态
        'examPointCode': null, // 类型：String  可有字段  备注：考点
        'examTypeCode': null,
        'pageNum': this.page.current,
        'pageSize': this.page.size
      }
      classService.SeachByCondition(param).then(data => {
        if (!data.hasOwnProperty('code')) {
          this.loading = false
          this.tableData = []
          this.tableData = data.classInfoList.list
          this.page.total = parseInt(data.classInfoList.total)
        }
      }).catch(err => {
        if (err) {
          this.loading = false
        }
      })
    },
    handleSearchFormSubmit () {
      this.getTableData()
    },
    handleSearchFormReset () {
      this.searchInfo.className = ''
      this.getTableData()
    },
    // 搜索刷新
    pageRefresh () {
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
    // 添加窗口弹出
    openAdd () {
      this.classRow = {}
      this.editFormVisible = true
    },
    // 表格中按钮-编辑
    openEdit (data) {
      this.classRow = data
      this.editFormVisible = true
    },
    // 表格中按钮-删除
    handleDelete (id) {
      this.$confirm('确认删除？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        const data = {
          'id': id
        }
        classService.DeleteClassroom(data).then(() => {
          if (!data.hasOwnProperty('code')) {
            this.getTableData()
          }
        })
      }).catch(() => {
      })
    },
    UpdateStatus (row) {
      let status = 0
      if (row.status === 1) {
        status = 0
      } else {
        status = 1
      }
      const data = {
        'id': row.id,
        'status': status
      }
      classService.UpdateStatus(data).then(() => {
        if (!data.hasOwnProperty('code')) {
          this.getTableData()
        }
      })
    },
    UpdateStatusOpen (row) {
      this.$confirm('确认启用？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.UpdateStatus(row)
      }).catch(() => {
      })
    },
    UpdateStatusClose (row) {
      this.$confirm('确认禁用？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.UpdateStatus(row)
      }).catch(() => {
      })
    }
  }
}
</script>

<style>
.el-tag {
  cursor: pointer;
}
</style>
