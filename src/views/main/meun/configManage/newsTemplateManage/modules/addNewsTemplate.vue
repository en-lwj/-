<template>
  <!-- 新增或修改角色弹窗 -->
  <el-dialog v-dialog-drag :visible.sync="visible" :close-on-click-modal="false" :before-close="closeDialog" :title="dialogTitle" width="500px">
    <el-form ref="form" :rules="form_rules" :model="form" label-position="right" label-width="115px">
      <el-form-item class="yz-block" label="模版名称：" prop="name">
        <el-input v-model="form.name" class="single-border" type="text" />
      </el-form-item>
      <el-form-item class="yz-inline" label="状态：" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="item in statusOption" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="yz-block" label="简介：" prop="description">
        <el-input v-model="form.description" class="single-border" type="textarea" rows="3" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">
        取消
      </el-button>
      <el-button type="primary" @click="toSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import newsTemplateApi from '@/api/configManage/newsTemplate'

export default {
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
      dialogTitle: this.dialogType === 'add' ? '新增模版' : '修改模版',
      total: null,
      genderOption: this.$store.getters.genderOption,
      statusOption: this.$store.getters.statusOption,
      form: {
        'description': '',
        'name': '',
        'status': 'V'
      },
      form_rules: {
        name: [{ required: true, message: '模版名称不能为空', trigger: ['blur', 'change'] }],
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
        if (this.dialogType === 'add') this.addNewsTemplate()
        else if (this.dialogType === 'edit') this.updateNewsTemplate()
      })
    },
    // 新增
    addNewsTemplate() {
      newsTemplateApi.addNewsTemplate(this.form).then((res) => {
        if (res.status === 200) {
          this.$emit('reload')
          this.$message.success('新增成功！')
        } else this.$message.error('新增失败！')
        this.closeDialog()
      })
    },
    // 修改
    updateNewsTemplate() {
      newsTemplateApi.updateNewsTemplate(this.form).then((res) => {
        if (res.status === 200) {
          this.$nextTick(() => {
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

