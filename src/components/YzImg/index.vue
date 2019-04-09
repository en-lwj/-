<template>
  <img v-if="visible" v-bind="$attrs" @error="setDefault($event)">
  <img v-else :src="defauleScr">
</template>

<script>
export default {
  props: {
    default: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      defauleScr: (process.env.STATIC_PATH || '') + '/static/img/user/default.png'
    }
  },
  created() {
    if (this.$attrs.src !== '' && this.$attrs.src !== undefined) this.visible = true
  },
  methods: {
    setDefault(e) {
      if (this.default) {
        e.target.src = this.default
      } else {
        this.visible = false
      }
    }
  }
}
</script>

