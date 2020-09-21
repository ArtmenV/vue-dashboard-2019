<template>
  <div class="page-container signup-page">
    <div class="background-header-curve"></div>

    <div class="background-main"></div>

    <svg-icon icon-class="curve" class="background-header-curve-svg"/>

    <svg-icon icon-class="curve-top" class="background-top-curve"/>

    <svg class="background-bottom-curve" width="936" height="557" viewBox="0 0 936 557" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M936 0V557H0C423.276 447.386 680.378 304.256 936 0Z" fill="#C4C4C4"/>
    </svg>

    <div class="content">
      <section class="content__section description">
        <h1 class="description__header">
          Get an extra layer of web security!
        </h1>

        <span class="description__text">
          <span class="text-container">
            Security and Privacy Plus - preconfigured FreeBSD based, non-caching
            proxy servers with cloud managment system. Security and Privacy Plus
            is based on the open source software 
            <a class="link" href="https://privoxy.org/" target="_blank">Privoxy</a>
          </span>
        </span>
      </section>

      <section class="content__section plan">
        <h2 class="plan__header">
          <svg-icon icon-class="stage-1" class="stage-icon"/> Select your plan
        </h2>

        <div class="plan__subscriptions">
          <el-card
            class="subscription-card"
            v-for="plan in plans"
            :key="plan.plan_id"
            :class="{'is-active': subscriptionType === plan.plan_id}"
            @click.native="setSubscriptionType(plan.plan_id)"
          >
            <div class="subscription">
              <h3 class="subscription__header">
                {{ plan.name }}
              </h3>

              <span
                class="subscription__check"
                v-for="feature in plan.features"
                :key="feature"
              >
                {{ feature }}
              </span>

              <h4 class="subscription__coming-soon-header" v-if="plan.coming_soon && plan.coming_soon.length > 0">
                Coming soon
              </h4>

              <span
                class="subscription__check"
                v-for="feature in plan.coming_soon"
                :key="feature"
              >
                {{ feature }}
              </span>

              <div v-if="plan.pricing.model === 'per_unit'" class="pricing">
                <span class="pricing__header">
                  Pricing Per Server
                </span>

                <span class="pricing__price">
                  ${{ plan.price_monthly / 100 }}/month
                  
                  <!-- <span
                    v-if="plan.price_yearly"
                  >
                    or ${{ plan.price_yearly / 100 }}/year
                  </span> -->
                </span>
              </div>

              <div v-else class="pricing">
                <span class="pricing__header">
                  Pricing Per Server
                </span>

                <span
                  v-for="tier in plan.pricing.tiers"
                  :key="tier.price"
                >
                  {{ tier.fixed ? tier.end : tier.start + '+'}} servers: ${{ tier.price / 100 }}/month
                  <br/>
                </span>

                <span v-if="plan.price == 0 && !plan.pricing.tiers" class="pricing__price">
                  Free
                </span>
              </div>

              <footer class="subscription__checkmark">
                <i class="el-icon-circle-check checkmark"></i>
              </footer>
            </div>
          </el-card>

          <el-card
            class="subscription-card enterprise"
          >
            <div class="subscription enterprise">
              <h3 class="subscription__header">
                Enterprise
              </h3>

              <span class="subscription__check">
                Advanced solutions for enterprise networks
              </span>

              <span class="subscription__check">
                High availability solutions
              </span>

              <span class="subscription__check">
                Load balanced solutions
              </span>

              <span class="subscription__check">
                Carrier grade solutions
              </span>

              <span class="subscription__check">
                Custom software development
              </span>

              <span class="subscription__check">
                Full consulting services
              </span>

              <span class="subscription__check">
                100% on premise solutions
              </span>

              <span class="subscription__check">
                Talk to an expert today
              </span>

              <div class="subscription__custom-solution" style="margin-top:auto;height:auto;">
                <el-button type="primary" class="contact-btn" @click="contactUsHandler">
                  Contact us for pricing
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </section>

      <section class="content__section">
        <h2 class="account__header">
          <svg-icon icon-class="stage-2" class="stage-icon"/> Create an account
        </h2>

        <span class="account__sub-text">
          If you have an account, please <a class="link" @click="loginRedirect">Sign in</a>
        </span>

        <div class="account">
          <div class="input">
            <el-input
              class="account__input"
              placeholder="First name"
              v-model.trim="account.firstName"
              size="large"
            ></el-input>

            <div v-if="accountFirstNameValid.length != 0" class="error-msg">
              {{ accountFirstNameValid }}
            </div>
          </div>
          
          <div class="input">
            <el-input
              class="account__input"
              placeholder="Last name"
              v-model.trim="account.lastName"
              size="large"
            ></el-input>

            <div v-if="accountLastNameValid.length != 0" class="error-msg">
              {{ accountLastNameValid }}
            </div>
          </div>

          <div class="input">
            <el-input
              class="account__input"
              placeholder="Email"
              v-model.trim="account.email"
              size="large"
              type="email"
            ></el-input>

            <div v-if="accountEmailValid.length != 0" class="error-msg">
              {{ accountEmailValid }}
            </div>
          </div>

          <div class="input">
            <el-input
              class="account__input"
              placeholder="Company"
              v-model.trim="account.company"
              autoComplete="off"
              size="large"
              type="text"
            ></el-input>

            <div v-if="accountCompanyValid.length != 0" class="error-msg">
              {{ accountCompanyValid }}
            </div>
          </div>

          <div class="input">
            <el-input
              class="account__input"
              placeholder="Password"
              v-model="account.password"
              size="large"
              type="password"
              show-password
            ></el-input>

            <div v-if="accountPasswordValid.length != 0" class="error-msg">
              {{ accountPasswordValid }}
            </div>
          </div>
          
          <div class="input">
            <el-input
              class="account__input"
              placeholder="Confirm password"
              v-model="account.passwordConfirm"
              size="large"
              type="password"
              show-password
            ></el-input>

            <div v-if="accountPasswordConfirmValid.length != 0" class="error-msg">
              {{ accountPasswordConfirmValid }}
            </div>
          </div>
        </div>
      </section>

      <section v-if="!isPlanFree" class="content__section payment">
        <h2 class="payment__header">
          <svg-icon icon-class="stage-3" class="stage-icon"/> Select the payment method
        </h2>

        <el-radio-group class="payment__method" v-model="payment.paymentType" size="large">
          <el-radio label="creditcard" border>Credit card</el-radio>

          <el-tooltip content="This feature is coming soon" placement="top">
            <el-radio disabled label="paypal" border>PayPal</el-radio>
          </el-tooltip>

          <el-tooltip content="This feature is coming soon" placement="top">
            <el-radio disabled label="bitcoin" border>Bitcoin</el-radio>
          </el-tooltip>
        </el-radio-group>

        <div v-if="payment.paymentType == 'creditcard'" class="payment__credentials creditcard">
          <div class="input">
            <el-input
              class="first-name"
              size="large"
              placeholder="FIRST NAME"
              v-model="payment.creditcard.firstName"
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
              v-model="payment.creditcard.lastName"
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
              v-model="payment.creditcard.number"
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
              v-model="payment.creditcard.expiryDate"
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
              v-model="payment.creditcard.cvv"
              v-mask="'####'"
            ></el-input>

            <div v-if="paymentCVVValid.length != 0" class="error-msg">
              {{ paymentCVVValid }}
            </div>
          </div>

          <div v-if="payment.paymentType == 'paypal'" class="payment__credentials paypal">
            <el-input size="large" placeholder="Your credentials"></el-input>
          </div>

          <div v-if="payment.paymentType == 'bitcoin'" class="payment__credentials bitcoin">
            <el-input size="large" placeholder="Your credentials"></el-input>
          </div>
        </div>
      </section>

      <section class="content__section submit">
        <el-checkbox
          v-model="agreed"
          class="terms-and-conditions"
        >
          I agree to 
          <a
            class="legal-link"
            target="_blank"
            href="/terms-and-conditions"
          >
            Terms and conditions
          </a>
        </el-checkbox>

        <el-alert
          v-if="errorSubmit.length !== 0"
          type="error"
          :title="errorSubmit"
          class="error-msg"
        ></el-alert>        

        <el-button
          v-loading="loading"
          type="primary"
          class="submit__btn btn-submit"
          @click="handleSubmit"
          :disabled="loading || !canSubmitSignup"
        >
          Submit
        </el-button>
      </section>
    </div>
  </div>
