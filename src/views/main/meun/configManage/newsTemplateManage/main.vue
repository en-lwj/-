<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-container-header">
        <el-button class="filter-item search-list-btn" size="small" @click="searchListClose = !searchListClose">
          <span>筛选条件</span>
          <i :class="searchListClose ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"/>
        </el-button>
      </div>
      <div :class="searchListClose ? 'close' : ''" class="filter-container-body">
        <el-row v-loading="searchListLodaing" element-loading-text="筛选条件拼命加载中...">
          <!-- 条件筛选 -->
          <el-form ref="form" :model="listQuery" label-width="100px" size="mini">
            <el-form-item class="yz-inline" label="模版名称：" prop="name">
              <el-input v-model="listQuery.name" class="single-border"/>
            </el-form-item>
            <el-form-item class="yz-block" label="状态：" prop="status">
              <el-radio-group v-model="listQuery.status">
                <el-radio v-for="item in statusOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <el-row class="yz-center">
            <el-button v-waves class="filter-item" size="small" type="primary" @click="getList">确认</el-button>
          </el-row>
        </el-row>
      </div>
    </div>

    <!-- 咨询模版 -->
    <div class="yz-panel">
      <div class="yz-panel-header">
        <div class="yz-panel-header-left">
          <span class="yz-panel-title">咨询模版</span>
        </div>
        <el-row class="yz-panel-header-right">
          <el-button class="filter-item" type="primary" icon="el-icon-plus" size="mini" @click="showAddNewsTemplateDialog()">新增</el-button>
        </el-row>
      </div>
      <div class="yz-panel-body">
        <el-table
          v-loading="listLoading"
          :max-height="tableMaxHeight"
          :data="list"
          border>
          <el-table-column :index="indexMethod" label="序号" align="center" type="index" width="65"/>
          <el-table-column label="模版名称" min-width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" class-name="status-col" min-width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status | statusFilter }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="简介" class-name="status-col" min-width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" class-name="status-col" min-width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="280" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="goTemplateItem(scope.row)">模版属性</el-button>
              <el-button size="mini" type="warning" @click="showEditNewsTemplateDialog(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination :current-page="pager.pageNum" :page-sizes="[10,20,30, 50]" :page-size="pager.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
        </div>
      </div>
    </div>

    <!-- 新增和修改用户弹窗 -->
    <div v-if="add_or_put_dialog">
      <add-news-template-dialog :visible.sync="add_or_put_dialog" :row.sync="select_row" :dialog-type="add_or_put_dialog_type" @reload="getList"/>
    </div>
  </div>
</template>

<script>
import newsTemplateApi from '@/api/configManage/newsTemplate'
import addNewsTemplateDialog from './modules/addNewsTemplate'
import resize from './mixins/resize'

export default {
  components: {
    addNewsTemplateDialog
  },
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
  mixins: [resize],
  data() {
    return {
      list: [],
      total: null,
      searchListLodaing: false,
      searchListClose: true,
      listLoading: true,
      listQuery: {
        status: '',
        name: undefined,
        isDelete: false
      },
      pager: {
        pageNum: 1,
        pageSize: 20
      },
      statusOptions: [
        { label: '全部', value: '' },
        ...this.$store.getters.statusOption
      ],
      // 选择的table行
      select_row: {},
      add_or_put_dialog: false,
      add_or_put_dialog_type: 'add'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取表格数据
    getList() {
      this.listLoading = true
      newsTemplateApi.getNewsTemplateList(this.pager, this.listQuery).then(res => {
        if (res.status !== 200) {
          this.listLoading = false
          return this.$message.error('用户列表获取失败！')
        }
        this.list = res.data.rows
        this.total = res.data.total
        this.listLoading = false
      })
    },
    // 表格序号
    indexMethod(index) {
      return (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
    },
    // 重置表格数据
    resetList() {
      this.pager.pageNum = 1
      this.getList()
    },
    // 改变表格显示数量
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getList()
    },
    // 改变页数
    handleCurrentChange(val) {
      this.pager.pageNum = val
      this.getList()
    },
    // 显示新增角色弹窗
    showAddNewsTemplateDialog() {
      this.add_or_put_dialog = true
      this.add_or_put_dialog_type = 'add'
    },
    // 显示修改角色弹窗
    showEditNewsTemplateDialog(row) {
      this.select_row = row
      this.add_or_put_dialog = true
      this.add_or_put_dialog_type = 'edit'
    },
    // 去模板属性页
    goTemplateItem(row) {
      this.$router.push({ name: 'newsTemplateItem', params: { id: row.id }})
    },
    // 删除行数据
    deleteRow(index, row) {
      this.$confirm('你确定要删除该模版吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        newsTemplateApi.deleteNewsTemplate(row.id).then((res) => {
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

</style>

