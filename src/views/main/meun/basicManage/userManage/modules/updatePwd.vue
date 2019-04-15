<template>
  <!-- 分派角色弹窗 -->
  <el-dialog v-dialog-drag :visible.sync="visible" :close-on-click-modal="false" :before-close="closeDialog" :title="dialogTitle" width="450px">
    <el-form ref="form" :rules="form_rules" :model="form" label-position="left" label-width="90px" style="width: 300px; margin-left:50px;">
      <el-form-item class="yz-block" label="旧密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" class="single-border" auto-complete="off" />
      </el-form-item>
      <el-form-item class="yz-block" label="新密码" prop="password">
        <el-input v-model="form.password" type="password" class="single-border" auto-complete="off" />
      </el-form-item>
      <el-form-item class="yz-block" label="确认密码" prop="password2">
        <el-input v-model="form.password2" type="password" class="single-border" auto-complete="off" />
      </el-form-item>
    </el-form>
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
import userApi from '@/api/basic/userManage'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogTitle: '修改密码',
      form: {
        oldPassword: '',
        password: '',
        password2: ''
      },
      form_rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' },
          { min: 3, message: '密码长度不能小于3', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 3, message: '密码长度不能小于3', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: (rule, value, callback) => {
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

  },
  methods: {
    // 确认修改密码
    toSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) return
        userApi.updateUserPwd({
          oldPassword: this.form.oldPassword,
          password: this.form.password
        }).then((res) => {
          this.closeDialog()
          this.$nextTick(() => {
            if (res.status === 200) this.$message.success('密码修改成功！')
            else this.$message.error('密码修改失败！')
          })
        })
      })
    },
    // 关闭弹框
    closeDialog() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

