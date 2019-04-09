<template>
  <el-row>
    <!-- 资讯模版列表 -->
    <keep-alive>
      <news-template-manage v-if="$route.name ==='newsTemplateManage'" />
    </keep-alive>
    <!-- 角色配置 -->
    <!-- <info-container v-if="$route.name ==='studentInfo' || $route.name ==='parentInfo'"/> -->
    <router-view v-cloak v-if="$route.name !=='newsTemplateManage'" />
  </el-row>
</template>

<script>
// import infoContainer from './modules/infoContainer'
import newsTemplateManage from './main'

export default {
  components: {
    // infoContainer,
    newsTemplateManage
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

