<template>
  <table-editor-select
    @click.native="initOptions()"
    :value="localValue"
    :loading="loading"
    :requesting="requesting"
    :options="options"
    @input="editorSelect">
  </table-editor-select>
</template>

<script>
  import TableEditorSelect from './TableEditorSelect.vue'
  export default {
    name: 'TableSelectBusse',
    props: {
      value: {}
    },
    data: () => ({
      loading: false, // 加载备选项
      requesting: false, // 变更请求
      loaded: false, // 第一次请求完备选项后，如果返回的备选项为空，则接下来不再进行任何请求
      localValue: '', // 当前选中值
      oldValue: '', // 之前选中值，在请求失败后回显
      options: [] // 备选项列表
    }),
    created () {
      // // 添加默认值
      this.localValue = this.value
      this.oldValue = this.value
    },
    methods: {
      initOptions () { // 请求备选项
        if (this.loading || this.loaded) {
          return
        }
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = [{
            value: 1,
            label: '选项一'
          }, {
            value: 2,
            label: '选项二'
          }, {
            value: 3,
            label: '选项三'
          }]
        }, 2000)
      },
      editorSelect (v) { // 变更
        if (this.localValue === v ) { // 如果变更目标结果和当前选中的值相同，则不进行任何操作
          return
        }
        this.oldValue = this.localValue // 将变更前的值储存起来
        this.requesting = true
        this.localValue = v // 立即显示变更后的值
        setTimeout(() => { // 开始请求变更
          const hasError = false
          if (hasError) {
            this.localValue = this.oldValue // 请求错误的话回显之前的数据
            this.$message.error('更新失败...')
          }
          // else {
          //   this.$message({
          //     // message: '更新成功',
          //     type: 'success'
          //   })
          // }
          this.requesting = false
        }, 2000)
      }
    },
    components: {
      TableEditorSelect
    }
  }
</script>
<style lang="scss">
</style>
