<template>
  <div @mouseover="isHideChange(1)"
       @mouseleave="isHideChange(2)">
    <el-time-picker v-if="isHide || value === null"
                    :disabled="requesting"
                    :loading="loading"
                    :value="value"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @focus="focusChange"
                    @blur="blurChange"
                    @input="e => { $emit('input', e) }"
                    :placeholder="placeholder"
                    class="component el-time-picker"
                    :class="[{'hide': isHide || requesting}]"
                    :picker-options="{
                      selectableRange :startTime+' - '+endTime
                    }">
    </el-time-picker>
    <span v-else>{{value}}</span>
  </div>
</template>

<script>
  export default {
    name: 'EditTimeCell',
    props: {
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
      },
      startTime: {
        type: String,
        default: '00:00:00'
      },
      endTime: {
        type: String,
        default: '23:59:59'
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
  .component.el-time-picker {
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
