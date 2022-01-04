import hasRole from './hasRole'
import hasPermi from './hasPermi'
import hasDataPermi from './hasDataPermi'

const install = function(Vue) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermi', hasPermi)
  Vue.directive('hasDataPermi', hasDataPermi)
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  Vue.use(install); // eslint-disable-line
}

export default install
