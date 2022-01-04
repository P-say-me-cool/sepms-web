<template>
  <div class="editCell">
    <div class="canEdit" v-if="CanEdit" @click="beginEdit">
      <label v-show="!editStatus">
        <span
          v-if="this.value!== null && this.value !== undefined && this.value !== ''">{{ value }}{{this.suffix}}</span>
        <span v-else style="padding-left: 100%;padding-top: 100%;"/>
      </label>
      <label v-show="editStatus">
        <input
          type="Number"
          class="inputClass"
          min="0"
          ref="input"
          v-on:keyup.13="loseFocus"
          :value="value"
          @blur="loseFocus"
          oninput="value=value.replace('-', '')"
        />
      </label>
    </div>
    <label class="cannotEdit" v-else>
      <span>{{ value }}{{ suffix }}</span>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'EditCellNumber',
    props: {
      /**
       * 绑定值
       */
      value: {
        required: true
      },
      /**
       * 是否可编辑
       */
      CanEdit: {
        type: Boolean,
        default: true
      },
      /**
       * 格式化函数
       */
      formatData: {
        type: Function,
        default: value => {
          return value
        }
      },
      /**
       * 编辑后事件
       */
      afterEdit: {
        type: Function,
        default: () => {
        }
      },
      /**
       * 是否初始格式化
       */
      initFormat: {
        type: Boolean,
        default: false
      },
      suffix: {
        default: ''
      },
      /**
       * 数据为空是否为输入框
       */
      status: {
        default: false
      },
      /**
       * 输入框类型
       */
      inputType: {
        type: String,
        default: 'text'
      }
    },
    data() {
      return {
        editStatus: false,
        showData: '',
        defaultData: '',
        timeout: null
      }
    },
    methods: {
      /**
       * 单击开始编辑
       */
      beginEdit() {
        this.editStatus = true
        setTimeout(() => {
          this.$refs.input.focus()
        }, 1)
      },

      /**
       * @param {event} event
       * 丢失焦点关闭编辑状态，并保存数据
       */
      loseFocus(event) {
        if (!event.target.value) {
          value = null
          this.editData(value)
          this.editStatus = false
          return
        }
        let value = Number(this.formatData(event.target.value))
        if (value != '' && typeof value == 'number') {
          this.closeEditStatus(value)
        } else if (value == 0) {
          this.closeEditStatus(value)
        } else {
          this.$message.warning('只能数字类型!!!')
          return
        }
        this.editData(value)
        this.afterEdit(value)
      },

      /**
       * 发布input事件修改数据
       * @param value
       */
      editData(value) {
        this.$emit('input', value)
      },

      /**
       * 关闭编辑状态
       * @param value
       */
      closeEditStatus(value) {
        this.editStatus = false
      },
      /**
       * 初始格式化数据
       */
      initData() {
        let newValue = this.formatData(this.value)
        this.$emit('input', newValue)
      }
    },
    mounted() {
      if (this.initFormat) {
        this.initData()
      }

      if (this.status) {
        if (this.value === null || this.value === '') {
          this.editStatus = true
        }
      }
    },
    watch: {
      'value': function(newVal) {
        if (this.inputType === 'number') {
          if (newVal !== '' && newVal !== null) {
            newVal = String(newVal)
            if (newVal < 0) {
              newVal = ''
            }
            if (newVal.indexOf('.') > -1) {
              newVal = newVal.slice(0, newVal.indexOf('.') + 3)
            }
          }
        }
        this.$emit('input', this.formatData(newVal))
      }
    }
  }
</script>

<style scoped>
  .editCell {
    height: 100%;
    width: 100%;
  }

  .inputClass {
    height: 30px;
    width: 100%;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    line-height: 30px;
    outline: 0;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    overflow: visible;
    touch-action: manipulation;
    margin: 0;
  }
</style>
