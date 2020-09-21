<template>
  <div class="update-subscription-container">
    <el-alert
      v-show="successMessage.length != 0"
      type="success"
      :title="successMessage"
    ></el-alert>

    <el-select
      v-model="subscriptionSelected"
      placeholder="Select subscription"
      v-loading="loadingGet"
      size="small"
    >
      <el-option
        v-for="subscription in subscriptions"
        :key="subscription.plan_id"
        :value="subscription.plan_id"
        :label="subscription.name"
      />
    </el-select>

    <el-button
      size="small"
      type="primary"
      :loading="loading"
      :disabled="loadingGet || !subscriptionSelected"
      @click="handleSubmit"
    >
      Update subscription
    </el-button>
  </div>
</template>

<script>
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'

  export default {
    data () {
      return {
        subscriptions: [],

        subscriptionSelected: null,

        loading: false,
        loadingGet: false,

        errMessage: null,
        successMessage: ''
      }
    },

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    mounted () {
      this.updatePlans()
    },

    methods: {
      handleSubmit () {
        this.loading = true
        SPPCloudApi
          .updateSubscription({plan: this.subscriptionSelected})
          .then(r => {
            this.loading = false
            this.$emit('subscription-update', r.data.result)
            this.successMessage = 'Subscription has been updated successfully.'
            this.$store.dispatch('updateSubscriptionStatusAndType', {status: r.data.result.status, type: r.data.result.plan.name})

            this.updatePlans()
          })
          .catch(e => {
            this.loading = false
            this.errMessage = handleError(this, e)
          })
      },

      updatePlans () {
        this.loadingGet = true
        this.subscriptionSelected = null
        SPPCloudApi
          .getSubscriptions()
          .then(r => {
            this.subscriptions = r.data.result.items
            this.loadingGet = false
          })
          .catch(e => {
            this.errMessage = handleError(this, e)
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .update-subscription-container {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr;
  }
</style>
