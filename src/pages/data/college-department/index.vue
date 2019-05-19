<template>
  <el-container class="out">
    <el-aside width="200px">
      <p>学院部门</p>
      <el-button-group class="aside-button">
        <el-button size="mini" @click="editTree">{{ btn_editTree }}</el-button>
        <el-button :class="{hidden:editTreeIsActive}" size="mini" @click="addTopTree">添加学院</el-button>
      </el-button-group>
      <el-tree
        :data="treeData"
        :props="defaultProps"
        :loading="loading"
        :expand-on-click-node="false"
        node-key="id"
        default-expand-all
        @node-click="handleNodeClick"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span :class="{hidden:editTreeIsActive}">
            <el-button type="text" size="mini" @click.stop="() => openTreeAdd(data)">添加</el-button>
            <el-button type="text" size="mini" @click.stop="() => openTreeEdit(data)">修改</el-button>
            <el-button type="text" size="mini" @click.stop="() => treeDelete(data)">删除</el-button>
          </span>
        </span>
      </el-tree>
    </el-aside>
    <el-container v-if="collegeId!=''">
      <el-header height="auto">
        <el-form
          :inline="true"
          :model="searchInfo"
          size="mini"
          class="demo-form-inline"
          style="margin-bottom: -18px;"
        >
          <el-form-item label="姓名">
            <el-input v-model="searchInfo.name" placeholder="姓名"/>
          </el-form-item>
          <el-form-item label="学号工号">
            <el-input v-model="searchInfo.workCode" placeholder="学号工号"/>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="searchInfo.phone" placeholder="电话"/>
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
      </el-header>
      <el-main>
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
          size="small"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column fixed type="selection" width="30"/>
          <el-table-column fixed type="index" label="序号" align="center" width="80"/>
          <el-table-column prop="workCode" label="学号工号" width="120" align="center"/>
          <el-table-column prop="name" label="姓名" align="center" show-overflow-tooltip/>
          <el-table-column prop="phone" label="联系电话" width="120" align="center"/>
          <el-table-column prop="sex" label="性别" width="120" align="center"/>
          <el-table-column prop="pid" label="身份证号" width="130" align="center"/>
          <el-table-column prop="bankDescription" label="银行" width="120" align="center"/>
          <el-table-column prop="bankOpenCode" label="开户行代码" width="120" align="center"/>
          <el-table-column prop="bankOpen" label="开户行名称" width="120" align="center"/>
          <el-table-column prop="bankCode" label="银行卡号" width="120" align="center"/>
          <el-table-column prop="personKindDescription" label="人员类别" width="120" align="center"/>
          <el-table-column prop="personTypeDescription" label="人员类型" width="120" align="center"/>
          <el-table-column prop="moneyDescription" label="汇款类型" width="120" align="center"/>
          <el-table-column prop="finance" label="是否加入财务系统" width="120" align="center"/>
          <el-table-column fixed="right" label="操作" align="center" min-width="60px">
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
      </el-main>
      <el-footer height="53px">
        <!-- 分页 -->
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
      </el-footer>
    </el-container>
    <edit-tree-form
      :node-data="nodeData"
      :type="type"
      v-model="editTreeFormVisible"
      @submit="getTreeData"
    />
    <edit-form
      :person="person"
      :college-id="collegeId"
      :college-name="collegeName"
      v-model="editFormVisible"
      @submit="getTableData"
    />
  </el-container>
</template>

