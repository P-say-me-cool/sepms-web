<template>
  <div @mouseover="isHideChange(1)"
       @mouseleave="isHideChange(2)">
    <el-date-picker v-if="isHide || value === null"
                    :disabled="requesting"
                    :loading="loading"
                    :value="value"
                    type="datetime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @focus="focusChange"
                    @blur="blurChange"
                    @input="e => { $emit('input', e) }"
                    :placeholder="placeholder"
                    class="component el-date-picker"
                    style="width: 140px"
                    :class="[{'hide': isHide || requesting}]">
    </el-date-picker>
    <span v-else>{{value}}</span>
  </div>
</template>

<script>
  export default {
    name: 'EditDateCell',
    props: {
      pickerOptions:{},
      placeholder: {
        type: String,
        default: '请选择'
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
    data() {
      return {
        isHide: true,
        currentDate:null,
        flag:true
      }
    },
    created() {
      this.isHide = this.value === null;
    },
    methods:{
      isHideChange(value){
        if(this.flag){
          if(1 === value){
            this.isHide = true
          }else{
            this.isHide = false
          }
        }

      },
      focusChange(){
        this.flag = false
      },
      blurChange(){
        this.flag = true
        this.isHide = false
      }
    }
  }
</script>
<style lang="scss">
  .component.el-date-picker {
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
