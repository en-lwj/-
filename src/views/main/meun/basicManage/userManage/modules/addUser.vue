<template>
  <!-- 分派角色弹窗 -->
  <el-dialog v-dialog-drag :visible.sync="visible" :close-on-click-modal="false" :before-close="closeDialog" :title="dialogTitle" width="600px">
    <el-form ref="form" :rules="form_rules" :model="form" label-position="right" label-width="95px">
      <el-form-item class="yz-block" label="用户账号：" prop="username">
        <el-input v-if="dialogType === 'add'" v-model="form.username" class="single-border" type="text"/>
        <span v-else style="padding: 0 10px">{{ form.username }}</span>
      </el-form-item>
      <el-form-item class="yz-block" label="职工号：" prop="staffNumber">
        <el-input v-model="form.staffNumber" class="single-border" type="text"/>
      </el-form-item>
      <el-form-item v-if="dialogType === 'add'" class="yz-block" label="密码：" prop="password">
        <el-input v-model="form.password" type="password" class="single-border" auto-complete="off"/>
      </el-form-item>
      <el-form-item v-if="dialogType === 'add'" class="yz-block" label="确认密码：" prop="password2">
        <el-input v-model="form.password2" type="password" class="single-border" auto-complete="off"/>
      </el-form-item>
      <el-form-item class="yz-inline" label="真实姓名：" prop="realName">
        <el-input v-model="form.realName" class="single-border" type="text"/>
      </el-form-item>
      <el-form-item class="yz-inline" label="邮箱：" prop="email">
        <el-input v-model="form.email" class="single-border" type="text"/>
      </el-form-item>
      <el-form-item class="yz-inline" label="状态：" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="item in statusOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="yz-inline" label="性别：" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio v-for="item in genderOption" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="yz-block" label="地址：" prop="address">
        <el-input v-model="form.address" class="single-border" type="textarea" rows="3"/>
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
import userApi from '@/api/basic/userManage'

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
      dialogTitle: this.dialogType === 'add' ? '新增用户' : '修改用户',
      total: null,
      genderOption: this.$store.getters.genderOption,
      statusOptions: [
        { label: '可用', value: 'V' },
        { label: '禁用', value: 'I' }
      ],
      form: {
        'address': '',
        'description': '',
        'email': '',
        'realName': '',
        'sex': this.$store.getters.genderOption[0].value,
        'staffNumber': '',
        'status': 'V',
        'username': '',
        password: undefined,
        password2: undefined
      },
      form_rules: {
        username: [{ required: true, message: '用户账号不能为空', trigger: ['blur', 'change'] }],
        // realName: [{ required: true, message: '真实姓名不能为空', trigger: ['blur', 'change'] }],
        staffNumber: [{ required: true, message: '职工号不能为空', trigger: ['blur', 'change'] }],
        email: [
          // { required: true, message: '邮箱不能为空', trigger: ['blur', 'change'] },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
          { min: 3, message: '密码长度不能小于3', trigger: ['blur', 'change'] }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
          { required: true, trigger: ['blur', 'change'], validator: (rule, value, callback) => {
            if (value !== this.form.password) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          } }
        ]
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
        if (this.dialogType === 'add') this.addUser()
        else if (this.dialogType === 'edit') this.updateUser()
      })
    },
    // 新增用户
    addUser() {
      userApi.addUser(this.form).then((res) => {
        if (res.status === 200) {
          this.$emit('reload')
          this.$message.success('新增用户成功！')
        } else this.$message.error('新增用户失败！')
        this.closeDialog()
      })
    },
    // 更新用户信息
    updateUser() {
      userApi.updateUser(this.form).then((res) => {
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

