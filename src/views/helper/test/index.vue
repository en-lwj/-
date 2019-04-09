<template>
  <div>
    <el-form ref="dynamicValidateForm" :model="form" :rules="rules" label-width="100px" class="demo-dynamic">
      <el-form-item prop="fileList" label="文件列表" >
        <el-upload
          ref="upload"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :file-list="form.fileList"
          :auto-upload="false"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }]
      },
      rules: {
        'fileList': [{ validator: (rule, list, callback) => {
          list.forEach(item => {
            if (item.fail === true) callback(new Error('列表中有文件上传失败，请重新上传或移除'))
            else if (item.status === 'ready') callback(new Error('列表中还有文件未上传,请先上传'))
            else if (item.status === 'uploading') callback(new Error('文件正在上传'))
          })
          callback()
        }, trigger: 'change' }]
      }
    }
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      this.form.fileList = fileList
      this.$refs['dynamicValidateForm'].validateField(['fileList'])
    },
    handleChange(file, fileList) {
      this.form.fileList = fileList
      if (file.status && file.status === 'fail') {
        file.fail = true
        file.status = 'ready'
        file.percentage = 0
        this.form.fileList.push(file)
        this.$refs['dynamicValidateForm'].validateField(['fileList'])
      }
      const flag = fileList.every(item => item.status && item.status === 'success')
      if (flag) this.$refs['dynamicValidateForm'].validateField(['fileList'])
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
