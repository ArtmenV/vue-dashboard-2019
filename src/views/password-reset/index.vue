<template>
  <div class="container">
    <div class="background">
      <el-card v-if="$route.params.key === '_'" class="validation" v-loading="loading">
        <h2 class="text">Enter email</h2>
        
        <el-input
          class="input"
          v-model="email"
          @keyup.enter.native="handleSubmit"
        />

        <el-button
          type="success"
          :disabled="email.length === 0"
          class="submit-btn"
          @click="handleSubmit"
        >
          Continue
        </el-button>

        <el-alert
          v-if="errMsg !== ''"
          :title="errMsg"
          :description="errDescription"
          type="error"
        />

        <el-alert
          v-if="successMsg !== ''"
          :title="successMsg"
          type="success"
        />
      </el-card>

      <el-card v-else class="validation" v-loading="loading">
        <h2 class="text">Create new password</h2>

        <el-input
          class="input"
          v-model="password"
          type="password"
          placeholder="Enter new password"
          @keyup.enter.native="handleSubmit"
        />

        <el-input
          class="input"
          v-model="passwordConfirm"
          type="password"
          placeholder="Confirm new password"
          @keyup.enter.native="handleSubmit"
        />

        <el-button
          type="success"
          :disabled="password.length < 6 || password !== passwordConfirm"
          class="submit-btn"
          @click="handlePasswordResetSubmit"
        >
          Save new password
        </el-button>

        <el-alert
          v-if="errMsg !== ''"
          :title="errMsg"
          :description="errDescription"
          type="error"
        />

        <el-alert
          v-if="successMsg !== ''"
          :title="successMsg"
          type="success"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
  import SPPCloudApi from '@/api/cloud-api.js'

  export default {
    data () {
      return {
        loading: false,
        
        email: '',
        password: '',
        passwordConfirm: '',

        errMsg: '',
        errDescription: '',

        successMsg: ''
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
        if (this.$route.params.key === '_') {
          this.loading = true
          SPPCloudApi
            .forgotPasswordSendEmail(this.email)
            .then(r => {
              this.loading = false
  
              this.successMsg = 'Link for resetting your password was sent to your email.'
            })
            .catch(e => {
              this.loading = false
              const statusCode = e.response.data.status_code 
              if (statusCode == '403' || statusCode == '400') {
                this.errMsg = e.response.data.messages[0].message
                this.errDescription = e.response.data.messages[0].context.reason
              } else if (statusCode == '500') {
                this.errDescription = 'Something went wrong'
                this.errMsg = 'Error 500'
              }
            })
        }
      },

      handlePasswordResetSubmit () {
        this.loading = true

        SPPCloudApi
          .forgotPasswordSetPassword(this.password, this.$route.params.key)
          .then(r => {
            this.loading = false

            this.successMsg = 'Password has been changed successfully. Now you\'ll redirected to login page.'

            setTimeout(() => {
              this.$router.push('/login')
            }, 1000)
          })
          .catch(e => {
            this.loading = false
            const statusCode = e.response.data.status_code 

            if (statusCode == '403' || statusCode == '400') {
              this.errMsg = e.response.data.messages[0].message
              this.errDescription = e.response.data.messages[0].context.reason
            } else if (statusCode == '500') {
              this.errDescription = 'Something went wrong'
              this.errMsg = 'Error 500'
            }
          })
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
        display: grid;
        flex-direction: column;
        margin-top: 20px;

        .input {
          margin: 5px 0;
        }

        .submit-btn {
          margin: 10px 0;
          width: 100%;
        }
      }
    }
  }
</style>
