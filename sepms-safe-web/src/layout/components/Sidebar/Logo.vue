<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}" :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <div  v-if="logo" style="width: 100%">
        <img :src="logo" class="sidebar-logo">
        </div>
        <h1 v-else class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.sidebarTitle : variables.sidebarLightTitle }">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <div  v-if="logo" style="width: 100%">
        <img :src="logo" class="sidebar-logo">
        </div>
        <h1 class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.sidebarTitle : variables.sidebarLightTitle }">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import logoImg from '@/assets/logo/logo-05.png'
import variables from '@/assets/styles/variables.scss'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    variables() {
      return variables;
    },
	sideTheme() {
      return this.$store.state.settings.sideTheme
    }
  },
  data() {
    return {
      title: '安环生产信息化管理平台',
      logo: logoImg
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 83px;
  line-height: 83px;
  background: #2b2f3a;
  padding-left: 13px;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 110px;
      /*height: 110px;*/
      height: 25px;
      vertical-align: middle;
      margin-right: 24px;
      margin-top: -31px;
    }

    & .sidebar-title {
      display: inline-block;
      margin-top: -120px;
      color: #0188D7 !important;
      font-weight: 600;
      line-height: 50px;
      font-size: 16px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
