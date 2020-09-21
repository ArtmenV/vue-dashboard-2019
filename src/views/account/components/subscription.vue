<template>
  <div class="container card-container" v-loading="loading">
    <div class="billing-information">
      <div class="header">
        Billing information:
      </div>

      <div class="info" v-if="user.subscription.payment_method">
        <div class="prop">
          <div class="title">
            Card number:
          </div>

          <div class="value">
            **** **** **** {{ user.subscription.payment_method.last4 }}
          </div>
        </div>

        <div class="prop">
          <div class="title">
            Expiry date:
          </div>

          <div class="value">
            {{ user.subscription.payment_method.expiry_month + '/' + user.subscription.payment_method.expiry_year.toString().slice(-2) }}
          </div>
        </div>
      </div>

      <div v-else style="margin: 20px 0;">
        No card added
      </div>

      <div class="actions">
        <el-button
          type="primary"
          size="mini"
          @click="editingCard = true"
        >
          {{ user.subscription.payment_method ? 'Update card' : 'Add card' }}
        </el-button>

        <el-button
          v-if="user.subscription.payment_method"
          size="mini"
          @click="removeCard"
        >
          Remove card
        </el-button>
      </div>
    </div>

    <div class="subscription">
      <div class="header">
        Your plan: {{ user.subscription.plan.name }}
      </div>

      <div class="info">
      </div>

      <div class="actions">
        <el-button
          size="mini"
          type="primary"
          @click="$router.push('/plan-upgrade')"
          
        >
          Upgrade subscription
        </el-button>

        <el-button
          size="mini"
          @click="unsubscribe"
          v-if="user.subscription.status === 'active' && !user.subscription.plan.is_free"
        >
          Cancel subscription
        </el-button>

        <el-button
          size="mini"
          @click="resubscribe"
          v-if="user.subscription.status === 'non_renewing' || user.subscription.status === 'cancelled'"
        >
          Resubscribe
        </el-button>

        <el-button
          size="mini"
          class="money-back"
          @click="$router.push('/tickets/new?guarantee=true')"
          v-if="user.subscription.is_money_back_available"
        >
          7 days money refund
        </el-button>

        <el-alert 
          v-if="statusDict(user.subscription.status).length" 
          type="info" 
          style="grid-column: 1/4;margin-top:10px;" 
          :closable="false" 
          :title="statusDict(user.subscription.status)"
        />
      </div>
    </div>

    <el-dialog 
      class="new-card"
      title="New card" 
      :visible.sync="editingCard"
    >
      <card-number @card-updated="handleCardUpdate" />
    </el-dialog>

    <el-dialog title="Update subscription" :visible.sync="editingSubscription">
      <update-subscription
        @subscription-update="handleSubscriptionUpdate"
      />
    </el-dialog>
  </div>
</template>

<script>
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'

  export default {
    props: [
      'invoice',
      'history',
      'user'
    ],

    data () {
      return {
        loading: false,

        errMessage: null,

        editingCard: false,

        editingSubscription: false,
        subscriptionStatus: '',
      }
    },

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    components: {
      cardNumber: () => import('./card-number'),
      updateSubscription: () => import('./update-subscription')
    },

    methods: {
      statusDict (status) {
        switch (status) {
          case 'non_renewing': return 'Subscription will be stopped in the end of the billing cycle.'
          default: return ''
        }
      },

      unsubscribe () {
        this.loading = true

        SPPCloudApi
          .unsubscribe()
          .then(r => {
            this.loading = false

            try {
              this.$store.dispatch('cancelSubscription')
              this.$emit('subscription-cancelled')
              this.$emit('subscription-update', null, r.status)
            } catch (e) {
              handleError(this, e)
            }
          })
          .catch(e => {
            this.loading = false
            this.errMessage = handleError(this, e)
          })
      },

      removeCard () {
        this.loading = true

        SPPCloudApi
          .updateSubscription({payment_method: -1})
          .then(r => {
            this.loading = false
            this.$emit('card-removed')
          })
          .catch(e => {
            this.loading = false
            this.errMessage = handleError(this, e)
          })
      },

      handleSubscriptionUpdate (payload) {
        this.$emit('subscription-update', payload)
      },

      handleCardUpdate (payload) {
        this.$emit('card-updated', payload)
      },

      resubscribe () {
        this.loading = true

        
        SPPCloudApi
          .resubscribe({plan: this.user.subscription.plan.id})
          .then(r => {
            this.loading = false
            try {
              this.$emit('subscription-update', r.data.result, r.data.result.status)
              this.$emit('subscription-uncancelled')
              this.successMessage = 'Subscription has been updated successfully.'
              this.$store.dispatch('updateSubscriptionStatusAndType', {status: r.data.result.status, type: r.data.result.plan.name})
            } catch (e) {
              handleError(this, e)
            }
          })
          .catch(e => {
            this.loading = false
            this.errMessage = handleError(this, e)
          })
      }
    },
  }
</script>

<style lang="scss">
.card-container {
  .new-card {
    margin-left: 2rem;
    margin-right: 2rem;
    .el-dialog {
      max-width: 520px !important;
      width: 100%;
    }
  }
}
</style>

<style lang="scss" scoped>
  .container {
    display: grid;

    grid-template-areas: 
                          "billing-information"
                          "subscription";
    max-width: 500px;

    grid-gap: 75px;

    .actions {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 10px;
    }

    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .billing-information {
      grid-area: billing-information;

      display: grid;
      grid-gap: 10px;

      .info {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 10px;
        margin: 10px 0;

        .prop {
          display: grid;
          grid-template-columns: 2fr 5fr;
        }
      }
    }

    .subscription {
      grid-area: subscription;
      
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .actions {
        margin-top: 30px;

        grid-template-columns: 1fr 1fr 1fr;
      }
    }

    .upcoming-invoice {
      grid-area: upcoming-invoice;

      display: grid;
      grid-gap: 20px;
    }

    .billing-history {
      grid-area: billing-history;

      display: grid;
      grid-gap: 10px;

      .money-back {
        max-width: 200px;
      }
    }
  }
</style>
