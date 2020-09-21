<template>
  <div class="container">
    <div class="background">
      <el-card class="validation" v-loading="loading">
        <h2 class="text">
          Enter validation key:
        </h2>

        <el-input class="input" v-model="key" @keyup.enter.native="handleSubmit" />
        
        <el-button
          type="success"
          :disabled="key.length === 0"
          class="submit-btn"
          @click="handleSubmit"
        >
          Validate
        </el-button>

        <div
          v-if="errMsg"
          class="alert"
          :class="{'alert--blue': reachedPlanLimit}"
        >
          <div class="alert__title">
            {{ errMsg }}
          </div>

          <div class="alert__text" v-if="errDescription">
            {{ errDescription }}
          </div>

          <div v-if="reachedPlanLimit" class="alert__text">
            <router-link class="link" to="/plan-upgrade">Upgrade plan</router-link> to link more servers.
          </div>

          <div class="alert__close" @click="handleAlertClose">
            <i class="el-icon-close" />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import SPPCloudApi from '@/api/cloud-api.js'

export default {
  data () {
    return {
      key: '',
      loading: false,
      errMsg: '',
      reachedPlanLimit: false,

      errDescription: ''
    }
  },

  mounted () {
    if (this.$route.params['key'] !== '_') {
      this.key = this.$route.params['key']

      this.handleSubmit()
    }
  },

  methods: {
    handleSubmit () {
      this.loading = true
      SPPCloudApi
        .validateServer(this.key)
        .then(r => {
          this.loading = false
          this.$router.push('/servers/' + r.data.result.id + '?noredirect=true')
        })
        .catch(e => {
          this.loading = false
          const statusCode = e.response.data.status_code 

          try {
            if (statusCode == '403' || statusCode == '400') {

              const { reason } = e.response.data.messages[0].context

              if (reason.includes('servers with current plan')) {
                this.errMsg = 'You reached the limit of your plan'
                this.reachedPlanLimit = true
              } else {
                this.errMsg = e.response.data.messages[0].message
                this.errDescription = reason
              }
            } else if (statusCode == '500') {
              this.errDescription = 'Something went wrong'
              this.errMsg = 'Error 500'
            } else if (statusCode == '409') {
              this.errMsg = 'Server with uuid ' + e.response.data.messages[0].context.server_uuid + ' is already exists'
            } else if (statusCode == '404') {
              this.errMsg = 'Wrong validation key'
            } else {
              this.errMsg = 'Error '
            }
          } catch (e) {
            this.errMsg = 'An error occurred'
          }
        })
    },
    handleAlertClose () {
      this.errMsg = ''
      this.errDescription = ''
      this.reachedPlanLimit = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  
  .background {
    min-height: 100vh;
    min-width: 100vw;
    background-color: rgb(245, 245, 245);

    .validation {
      width: 400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      margin-top: 20px;

      .submit-btn {
        margin: 10px 0;
        width: 100%;
      }
    }
  }
}

.alert {
  color: #f56c6c;
  background-color: #fef0f0;

  position: relative;

  &__close {
    position: absolute;
    top: 7px;
    right: 10px;
    cursor: pointer;
  }

  &--blue {
    background-color: #409EFF;
    color: #fff;
  }

  font-size: 13px;
  line-height: 18px;

  padding: 8px 16px;
  border-radius: 5px;

  &__title {
    font-weight: bold;
  }

  &__text {
    margin-top: 5px;
  }

  .link {
    text-decoration: underline;
  }
}
</style>
