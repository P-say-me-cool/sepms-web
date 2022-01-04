<template>
  <el-select
    :disabled="requesting"
    :loading="loading"
    :value="value"
    @mouseenter.native="isHide = false"
    @mouseleave.native="isHide = true"
    @input="e => { $emit('input', e) }"
    clearable
    :placeholder="placeholder"
    class="component table-editor-select"
    :class="[{'hide': isHide || requesting}]">
    <el-option v-for="item in options" :key="item.key" :value="item.value">{{item.label}}</el-option>
  </el-select>
</template>

<script>
  export default {
    name: 'TableEditorSelect',
    props: {
      placeholder: {
        type: String,
        default: '请选择'
      },
      options: { // 备选项
        type: Array,
        required: true
      },
      requesting: { // 提交修改请求
        type: Boolean,
        default: false
      },
      loading: { // 加载备选项
        type: Boolean,
        default: false
      },
      value: { // 选中的选项
      }
    },
    data: () => ({
      isHide: true
    })
  }
</script>
<style lang="scss">
  .component.table-editor-select {
    &.hide {
      :not(.is-focus) .el-input__inner, :not(.is-focus) .el-input__inner:hover {
        border-color: transparent !important;
        background-color: transparent !important;
      }
      :not(.is-focus) .el-input__suffix {
        opacity: 0;
      }
    }
  }
</style>
