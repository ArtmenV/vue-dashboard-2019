<template>
  <div class="navbar">
    <img 
      class="logo__image" 
      :src="logoSrc" 
      alt="logo"
      @click="$router.push('/')"
    >

    <hamburger 
      v-if="$route.path !== '/plan-upgrade'" 
      :toggle-click="toggleSideBar" 
      :is-active="sidebar.opened" 
      class="hamburger-container"
    />

    <div class="user-info" style="margin-left: auto;">
      <div class="username">
        {{ $store.getters.userName }}
      </div>

      <div class="subscription-type link" @click="$router.push('/plan-upgrade')">
        {{ $store.getters.subscriptionType }}
      </div>
    </div>

    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img :src="avatarPlaceholder" class="user-avatar">
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <el-dropdown-item>
          <span style="display:block;" @click="$router.push('/account')">Settings</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <a
            href="https://nextvectorsecurity.com/donate/"
          >
            Fund the project
          </a>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">Sign out</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),

    logoSrc () {
      return require('@/assets/images/logo_03.png')
    },

    avatarPlaceholder () {
      return require('@/assets/images/avatar-placeholder.png')
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  position: relative;
  display: flex;
  z-index: 1002 !important;
  background-color: white;

  height: 50px;
  line-height: 50px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);

  .logo__image {
    padding: 10px;
    height: 100%;
    max-width: 190px;

    &:hover {
      cursor: pointer;
    }
  }

  .hamburger-container {
    line-height: 58px;
    height: 50px;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }

  .user-info {
    display: inline-flex;
    float: right;
    margin-right: 100px;

    .username {
      font-size: 16px;
      font-weight: bold;
    }

    .subscription-type {
      font-size: 15px;
      color: lightgray;
      margin-left: 20px;
    }
  }

  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }

  .link {
    color: lightgray;

    transition: all .2s ease-in;

    &:hover {
      cursor: pointer;

      color: #409EFF;
    }
  }
}
</style>

