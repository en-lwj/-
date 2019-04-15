<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-container-header">
        <el-button class="filter-item search-list-btn" size="small" @click="searchListClose = !searchListClose">
          <span>筛选条件</span>
          <i :class="searchListClose ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" />
        </el-button>
      </div>
      <div :class="searchListClose ? 'close' : ''" class="filter-container-body">
        <el-row v-loading="searchListLodaing" element-loading-text="筛选条件拼命加载中...">
          <!-- 条件筛选 -->
          <el-form ref="form" :model="listQuery" label-width="100px" size="mini">
            <el-form-item class="yz-inline" label="用户名：" prop="name">
              <el-input v-model="listQuery.username" class="single-border" />
            </el-form-item>
            <el-form-item class="yz-inline" label="姓名：" prop="name">
              <el-input v-model="listQuery.realName" class="single-border" />
            </el-form-item>
            <el-form-item class="yz-block" label="状态：" prop="status">
              <el-radio-group v-model="listQuery.status">
                <el-radio v-for="item in statusOptions" :key="item.value" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <el-row class="yz-center">
            <el-button v-waves class="filter-item" size="small" type="primary" @click="getList">
              确认
            </el-button>
          </el-row>
        </el-row>
      </div>
    </div>

    <!-- 用户信息 -->
    <div class="yz-panel">
      <div class="yz-panel-header">
        <div class="yz-panel-header-left">
          <span class="yz-panel-title">用户</span>
        </div>
        <el-row class="yz-panel-header-right">
          <el-button class="filter-item" type="primary" icon="el-icon-plus" size="mini" @click="showAddUserDialog()">
            新增
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showChangePwdDialog()">
            修改密码
          </el-button>
        </el-row>
      </div>
      <div class="yz-panel-body">
        <el-table
          v-loading="listLoading"
          :max-height="tableMaxHeight"
          :data="list"
          border
        >
          <el-table-column :index="indexMethod" label="序号" align="center" type="index" width="55" />
          <el-table-column label="用户名" min-width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" min-width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.realName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色" min-width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.roleNames }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" min-width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.email || '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="最后登录时间" min-width="160px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.lastLogin }}</span>
              <!-- <span>{{ scope.row.lastLogin | lastLoginFilter | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
            </template>
          </el-table-column>
          <el-table-column label="登录次数" width="80px" align="center">
            <template slot-scope="scope">
              <el-tag>{{ scope.row.loginCount | loginCountFilter }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" class-name="status-col" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusTypeFilter">
                {{ scope.row.status | statusFilter }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="200" class-name="small-padding">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="showEditUserDialog(scope.row)">
                修改用户
              </el-button>
              <el-button size="mini" type="danger" @click="deleteRow(scope.$index, scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination :current-page="pager.pageNum" :page-sizes="[10,20,30, 50]" :page-size="pager.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="update_pwd_dialog">
      <update-pwd-dialog :visible.sync="update_pwd_dialog" @reload="getList" />
    </div>

    <!-- 新增和修改用户弹窗 -->
    <div v-if="add_or_put_dialog">
      <add-user-dialog :visible.sync="add_or_put_dialog" :row.sync="select_row" :dialog-type="add_or_put_dialog_type" @reload="getList" />
    </div>
  </div>
</template>

<script>
import api from '@/api/basic/userManage'
import addUserDialog from './modules/addUser'
import updatePwdDialog from './modules/updatePwd'
import resize from './mixins/resize'

export default {
  components: {
    addUserDialog,
    updatePwdDialog
  },
  filters: {
    statusTypeFilter(status) {
      const statusMap = {
        'V': 'success',
        'I': 'danger'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        'V': '可用',
        'I': '禁用'
      }
      return statusMap[status]
    },
    parseTime: Common.parseTime,
    lastLoginFilter(val) {
      return val || ''
    },
    loginCountFilter(val) {
      return val || 0
    }
  },
  mixins: [resize],
  data() {
    return {
      tableMaxHeight: 300,
      searchListLodaing: false,
      searchListClose: true,
      list: [],
      total: null,
      listLoading: false,
      listQuery: {
        status: '',
        realName: '',
        username: ''
      },
      pager: {
        pageNum: 1,
        pageSize: 20
      },
      statusOptions: [
        { label: '全部', value: '' },
        { label: '可用', value: 'V' },
        { label: '禁用', value: 'I' }
      ],
      // 选择的table行
      select_row: undefined,
      update_pwd_dialog: false,
      add_or_put_dialog: false,
      add_or_put_dialog_type: 'add'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取表格数据
    getList() {
      this.listLoading = true
      api.getUserList(this.pager, this.listQuery).then(res => {
        if (res.status !== 200) {
          this.listLoading = false
          return this.$message.error('用户列表获取失败！')
        }
        this.list = res.data.rows
        this.total = res.data.total
        this.listLoading = false
      })
    },
    // 表格序号
    indexMethod(index) {
      return (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
    },
    // 重置表格数据
    resetList() {
      this.pager.pageNum = 1
      this.getList()
    },
    // 改变表格显示数量
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getList()
    },
    // 改变页数
    handleCurrentChange(val) {
      this.pager.pageNum = val
      this.getList()
    },
    // 显示修改密码弹框
    showChangePwdDialog() {
      this.update_pwd_dialog = true
    },
    // 显示修改用户信息弹窗
    showEditUserDialog(row) {
      this.select_row = row
      this.add_or_put_dialog = true
      this.add_or_put_dialog_type = 'edit'
    },
    // 显示新增用户弹窗
    showAddUserDialog() {
      this.add_or_put_dialog = true
      this.add_or_put_dialog_type = 'add'
    },
    // 删除行数据
    deleteRow(index, row) {
      this.$confirm('你确定要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteUser(row.id).then((res) => {
          if (res.status === 200) {
            this.list.splice(index, 1)
            this.$message.success('删除成功！')
          } else {
            this.$message.error('删除失败！')
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  padding-bottom: 0;
}
</style>

