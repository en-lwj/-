<template>
  <!-- 分派角色弹窗 -->
  <el-dialog v-dialog-drag :visible.sync="visible" :close-on-click-modal="false" :before-close="closeDialog" :title="dialogTitle" width="500px">
    <div v-loading="treeLoading" style="height: 340px;overflow: auto; margin: -20px -5px;">
      <el-tree
        ref="tree"
        :data="treeData"
        :default-expand-all="true"
        :expand-on-click-node="false"
        show-checkbox
        node-key="id"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ data.permissionName }}</span>
          <span class="tree-leaf-state">{{ '[' + data.code + ']' }}</span>
        </span>
      </el-tree>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">
        取消
      </el-button>
      <el-button type="primary" @click="toSubmit()">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import campusPermissionApi from '@/api/configManage/campusPermission'
import campusRoleApi from '@/api/configManage/campusRole'

export default {
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
      dialogTitle: this.row.roleName + '权限',
      treeLoading: false,
      treeData: []
    }
  },
  created() {
    this.getPermissionTree()
  },
  methods: {
    // 获取权限树
    getPermissionTree() {
      this.treeLoading = true
      campusPermissionApi.getPermissionTree().then(res => {
        this.treeLoading = false
        if (res.status === 200) {
          this.treeData = res.data.rows
          this.renderPermissionByRoleId()
        }
      })
    },
    // 获取该角色权限
    getPermissionByRoleId() {
      return campusRoleApi.getCampusRolePermission({ roleId: this.row.id, tenantId: this.row.tenantId }).then(res => {
        if (res.status !== 200) {
          this.$message.error('获取角色权限失败！')
          return []
        }
        return res.data.rows
      })
    },
    // 渲染该角色权限
    renderPermissionByRoleId() {
      this.getPermissionByRoleId().then(data => {
        this.$refs['tree'].setCheckedKeys(data.map(item => item.permissionId))
      })
    },
    // 确认
    toSubmit() {
      campusRoleApi.updateCampusRolePermission({
        roleId: this.row.id,
        tenantId: this.row.tenantId,
        permissionIds: this.$refs['tree'].getCheckedKeys(true).join()
      }).then(res => {
        if (res.status !== 200) this.$message.error('分配权限失败！')
        else {
          this.$message.success('分配权限成功')
          this.closeDialog()
        }
      })
    },
    // 关闭弹框
    closeDialog() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

