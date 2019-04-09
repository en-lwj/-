<template>
  <el-dialog v-dialog-drag :visible.sync="visible" :close-on-click-modal="false" :title="title" :before-close="closeDialog" width="600px">
    <el-form v-loading="dialogLoading" ref="form" :model="form" :rules="form_rules" class="form" element-loading-text="模版加载中..." label-width="100px">
      <el-form-item class="yz-block" label="缩略图" prop="thumbnail">
        <yz-upload-avatar :path.sync="avatar.imageUrl" :upload-url="avatar.uploadUrl" :on-success="changeAvatarSuccess" file-size="20MB" width="140px" height="140px" style="margin-left: 0;"/>
      </el-form-item>
      <el-form-item class="yz-inline" label="学校名称" prop="name">
        <el-input v-model="form.name" class="single-border"/>
      </el-form-item>
      <el-form-item class="yz-inline" label="学校code" prop="code">
        <el-input v-model="form.code" class="single-border"/>
      </el-form-item>
      <el-form-item class="yz-inline" label="学校邮箱" prop="email">
        <el-input v-model="form.email" class="single-border"/>
      </el-form-item>
      <el-form-item class="yz-inline" label="联系方式" prop="contact">
        <el-input v-model="form.contact" class="single-border"/>
      </el-form-item>
      <el-form-item class="yz-block" label="学段选择" prop="stages">
        <el-checkbox-group v-model="form.stages">
          <el-checkbox v-for="stage in stageOption" :label="stage.value" :key="stage.value">{{ stage.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item class="yz-block" label="简介" prop="description">
        <el-input v-model="form.description" type="textarea" class="single-border" rows="3"/>
      </el-form-item>
      <el-form-item class="yz-block">
        <el-button type="default" size="small" @click="closeDialog()">取消</el-button>
        <el-button type="primary" size="small" @click="toSubmit()">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import campusApi from '@/api/configManage/campus'
import YzUploadAvatar from '@/components/YzUploadAvatar'

export default {
  components: {
    YzUploadAvatar
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: function() {
        return {}
      }
    },
    dialogType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      title: this.dialogType === 'add' ? '新增' : '修改',
      stageOption: this.$store.getters.stageOption,
      dialogLoading: false,
      avatar: {
        uploadUrl: '/adminCampus/imageUpload',
        imageUrl: ''
      },
      form: {
        'code': '',
        'contact': '',
        'description': '',
        'email': '',
        'name': '',
        'stages': [],
        'thumbnail': ''
      },
      form_rules: {
        thumbnail: [{ required: true, message: '缩略图不能为空', trigger: 'change' }],
        name: [{ required: true, message: '学校名称不能为空', trigger: 'blur' }],
        contact: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '学校code不能为空', trigger: 'change' }],
        stages: [{ required: true, message: '学校学段不能为空', trigger: 'change' }],
        email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]
      },
      form_item_template: []
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
        ...this.row,
        stages: this.row.stages.split(',').map(item => +item)
      }
      this.avatar.imageUrl = this.form.thumbnail
    },
    // 修改头像成功回调
    changeAvatarSuccess(res) {
      this.form.thumbnail = res.data.uri
    },
    // 提交表单
    toSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) return false
        if (this.dialogType === 'add') this.addCampus()
        else if (this.dialogType === 'edit') this.updateCampus()
      })
    },
    // 新增
    addCampus() {
      campusApi.addCampus({ ...this.form, stages: this.form.stages.sort().join() }).then((res) => {
        if (res.status === 200) {
          this.$message.success('新增成功！')
          this.$emit('reload')
          this.closeDialog()
        } else {
          this.$message.error('新增失败！')
        }
      })
    },
    // 修改
    updateCampus() {
      const thumbnail = this.form.thumbnail === this.avatar.imageUrl ? undefined : this.form.thumbnail
      campusApi.updateCampus({ ...this.form, stages: this.form.stages.join(), thumbnail }).then((res) => {
        if (res.status === 200) {
          this.$message.success('修改成功！')
          this.$emit('reload')
          this.closeDialog()
        } else {
          this.$message.error('修改失败！')
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

<style lang="scss" scoped>
@import '@/assets/styles/mixin.scss';
.el-form{
  min-height: 400px;
}
.panel-footer{
  margin-top: 20px;
  .el-row{
    margin: auto;
  }
}
</style>