<script>
import * as treeService from '@/api/data/treeInfo'
import * as personService from '@/api/data/person'
import editTreeForm from './editTreeForm'
import editForm from './editForm'
export default {
  name: 'CollegeDepartment',
  components: { editTreeForm, editForm },
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'deptList',
        label: 'name'
      },

      collegeId: '',
      collegeName: '',
      searchInfo: {
        name: '',
        workCode: '',
        phone: ''
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      nodeData: {
      },
      person: {},
      type: 1, // 1添加，2编辑
      tableData: [],
      multipleSelection: [],
      loading: false,
      editFormVisible: false,
      editTreeFormVisible: false,
      editTreeIsActive: true,
      btn_editTree: '编辑'
    }
  },
  mounted () {
    this.getTreeData()
    this.$notify({
      title: '提示',
      message: '请选择部门',
      duration: 1000
    })
  },
  methods: {
    // 获取树内容
    getTreeData () {
      this.loading = true
      const param = {
      }
      treeService.DepartmentListFromDict(param).then(data => {
        if (!data.hasOwnProperty('code')) {
          this.loading = false
          this.treeData = []
          this.treeData = data.DeptList
        }
      }).catch(err => {
        if (err) {
          this.loading = false
        }
      })
    },
    // 点击节点时触发
    handleNodeClick (data) {
      this.collegeId = data.id
      this.collegeName = data.name
      this.getTableData()
    },
    addTopTree () {
      this.type = 3
      this.editTreeFormVisible = true
    },
    openTreeAdd (nodeData) {
      this.nodeData = nodeData
      this.type = 1
      this.editTreeFormVisible = true
    },
    openTreeEdit (nodeData) {
      this.nodeData = nodeData
      this.type = 2
      this.editTreeFormVisible = true
    },

    treeDelete (nodeData) {
      this.$confirm('确认删除？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        const data = {
          'id': nodeData.id
        }
        treeService.DeleteDepartment(data).then(() => {
          if (!data.hasOwnProperty('code')) {
            this.getTreeData()
          }
        })
      }).catch(() => {
      })
    },
    // 添加学院部门
    editTree () {
      if (this.editTreeIsActive) {
        this.editTreeIsActive = false
        this.btn_editTree = '返回'
      } else {
        this.editTreeIsActive = true
        this.btn_editTree = '编辑'
      }
    },
    // 获取表格内容
    getTableData () {
      this.loading = true
      const param = {
        'name': this.searchInfo.name, // 类型：String  可有字段  备注：姓名
        'workCode': this.searchInfo.workCode, // 类型：String  可有字段  备注：工号学号
        'phone': this.searchInfo.phone, // 类型：String  可有字段  备注：电话
        'collegeId': this.collegeId, // 类型：String  可有字段  备注：部门id
        'pageNum': this.page.current,
        'pageSize': this.page.size
      }
      personService.searchPerson(param).then(data => {
        this.loading = false
        if (!data.code) {
          this.tableData = []
          this.tableData = data.PersonList.list
          this.page.total = parseInt(data.PersonList.total)
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
      this.searchInfo.name = ''
      this.searchInfo.workCode = ''
      this.searchInfo.phone = ''
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
      this.person = {}
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
          'personIdList': this.multipleSelection.map(s => s.id)
        }
        personService.deletePerson(data).then(() => {
          if (!data.hasOwnProperty('code')) {
            this.getTableData()
          }
        })
      }).catch(() => {
      })
    },
    // 表格中按钮-编辑
    openEdit (person) {
      this.person = person
      this.editFormVisible = true
    }
  }
}
</script>

<style scope>
.out {
  position: absolute;
  top: 0px;
  right: 20px;
  bottom: 0px;
  left: 0px;
  border: 1px solid #cfd7e5;
  border-bottom: none;
}
.el-header,
.el-footer,
.el-main {
  padding: 20px;
  background: #fff;
}
.el-footer {
  border-top: 1px solid #cfd7e5;
  display: flex;
  align-items: center;
}
.el-header {
  border-bottom: 1px solid #cfd7e5;
  display: flex;
  align-items: center;
  -webkit-box-orient: vertical;
  /* overflow: hidden; */
}

.el-aside {
  border-right: 1px solid #cfd7e5;
  background-color: #fff;
}
.el-aside > p {
  font-size: 18px;
  font-weight: 800;
  padding: 20px 20px 0 20px;
}
.aside-button {
  padding: 0 20px 20px 20px;
}
/* .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
} */
.custom-tree-node {
  font-size: 12px;
}
.hidden {
  display: none;
}
</style>

<style>
.el-tree-node > .el-tree-node__children {
  width: 100%;
  overflow: visible;
}
.el-tree-node {
  width: 100%;
  overflow: visible;
}
</style>
