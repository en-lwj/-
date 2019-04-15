<template>
  <section class="app-main">
    <el-row v-show="!$route.meta.noCache" class="app-main-contain">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view v-if="!$route.meta.noCache" />
        </keep-alive>

        <!-- <keep-alive :include="cachedViews">
          <router-view :key="key"/>
        </keep-alive> -->
      </transition>
    </el-row>
    <el-row v-show="$route.meta.noCache" class="app-main-contain">
      <transition name="fade-transform" mode="out-in">
        <router-view v-if="$route.meta.noCache" />
      </transition>
    </el-row>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {

    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  },
  watch: {
    // $route(to, from) {
    //   if (!to.meta.noCache && from.meta.noCache) {
    //     this.transition = 'slide-left'
    //   } else {
    //     this.transition = 'slide-right'
    //   }
    // }
  },
  created() {
    // console.log(this.$route)
  }
}
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  /* min-height: calc(100vh - 117px); */
  min-height: calc(100vh - 84px);
  position: relative;
  overflow: hidden;
  background: #f4f4f4;
}
.app-main-contain{
  min-height: calc(100vh - 84px);
}
</style>

