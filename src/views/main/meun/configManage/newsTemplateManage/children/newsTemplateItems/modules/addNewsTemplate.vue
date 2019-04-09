<template>
  <!-- 新增或修改角色弹窗 -->
  <el-dialog v-dialog-drag :visible.sync="visible" :close-on-click-modal="false" :before-close="closeDialog" :title="dialogTitle" width="600px">
    <el-form ref="form" :rules="form_rules" :model="form" label-position="right" label-width="115px">
      <el-form-item class="yz-block" label="属性名称：" prop="label">
        <el-input v-model="form.label" class="single-border" type="text"/>
      </el-form-item>
      <el-form-item class="yz-block" label="字段名称：" prop="field">
        <el-input v-model="form.field" class="single-border" type="text"/>
      </el-form-item>
      <el-form-item class="yz-block" label="类型：" prop="inputType">
        <el-radio-group v-model="form.inputType">
          <el-radio v-for="item in inputTypeOption" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 输入框 -->
      <el-form-item v-if="form.inputType === 1" class="yz-block" label="默认值：" prop="defValue">
        <el-input v-model="form.defValue" class="single-border" type="text"/>
      </el-form-item>
      <!-- 下拉框 -->
      <el-form-item v-if="form.inputType === 2" class="yz-block optValue" label="多选选项：" prop="optValue">
        <el-tag
          v-for="tag in form.optValue"
          :key="tag"
          :disable-transitions="true"
          closable
          size="medium"
          @close="handleClose(tag)">
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="saveTagInput"
          v-model="inputValue"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag" icon="el-icon-plus" size="small" @click="showInput">新增选项</el-button>
      </el-form-item>
      <el-form-item v-if="form.inputType === 2" class="yz-block" label="默认值：" prop="defValue2">
        <el-select v-model="form.defValue" placeholder="请选择" class="single-border">
          <el-option v-for="tag in form.optValue" :key="tag" :label="tag" :value="tag"/>
        </el-select>
      </el-form-item>
      <!-- 文本框 -->
      <el-form-item v-if="form.inputType === 3" class="yz-block" label="默认值：" prop="defValue">
        <el-input v-model="form.defValue" class="single-border" type="textarea" rows="3"/>
      </el-form-item>
      <!-- 富文本编辑器 -->
      <el-form-item v-if="form.inputType === 4" class="yz-block" label="默认值：" prop="defValue">
        <ueditor v-model="form.defValue" />
      </el-form-item>
      <el-form-item class="yz-inline" label="是否必填：" prop="isRequired">
        <el-radio-group v-model="form.isRequired">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="yz-block" label="最大长度：" prop="textSize">
        <el-input v-model="form.textSize" class="single-border" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">取消</el-button>
      <el-button type="primary" @click="toSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import newsTemplateItemApi from '@/api/configManage/newsTemplateItem'
import ueditor from '@/components/Ueditor'

export default {
  components: {
    ueditor
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
    newsTemplateId: {
      type: String,
      required: true
    },
    row: {
      type: Object,
      default: function() {
        return {}
      }
    },
    inputTypeOption: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialogTitle: this.dialogType === 'add' ? '新增模版属性' : '修改模版属性',
      total: null,
      genderOption: this.$store.getters.genderOption,
      inputVisible: false,
      inputValue: '',
      form: {
        'defValue': '',
        'field': '',
        'inputType': 1,
        'isRequired': true,
        'label': '',
        'newsTemplateId': this.newsTemplateId,
        'optValue': [],
        'sequence': 0,
        'textSize': 0
      },
      form_rules: {
        label: [{ required: true, message: '属性名称不能为空', trigger: ['blur', 'change'] }],
        field: [{ required: true, message: '字段名称不能为空', trigger: ['blur', 'change'] }],
        inputType: [{ required: true, message: '类型不能为空', trigger: ['blur', 'change'] }],
        optValue: [{ required: true, message: '选项不能为空', trigger: ['blur'] }],
        isRequired: [{ required: true, message: '是否为空选项不能为空', trigger: ['change'] }],
        defValue2: [{ required: true, validator: (rule, value, callback) => {
          if (this.form.inputType === 2) {
            if (this.form.optValue.length === 0) {
              this.form.defValue = ''
              callback(new Error('默认值不能为空'))
            } else if (this.form.optValue.find(item => item === this.form.defValue) === undefined) {
              this.form.defValue = ''
              callback(new Error('默认值不能为空'))
            }
            callback()
          } else {
            callback()
          }
        }, trigger: ['blur', 'change'] }],
        textSize: [{ required: true, validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('最大长度不能为空'))
          } else {
            if (!/^\d+$/.test(value) || +value <= 0) callback(new Error('请输入大于0的正整数'))
            callback()
          }
        }, trigger: ['blur', 'change'] }]
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
        ...this.row,
        optValue: (() => {
          try {
            return JSON.parse(this.row.optValue)
          } catch (error) {
            return this.row.optValue.split(',').filter(item => item !== '')
          }
        })()
      }
    },
    // 提交表单
    toSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) return false
        if (this.dialogType === 'add') this.addNewsTemplateItem()
        else if (this.dialogType === 'edit') this.updateNewsTemplateItem()
      })
    },
    // 新增
    addNewsTemplateItem() {
      newsTemplateItemApi.addNewsTemplateItem({ ...this.form, optValue: JSON.stringify(this.form.optValue) }).then((res) => {
        if (res.status === 200) {
          this.$emit('reload')
          this.$message.success('新增成功！')
        } else this.$message.error('新增失败！')
        this.closeDialog()
      })
    },
    // 更新
    updateNewsTemplateItem() {
      newsTemplateItemApi.updateNewsTemplateItem({ ...this.form, optValue: JSON.stringify(this.form.optValue) }).then((res) => {
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
    },
    // 多选处理
    handleClose(tag) {
      this.form.optValue.splice(this.form.optValue.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        const flag = this.form.optValue.indexOf(inputValue) === -1
        flag && this.form.optValue.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.optValue{
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 30px;
    line-height: 28px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>

<style scoped>
.optValue>>> .el-tag__close.el-icon-close{
  line-height: 18px;
}
</style>

