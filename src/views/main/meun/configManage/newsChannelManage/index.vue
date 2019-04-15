<template>
  <section class="panel">
    <el-container>
      <el-aside class="container-aside" width="270px">
        <div class="yz-panel">
          <div class="yz-panel-header">
            <div class="yz-panel-header-left">
              <span class="yz-panel-title">资讯栏目列表</span>
            </div>
          </div>
          <div class="yz-panel-body premission-tree">
            <el-tree
              ref="tree"
              v-loading="treeLoading"
              :data="treeData"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :highlight-current="true"
              node-key="id"
              @node-click="selectRowChange"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ data.name }}</span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-aside>
      <el-main class="container-right">
        <div class="yz-panel">
          <div class="yz-panel-header">
            <div class="yz-panel-header-left">
              <span class="yz-panel-title">栏目：{{ currentTreeNode && currentTreeNode.data.name || '' }}</span>
            </div>
            <el-row class="yz-panel-header-right">
              <el-button type="primary" size="mini" @click="showAddDialog()">
                新增
              </el-button>
            </el-row>
          </div>
          <div class="yz-panel-body">
            <el-table
              v-loading="tableLoading"
              :data="tableData"
              :max-height="tableMaxHeight"
              size="small"
              border
            >
              <el-table-column label="序号" align="center" type="index" width="65" />
              <el-table-column label="栏目图标" min-width="100px" align="center">
                <template slot-scope="scope">
                  <yz-img :key="Math.random()+Date.now()" :src="scope.row.thumbnail" style="width: 70px; height: auto; max-height: 200px" />
                </template>
              </el-table-column>
              <el-table-column label="栏目名称" class-name="status-col" min-width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="简介" class-name="status-col" min-width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.description }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" align="center" min-width="180" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <!-- <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-plus" @click="showNewNewsChannelDialog(scope.row)">添加</el-button> -->
                  <el-button size="mini" type="warning" @click="showEditDialog(scope.row)">
                    修改
                  </el-button>
                  <el-button size="mini" type="danger" @click="deleteRow(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- 新增/修改弹窗 -->
    <div v-if="add_newsChannel_dialog">
      <add-news-channel-dialog :visible.sync="add_newsChannel_dialog" :parent-data="currentTreeNode.data" :dialog-type="dialogType" :row.sync="currentTableRow" :parent-node="currentTreeNode" @getNewsTemplateAll="getNewsTemplateAll" @reload="getNewsChannelTree" />
    </div>
  </section>
</template>

<script>
import newsChannelApi from '@/api/configManage/newsChannel'
import newsTemplateApi from '@/api/configManage/newsTemplate'
import addNewsChannelDialog from './modules/addNewsChannel'

import resize from './mixins/resize'

export default {
  components: {
    addNewsChannelDialog
  },
  filters: {

  },
  mixins: [resize],
  data() {
    return {
      permissionAll: undefined,
      treeData: [],
      treeLoading: false,
      tableLoading: false,
      tableData: [],
      tableMaxHeight: 300,
      currentTreeNode: undefined,
      currentTableRow: undefined,
      add_newsChannel_dialog: false,
      dialogType: 'add',
      // 模版列表
      newsTemplateAll: undefined
    }
  },
  created() {
    // this.setTableMaxHeight()
    this.getNewsChannelTree()
  },
  methods: {
    selectRowChange(data, node) {
      this.currentTreeNode = node
      this.setTabelData()
    },
    // 获取资讯栏目列表
    getNewsChannelTree() {
      this.treeLoading = true
      newsChannelApi.getNewsChannelTree().then(res => {
        this.treeLoading = false
        if (res.status === 200) {
          this.treeData = res.data.rows
          if (this.currentTreeNode) {
            this.$nextTick(() => {
              this.$refs['tree'].setCurrentKey(this.currentTreeNode.data.id)
              this.currentTreeNode = this.$refs['tree'].getNode(this.currentTreeNode.data.id)
              this.setTabelData()
            })
          } else {
            this.setTabelData(this.treeData[0])
            this.$nextTick(() => {
              this.$refs['tree'].setCurrentKey(this.treeData[0].id)
              this.currentTreeNode = this.$refs['tree'].getNode(this.treeData[0])
            })
          }
        }
      })
    },
    // 获取新闻模版列表（所有）
    getNewsTemplateAll(callback) {
      // if (this.newsTemplateAll !== undefined) return Promise.resolve(this.newsTemplateAll)
      return newsTemplateApi.getNewsTemplateAll(this.listQuery).then(res => {
        if (res.status !== 200) {
          this.$message.error('新闻模版列表获取失败！')
          callback && callback([])
          return []
        }
        this.newsTemplateAll = res.data.rows
        callback && callback(this.newsTemplateAll)
      })
    },
    // 显示表格数据
    setTabelData(data) {
      // const parentId = id || this.currentTreeNode.data.id
      this.tableLoading = true
      this.tableData = data && data.children || this.currentTreeNode.data.children || []
      this.tableLoading = false
    },
    // 显示新增弹框
    showAddDialog() {
      this.dialogType = 'add'
      this.add_newsChannel_dialog = true
    },
    // 显示修改弹框
    showEditDialog(row) {
      this.currentTableRow = row
      this.dialogType = 'edit'
      this.add_newsChannel_dialog = true
    },
    // 删除行数据
    deleteRow(index, row) {
      this.$confirm('你确定要删除该资讯栏目吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        newsChannelApi.deleteNewsChannel(row.id).then((res) => {
          if (res.status === 200) {
            this.$refs['tree'].remove(row.id)
            this.tableData.splice(index, 1)
            this.$message.success('删除成功！')
          } else this.$message.error('删除失败！')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel{
  padding: 10px 30px;
}
.el-aside{
  overflow: visible;
}
.el-main{
  padding: 0 0 0 20px;
}
.yz-panel-body{
  height: calc(100vh - 150px);
}
.premission-tree{
  overflow: auto;
  font-size: 14px;
  span.tree-leaf-state {
    color: #66b1ff;
  }
}
</style>

<style scoped>
.premission-tree>>> .el-tree-node.is-expanded>.el-tree-node__children{
  overflow: visible;
}
</style>

