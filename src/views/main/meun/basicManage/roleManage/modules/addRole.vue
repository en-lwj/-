<template>
  <!-- 新增或修改角色弹窗 -->
  <el-dialog v-dialog-drag :visible.sync="visible" :close-on-click-modal="false" :before-close="closeDialog" :title="dialogTitle" width="600px">
    <el-form ref="form" :rules="form_rules" :model="form" label-position="right" label-width="115px">
      <el-form-item class="yz-block" label="角色名：" prop="roleName">
        <el-input v-model="form.roleName" class="single-border" type="text"/>
      </el-form-item>
      <el-form-item class="yz-block" label="角色识别码：" prop="code">
        <el-input v-model="form.code" class="single-border" type="text"/>
      </el-form-item>
      <el-form-item class="yz-inline" label="状态：" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="item in statusOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="yz-inline" label="是否隐藏：" prop="isVisible">
        <el-radio-group v-model="form.isVisible">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="yz-inline" label="是否可修改：" prop="canBeChange">
        <el-radio-group v-model="form.canBeChange">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="yz-block" label="描述：" prop="description">
        <el-input v-model="form.description" class="single-border" type="textarea" rows="3"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">取消</el-button>
      <el-button type="primary" @click="toSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
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
    dialogType: {
      type: String,
      default: 'add'
    },
    row: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogTitle: this.dialogType === 'add' ? '新增角色' : '修改角色',
      total: null,
      genderOption: this.$store.getters.genderOption,
      statusOptions: [
        { label: '可用', value: 'V' },
        { label: '禁用', value: 'I' }
      ],
      form: {
        'canBeChange': true,
        'code': '',
        'description': '',
        'isVisible': true,
        'roleName': '',
        'status': 'V'
      },
      form_rules: {
        roleName: [{ required: true, message: '角色号不能为空', trigger: ['blur', 'change'] }],
        canBeChange: [{ required: true, message: '是否可修改不能为空', trigger: ['blur', 'change'] }],
        code: [{ required: true, message: '角色识别码不能为空', trigger: ['blur', 'change'] }],
        isVisible: [{ required: true, message: '是否隐藏不能为空', trigger: ['blur', 'change'] }],
        status: [{ required: true, message: '状态不能为空', trigger: ['blur', 'change'] }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.form = this.dialogType === 'add' ? {
        ...this.form
      } : {
        ...this.form,
        ...this.row
      }
    },
    // 提交表单
    toSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) return false
        if (this.dialogType === 'add') this.addRole()
        else if (this.dialogType === 'edit') this.updateRole()
      })
    },
    // 新增角色
    addRole() {
      roleApi.addRole(this.form).then((res) => {
        if (res.status === 200) {
          this.$emit('reload')
          this.$message.success('新增成功！')
        } else this.$message.error('新增失败！')
        this.closeDialog()
      })
    },
    // 更新角色信息
    updateRole() {
      roleApi.updateRole(this.form).then((res) => {
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

