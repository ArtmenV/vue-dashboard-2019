<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <h1>SPP</h1>
    <el-menu
      :show-timeout="50"
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
      class="sidebar"
    >
      <sidebar-item 
        v-for="route in routes" 
        :key="route.path" 
        :item="route" 
        :base-path="route.path"
        @getUpgradeModal="getUpgradeModal"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes () {
      if (this.$store.getters.subscriptionType === "Free Plan" || this.$store.getters.subscriptionType === "Pro Plan") {
        return this.$router.options.routes.map(el => el.name === 'Server group' || el.name === 'MSP Level' || el.name === 'MSP Templates' ? ({
          ...el,
          statusActive: !el.statusActive
        }) : el)
      } else {
        return this.$router.options.routes
      }
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    getUpgradeModal() {
      this.$emit('getUpgradeModal')
    }
  }
}
</script>

<style lang="scss" scoped>
  .logo {
    height: 50px;
    padding-bottom: 5px;
    padding: 0 10px !important;
    opacity: 1;

    &__image {
      width: 100%;
      margin: 0;
      padding: 0;

      &:hover {
        cursor: default !important
      }
    }

    &:hover {
      cursor: default !important
    }
  }
</style>

