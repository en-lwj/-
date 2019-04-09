import Vue from 'vue'

// 注册全局指令
import vPermission from './permission/permission'
import vWaves from './waves/waves'
import vdialogDrag from './el-dragDialog/drag'

// 权限 v-permission="'权限模块'"
Vue.directive('permission', vPermission)
// 按钮点击水波纹样式
Vue.directive('waves', vWaves)
// v-dialog-drag 弹窗可移动
Vue.directive('dialogDrag', vdialogDrag)

