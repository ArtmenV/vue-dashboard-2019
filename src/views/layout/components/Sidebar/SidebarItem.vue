<template>
  <div v-if="shouldShowItem(item)" class="menu-wrapper">

    <template v-if="hasOneShowingChild(item.children,item) 
      && (!onlyOneChild.children||onlyOneChild.noShowingChildren)
      &&!item.alwaysShow"
    >
      <app-link 
        :to="resolvePath(onlyOneChild.path)" 
        :isActive="item.statusActive"
        @getUpgradeModal="getUpgradeModal"
      >
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <item :meta="Object.assign({},item.meta,onlyOneChild.meta)" />
        </el-menu-item>
      </app-link>
    </template>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import baseUrl from '../../../../api/config'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.getCurrent()
  },
  data() {
    this.onlyOneChild = null
    return {}
  },

  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath).replace(':id', 'list')

      console.log('routePath', routePath)
    },

    shouldShowItem (item) {
      if (item.hidden) {
        return false
      }

      return true
    },

    getUpgradeModal () {
      this.$emit('getUpgradeModal')
    },

    getCurrent () {
        [...document.querySelectorAll(".menu-wrapper")]
        .filter((el, index) => index === 4)
        .map(el => el.classList.add('main-block'));

        [...document.querySelectorAll(".menu-wrapper")]
        .filter((el, index) => index === 5)
        .map(el => el.classList.add('footer-block'));

        if (baseUrl === 'https://demo-sppapi.zimalab.com') {
          [...document.querySelectorAll(".menu-wrapper")]
          .filter((el, index) => index === 7)
          .map(el => el.classList.add('forum-block'));
        }
    },
  }
}
</script>

<style lang="scss">
.sidebar-container {
  .el-tooltip {
    padding-left: 10px !important;
  }
  .el-menu-item {
    padding-left: 10px !important;
    svg {
      font-size: 16px;
    }
  }

  .submenu-title-noDropdown {
    padding-left: 10px !important;
  }

  .main-block {
    padding-bottom: 1.5rem;
  };

  .forum-block a {
    pointer-events: none !important;
  }
  .forum-block > * {
    cursor: not-allowed;
  }
} 
</style>
