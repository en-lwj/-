<template>
  <div class="app-container">

    <!-- 角色配置 -->
    <div class="yz-panel">
      <div class="yz-panel-header">
        <div class="yz-panel-header-left">
          <span class="yz-panel-title">模版属性 - {{ newsTemplate.name }}</span>
        </div>
        <el-row class="yz-panel-header-right">
          <el-button class="filter-item" type="primary" icon="el-icon-plus" size="mini" @click="showAddDialog()">新增</el-button>
        </el-row>
      </div>
      <div class="yz-panel-body">
        <el-table
          v-loading="listLoading"
          :max-height="tableMaxHeight"
          :data="list"
          border>
          <el-table-column :index="indexMethod" label="序号" align="center" type="index" width="65"/>
          <el-table-column label="显示名称" min-width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.label }}</span>
            </template>
          </el-table-column>
          <el-table-column label="字段" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.field }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.inputType | inputTypeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否必填" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.isRequired }}</span>
            </template>
          </el-table-column>
          <el-table-column label="默认值" min-width="100" align="center">
            <template slot-scope="scope">
              <div style="max-height: 100px;overflow: hidden;">{{ String(scope.row.defValue) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="showChangeDialog(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新增和修改角色弹窗 -->
    <div v-if="add_and_put_dialog">
      <add-newsTemplate-dialog :visible.sync="add_and_put_dialog" :row.sync="select_row" :dialog-type="add_and_put_dialog_type" :input-type-option="inputTypeOption" :news-template-id="listQuery.newsTemplateId" @reload="getList"/>
    </div>
  </div>
</template>

<script>
import newsTemplateApi from '@/api/configManage/newsTemplate'
import newsTemplateItemApi from '@/api/configManage/newsTemplateItem'
import addNewsTemplateDialog from './modules/addNewsTemplate'
import resize from './mixins/resize'
const inputTypeOption = [
  { label: '输入框', value: 1 },
  { label: '下拉框', value: 2 },
  { label: '文本框', value: 3 },
  { label: '富文本编辑器', value: 4 }
]

export default {
  components: {
    addNewsTemplateDialog
  },
  filters: {
    inputTypeFilter(value) {
      const obj = inputTypeOption.find(item => +item.value === +value)
      return obj && obj.label || ''
    }
  },
  mixins: [resize],
  data() {
    return {
      list: [],
      total: null,
      listLoading: false,
      listQuery: {
        newsTemplateId: this.$route.params.id
      },
      inputTypeOption: inputTypeOption,
      newsTemplate: {},
      // 选择的table行
      select_row: {},
      // 新增修改弹框
      add_and_put_dialog: false,
      add_and_put_dialog_type: 'add'
    }
  },
  created() {
    this.getNewsTemplateById()
    this.getList()
  },
  methods: {
    // 获取表格数据
    getList() {
      this.listLoading = true
      newsTemplateItemApi.getNewsTemplateItemAll(this.listQuery).then(res => {
        if (res.status !== 200) {
          this.listLoading = false
          return this.$message.error('模版列表获取失败！')
        }
        this.list = res.data.rows
        this.total = res.data.total
        this.listLoading = false
      })
    },
    // 获取模版信息
    getNewsTemplateById() {
      const id = this.listQuery.newsTemplateId
      if (!id) return this.$message.error('无法获取模版信息')
      newsTemplateApi.getNewsTemplateById(id).then(res => {
        if (res.status === 200) this.newsTemplate = res.data
        else this.$message.error('获取模版信息失败')
      })
    },
    // 表格序号
    indexMethod(index) {
      return index + 1
    },
    // 打开新增弹框
    showAddDialog() {
      this.add_and_put_dialog = true
      this.add_and_put_dialog_type = 'add'
    },
    // 修改弹窗
    showChangeDialog(row) {
      this.select_row = row
      this.add_and_put_dialog = true
      this.add_and_put_dialog_type = 'edit'
    },
    // 删除行数据
    deleteRow(index, row) {
      this.$confirm('你确定要删除该模版吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        newsTemplateItemApi.deleteNewsTemplateItem(row.id).then((res) => {
          if (res.status === 200) {
            this.list.splice(index, 1)
            this.$message.success('删除成功！')
          } else {
            this.$message.error('删除失败！')
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tree-leaf-state{
  color: #409eff;
}
</style>

