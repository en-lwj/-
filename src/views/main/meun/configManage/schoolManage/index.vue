<template>
  <el-row>
    <!-- 学校管理 -->
    <keep-alive>
      <school-manage v-if="$route.name ==='schoolManage'" />
    </keep-alive>
    <!-- 角色配置 -->
    <!-- <info-container v-if="$route.name ==='studentInfo' || $route.name ==='parentInfo'"/> -->
    <router-view v-cloak v-if="$route.name !=='schoolManage'" />
  </el-row>
</template>

<script>
// import infoContainer from './modules/infoContainer'
import schoolManage from './main'

export default {
  components: {
    // infoContainer,
    schoolManage
  },
  data() {
    return {

    }
  },
  created() {
    // console.log(this.$route)
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>

</style>

