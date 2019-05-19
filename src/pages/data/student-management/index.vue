<template>
  <d2-container>
    <template slot="header">
      <el-button @click="addstu">
        添加
      </el-button>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="number"
          label="学号"/>
        <el-table-column
          prop="name"
          label="姓名"
          width="180"/>
        <el-table-column
          prop="date"
          label="入学时间"
          width="180"/>
        <el-table-column
          prop="status"
          label="在学状态"/>
        <el-table-column
          prop="gender"
          label="性别"/>
        <el-table-column
          prop="college"
          label="学院"/>
        <el-table-column
          prop="idCard"
          label="身份证号"/>
      </el-table>
    </template>
    <template slot="footer">
      <el-pagination
        :current-page="currentPage"
        page-size="10"
        :total="total"
        :page-sizes="[10,20, 30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin: -10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </template>
  </d2-container>
</template>

<script>
  export default {
    name: 'StudentManagement',
    data () {
      return {
        currentPage: 1,
        total: 0,
        tableData: [],
        totalData: []
      }
    },
    mounted () {
      this.addstu()
    },
    methods: {
      addstu () {
        this.totalData.push({
          number: this.total,
          date: '2019-5-12',
          name: 'chchyu',
          status: '在学',
          gender: '男',
          college: '数学与信息学院',
          idCard: '522526199609181813'
        })
        this.total = this.totalData.length
        this.tableData = this.totalData.slice((this.currentPage - 1) * 10, (this.currentPage) * 10)
      },
      handleSizeChange () {

      },
      handleCurrentChange (pageNo) {
        this.currentPage = pageNo
        this.tableData = this.totalData.slice((this.currentPage - 1) * 10, (this.currentPage) * 10)
      }
    }
  }
</script>

<style>
</style>
