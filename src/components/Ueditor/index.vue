<template>
  <div>
    <vue-ueditor-wrap v-model="msg" :config="myConfig" :destroy="false" @ready="ready"/>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  components: {
    VueUeditorWrap
  },
  props: {
    value: {
      type: null,
      default: undefined
    },
    config: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      msg: undefined,
      myConfig: {
        // 编辑器是否自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 250,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: process.env.BASE_API + '/ueditor',
        // 获取配置文件接口
        configUrl: process.env.BASE_API + '/ueditor/config',
        // UEditor 资源文件存放的根目录，如果你使用的是 vue-cli 3.x，设置为'/UEditor/'（参考下方的常见问题2）
        UEDITOR_HOME_URL: (process.env.STATIC_PATH || '') + '/static/UEditor/',
        // 设置不自动调整高度
        scaleEnabled: false,
        // 是否取消默认zIndex(不影响全屏,和使用表情等弹框时使用zIndex)
        cancelZIndex: true,
        zIndex: 3000,
        // 配置选项
        toolbars: [
          [
            'indent', // 首行缩进
            'bold', // 加粗
            'italic', // 斜体
            'underline', // 下划线
            'strikethrough', // 删除线
            'subscript', // 下标
            'superscript', // 上标
            '|',
            'justifyleft', // 居左对齐
            'justifyright', // 居右对齐
            'justifycenter', // 居中对齐
            'justifyjustify', // 两端对齐
            '|',
            'fontsize', // 字号
            'paragraph', // 段落格式
            '|',
            'spechars', // 特殊字符
            'forecolor', // 字体颜色
            'fontborder', // 字符边框
            'formatmatch', // 格式刷
            'blockquote', // 引用
            'horizontal', // 分隔线
            'removeformat', // 清除格式期
            '|',
            'link', // 超链接
            'unlink', // 取消链接
            '|',
            'imagenone', // 默认
            'imageleft', // 左浮动
            'imageright', // 右浮动
            'imagecenter', // 居中
            '|',
            'rowspacingtop', // 段前距
            'rowspacingbottom', // 段后距
            'lineheight', // 行间距
            '|',
            'emotion', // 表情
            'insertimage', // 多图上传
            'insertvideo', // 视频
            'attachment', // 附件
            '|',
            'backcolor', // 背景色
            'insertorderedlist', // 有序列表
            'insertunorderedlist', // 无序列表
            'fullscreen', // 全屏
            // 'directionalityltr', // 从左向右输入
            // 'directionalityrtl', // 从右向左输入
            // 'pagebreak', // 分页
            'insertframe', // 插入Iframe
            // 'wordimage', // 图片转存
            'autotypeset', // 自动排版
            'inserttable', // 插入表格
            'background', // 背景
            // 'music', // 音乐
            'template', // 模板
            'preview' // 预览
          ]
        ]
      }
    }
  },
  // v-model语法糖实现
  watch: {
    value: {
      handler(value) {
        this.msg = value
      },
      immediate: true
    },
    msg() {
      this.$emit('input', this.msg)
    }
  },
  created() {
    this.myConfig = Object.assign(this.myConfig, this.config)
  },
  methods: {
    ready() {
      this.$listeners['ready'] && this.$emit('ready')
    }
  }
}
</script>

