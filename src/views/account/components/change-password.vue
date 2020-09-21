<template>
  <div class="password-change-container" v-loading="loading">
    <el-alert
      v-show="successMsg.length != 0"
      type="success"
      :title="successMsg"
    />

    <div class="input">
      <el-input
        size="mini"
        placeholder="Enter password"
        type="password"
        v-model="password"
      />

      <div class="error-msg">
        {{ errorPassword }}
      </div>
    </div>

    <div class="input">
      <el-input
        size="mini"
        placeholder="Confirm password"
        type="password"
        v-model="passwordConfirm"
      />

      <div class="error-msg">
        {{ errorPasswordConfirm }}
      </div>
    </div>
    
    <el-button
      type="primary"
      size="mini"
      :loading="loading"
      :disabled="errorPassword.length != 0 || errorPasswordConfirm.length != 0"
      @click="handleSubmit"
    >
      Change password
    </el-button>
  </div>
</template>

<script>
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'

  export default {
    data () {
      return {
        loading: false,

        password: '',
        passwordConfirm: '',

        errorMsg: null,

        successMsg: ''
      }
    },

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    computed: {
      errorPassword () {
        if (!this.password) {
          return ' '
        } else if (this.password.length < 6) {
          return 'Password should contain at least 6 symbols'
        } else {
          return ''
        }
      },

      errorPasswordConfirm () {
        if (!this.passwordConfirm) {
          return ' '
        } else if (this.password !== this.passwordConfirm) {
          return 'Passwords don\'t match'
        } else {
          return ''
        }
      }
    },

    props: [
      'id'
    ],

    methods: {
      handleSubmit () {
        this.loading = true
        this.successMsg = ''
        
        SPPCloudApi
          .updateUserInfo({password: this.password}, 'user/password')
          .then(r => {
            this.loading = false
            this.successMsg = 'Password has been changed successfully.'
            setTimeout(() => {
              this.$emit('password-changed')
            }, 2000)
          })
          .catch(e => {
            this.loading = false
            this.errorMsg = handleError(this, e)
          })
      }
    }
  }
</script>

<style lang="scss">
.password-change-container {
  .el-dialog {
    max-width: 300px;
  }
}
</style>

<style lang="scss" scoped>
  .password-change-container {
    display: grid;
    grid-gap: 10px;

    .error-msg {
      font-size: 13px;
      color: red;
      margin-left: 5px;
    }
  }
</style>
