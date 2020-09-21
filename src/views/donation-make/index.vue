<template>
  <div class="container">
    <div class="steps-container">
      <el-steps :active="step" finish-status="success">
        <el-step title="Amount" />
        <el-step title="Details" />
        <el-step title="Payment" />
        <el-step title="Finish" />
      </el-steps>

      <!-- Choosing amoung -->
      <div
        class="step"
        v-if="step === 0"
      >

        <el-radio-group v-model="monthly" size="small">
          <el-radio-button label="One time payment"></el-radio-button>
          <el-radio-button label="Monthly recurring"></el-radio-button>
        </el-radio-group>

        <div class="amount">
          <el-radio size="small" v-model="amount" :label="5" border>5$</el-radio>
          <el-radio size="small" v-model="amount" :label="10" border>10$</el-radio>
          <el-radio size="small" v-model="amount" :label="15" border>15$</el-radio>

          <el-input
            class="amount-input"
            v-model.number="amount"
            placeholder="Custom" 
            size="small"
          /> $
        </div>

        <div class="nav">
          <div class="empty"></div>

          <el-button
            @click="step++"
            size="small"
            type="primary"
          >
            Next
          </el-button>
        </div>
      </div>

      <!-- Payer's details (name and email) -->
      <div
        class="step"
        v-if="step === 1"
      >
        <div class="details">
          <div class="input">
            <el-input size="small" v-model.trim="name" placeholder="Your name" />

            <div v-if="nameValid.length !== 0" class="error-msg">
              {{ nameValid }}
            </div>
          </div>

          <div class="input">
            <el-input size="small" v-model.trim="email" placeholder="Email" />

            <div v-if="emailValid.length !== 0" class="error-msg">
              {{ emailValid }}
            </div>
          </div>
        </div>

        <div class="nav">
          <el-button
            @click="step--"
            size="small"
          >
            Back
          </el-button>

          <el-button
            @click="step++"
            size="small"
            type="primary"
            :disabled="emailValid.length !== 0 || nameValid.length !== 0"
          >
            Next
          </el-button>
        </div>
      </div>
      
      <!-- Payment -->
      <div
        class="step"
        v-if="step === 2"
      >
        <div class="payment">
          <div class="input">
            <el-input
              class="first-name"
              size="large"
              placeholder="FIRST NAME"
              v-model="card.firstName"
              v-mask="'AAAAAAAAAAAAAAAAAAAAAAAAAA'"
              autocorrect="off"  spellcheck="false"
            ></el-input>

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
            ></el-input>

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
            ></el-input>

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
            ></el-input>

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
            ></el-input>

            <div v-if="paymentCVVValid.length != 0" class="error-msg">
              {{ paymentCVVValid }}
            </div>
          </div>          
        </div>

        <div class="nav">
          <el-button
            @click="step--"
            size="small"
          >
            Back
          </el-button>

          <el-button
            @click="handleSubmit"
            size="small"
            type="primary"
            :disabled="!canSubmit"
          >
            Submit
          </el-button>
        </div>
      </div>

      <!-- Success message -->
      <div
        class="step"
        v-if="step >= 3"
      >
        <el-alert
          type="success"
          title="Congratulations!"
          description="The payment has passed. Thank you for the support!"
          :closable="false"          
        />

        <p class="success-text">
          <a class="link" :href="backPath">
            {{ (backPath === '/signup') ? 'Back to sign up page.' : 'Go back' }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { mask } from 'vue-the-mask'
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'

  export default {
    data () {
      return {
        step: 0,
        amount: 5,
        monthly: 'Monthly recurring',

        email: '',
        name: '',

        card: {
          firstName: '',
          lastName: '',
          number: '',
          expiryDate: '',
          cvv: ''
        }
      }
    },

    directives: { mask },

    computed: {
      nameValid () {
        if (this.name.length) {
          if (this.name.length <= 1) {
            return 'The name is too short'
          } else {
            return ''
          }
        } else {
          return ' '
        }
      },

      emailValid () {
        const val = this.email

        if (!val.length) {
          return ' '
        }

        function validateEmail(email) {
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(String(email).toLowerCase());
        }

        if (!validateEmail(val)) {
          return 'Please enter correct email'
        }

        return ''
      },

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
                && !this.emailValid
      },

      backPath () {
        if (this.$route.query && this.$route.query.back) {
          return this.$route.query.back
        }
      }
    },

    mounted () {
      if (this.$route.query && this.$route.query.username) {
        this.name = this.$route.query.username
      }

      if (this.$route.query && this.$route.query.email) {
        this.email = this.$route.query.username
      }
    },

    methods: {
      handleSubmit () {
        this.step += 2
      }
    }
  }
</script>

<style lang="scss">
  html {
    background-color: whitesmoke;
  }
</style>

<style lang="scss" scoped>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    color: #303133;

    .success-text {
      font-size: 13px;
      margin-left: auto;

      .link {
        color: #409EFF;
        text-decoration: underline;
      }
    }

    .steps-container {
      border: 1px solid lightgray;
      border-radius: 5px;
      background-color: white;
      padding: 20px;

      display: grid;
      grid-gap: 20px;

      .step {
        display: grid;
        grid-gap: 10px;

        .amount {
          display: flex;
          align-items: center;

          .amount-input {
            width: 100px;
            margin: 0 10px;
          }
        }

        .payment {
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

        .details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 10px;
        }

        .nav {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
</style>
