<template>
  <el-dialog v-dialog-drag :visible.sync="visible" :close-on-click-modal="false" :title="title" :before-close="closeDialog" width="600px">
    <el-form v-loading="dialogLoading" ref="form" :model="form" :rules="form_rules" class="form" element-loading-text="模版加载中..." label-width="100px">
      <el-form-item class="yz-block" label="缩略图：" prop="thumbnail">
        <yz-upload-avatar :path.sync="avatar.imageUrl" :upload-url="avatar.uploadUrl" :on-success="changeAvatarSuccess" file-size="20MB" width="140px" height="140px" style="margin-left: 0;"/>
      </el-form-item>
      <el-form-item class="yz-block" label="父栏目：" prop="name">
        <span style="padding: 0 15px;">{{ parentData.name }}</span>
      </el-form-item>
      <el-form-item class="yz-block" label="栏目名称：" prop="name">
        <el-input v-model="form.name" class="single-border"/>
      </el-form-item>
      <el-form-item class="yz-block" label="栏目模版：" prop="newsTemplateId">
        <el-select v-model="form.newsTemplateId" placeholder="请选择" class="single-border">
          <el-option label="无" value=""/>
          <el-option
            v-for="item in newsTemplateAll"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item class="yz-block" label="栏目描述：" prop="code">
        <el-input v-model="form.description" class="single-border" type="textarea" rows="3" />
      </el-form-item>
      <el-form-item class="yz-block">
        <el-button type="default" size="small" @click="closeDialog()">取消</el-button>
        <el-button type="primary" size="small" @click="toSubmit()">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import newsChannelApi from '@/api/configManage/newsChannel'
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
    parentData: {
      type: Object,
      required: true
    },
    dialogType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      title: this.dialogType === 'add' ? '新增' : '修改',
      dialogLoading: false,
      newsTemplateAll: [],
      avatar: {
        uploadUrl: '/adminNewsChannels/imageUpload',
        imageUrl: ''
      },
      form: {
        'description': '',
        'name': '',
        'thumbnail': '',
        'newsTemplateId': '',
        'parentId': this.parentData.id
      },
      form_rules: {
        thumbnail: [{ required: true, message: '缩略图不能为空', trigger: 'change' }],
        name: [{ required: true, message: '栏目名称不能为空', trigger: ['blur', 'change'] }]
      }
    }
  },
  created() {
    this.init()
    this.getNewsTemplateAll()
  },
  methods: {
    init() {
      this.form = this.dialogType === 'add' ? {
        ...this.form
      } : {
        ...this.form,
        ...this.row
      }
      this.avatar.imageUrl = this.form.thumbnail
    },
    // 获取新闻模版列表（所有）
    getNewsTemplateAll() {
      this.dialogLoading = true
      this.$emit('getNewsTemplateAll', res => {
        this.newsTemplateAll = res
        this.dialogLoading = false
      })
    },
    // 修改头像成功回调
    changeAvatarSuccess(res) {
      this.form.thumbnail = res.data.uri
    },
    // 提交表单
    toSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) return false
        if (this.dialogType === 'add') this.addNewsChannel()
        else if (this.dialogType === 'edit') this.updateNewsChannel()
      })
    },
    // 新增
    addNewsChannel() {
      newsChannelApi.addNewsChannel(this.form).then((res) => {
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
    updateNewsChannel() {
      const thumbnail = this.form.thumbnail === this.avatar.imageUrl ? undefined : this.form.thumbnail
      newsChannelApi.updateNewsChannel({ ...this.form, thumbnail }).then((res) => {
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
