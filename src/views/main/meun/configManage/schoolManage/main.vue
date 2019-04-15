<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-container-header">
        <el-button class="filter-item search-list-btn" size="small" @click="searchListClose = !searchListClose">
          <span>筛选条件</span>
          <i :class="searchListClose ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" />
        </el-button>
      </div>
      <div :class="searchListClose ? 'close' : ''" class="filter-container-body">
        <el-row v-loading="searchListLodaing" element-loading-text="筛选条件拼命加载中...">
          <!-- 条件筛选 -->
          <el-form ref="form" :model="listQuery" label-width="100px" size="mini">
            <el-form-item class="yz-inline" label="学校名称：" prop="code">
              <el-input v-model="listQuery.name" class="single-border" type="text" />
            </el-form-item>
          </el-form>
          <el-row class="yz-center">
            <el-button v-waves class="filter-item" size="small" type="primary" @click="getList">
              确认
            </el-button>
          </el-row>
        </el-row>
      </div>
    </div>

    <!-- 学校列表 -->
    <div class="yz-panel">
      <div class="yz-panel-header">
        <div class="yz-panel-header-left">
          <span class="yz-panel-title">学校列表</span>
        </div>
        <el-row class="yz-panel-header-right">
          <el-button class="filter-item" type="primary" size="mini" @click="goSchoolPermission()">
            权限配置
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-plus" size="mini" @click="showAddDialog">
            新增
          </el-button>
        </el-row>
      </div>
      <div v-if="list.length === 0" v-loading="listLoading" class="yz-panel-body" style="padding: 30px;text-align: center;color: #888;">
        暂无学校
      </div>
      <div v-else v-loading="listLoading" class="yz-panel-body panel-container">
        <div class="panel">
          <el-row v-for="(item, index) in list" :key="item.id" class="panel-item">
            <div class="img-container">
              <yz-img :src="item.thumbnail" class="avatar" default="/static/img/default-img.png" />
            </div>
            <div class="panel-main">
              <div class="panel-main-header">
                <span class="panel-main-title">{{ item.name }}</span>
                <span class="panel-main-status">
                  <el-tag v-for="stage in item.stageList" :key="stage.stageName" size="mini">{{ stage.stageName }}</el-tag>
                </span>
              </div>
              <div class="panel-main-content" v-html="item.description.replace(/(\r\n)|(\n)/g, '<br>')" />
            </div>
            <div class="panel-tools">
              <el-button size="mini" type="primary" @click="goRoleConfig(item)">
                角色配置
              </el-button>
              <el-button size="mini" type="warning" @click="showChangeDialog(item)">
                修改
              </el-button>
              <el-button size="mini" type="danger" @click="deleteRow(index, item)">
                删除
              </el-button>
            </div>
          </el-row>
        </div>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination :current-page="pager.pageNum" :page-sizes="[10,20,30, 50]" :page-size="pager.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
    <!-- 新增和修改弹窗 -->
    <div v-if="add_and_put_dialog">
      <add-campus-dialog :visible.sync="add_and_put_dialog" :row="select_row" :dialog-type="add_and_put_dialog_type" @reload="getList" />
    </div>
  </div>
</template>

<script>
import campusApi from '@/api/configManage/campus'
import addCampusDialog from './modules/addCampusDialog'

export default {
  components: {
    addCampusDialog
  },
  data() {
    return {
      list: [],
      total: null,
      listLoading: false,
      listQuery: {
        name: ''
      },
      pager: {
        pageNum: 1,
        pageSize: 20
      },
      // 筛选框默认收起
      searchListClose: true,
      searchListLodaing: false,
      // 选择的table行
      select_row: {},
      // 新增修改弹框
      add_and_put_dialog: false,
      add_and_put_dialog_type: 'add'

    }
  },
  computed: {

  },
  created() {
    this.getList()
  },
  methods: {
    // 获取表格数据
    getList() {
      this.listLoading = true
      campusApi.getCampusList(this.pager, this.listQuery).then(res => {
        if (res.status !== 200) return
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
    // 选中栏目并打开新增弹框
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
    // 去角色配置页
    goRoleConfig(row) {
      this.$router.push({ name: 'roleConfig', params: { id: row.id }})
    },
    // 去权限配置页
    goSchoolPermission() {
      this.$router.push({ name: 'schoolPermission' })
    },
    // 删除行数据
    deleteRow(index, row) {
      this.$confirm('你确定要删除该内容吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        campusApi.deleteCampusContent(row.id).then((res) => {
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
.panel-container{
  background: transparent;
  .panel{
    .panel-item{
      background: #fff;
      display: flex;
      padding: 20px 10px;
      + .panel-item{
        margin-top: 15px;
      }
      .img-container{
        width: 170px;
        min-height: 70px;
        padding: 0 20px;
        max-height: 200px;
        overflow: hidden;
        img{
          width: 100%;
          height: auto;
        }
      }
      .panel-main{
        flex: 1;
        min-height: 100%;
        padding: 0px 10px;
        font-size: 14px;
        span{
          margin-right: 10px;
        }
        .panel-main-title{
          font-size: 16px;
          font-weight: 700;
        }
        .panel-main-content{
          margin: 8px 0px 0;
        }
      }
      .panel-tools{
        height: 100%;
        padding: 0px 10px;
        width: 250px;
        text-align: right;
        button{
          margin-top: 16px;
        }
      }
    }
  }
}
</style>
