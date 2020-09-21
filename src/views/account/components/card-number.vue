<template>
  <div class="card-container">
    <el-alert
      v-show="successMessage.length != 0"
      type="success"
      :title="successMessage"
      class="success-msg"
    />

    <div class="input">
      <el-input
        class="first-name"
        size="large"
        placeholder="FIRST NAME"
        v-model="card.firstName"
        v-mask="'AAAAAAAAAAAAAAAAAAAAAAAAAA'"
        autocorrect="off"  spellcheck="false"
      />

      <div v-if="paymentFirstNameValid.length != 0" class="error-msg">
        {{ paymentFirstNameValid }}
      </div>
    </div>
          
    <div class="input">
      <el-input
        class="last-name"
        size="large"
        placeholder="LAST NAME"
        v-model="card.lastName"
        v-mask="'AAAAAAAAAAAAAAAAAAAAAAAAAA'"
        autocorrect="off" spellcheck="false"
      />

      <div v-if="paymentLastNameValid.length != 0" class="error-msg">
        {{ paymentLastNameValid }}
      </div>
    </div>

    <div class="input number">
      <el-input
        class="number"
        size="large"
        placeholder="CARD NUMBER"
        v-model="card.number"
        type="tel"
        v-mask="'#### #### #### #### ###'"
      />

      <div v-if="paymentCardNumberValid.length != 0" class="error-msg">
        {{ paymentCardNumberValid }}
      </div>
    </div>

    <div class="input">
      <el-input
        class="expiry"
        size="large"
        placeholder="EXPIRY DATE"
        type="tel"
        v-model="card.expiryDate"
        v-mask="'##/##'"
      />

      <div v-if="paymentExpiryDateValid.length != 0" class="error-msg">
        {{ paymentExpiryDateValid }}
      </div>
    </div>

    <div class="input">
      <el-input
        class="cvv"
        size="large"
        placeholder="CVV"
        v-model="card.cvv"
        v-mask="'####'"
      />

      <div v-if="paymentCVVValid.length != 0" class="error-msg">
        {{ paymentCVVValid }}
      </div>
    </div>

    <el-button
      @click="handleSubmit"
      type="primary"
      class="submit-btn"
      :disabled="!canSubmit"
      :loading="loading"
    >
      Submit
    </el-button>
  </div>
</template>

<script>
  import { mask } from 'vue-the-mask'
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'

  export default {
    data () {
      return {
        loading: false,

        errMessage: null,

        card: {
          firstName: '',
          lastName: '',
          number: '',
          expiryDate: '',
          cvv: ''
        },

        successMessage: ''
      }
    },

    directives: { mask },

    computed: {
      paymentFirstNameValid () {
        const val = this.card.firstName

        if (val.length === 0) {
          return ' '
        } else if (val.length < 2) {
          return 'Too short name'
        } else if (val.length > 50) {
          return 'Too long name'
        }

        return ''
      },

      paymentLastNameValid () {
        const val = this.card.lastName

        if (!val.length) {
          return ' '
        } else if (val.length < 2) {
          return 'Too short name'
        } else if (val.length > 50) {
          return 'Too long name'
        }

        return ''
      },

      paymentCardNumberValid () {
        const val = this.card.number

        if (!val.length) {
          return ' '
        } else if (val.length > 23 || val.length < 16) {
          return 'Please enter correct card number'
        }

        return ''
      },

      paymentExpiryDateValid () {
        const val = this.card.expiryDate

        if (!val.length) {
          return ' '
        } else if (val.length > 5 || val.length < 5) {
          return 'Please enter correct expiry date'
        } else if (!val.match(/(0[1-9]|1[0-2])\/([2-9][0-9])/)) {
          return 'Please enter correct expiry date'
        }

        return ''
      },

      paymentCVVValid () {
        const val = this.card.cvv

        if (!val.length) {
          return ' '
        } else if (val.length < 3 || val.length > 4) {
          return 'Please enter correct cvv'
        }

        return ''
      },

      canSubmit () {
        return  !this.paymentFirstNameValid
                && !this.paymentLastNameValid
                && !this.paymentCardNumberValid
                && !this.paymentExpiryDateValid
                && !this.paymentCVVValid
      }
    },

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    methods: {
      handleSubmit () {
        this.loading = true
        SPPCloudApi
          .updateSubscription({
            payment_method: 0,
            payment: {
              first_name: this.card.firstName,
              last_name: this.card.lastName,
              number: this.card.number.replace(/[^0-9]/g, ''),
              expiry_month: parseInt(this.card.expiryDate.slice(0, 2)),
              expiry_year: parseInt('20' + this.card.expiryDate.slice(-2)),
              cvv: this.card.cvv.toString()
            }
          })
          .then(r => {
            this.successMessage = 'Card has been updated successfully'
            this.$emit('card-updated', this.card)
            this.loading = false
          })
          .catch(e => {
            if (e.response.data.messages[0].context) {
              if (e.response.data.messages[0].context.more_info) {
                this.errMessage =  handleError(this, e.response.data.messages[0].context.more_info)
              } else if (e.response.data.messages[0].context['subscription.payment.cvv'].reason)
                this.errMessage =  handleError(this, e.response.data.messages[0].context['subscription.payment.cvv'].reason)
            } else {
              this.errMessage = handleError(this, e)
            }
            this.loading = false
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;

    .success-msg {
      grid-column-start: 1;
      grid-column-end: 3;
    }

    .input {
      &.number {
        grid-column-start: 1;
        grid-column-end: 3;
      }

      .error-msg {
        font-size: 13px;
        color: red;
        margin-left: 5px;
      }
    }

    .submit-btn {
      grid-column-start: 1;
      grid-column-end: 3;
    }
  }
</style>
