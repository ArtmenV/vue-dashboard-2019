<template>
  <div class="phone-auth-modal">
    <vue-tel-input
      class="input-tel"
      v-model="value"
      v-bind="bindProps"
      placeholder="select code and put number"
    />
    <el-button
      :loading="isLoading"
      size="mini"
      class="submit-button"
      type="primary"
      :disabled="false"
      @click="handleSubmit"
    >
      Send a code
    </el-button>
    <el-alert
      class="error"
      v-if="error.length != 0"
      type="error"
      :title="error"
      :closable="false"
    />
  </div>
</template>

<script>
import baseUrl from "../../../../api/config"
import store from '@/store/index.js'
import axios from "axios"
import { VueTelInput } from "vue-tel-input";
export default {
  props: ["user"],

  data() {
    return {
      isLoading: false,
      value: this.user.user_settings.phone_number || "",
      error: '',

      phone: "+",
      bindProps: {
        mode: "international",
        defaultCountry: "US",
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        required: true,
        enabledCountryCode: true,
        enabledFlags: true,
        preferredCountries: ["AU", "BR", "US", "RU"],
        autocomplete: "off",
        name: "telephone",
        maxLen: 25,
        dropdownOptions: {
          disabledDialCode: false
        },
        inputOptions: {
          showDialCode: false
        }
      }
    };
  },

  beforeDestroy() {
    this.bindProps = {};
    this.value = "";
    this.data = {};
  },

  components: {
    VueTelInput
  },

  methods: {
    async handleSubmit () {
      this.isLoading = true
      this.error = ''
      if (!this.value) {
        this.error = 'Select code and put number'
        this.isLoading = false
        return
      }
      const data = {
        "phone_number" : this.value.replace(/[-\s]/g, '')
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
        this.isLoading = false
        this.$emit('changeData')
        this.$store.commit('SET_TWO_AUTH_PHONE' , this.value.replace(/[-\s]/g, ''), { module: 'user' })
      } catch(e) {
        this.error = 'Request failed'
        this.isLoading = false
      } finally {
        this.isLoading = false
      }
    }
  },
};
</script>
<style lang="scss">
.phone-auth-modal {
  .vti__input {
    overflow: hidden;
  }
} 

</style>
<style lang="scss" scoped>
.phone-auth-modal {
  .input-tel {
    width: 100%;
  }
  .vue-tel-input {
    display: flex;
    align-items: center;
    height: 2rem;
    margin-bottom: 1rem;
  }
  .submit-button {
    width: 100%;
    padding: 7px 15px;
  }
  .error {
    margin-top: .5rem;
  }
}
</style>
