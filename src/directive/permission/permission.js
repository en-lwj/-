
import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    // const roles = store.getters && store.getters.roles

    if (value) {
      // const permissionRoles = value
      const pagePermission = store.getters.pagePermission || []
      const flag = pagePermission.some(item => item.module === value)
      if (!flag) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`v-permission指令出错啦`)
    }
  }
}
