<template>
  <div class="two-factor-auth-container" v-loading="isLoading">
    <div class="header">
      Two-factor authentication
    </div>
    <div class="settings">
      <el-radio class="radio" v-model="value" label="1" @change="setDisable2FA">
        Disabled
      </el-radio>
      <el-radio @change="setEmailAuth" class="radio" v-model="value" label="2">
        Email
      </el-radio>
      <el-radio @change="setMethodSmSAuth" class="radio" v-model="value" label="3">
        SMS
      </el-radio>
    </div>
    <el-dialog
      title="Enter your phone number"
      :visible.sync="isPhoneAuth"
      :key="authKey"
    >
      <phone-auth-modal 
        :key="authKey"
        @changeData="changeStatus"
        :user="user"
      />
    </el-dialog>

    <el-dialog
      title="Enter your verification code"
      :visible.sync="isCodeSuccess"
    >
      <modal-access-code 
        @succesSetSMS="succesSetSMS"
        @updateUserInfo="() => $emit('changeUserAuth')"
      />
    </el-dialog>
  </div>
</template>

<script>
import baseUrl from "../../../../api/config"
import store from '@/store/index.js'
import axios from 'axios'
export default {
  props: ["user"],

  data() {
    return {
      isLoading: false,
      value: "",
      isPhoneAuth: false,
      isCodeSuccess: false,
      authKey: 1,
      authInfoMe: [],
      statusAuth: '',
    };
  },

  beforeDestroy() {},

  components: {
    phoneAuthModal: () => import("./phone-auth-modal"),
    modalAccessCode: () => import("./modal-access-code")
  },

  methods: {
    changeStatus() {
      this.isPhoneAuth = false
      this.isCodeSuccess = true
      this.authKey = this.authKey + 1
    },

    succesSetSMS() {
      this.isCodeSuccess = false
      this.$emit('changeUserAuth')
    },

    async setDisable2FA() {
      const data = {
        two_factor_auth_method: "None"
      }
      const config = {
        headers: 
          {
            'Authorization': "bearer " + store.getters.token,
            'Content-Type': 'application/json'
          }
      }
      try {
        await axios.patch(
          baseUrl + '/api/frontend/v1/user/change-settings/auth-method',
          data,
          config
        )
        this.$notify({
          title: 'Success',
          message: '2fa is disabled',
          type: 'success'
        });
        this.$emit('changeUserAuth')
      } catch(e) {
        console.log('disable', e)
      } finally {
      }
    },

    async setEnable2FAEmail() {
      const data = {
        two_factor_auth_method: "Email"
      }
      const config = {
        headers: 
          {
            'Authorization': "bearer " + store.getters.token,
            'Content-Type': 'application/json'
          }
      }
      try {
        await axios.patch(
          baseUrl + '/api/frontend/v1/user/change-settings/auth-method',
          data,
          config
        )
        this.$notify({
          title: 'Success',
          message: '2fa via email is enabled',
          type: 'success'
        });
        this.$emit('changeUserAuth')
      } catch(e) {
        console.log('email', e)
      } finally {
      }
    },

    async setSmsAuth() {
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
          message: '2fa via SMS is enabled',
          type: 'success'
        });
        this.success = 'Success'
      } catch(e) {
        this.error = e.message
        this.isLoading = false
      } finally {
        this.isLoading = false
      }
    },

    setMethodSmSAuth() {
      if (!this.user.user_settings.is_active_phone_number) {
        this.isPhoneAuth = true;
      }
      if (this.user.user_settings.is_active_phone_number) {
        this.setSmsAuth()
      } 
    },

    setEmailAuth() {
      this.setEnable2FAEmail()
    },
  },

  mounted() {
    this.statusAuth = this.user.user_settings.two_factor_auth_method
  },

  watch: {

    isPhoneAuth(val) {
      if (!val && !this.isCodeSuccess) {
        if (this.user.user_settings.two_factor_auth_method === 'Email') {
          this.value = '2'
        } else {
          this.value = '1'
        }
      }
    },

    isCodeSuccess(val) {
      if (!val) {
        if (this.user.user_settings.two_factor_auth_method === "SMS") {
          this.value = '3'
        }
        if (this.user.user_settings.two_factor_auth_method === "Email") {
          this.value = '2'
        }
        if (this.user.user_settings.two_factor_auth_method === "None") {
          this.value = '1'
        }
      }
    },

    statusAuth(val) {
      if (val === 'SMS') {
        this.value = '3'
      }
      if (val === 'Email') {
        this.value = '2'
      }
      if (val === 'None') {
        this.value = '1'
      }
    },
  },
};
</script>
<style lang="scss">
.two-factor-auth-container {
  .el-dialog__body {
    padding: 0.5rem 1rem 1rem 1rem;
  }
  .el-radio__label {
    font-size: 16px !important;
    color: #000;
  }
  .el-radio {
    font-weight: 400;
  }
  .el-dialog__header {
    width: 88%;
  }

  .el-dialog {
    width: 300px
  }
}
</style>
<style lang="scss" scoped>
.two-factor-auth-container {
  margin-top: 1rem;
  .header {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .settings {
    display: flex;
    flex-direction: column;
  }
  .radio {
    margin-left: 0;
    font-size: 26px !important;
  }
}
</style>
