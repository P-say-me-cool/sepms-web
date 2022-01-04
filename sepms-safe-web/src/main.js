import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'
import "element-ui/packages/theme-chalk/src/index.scss";

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'
import { download } from '@/utils/request'
import AFTableColumn from 'af-table-column' // table表格列自适应
import './assets/icons' // icon
import './permission' // permission control
import { getDicts,getDictsBatch } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree,differenceSecond,treeDataTranslate,isOne} from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
// 自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar"
// 引入echars图表
//防止按钮重复点击
import preventReClick from './utils/plugins.js'
import echarts from './utils/echartsUi.js'
import styleHeight from './utils/styleHeight.js'
Vue.use(styleHeight)
import styleHeightView from './utils/heightView'
Vue.use(styleHeightView)
import Print from './utils/print.js'
Vue.use(Print)
import vueToPdf from 'vue-to-pdf';
Vue.use(vueToPdf);
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

Vue.use(VXETable)

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getDictsBatch = getDictsBatch
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.isOne = isOne
Vue.prototype.handleTree = handleTree
Vue.prototype.differenceSecond = differenceSecond
Vue.prototype.treeDataTranslate = treeDataTranslate
Vue.prototype.echarts = echarts
Vue.prototype.preventReClick = preventReClick
Vue.prototype.tableColumnWidth = '180px'
Vue.prototype.tableTimeWidth = '200px'
Vue.prototype.tageNameWidth = '200px'


Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgWarning = function (msg) {
  this.$message({ showClose: true, message: msg, type: "warning" });
}


Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

Vue.use(permission)
Vue.use(AFTableColumn)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
