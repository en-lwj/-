<template>
  <el-row class="page-side">
    <div class="logo">
      <img src="https://dev.shadowedu.net/hfls-istr-admin/static/images/logo.png" alt="">
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <sidebar-item v-for="route in permissionRouters" :key="route.name" :item="route" :base-path="route.path"/>
      </el-menu>
    </el-scrollbar>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permissionRouters',
      'sidebar'
    ]),
    route_list() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss" scoped>
.page-side{
  height: 100%;
  background: rgb(48, 65, 86);
}
.hideSidebar {
  .logo{
    overflow: hidden;
    img{
      width: 0;
    }
  }
}

.logo{
  height: 50px;
  padding: 12px 20px 0;
  // background: #fff;
  img{
    height: auto;
    width: 100%;
  }
}
.el-scrollbar{
  height: calc(100% - 50px);
}
</style>