</template>

<script>
  import { mask } from 'vue-the-mask'
  import baseUrl from "../../api/config"
  import SPPCloudApi from '@/api/cloud-api.js'

  export default {
    data () {
      return {
        loading: false,

        subscriptionType: null,
        baseURL: '',

        account: {
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          password: '',

          passwordConfirm: ''
        },

        payment: {
          paymentType: 'creditcard',

          creditcard: {
            type: '',
            firstName: '',
            lastName: '',
            number: '',
            expiryMonth: -1,
            expiryYear: -1,
            cvv: '',
            expiryDate:''
          }
        },

        plans: null,

        errorSubmit: '',

        agreed: false
      }
    },

    directives: {mask},

    mounted () {
      console.log('baseUrl', baseUrl)
      this.baseURL = baseUrl
      if (baseUrl !== 'https://demo-sppapi.zimalab.com') {
        this.subscriptionType = 1 
        SPPCloudApi
          .getPlans()
          .then(r => {
            this.plans = []

            const plansRaw = r.data.result.items

            plansRaw.forEach(el => {
              if (this.plans.filter(e => e.weight === el.weight).length === 0) {
                el.price_monthly = el.price
                this.plans.push(JSON.parse(JSON.stringify(el)))
              } else {
                const existingPlan = this.plans.filter(e => e.weight === el.weight)[0]

                if (el.price > existingPlan.price) {
                  existingPlan.price_monthly = existingPlan.price
                  existingPlan.price_yearly = el.price
                } else {
                  existingPlan.price_yearly = existingPlan.price
                  existingPlan.price_monthly = el.price
                }
              }
            })

            this.plans.sort((a, b) => {
              return (a.weight > b.weight) ? 1 : -1
            })
          })
          .catch(e => console.log(e))
        } else {
          this.subscriptionType = 3
          SPPCloudApi
            .getPlans()
            .then(r => {
              this.plans = []

              const plansRaw = r.data.result.items

              plansRaw.forEach(el => {
                this.plans.push(JSON.parse(JSON.stringify(el)))
                if (this.plans.filter(e => e.weight === el.weight).length === 0) {
                  el.price_monthly = el.price
                  debugger
                  
                } else {
                  const existingPlan = this.plans.filter(e => e.weight === el.weight)[0]

                  if (el.price > existingPlan.price) {
                    existingPlan.price_monthly = existingPlan.price
                    existingPlan.price_yearly = el.price
                  } else {
                    existingPlan.price_yearly = existingPlan.price
                    existingPlan.price_monthly = el.price
                  }
                }
              })

              const twoElement = this.plans[1]
              const data = this.plans.filter(item => item.plan_id !== 7)
              this.plans = []
              this.plans = [...data, twoElement]
            })
            .catch(e => console.log(e))
            }
    },

    computed: {
      // validations

      accountFirstNameValid () {
        const val = this.account.firstName

        if (!val.length) {
          return ' '
        } else if (val.length < 2) {
          return 'Too short name'
        } else if (val.length > 50) {
          return 'Too long name'
        }

        return ''
      },

      accountLastNameValid () {
        const val = this.account.lastName

        if (!val.length) {
          return ' '
        } else if (val.length < 2) {
          return 'Too short name'
        } else if (val.length > 50) {
          return 'Too long name'
        }

        return ''
      },

      accountEmailValid () {
        const val = this.account.email

        if (!val.length) {
          return ' '
        }

        if (val.length > 129) {
          return 'Email too long'
        }

        function validateEmail(email) {
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
          return re.test(String(email).toLowerCase());
        }

        if (!validateEmail(val)) {
          return 'Please enter correct email'
        }

        return ''
      },

      accountCompanyValid () {
        const val = this.account.company

        if (!val.length) {
          return ' '
        } else if (val.length < 2) {
          return 'Too short company name'
        } else if (val.length > 100) {
          return 'Too long company name'
        }

        return ''
      },

      accountPasswordValid () {
        const val = this.account.password

        if (!val.length) {
          return ' '
        } else if (val.trim().length <= 0) {
          return 'Spaces are not allowed'
        } else if (val.trim().length < 6) {
          return 'Password must be at least 6 symbols'
        }
        return ''
      },

      accountPasswordConfirmValid () {
        const val = this.account.passwordConfirm

        if (val.length === 0) {
          return ' '
        } else if (val !== this.account.password) {
          return 'Passwords don\'t match'
        }

        return ''
      },

      paymentFirstNameValid () {
        const val = this.payment.creditcard.firstName

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
        const val = this.payment.creditcard.lastName

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
        // const val = this.payment.creditcard.number

        // if (!val.length) {
        //   return ' '
        // } else if (val.length > 23 || val.length < 16) {
        //   return 'Please enter correct card number'
        // }

        return ''
      },

      paymentExpiryDateValid () {
        const val = this.payment.creditcard.expiryDate

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
        // const val = this.payment.creditcard.cvv

        // if (!val.length) {
        //   return ' '
        // } else if (val.length < 3 || val.length > 4) {
        //   return 'Please enter correct cvv'
        // }

        return ''
      },

      canSubmitSignup () {
        return (!this.accountFirstNameValid
                && !this.accountLastNameValid
                && !this.accountEmailValid
                && !this.accountCompanyValid
                && !this.accountPasswordValid
                && !this.accountPasswordConfirmValid
                && !this.paymentFirstNameValid
                && !this.paymentLastNameValid
                && !this.paymentCardNumberValid
                && !this.paymentExpiryDateValid
                && !this.paymentCVVValid
                && this.agreed) || 
                (this.plans && this.plans.filter(e => this.subscriptionType == e.plan_id)[0].is_free 
                && !this.accountFirstNameValid
                && !this.accountLastNameValid
                && !this.accountEmailValid
                && !this.accountCompanyValid
                && !this.accountPasswordValid
                && !this.accountPasswordConfirmValid
                && this.agreed)
      },

      isPlanFree () {
        return this.plans && this.plans.filter(e => this.subscriptionType == e.plan_id)[0].is_free
      }
    },

    methods: {
      setSubscriptionType (newType) {
        this.subscriptionType = newType
      },

      handleSubmit () {
        this.loading = true
        this.errorSubmit = ""

        let payment_method = 0

        const isPlanFree = this.plans.filter(e => this.subscriptionType == e.plan_id)[0].is_free

        const isCardOffered = this.payment.creditcard.number.length > 13 && this.payment.creditcard.number.length < 19

        if (isPlanFree && !isCardOffered) {
          payment_method = -1
        }

        const signupPayload = {
          company: this.account.company,
          plan: parseInt(this.subscriptionType),
          payment_method: payment_method,
          user: {
            first_name: this.account.firstName,
            last_name: this.account.lastName,
            email: this.account.email,
            password: this.account.password.trim()
          }
        }

        if (!isPlanFree) {
          signupPayload.payment = {
            first_name: this.payment.creditcard.firstName,
            last_name: this.payment.creditcard.lastName,
            number: this.payment.creditcard.number.replace(/[^0-9]/g, ''),
            expiry_month: parseInt(this.payment.creditcard.expiryDate.slice(0, 2)),
            expiry_year: parseInt('20' + this.payment.creditcard.expiryDate.slice(-2)),
            cvv: this.payment.creditcard.cvv.toString()
          }
        }

        SPPCloudApi
          .signup(signupPayload)
          .then(r => {
            this.loading = false

            this.$router.push('/success-signup')
          })
          .catch(e => {
            this.loading = false       
            if (e.response.data.status_code == '500') {
              this.errorSubmit = e.response.data.messages[0].message
            } else if (e.response.data.messages[0].context) {
              if (e.response.data.messages[0].context.reason) {
                this.errorSubmit = e.response.data.messages[0].context.more_info
              } else if (e.response.data.messages[0].context['subscription.user.password']) {
                this.errorSubmit = 'Password: ' + e.response.data.messages[0].context['subscription.user.password'].reason
              } else if (e.response.data.messages[0].context['subscription.user.email']) {
                this.errorSubmit = 'Email: ' + e.response.data.messages[0].context['subscription.user.email'].reason
              } else if (e.response.data.messages[0].context['subscription.user.first_name']) {
                this.errorSubmit = 'First name: ' + e.response.data.messages[0].context['subscription.user.first_name'].reason
              } else if (e.response.data.messages[0].context['subscription.user.last_name']) {
                this.errorSubmit = 'Last name: ' + e.response.data.messages[0].context['subscription.user.last_name'].reason
              } else if (e.response.data.messages[0].context['subscription.user.company']) {
                this.errorSubmit = 'Company: ' + e.response.data.messages[0].context['subscription.user.company'].reason
              } else if (e.response.data.messages[0].context['subscription.company']) {
                this.errorSubmit = 'Company: ' + e.response.data.messages[0].context['subscription.company'].reason
              }  else if (e.response.data.messages[0].context['subscription.payment.cvv']) {
                this.errorSubmit = 'CVV: ' + e.response.data.messages[0].context['subscription.payment.cvv'].reason
              } else if (e.response.data.messages[0].context.more_info) {
                this.errorSubmit = e.response.data.messages[0].context.more_info
              }
            } else {
              this.errorSubmit = 'Something went wrong'
            }
          })
      },

      contactUsHandler () {
        window.location.href = `mailto:support@nextvectorsecurity.com?subject=Enterprise%20subscription%20request`
      },

      loginRedirect () {
        this.$store.dispatch('LogOut')
        this.$router.push('/login')
      }
    }
  }
