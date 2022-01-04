/**
 * table 表头增加icon
 */
export function renderHeaderMethod(h, { column, $index }) {
  // h 是一个渲染函数       column 是一个对象表示当前列      $index 第几列
  return h('div', [
    h('span', column.label + '  ', {
      align: 'left'
    }),
    h('i', {              // 生成 i 标签 ，添加icon 设置 样式，slot 必填
      class: 'el-icon-edit',
      style: 'color:#ccc,margin:18px',
      slot: 'reference'
    })
  ])
}
