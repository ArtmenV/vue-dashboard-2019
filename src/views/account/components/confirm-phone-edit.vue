<template>
  <div class="section-sibmit-code">
    <el-input
      placeholder="193675"
      v-model="value"
    />
    <el-button
      :loading="isLoading"
      size="mini"
      class="submit-button"
      type="primary"
      :disabled="disabledSubmitButton"
      @click="handleSubmit"
    >
      Submit
    </el-button>

    <el-alert
      class="success-resend"
      v-show="success.length"
      type="success"
      :title="success"
    />

    <el-alert
      class="error"
      v-if="error.length != 0"
      type="error"
      :title="error"
    />

    <div class="note">
      I didn't receive a code. 
      <button
        :disabled="blockButton"
        class="link"
        @click="handleResendCode"
        v-loading="isLoadingResend"
      >
        Resend a code
      </button> 
    </div>
    <el-alert
      class="success-resend"
      v-show="resendSuccessMessage.length"
      type="success"
      :title="resendSuccessMessage"
    />
    <el-alert
      class="error"
      v-show="resendError.length != 0"
      type="error"
      :title="resendError"
    />
  </div>
</template>

<script>
import baseUrl from "../../../api/config"
import store from '@/store/index.js'
import axios from 'axios'
export default {
  props: ["user"],

  data() {
    return {
      value: '',
      isLoading: false,
      resendError: '',
      error: '',
      isLoadingResend: false,
      resendError: '',
      resendCount: 1,
      blockButton: false,
      setTimer: 60000,
      resendSuccessMessage: '',

      submitCounter: '',
      disabledSubmitButton: false,
      errorManyRequest: '',
      success: ''
    };
  },

  beforeDestroy() {
    this.value = "";
  },

  methods: {
    async handleSubmit () {
      this.isLoading = true
      this.error = ''

      const data = {
        "confirmation_code": this.value
      }

      const config = {
        headers: 
          {
            'Authorization': "bearer " + store.getters.token,
            'Content-Type': 'application/json'
          }
      }

      try {
        const sendTelNumber = await axios.post(
          baseUrl + '/api/frontend/v1/user/change-settings/confirmation-phone-code',
          data,
          config
        )
        this.isLoading = false
        this.$notify({
          title: 'Success',
          message: 'This phone number has been successfully saved.',
          type: 'success'
        });

        this.setSmsAuth()
      } catch(e) {
        this.error = 'Request failed, please check the verification code'
        this.isLoading = false
      } finally {
        this.isLoading = false,
        this.submitCounter += 1
      }
    },

    async setSmsAuth () {

      if (this.user.user_settings.two_factor_auth_method !== "SMS") {
        this.$emit('updateUserInfo')
        this.$emit('confirmChangeTel')
        return
      }

      const data = {
        two_factor_auth_method: "SMS"
      }
      const config = {
        headers: 
          {
            'Authorization': "bearer " + store.getters.token,
            'Content-Type': 'application/json'
          }
      }
      
      try {
        const sendTelNumber = await axios.patch(
          baseUrl + '/api/frontend/v1/user/change-settings/auth-method',
          data,
          config
        )
        this.isLoading = false
        this.$notify({
          title: 'Success',
          message: '2FA successfully enabled via SMS',
          type: 'success'
        });
        this.success = 'Success'
        this.$emit('updateUserInfo')
        setTimeout(() => {
          this.$emit('confirmChangeTel')
        }, 1000)
      } catch(e) {
        this.error = e.message
        this.isLoading = false
      } finally {
        this.isLoading = false
      }
    },

    async handleResendCode () {
      this.isLoadingResend = true
      const data = {
        "phone_number": store.getters.userPhoneNumber
      }
      const config = {
        headers: 
          {
            'Authorization': "bearer " + store.getters.token,
            'Content-Type': 'application/json'
          }
      }
      try {
        const sendTelNumber = await axios.patch(
          baseUrl + '/api/frontend/v1/user/change-settings/phone-number',
          data, 
          config
        )
        this.isLoadingResend = false

        this.resendCount = this.resendCount + 2
        this.blockButton = true
        this.resendBlock()
        this.setTimer = this.setTimer * this.resendCount
      } catch(e) {
        this.resendError = e.message
        this.isLoadingResend = false
      } finally {
        this.isLoadingResend = false
      }
    },

    lockSubmitButton() {
      setTimeout(() => {
        this.disabledSubmitButton = false
      }, 180000)
    },

    resendBlock () {
      setTimeout(() => {
        this.blockButton = false
      }, this.setTimer)
    }
  },

  watch: {
    resendCount (val) {
      if (val === 3) {
        this.resendSuccessMessage = `
          The code was successfully resent. 
          The next time you can resend 
          the code in 3 minutes
        `
      }
      if (val === 5) {
        this.resendSuccessMessage = `
          The code was successfully resent. 
          The next time you can resend 
          the code in 15 minutes
        `
      }
      if (val === 7) {
        this.resendSuccessMessage = `
          The code was successfully resent. 
          The next time you can resend 
          the code more than a hour
        `
      }
    },
  },
};
</script>
<style lang="scss">
  .el-notification__group {
    width: 190px !important;
  }
</style>
<style lang="scss" scoped>
.section-sibmit-code {
  .success {
    margin-top: .7rem;
  }
  .success-resend {
    font-size: 12px;
    margin-top: .7rem;
  }
  .submit-button {
    margin-top: 1rem;
    width: 100%;
    padding: 7px 15px;
  }
  .error {
    margin-top: .7rem;
  }
  .note {
    font-size: 12px;
    .link {
      text-align: left;
      background: none;
      border: none;
      color: rgb(73, 73, 73);
      margin-top: .5rem;
      margin-left: -.3rem;
      text-decoration: underline;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
