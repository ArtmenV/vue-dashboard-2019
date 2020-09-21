<template>
  <div class="page-container signup-page">
    <div class="background-header-curve"></div>

    <div class="background-main"></div>

    <svg-icon icon-class="curve" class="background-header-curve-svg"/>

    <svg  class="background-top-curve" viewBox="0 0 1031 518" xmlns="http://www.w3.org/2000/svg">
      <path d="M1031 117C531 160 266.409 262.078 -8.34451e-07 517.97L-8.3445e-07 117V-1.52588e-05L1031 -1.66893e-06V117Z"/>
    </svg>

    <svg class="background-bottom-curve" viewBox="0 0 936 557" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M936 0V557H0C423.276 447.386 680.378 304.256 936 0Z" fill="#C4C4C4"/>
    </svg>

    <div class="content">
      <section class="content__section description">
        <h1 class="description__header">
          Upgrade plan
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

      <section class="content__section plan" v-if="plans">
        <h2 class="plan__header">
          <svg-icon icon-class="stage-1" class="stage-icon"/> Select new plan
        </h2>

        <div class="plan__subscriptions">
          <el-card
            class="subscription-card"
            v-for="plan in plans.filter(el => el.weight >= planWeight)"
            :key="plan.plan_id"
            :class="{'is-active': subscriptionType === plan.plan_id, 'enterprise': plan.is_current }"
            @click.native="!plan.is_current ? setSubscriptionType(plan.plan_id) : null"
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

              <footer v-if="!plan.is_current" class="subscription__checkmark">
                <i v-if="!isCardAdded" class="el-icon-circle-check checkmark"></i>

                <el-button
                  v-else
                  type="primary"
                  @click="handleSubmit(plan.plan_id)"
                >
                  Upgrade to this plan
                </el-button>
              </footer>

              <div v-else class="footer" style="color:gray;margin:10px auto;font-family:Ubu11ntu;font-size:19px;">
                Your current plan
              </div>
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

      <section v-if="!isPlanFree && !isCardAdded && subscriptionType !== 10" class="content__section payment">
        <h2 class="payment__header">
          <svg-icon icon-class="stage-2" class="stage-icon"/> Select the payment method
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
        <el-alert
          v-if="errorSubmit.length !== 0"
          type="error"
          :title="errorSubmit"
          class="error-msg"
        ></el-alert>        

        <el-button
          v-if="!isCardAdded && subscriptionType !== 10"
          :loading="loading"
          type="primary"
          class="submit__btn btn-submit"
          @click="handleSubmit"
          :disabled="loading || !canSubmitSignup"
        >
          Upgrade plan
        </el-button>
      </section>
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
        loading: false,

        subscriptionType: 1,

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
        planWeight: null,

        errorSubmit: '',

        agreed: true,

        isCardAdded: false
      }
    },

    directives: {mask},

    mounted () {
      SPPCloudApi
        .getSubscriptions()
        .then(r => {
          this.plans = []

          const plansRaw = r.data.result.items
          debugger

          plansRaw.forEach(el => {
            this.plans.push(JSON.parse(JSON.stringify(el)))
            if (this.plans.filter(e => e.weight === el.weight).length === 0) {
              el.price_monthly = el.price
              // this.plans.push(JSON.parse(JSON.stringify(el)))
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

          if (this.plans.length <= 1) {
            this.subscriptionType = r.data.result.items.find(el => el.is_current).plan_id
          } else {
            this.subscriptionType = this.plans[1].plan_id
          }
        })
        .catch(e => console.log(e))

      SPPCloudApi
        .getUser()
        .then(r => {
          this.isCardAdded = !!r.data.result.subscription.payment_method

          this.planId = r.data.result.subscription.plan.id

        })
    },

    computed: {

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

        function validateEmail(email) {
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
        } else if (val.length < 6) {
          return 'Password must contain more then 6 symbols'
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
        const val = this.payment.creditcard.number

        if (!val.length) {
          return ' '
        } else if (val.length > 23 || val.length < 16) {
          return 'Please enter correct card number'
        }

        return ''
      },

      paymentExpiryDateValid () {
        const val = this.payment.creditcard.expiryDate

        if (!val.length) {
          return ' '
        } else if (val.length > 5 || val.length < 5) {
          return 'Please enter correct expiry date'
        } else if (!val.match(/(0[1-9]|1[0-2])\/(2[0-9]|0[0-9])/)) {
          return 'Please enter correct expiry date'
        }

        return ''
      },

      paymentCVVValid () {
        const val = this.payment.creditcard.cvv

        if (!val.length) {
          return ' '
        } else if (val.length < 3 || val.length > 4) {
          return 'Please enter correct cvv'
        }

        return ''
      },

      canSubmitSignup () {
        if (this.$route.query && this.$route.query.backtest) {
          return true
        }

        if (this.isCardAdded && this.agreed) {
          return true
        } else if (
          !this.paymentFirstNameValid
          && !this.paymentLastNameValid
          && !this.paymentCardNumberValid
          && !this.paymentExpiryDateValid
          && !this.paymentCVVValid
          && this.agreed
        ) {
          return true
        } else {
          return false
        }
      },

      isPlanFree () {
        return false
      }
    },

    methods: {
      setSubscriptionType (newType) {
        this.subscriptionType = newType
      },

      handleSubmit (planId) {
        this.loading = true

        let payment_method = 0

        const isPlanFree = this.plans.filter(e => this.subscriptionType == e.plan_id)[0].is_free

        const isCardOffered = this.payment.creditcard.number.length > 13 && this.payment.creditcard.number.length < 19

        if (isPlanFree && !isCardOffered) {
          payment_method = -1
        }

        const signupPayload = {
          payment_method: payment_method
        }

        if (typeof planId === 'number') {
          signupPayload.plan = planId
        } else {
          signupPayload.plan = parseInt(this.subscriptionType)
        }

        if (!isPlanFree && !this.isCardAdded) {
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
          .updateSubscription(signupPayload)
          .then(r => {
            this.loading = false
            this.$store.dispatch('updateSubscriptionStatusAndType', {status: r.data.result.status, type: r.data.result.plan.name})

            this.$router.push('/account?tab=1')
          })
          .catch(e => {
            this.loading = false
            const data = e.response.data.messages[0].context
            if (e.response.data.messages[0].context) {
              this.errMessage = e.response.data.messages[0].context.more_info
            } else {
              this.errMessage = handleError(this, e)
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

  .background-top-curve {
    position: absolute;
    z-index: -2;
    width: 100vw !important;
    color: $gradient-start-color;
    top: 0;
    left: 0;

    path {
      fill: $gradient-start-color;
    }
  }

  .background-bottom-curve {
    position: fixed;

    z-index: -2;
    bottom: 0px;
    right: 0;
    width: 50vw;

    path {
      fill: $gradient-start-color-bottom;
    }
  }

  .background-main {
    position: fixed;
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
    width: 100vw !important;
    height: 200px;

    background-color: $background-header-color;
  }

  .background-header-curve-svg {
    background-color: #FFFFFF00;
    position: absolute;
    z-index: -1;
    top: 199px;
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
    min-height: 100vh;

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

  html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  *, *:before, *:after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
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
    top: 0;
    width: 100vw;
    height: calc(100vh - 50px);
    padding-bottom: 40px;
    overflow-y: auto;

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

            display: flex;
            justify-content: space-around;

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
