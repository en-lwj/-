<template>
  <!-- 分派角色弹窗 -->
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" :before-close="closeAssignRolesDialog" :title="dialogTitle" width="620px">
    <div class="filter-container">
      <el-form ref="form" :model="listQuery" label-width="80px" size="mini">
        <el-form-item class="yz-inline" label="用户名：" prop="name" style="width: 200px">
          <el-input v-model="listQuery.username" class="single-border"/>
        </el-form-item>
        <el-form-item class="yz-inline" label="姓名：" prop="name" style="width: 180px">
          <el-input v-model="listQuery.realName" class="single-border"/>
        </el-form-item>
        <span style="margin-left: 10px;">
          <el-button v-waves type="primary" size="mini" icon="el-icon-search" @click="getList">搜索</el-button>
          <el-button v-waves type="primary" size="mini" @click="setRoleUsers">
            <svg-icon icon-class="save" class-name="disabled" />
            <span>保存</span>
          </el-button>
        </span>

      </el-form>

    </div>
    <div style="height:300px;">
      <el-table
        v-loading="listLoading"
        ref="userList"
        :data="list"
        border
        size="mini"
        max-height="300"
        @select-all="handleSelectionChange"
        @select="handleSelectionChange">
        <el-table-column :index="indexMethod" label="序号" align="center" type="index" width="50"/>
        <el-table-column
          type="selection"
          size="medium"
          align="center"
          width="50"/>
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
        <el-table-column label="状态" class-name="status-col" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status | statusFilter }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination :current-page="pager.pageNum" :page-sizes="[10,20,30, 50]" :page-size="pager.pageSize" :total="total" background layout="total, sizes, prev, slot, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        <ul class="el-pager"><li class="number active">{{ pager.pageNum }}</li></ul>
      </el-pagination>
    </div>

    <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="closeAssignRolesDialog">取消</el-button>
      <el-button type="primary">确定</el-button>
    </div> -->
  </el-dialog>
</template>

<script>
import userApi from '@/api/basic/userManage'
import roleApi from '@/api/basic/roleManage'

export default {
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
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        status: '',
        username: undefined
      },
      pager: {
        pageNum: 1,
        pageSize: 20
      },
      // 存储所有角色分配的用户数据（相当于缓存）{role_id:1, users:[]}
      role_users_store: [],
      // 当前角色用户数据 [id]
      role_users_list: []
    }
  },
  computed: {
    dialogTitle() {
      const name = this.row.roleName || ''
      return `分配角色 - ${name}`
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getUsersByRoleId(this.row.id).then(res => {
        this.role_users_list = res.map(item => item.id)
        this.getList()
      })
    },
    // 渲染表格已选用户
    renderRoleUsers() {
      // 清除已渲染的
      this.$refs['userList'].clearSelection()
      // 重新渲染
      this.list.forEach(row => {
        const flag = this.role_users_list.some(item => item === row.id)
        if (flag) this.$refs['userList'].toggleRowSelection(row, true)
      })
    },
    // 获取表格数据
    getList() {
      return new Promise((resolve, reject) => {
        const role_id = this.row.id
        if (role_id === undefined) {
          this.$message.error('获取用户列表失败！')
          resolve()
        }
        this.listLoading = true
        userApi.getUserList(this.pager, this.listQuery).then(res => {
          if (res.status !== 200) {
            this.listLoading = false
            resolve()
          }
          this.list = res.data.rows
          this.total = res.data.total
          this.listLoading = false
          resolve()
        })
      }).then(() => {
        this.renderRoleUsers()
      })
    },
    // 通过role-id获取用户id []
    getUsersByRoleId(role_id) {
      return new Promise((resolve, reject) => {
        userApi.getUserAll({ roleId: role_id }).then(res => {
          if (res.status !== 200) {
            this.$message.error('获取角色用户失败！')
            resolve()
          }
          resolve(res.data.rows)
        })
      })
    },
    // 选择或取消用户
    handleSelectionChange(val) {
      this.list.forEach(row => {
        const user_in_store = this.role_users_list.indexOf(row.id)
        const user_in_val = val.find(item => item.id === row.id)
        if (user_in_store !== -1 && user_in_val === undefined) {
          this.role_users_list.splice(user_in_store, 1)
        } else if (user_in_store === -1 && user_in_val !== undefined) {
          this.role_users_list.push(user_in_val.id)
        }
      })
    },
    // 保存角色用户
    setRoleUsers() {
      roleApi.setRoleUsers({ roleId: this.row.id, userIds: this.role_users_list.join(',') }).then(res => {
        if (res.status === 200) {
          this.$message.success('用户分配成功！')
        } else {
          this.$message.error('用户分配失败！')
        }
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
    // 关闭弹框
    closeAssignRolesDialog() {
      this.$refs['userList'].clearSelection()
      this.$emit('update:visible', false)
    }
  }
}
</script>

