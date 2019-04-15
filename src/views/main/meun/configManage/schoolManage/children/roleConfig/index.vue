<template>
  <div class="app-container">
    <!-- 角色配置 -->
    <div class="yz-panel">
      <div class="yz-panel-header">
        <div class="yz-panel-header-left">
          <span class="yz-panel-title">角色配置 - {{ campusInfo.name }}</span>
        </div>
        <el-row class="yz-panel-header-right">
          <el-button class="filter-item" type="primary" icon="el-icon-plus" size="mini" @click="showAddDialog()">
            新增
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
          <el-table-column :index="indexMethod" label="序号" align="center" type="index" width="65" />
          <el-table-column label="角色名" min-width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.roleName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="识别码" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" min-width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="280" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="showAssignPermissionDialog(scope.row)">
                角色赋权
              </el-button>
              <el-button size="mini" type="warning" @click="showChangeDialog(scope.row)">
                修改
              </el-button>
              <el-button size="mini" type="danger" @click="deleteRow(scope.$index, scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新增和修改角色弹窗 -->
    <div v-if="add_and_put_dialog">
      <add-campus-role-dialog :visible.sync="add_and_put_dialog" :row.sync="select_row" :dialog-type="add_and_put_dialog_type" :tenant-id="listQuery.tenantId" @reload="getList" />
    </div>

    <!-- 分配权限弹窗 -->
    <div v-if="assign_permission_dialog">
      <assign-permission-dialog :visible.sync="assign_permission_dialog" :row.sync="select_row" @reload="getList" />
    </div>
  </div>
</template>

<script>
import campusApi from '@/api/configManage/campus'
import campusRoleApi from '@/api/configManage/campusRole'
import assignPermissionDialog from './modules/assignPermission'
import addCampusRoleDialog from './modules/addCampusRole'
import resize from './mixins/resize'

export default {
  components: {
    addCampusRoleDialog,
    assignPermissionDialog
  },
  mixins: [resize],
  data() {
    return {
      list: [],
      total: null,
      listLoading: false,
      listQuery: {
        tenantId: this.$route.params.id
      },
      campusInfo: {},
      // 选择的table行
      select_row: {},
      assign_permission_dialog: false,
      assign_role_dialog: false,
      // 新增修改弹框
      add_and_put_dialog: false,
      add_and_put_dialog_type: 'add'
    }
  },
  created() {
    this.getCampusById()
    this.getList()
  },
  methods: {
    // 获取表格数据
    getList() {
      this.listLoading = true
      campusRoleApi.getCampusRoleAll(this.listQuery).then(res => {
        if (res.status !== 200) {
          this.listLoading = false
          return this.$message.error('角色列表获取失败！')
        }
        this.list = res.data.rows
        this.total = res.data.total
        this.listLoading = false
      })
    },
    // 获取学校信息
    getCampusById() {
      const id = this.listQuery.tenantId
      if (!id) return this.$message.error('无法获取学校信息')
      campusApi.getCampusById(id).then(res => {
        if (res.status === 200) this.campusInfo = res.data
        else this.$message.error('获取学校信息失败')
      })
    },
    // 表格序号
    indexMethod(index) {
      return index + 1
    },
    // 打开新增弹框
    showAddDialog() {
      this.add_and_put_dialog = true
      this.add_and_put_dialog_type = 'add'
    },
    // 修改弹窗
    showChangeDialog(row) {
      this.select_row = row
      this.add_and_put_dialog = true
      this.add_and_put_dialog_type = 'edit'
    },
    // 显示分配权限弹框
    showAssignPermissionDialog(row) {
      this.select_row = row
      this.assign_permission_dialog = true
    },
    // 删除行数据
    deleteRow(index, row) {
      this.$confirm('你确定要删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        campusRoleApi.deleteCampusRole(row.id).then((res) => {
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
.tree-leaf-state{
  color: #409eff;
}
</style>

