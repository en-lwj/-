<template>
  <div class="app-container">
    <div class="yz-panel">
      <div class="yz-panel-header">
        <div class="yz-panel-header-left">
          <span class="yz-panel-title">基本信息</span>
        </div>
        <el-row class="yz-panel-header-right">
          <el-button type="warning">
            基础设置
          </el-button>
          <el-button type="primary">
            校园设置
          </el-button>
          <el-button type="primary">
            公众号
          </el-button>
          <el-button type="primary">
            钉钉
          </el-button>
        </el-row>
      </div>
      <div class="yz-panel-body">
        123
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@mixin clear(){
  &:before, &:after{
    display: block;
    content: '';
    height: 0;
    clear: both;
  }
}

.yz-panel {
  .yz-panel-header{
    height: 50px;
    border-bottom: 1px solid #ddd;
    @include clear();
    .yz-panel-header-left{
      height: 100%;
      float: left;
      font-size: 24px;
      &:before{
        content: '';
        display: inline-block;
        height: 100%;
        width: 0;
        vertical-align: middle;
      }
      .yz-panel-title{
        font-size: 24px;
        padding-left: 15px;
        border-left: 5px solid #33ccff;
        vertical-align: middle;
      }
    }
    .yz-panel-header-right{
      float: right;
      height: 100%;
      margin: 0;
      vertical-align: middle;
      &:before{
        content: '';
        display: inline-block;
        height: 100%;
        width: 0;
        vertical-align: middle;
      }
    }
  }
  .yz-panel-body{
    min-height: 300px;
  }
}
</style>
