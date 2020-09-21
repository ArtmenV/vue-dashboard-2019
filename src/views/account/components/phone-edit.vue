<template>
  <div class="phone-edit">
    <vue-tel-input
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
      :title="errorMessage"
      v-if="errorMessage.length != 0"
      type="error"
      :closable="false"
    />
  </div>
</template>

<script>
import { VueTelInput } from "vue-tel-input";
import baseUrl from "../../../api/config"
import store from '@/store/index.js'
import axios from "axios"
export default {
  props: ["user", "userPhone"],

  data() {
    return {
      isLoading: false,
      value: this.user.user_settings.phone_number || "",
      errorMessage: '',

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
      this.errorMessage = ''
      this.isLoading = true

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
        if (!this.value.length) throw new SyntaxError("Select code and put number");

        const sendTelNumber = await axios.patch(
          baseUrl + '/api/frontend/v1/user/change-settings/phone-number',
          data, 
          config
        )
        this.isLoading = false
        this.$emit('changeMobileEdit')
        this.$store.commit('SET_TWO_AUTH_PHONE' , this.value.replace(/[-\s]/g, ''), { module: 'user' })
      } catch(e) {
        if (e.name == "SyntaxError") {
          this.errorMessage = e.message
          this.isLoading = false
          return
        } else {
          this.errorMessage = 'Request failed'
          this.isLoading = false
        }
      } finally {
        this.isLoading = false
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.phone-edit {
  .vue-tel-input {
    display: flex;
    align-items: center;
    height: 2rem;
    margin-bottom: 1rem;
  }
  .submit-button {
    width: 100%;
    padding: 7px 15px
  }
  .error {
    margin-top: .5rem;
  }
}
</style>
