<template>
  <d2-container>
    <template slot="header">
      <el-form
        ref="searchForm"
        :inline="true"
        :model="searchInfo"
        size="mini"
        class="demo-form-inline"
        style="margin-bottom: -18px;"
      >
        <el-form-item label="选择字典">
          <el-select v-model="searchInfo.typeValue" placeholder="请选择" @change="selectChange">
            <el-option
              v-for="item in searchInfo.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button style="color:#666;" icon="el-icon-refresh" @click="pageRefresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="openAdd">新增</el-button>
    <el-button
      v-if="multipleSelection.length>0"
      type="danger"
      size="mini"
      icon="el-icon-delete"
      @click="alertDel"
    >删除</el-button>
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
      <el-table-column fixed type="selection" width="30"/>
      <el-table-column fixed type="index" label="序号" align="center" width="80"/>
      <el-table-column prop="description" label="名称" align="center" width="200"/>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip/>
      <el-table-column fixed="right" label="操作" align="center" width="60px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            title="编辑"
            size="mini"
            icon="el-icon-edit"
            circle
            @click="openEdit(scope.row)"
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
    <edit-form :dictionary="dictionary" v-model="editFormVisible" @submit="getTableData"/>
  </d2-container>
</template>

<script>
import * as dictionaryService from '@/api/data/dictionary'
import editForm from './editForm'
export default {
  name: 'RemittanceDictionary',
  components: { editForm },
  data () {
    return {
      searchInfo: {
        options: [{
          value: 'BANK',
          label: '银行'
        }, {
          value: 'PERSON_TYPE',
          label: '人员类型'
        }, {
          value: 'PERSON_KIND',
          label: '人员类别'
        }, {
          value: 'MONEY',
          label: '汇款类型'
        }],
        typeValue: 'BANK'
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      dictionary: {
      },
      tableData: [],
      multipleSelection: [],
      loading: false,
      editFormVisible: false
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    // 获取表格内容
    getTableData () {
      this.loading = true
      const param = {
        'type': this.searchInfo.typeValue,
        'pageNum': this.page.current,
        'pageSize': this.page.size
      }
      dictionaryService.searchDictionary(param).then(data => {
        if (!data.hasOwnProperty('code')) {
          this.loading = false
          this.tableData = []
          this.tableData = data.dictionaryList.list
          this.page.total = parseInt(data.dictionaryList.total)
        }
      }).catch(err => {
        if (err) {
          this.loading = false
        }
      })
    },
    selectChange () {
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
      this.dictionary = {
        'type': this.searchInfo.typeValue
      }
      this.editFormVisible = true
    },
    // 批量删除
    alertDel () {
      this.$confirm('确认删除？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        const data = {
          'dictionaryIdList': this.multipleSelection.map(s => s.id)
        }
        dictionaryService.deleteDictionary(data).then(() => {
          if (!data.hasOwnProperty('code')) {
            this.getTableData()
          }
        })
      }).catch(() => {
      })
    },
    // 表格中按钮-编辑
    openEdit (dictionary) {
      this.dictionary = dictionary
      this.editFormVisible = true
    }
  }
}
</script>
