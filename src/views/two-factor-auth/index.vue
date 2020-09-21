<template>
  <div class="two-factor-page">
    <div class="container">
      <div class="auth-window">
        <div class="auth-window__title">
          Enter your verification code
        </div>
        <div class="auth-window__input">
          <el-input
            placeholder="385698"
            v-model.trim="value"
          />
          <small v-if="isShortMessage.length" style="color: red">
            {{ isShortMessage }}
          </small>
        </div>
        <el-button
          size="mini"
          class="submit-button"
          type="primary"
          :disabled="false"
          :loading="loading"
          @click="handleSubmit"
        >
          Continue
        </el-button>

        <el-alert
          class="success-resend-to-phone"
          v-if="requestSubmitCodeFailed.length"
          :title="requestSubmitCodeFailed"
          type="error"
        />

        <div
          v-if="authMethod === 'Email'"
        >
          <div class="note-send">
            Email with code is sent to you
          </div>
            <div class="note">
              I didn't receive a code.
              <button
                @click="handleResendCodeToEmail"
                class="link"
                v-loading="isLoadingResend"
              >
                Resend a code
              </button> 
            </div>
              
            <el-alert
              class="success-resend"
              v-if="resendEmailResult.length"
              type="success"
              :title="resendEmailResult"
            />

            <el-alert
              class="success-resend-failed"
              v-if="resendEmailResultError.length"
              type="error"
              :title="resendEmailResultError"
            />
          </div>
        <div
          v-else
        >
          <div class="note-send">
            SMS with code is sent to you
          </div>
          <div class="note">
            I didn't receive a code. 
            <button
              @click="handleResendCode"
              :disabled="blockButton"
              class="link"
              v-loading="isLoadingResend"
            >
              Resend a code
            </button> 
          </div>

          <el-alert
            class="success-resend-to-phone"
            v-show="timeResponse.length"
            type="success"
            :title="timeResponse"
          />

          <div class="note">
            <button
              @click="handleResendCodeToEmail"
              class="link"
              v-loading="isLoadingResendEmail"
            >
              I don't have access to my phone
            </button> 
          </div>

          <el-alert
            class="success-resend-to-email"
            v-if="resendEmailResult.length"
            type="success"
            :title="resendEmailResult"
          />

          <el-alert
            class="success-resend-to-email"
            v-if="resendEmailResultError.length"
            type="error"
            :title="resendEmailResultError"
          />

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseUrl from "../../api/config"
import store from '@/store/index.js'
import axios from 'axios'
export default {
  data() {
    return {
      value: '',
      isShortMessage: '',
      loading: false,

      factorAuthData: {},
      authMethod: '',
      stepOneTokenData: '',

      successResend: '',

      isLoadingResend: false,
      isLoadingResendEmail: false,

      resendEmailResult: '',
      resendEmailResultError: '',

      requestSubmitCodeFailed: '',
      slosableError: false,

      resendError: '',
      blockButton: false,

      currentResendItem: 0,
      timeBlock: null,
      timeResponse: '',
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    async handleSubmit() {
      this.requestSubmitCodeFailed = ''
      if (!this.value.length) {
        this.isShortMessage = 'is required'
        return
      } else {
        this.isShortMessage = ''
      }
      const data = {
        step_one_token: this.stepOneTokenData,
        code: this.value
      }
      this.loading = true
      this.$store.dispatch('TwoFactorAuth', data).then(() => {
        this.loading = false
        this.$router.push({ path: this.redirect || '/' })
        this.loginError = false
        this.requestSubmitCodeFailed = ''
        localStorage.removeItem('factorAuth')
        localStorage.removeItem('methodAuth')
        localStorage.removeItem('stepOneToken')
        localStorage.removeItem('resenCount')
        localStorage.removeItem('dataTime')
        this.isShortMessage = ''
      }).catch(error => {
        this.loading = false
        this.requestSubmitCodeFailed = 'Request failed, please check the verification code'
      })
    },

    handleResendCode() {
      const teps = localStorage.getItem('resenCount')
      const timeLeft = localStorage.getItem('dataTime')
      this.resendError = ''
      this.timeBlock = new Date(+timeLeft) - new Date()
      if (teps >= 3 && this.timeBlock >= 0) {
        this.timeResponse = `
        The code was successfully resent. 
        The next time you can resend the code in ${Math.ceil(this.timeBlock / 60000).toFixed(0)} minutes
      `
        return
      }
      this.isLoadingResend = true
      this.$store.dispatch('Login', this.factorAuthData).then(() => {
        this.isLoadingResend = false
        this.successResend = 'Code successfully resent'
        this.stepOneTokenData = localStorage.getItem('stepOneToken')
        this.resendCount()
      }).catch(error => {
        this.isLoadingResend = false
        this.resendError = 'Resend request failed'
      })
    },

    async handleResendCodeToEmail() {
      this.isLoadingResendEmail = true

      this.resendEmailResult = ''
      this.resendEmailResultError = ""

      const data = {
        step_one_token: this.stepOneTokenData
      }

      try {
        await axios.post(
          baseUrl + '/auth/v1/resend-code',
          data
        )
        this.resendEmailResult = "The code was successfully sent to you by mail"
        this.isLoadingResendEmail = false
      } catch(e) {
        this.resendEmailResultError = "Request failed"
        this.isLoadingResendEmail = false
      } finally {
        this.isLoadingResendEmail = false
      }
    },

    resendCount () {
      const teps = localStorage.getItem('resenCount')
      const currentItem = (+teps || 0) + 1
      localStorage.setItem('resenCount', currentItem)
      this.timeResponse = ''
      if ( currentItem === 1 ) {
        this.timeResponse = ''
        this.blockButton = true

        this.timeBlock = new Date().setMinutes(new Date().getMinutes() + 3)
        const timeNewResend = new Date(+this.timeBlock) - new Date()
        

        localStorage.setItem('dataTime', this.timeBlock)
        setTimeout(() => {
          this.blockButton = false
        }, timeNewResend)
        this.timeResponse = `
          The code was successfully resent. 
          The next time you can resend the code in ${Math.ceil(timeNewResend / 60000).toFixed(0)} minutes
        `   
      }

      if ( currentItem === 2 ) {
        this.blockButton = true
        
        this.timeBlock = new Date().setMinutes(new Date().getMinutes() + 15)
        const timeNewResend = new Date(+this.timeBlock) - new Date()

        localStorage.setItem('dataTime', this.timeBlock)
        setTimeout(() => {
          this.blockButton = false
        }, timeNewResend)
        this.timeResponse = `
          The code was successfully resent. 
          The next time you can resend the code in ${Math.ceil(timeNewResend / 60000).toFixed(0)} minutes
        `
      }

      if ( currentItem === 3 ) {
        this.blockButton = true

        this.timeBlock = new Date().setMinutes(new Date().getMinutes() + 75)

        const timeNewResend = new Date(+this.timeBlock) - new Date()
        localStorage.setItem('dataTime', this.timeBlock)
        setTimeout(() => {
          this.blockButton = false
          localStorage.removeItem('dataTime')
          localStorage.removeItem('resenCount')
        }, timeNewResend)
        this.timeResponse = `
          The code was successfully resent. 
          The next time you can resend the code in ${Math.ceil(timeNewResend / 60000).toFixed(0)} minutes
        `
      }
    }
  },

  mounted () {
    const data = localStorage.getItem('factorAuth')
    this.factorAuthData = JSON.parse(data)
    this.authMethod = localStorage.getItem('methodAuth')
    this.stepOneTokenData = localStorage.getItem('stepOneToken')

    const timeLeft = localStorage.getItem('dataTime')
    this.timeBlock = new Date(+timeLeft) - new Date()

    const countCount = localStorage.getItem('resenCount')

    if (this.timeBlock >= 0) {
      this.blockButton = true
      this.timeResponse = `
        The code was successfully resent. 
        The next time you can resend the code in ${Math.ceil(this.timeBlock / 60000).toFixed(0)} minutes
      `
    }
  }
}
</script>

<style lang="scss" scoped>
.two-factor-page {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;

  .container {
    display: flex;
    justify-content: center;
    align-items: center;

    .auth-window {
      max-width: 320px;
      padding: 25px 25px;
      background-color: white;
      border-radius: 7px;
      margin-top: 3rem;
      box-shadow: 2px 2px 20px 0px silver;

      .success-resend {
        margin-top: .7rem;
      };

      .success-resend-to-email {
        margin-top: .7rem;
      }

      .success-resend-to-phone {
        margin-top: .7rem;
      }

      &__title {
        font-size: 18px;
        margin-bottom: 1.5rem;
      }

      &__input {
        margin-bottom: 1.1rem;
      }

      .note {
        font-size: 12px;

        .link {
          padding-left: 0;
          background: none;
          border: none;
          color: rgb(37, 37, 37);
          margin-top: .5rem;
          text-decoration: underline;
            &:hover {
              cursor: pointer;
            }
          } 
      }

      .note-send {
        font-size: 12px;
        margin-top: .6rem;
        // color: rgb(0, 114, 9);
      }
      .submit-button {
        width: 100%;
        padding: 0.7rem 0;
      }
    }
  }
}

</style>