</script>

<style lang="scss">
  $gradient-start-color: #99c1fd;
  $gradient-start-color-bottom: #ffdba4;
  $background-end-color: rgba(0, 0, 0, 0);
  $background-header-color: #1f57ac;

  $page-background-color: whitesmoke;

  body,
  html {
    overflow-x: hidden;

  }
  #icon-curve-top {
    position: absolute;
    top: 0;
    left: 0;
  }

  .background-top-curve {
    position: absolute;
    z-index: -2;
    height: 1000px !important;
    width: 100vw !important;
    color: $gradient-start-color;
    top: 0;
    left: 0;
  }

  .background-bottom-curve {
    position: absolute;
    z-index: -2;
    bottom: 0;
    right: 0;

    path {
      fill: $gradient-start-color-bottom;
    }
  }

  .background-main {
    position: absolute;
    z-index: -3;
    width: 100vw;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgb(251, 251, 251);
  }
  
  .background-header-curve {
    position: absolute;
    z-index: -1;
    width: 100vw;
    height: 200px;

    background-color: $background-header-color;
  }

  .background-header-curve-svg {
    background-color: #FFFFFF00;
    position: absolute;
    z-index: -1;
    top: 200px;
    left: 0;
    width: 100vw !important;
    height: auto !important;

    color: $background-header-color;
    transform: rotate(180deg)
  }
  
  .background-gradient-top,
  .background-gradient-bottom {
    position: absolute;
    z-index: -2;
    width: 100vw;
    height: 100vh;
  }

  .background-gradient-top {
    top: 0;
    left: 0;

    background: linear-gradient(160deg, $gradient-start-color 50%, $background-end-color 50%);
  }

  .background-gradient-bottom {
    bottom: 0;
    right: 0;

    background: linear-gradient(340deg, $gradient-start-color-bottom 23%, $background-end-color 23%);
  }

  .el-radio.is-bordered {
    background: #fff;
  }

  .el-radio.is-bordered,
  .el-input__inner {
    height: 50px;
  }

  .el-radio.is-bordered {
    padding-top: 16px;
    margin-right: 30px;
  }

  .signup-page {
    .el-form-item {
      margin-bottom: 0;
    }

    .el-checkbox {
      cursor: default;
    }

    .el-checkbox__input.is-checked+.el-checkbox__label {
      color: #606266;
    }
  }
