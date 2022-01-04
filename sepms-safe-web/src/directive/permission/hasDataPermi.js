 /**
 * 界面数据权限绑定处理
 * renyp
 */

import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value,arg } = binding
    const all_permission = "*:*:*";
    const dataPermissions = store.getters && store.getters.dataPermissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value + "-" + arg

      const hasPermissions = dataPermissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.style.hidden = true
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}
