<template>
  <!-- 新增或修改权限弹窗 -->
  <el-dialog v-dialog-drag :visible.sync="visible" :close-on-click-modal="false" :before-close="closeDialog" :title="dialogTitle" width="500px">
    <el-form ref="form" :rules="form_rules" :model="form" label-position="right" label-width="115px" style="padding: 0 30px 0 10px;">
      <el-form-item class="yz-block" label="父权限：">
        <span style="padding: 0 15px">{{ parentPermissionName }}</span>
        <!-- <el-input v-model="parentPermissionName" class="single-border" disabled type="text"/> -->
      </el-form-item>
      <el-form-item class="yz-block" label="权限名称：" prop="permissionName">
        <el-input v-model="form.permissionName" class="single-border" type="text"/>
      </el-form-item>
      <el-form-item class="yz-block" label="权限码code：" prop="code">
        <el-input v-model="form.code" class="single-border" type="text"/>
      </el-form-item>
      <el-form-item class="yz-block" label="links：" prop="links">
        <el-input v-model="form.links" class="single-border" type="text"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">取消</el-button>
      <el-button type="primary" @click="toSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import campusPermissionApi from '@/api/configManage/campusPermission'

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
    dialogType: {
      type: String,
      default: 'add'
    },
    row: {
      type: Object,
      default: function() {
        return {}
      }
    },
    parentNode: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogTitle: this.dialogType === 'add' ? '新增权限' : '修改权限',
      parentPermissionName: '',
      form: {
        id: undefined,
        code: undefined,
        description: undefined,
        parentId: undefined,
        permissionName: undefined,
        links: undefined,
        // 状态(V:启用，I:禁用)
        status: 'V'
      },
      form_rules: {
        permissionName: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限码code不能为空', trigger: 'blur' }],
        links: [{ required: true, message: 'links不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.parentPermissionName = this.parentNode.data.permissionName
      this.form = this.dialogType === 'add' ? {
        ...this.form,
        parentId: this.parentNode.data.id
      } : {
        ...this.form,
        ...this.row
      }
    },
    // 提交表单
    toSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) return false
        if (this.dialogType === 'add') this.addPermission()
        else if (this.dialogType === 'edit') this.updatePermission()
      })
    },
    // 新增权限
    addPermission() {
      campusPermissionApi.addPermission(this.form).then((res) => {
        if (res.status === 200) {
          this.$emit('reload')
          this.$message.success('新增成功！')
        } else this.$message.error('新增失败！')
        this.closeDialog()
      })
    },
    // 更新权限信息
    updatePermission() {
      campusPermissionApi.updatePermission(this.form).then((res) => {
        if (res.status === 200) {
          this.$nextTick(() => {
            // Object.assign(this.row, this.form)
            // this.$emit('update:row', this.row)
            this.$emit('reload')
            this.$message.success('修改成功！')
          })
        } else this.$message.error('修改失败！')
        this.closeDialog()
      })
    },
    // 关闭弹框
    closeDialog() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

