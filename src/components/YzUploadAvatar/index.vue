<template>
  <el-upload
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :on-progress="showProgress"
    :on-error="uploadFail"
    :headers="avatar.uploadHeader"
    :action="avatar.uploadUrl"
    :style="generatorStyle"
    upload-header
    class="yz-avatar-uploader"
  >
    <div class="yz-avatar-box">
      <yz-img v-if="avatar.imageUrl && !avatar.progressVisible" :src="avatar.imageUrl" class="yz-avatar" />
      <i v-else-if="!avatar.imageUrl && !avatar.progressVisible" class="el-icon-plus yz-avatar-uploader-icon" />
      <el-progress v-if="avatar.progressVisible" :percentage="avatar.uploadPercent" type="circle" />
    </div>
  </el-upload>
</template>

<script>
import { getToken } from '@/utils/Token'
export default {
  name: 'YzUploadAvatar',
  props: {
    // 图片显示路径
    path: {
      type: String,
      default: ''
    },
    fileSize: {
      type: String,
      default: '2MB'
    },
    fileType: {
      type: Array,
      default: function() {
        return ['image/jpeg', 'image/png']
      }
    },
    baseUrl: {
      type: String,
      default: process.env.BASE_API
    },
    uploadUrl: {
      type: String,
      default: ''
    },
    onSuccess: {
      type: Function,
      default: function() {}
    },
    onFail: {
      type: Function,
      default: function() {}
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      avatar: {
        uploadUrl: this.baseUrl + this.uploadUrl,
        imageUrl: this.path,
        uploadPercent: 0,
        progressVisible: false,
        uploadHeader: {
          Authorization: getToken() || ''
        }
      }
    }
  },
  computed: {
    fileSizeToBit() {
      const str = this.fileSize.replace(/GB/ig, ' * 1024 * 1024 * 1024').replace(/G/ig, ' * 1024 * 1024 * 1024')
        .replace(/MB/ig, ' * 1024 * 1024').replace(/M/ig, ' * 1024 * 1024')
        .replace(/KB/ig, ' * 1024').replace(/B/ig, ' * 1')
      return (new Function(`return ${str}`)())
    },
    generatorStyle() {
      let str = ''
      if (this.width) str += `width: ${this.width};`
      if (this.height) str += `height: ${this.height};`
      return str
    }
  },
  watch: {
    path() {
      this.avatar.imageUrl = this.path
    }
  },
  methods: {
    // 上传文件成功处理
    handleAvatarSuccess(res, file, fileList) {
      this.avatar.uploadPercent = 0
      this.avatar.progressVisible = false
      this.avatar.imageUrl = res.data.url
      this.$listeners['update:path'] && this.$emit('update:path', this.avatar.imageUrl)
      this.$nextTick(() => {
        this.onSuccess(res, file, fileList)
      })
    },
    // 上传文件前拦截
    beforeAvatarUpload(file) {
      const receiveTypes = this.fileType
      const typeFlag = receiveTypes.includes(file.type)
      !typeFlag && this.$message.error('图片格式错误!')
      const sizeFlag = file.size < this.fileSizeToBit
      !sizeFlag && this.$message.error(`上传头像图片大小不能超过 ${this.fileSize}!`)
      return typeFlag && sizeFlag
    },
    // 显示进度条
    showProgress(event, file, fileList) {
      this.avatar.progressVisible = true
      this.avatar.uploadPercent = Number(file.percentage.toFixed(0))
    },
    // 上传失败
    uploadFail(err, file, fileList) {
      this.$message.error('上传失败')
      this.avatar.uploadPercent = 0
      this.avatar.progressVisible = false
      this.onFail(err, file, fileList)
    }
  }
}
</script>

<style lang="scss" scoped>
// 头像上传
.yz-avatar-uploader{
  width: 182px;
  height: 182px;
  margin: auto;
  position: relative;
  .yz-avatar-box{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #d9d9d9;
    &:hover {
      border-color: #92c7fd;
    }
  }
  .yz-avatar-uploader-icon {
    font-size: 36px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .yz-avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>

