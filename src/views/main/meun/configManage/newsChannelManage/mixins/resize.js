
export default {
  created() {
    this.setTableMaxHeight()
  },
  mounted() {
    this.__resizeHanlder = Common.debounce(() => {
      this.setTableMaxHeight()
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  methods: {
    // 设置表格最大高度
    setTableMaxHeight() {
      this.tableMaxHeight = window.innerHeight - 160
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHanlder)
  }
}
