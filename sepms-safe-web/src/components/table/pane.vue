<template>
  <div class="pane" v-show="show">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "pane",
    props:{
      name:{
        type: String
      },
      label:{
        type: String,
        default: ''
      }
    },
    data(){
      return {
        show: true
      }
    },
    mounted(){
      this.updateNav();
    },
    methods: {
      updateNav: function () {
        this.$parent.updateNav();
      }
    },
    watch: {
      label: function () {
        this.updateNav();
      }
    }
  }
</script>

<style scoped>
</style>