</style>

<style lang="scss" scoped>
  .pricing--muted {
    color: gray;
    font-size: 13px;
    font-weight: bold;

    &.mg-top {
      margin-top: -8px;
    }
  }

  @font-face {
    font-family: "Ubu11ntu";
    src: url('/static/fonts/Ubuntu-Regular.ttf') format("truetype");
    font-weight: normal;
  }

  .page-container {
    position: absolute;
    width: 100vw;

    .link {
      color: #409EFF;
      text-decoration: underline;
    }

    .stage-icon {
      font-size: 22px;
    }

    h1,
    h2,
    h3 {
      font-family: 'Ubu11ntu', sans-serif;
    }

    h2[class*=__header] {
      position: relative;

      .stage-icon {
        position: absolute;
        bottom: 2px;
        left: -30px;
      }
    }

    .header {
      width: 100vw;
      background-color: rgb(0, 41, 41);
    }

    .content {
      max-width: 1300px;
      margin: 0 auto;

      &__section {
        width: 70%;
        margin: 30px auto;

        &.description { 

          padding-top: 10px;
          padding-bottom: 115px;

          color: rgb(231, 231, 231);

          .link {
            color: rgb(167, 211, 255);
          }
        }

        &.plan {
          width: 100%;          

          .plan__header {
            margin-left: 15%;
          }

          .plan__subscriptions {
            width: 100%;
            // min-height: 0px;

            display: flex;
            justify-content: space-between;

            padding: 50px 0;

            .subscription-card {
              width: 23%;

              &.enterprise  {
                &:hover {
                  cursor: default;
                }
              }

              &.is-active {

                .subscription__checkmark {
                  color: green;
                }

                transform: scale(1.15)
              }

              &:hover {
                cursor: pointer;
              }

              .subscription {
                display: flex;
                flex-direction: column;
                height: 100%;

                &__header {
                  margin: 0 auto;
                  margin-bottom: 10px;
                }

                &__trial {
                  margin: 10px auto;
                  margin-top: 5px;
                }

                &__check {
                  min-width: 100%;
                  margin: 4px 0;
                  padding-left: 21px;
                  position: relative;

                  &::before {
                    content:'✓';
                    position: absolute;
                    left: 0px;
                    top: 2px;
                    display:inline-block;
                    vertical-align: top;
                    line-height: 1em;
                    width: 1em;
                    height:1em;
                    text-align: center;
                    color: green;
                    font-weight: bold;
                  }
                }

                .subscription__coming-soon-header {
                  margin: 0 auto;
                  margin-top: 20px;
                  margin-bottom: 10px;
                }

                .pricing {
                  margin: 10px auto;
                  padding-top: 30px;
                  margin-top: auto;
                  line-height: 1.7em;

                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  align-items: center;

                  &__header {
                    font-size: 18px;
                    font-weight: bold;
                  }

                  &__price {
                    font-size: 14px;
                  }
                }

                &__checkmark {
                  margin: 0 auto;
                  margin-top: 10px;
                  font-size: 32px;
                }

                .link {
                  &.donate-link {
                    margin: 0 auto;
                    text-decoration: none;
                    font-size: 14px;

                    transition: all .2s ease-in;

                    &:hover {
                      color: blue;
                    }
                  }
                }

                &.enterprise {
                  .subscription__header {
                    margin-bottom: 10px;
                  }
                  .subscription__custom-solution {
                    text-align: center;
                    height: 100%;
                    display: flex;
                    flex-direction: column;

                    .custom {
                      padding: 10px 0;
                      
                      &.second {
                        margin-top: 60px;
                      }
                    }

                    .contact-btn {
                      margin-top: 10px;
                    }
                  }
                }
              }
            }
          }
        }

        .account {
          margin-top: 30px;
          display: grid;
          grid-template-columns: 250px 250px;
          grid-gap: 20px;
          grid-column-gap: 40px;

          .account__sub-text,
          .account__header {
            grid-column-start: 1;
            grid-column-end: 3;
          }

          .account__sub-text {
            font-size: 18px;
            padding-bottom: 5px;
          }
        }

        &.payment {
          margin-top: 50px;

          display: grid;
          grid-template-columns: 1fr;
          grid-gap: 15px;

          .payment__credentials {
            max-width: 402px;

            &.creditcard {
              display: grid;
              grid-gap: 20px;

              grid-template-columns: 1fr 1fr;

              .number {
                grid-column: 1 / 3;
              }
            }
          }
        }

        &.submit {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          
          .error-msg {
            width: 402px;
            min-height: 50px;
            margin-bottom: 20px;
            margin-right: auto;
          }

          .terms-and-conditions {
            width: 402px;
            min-height: 50px;
            margin-bottom: 20px;
            margin-right: auto;

            .legal-link {
              color: #409EFF;
              text-decoration: underline;
            }
          }

          .submit__btn {
            min-width: 140px;
          }
        }
      }
    }

    .input {
      position: relative;
      transition: all .2s ease-in-out;

      @keyframes fade-in {
        0%   { top: 40px; }
        100% { top: 50px; }
      }

      .error-msg {
        position: absolute;
        font-size: 13px;
        top: 50px;
        left: 5px;
        color: rgb(255, 116, 116);
        animation: fade-in .2s;
        z-index: -1;
      }
    }
  }
</style>